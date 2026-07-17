// ==========================================
// КОНТРОЛЛЕР ЧЕРТ И АТРИБУТОВ (attributesScript.js)
// ==========================================

import { charData } from '../../saves/tempSave.js';
import { featsData } from '../data/attributesData.js';
import { racesData, getDynamicRaceFeatures } from '../data/racesData.js';
import { getDynamicClassFeatures } from './classScript.js';
import { recalculateStats, syncStatsUI, ensureCharDataStructure, calculateFeatureCharges } from './statsScript.js';
import { updateInstrumentsUI } from '../tabs/mainTab.js';
import { instrumentsData } from '../data/equipments/instrumentsData.js';

function checkHardRequirements(feat) {
    const lvl = charData.origin.level || 1;
    if (feat.levelReq && lvl < feat.levelReq) return false;
    if (feat.fightingStyleReq && !["fighter", "paladin", "ranger"].includes(charData.origin.classKey)) return false;
    return true;
}

function checkSoftRequirements(feat, key) {
    if (feat.statReq) {
        const s = charData.stats;
        if (feat.statReq.str && s.str.val < 13) return { ok: false, reason: "Требуется Сила 13+" };
        if (feat.statReq.dex && s.dex.val < 13) return { ok: false, reason: "Требуется Ловкость 13+" };
        if (feat.statReq.cha && s.cha.val < 13) return { ok: false, reason: "Требуется Харизма 13+" };
        if (feat.statReq.strOrDex && s.str.val < 13 && s.dex.val < 13) return { ok: false, reason: "Требуется Сила или Ловкость 13+" };
        if (feat.statReq.dexOrCon && s.dex.val < 13 && s.con.val < 13) return { ok: false, reason: "Требуется Ловкость или Телосложение 13+" };
        if (feat.statReq.intOrWis && s.int.val < 13 && s.wis.val < 13) return { ok: false, reason: "Требуется Интеллект или Мудрость 13+" };
        if (feat.statReq.wisOrCha && s.wis.val < 13 && s.cha.val < 13) return { ok: false, reason: "Требуется Мудрость или Харизма 13+" };
        if (feat.statReq.intOrWisOrCha && s.int.val < 13 && s.wis.val < 13 && s.cha.val < 13) return { ok: false, reason: "Требуется Инт/Муд/Хар 13+" };
    }

    if (feat.armorReq === "light" && !charData.proficiencies.armor.light) return { ok: false, reason: "Требуются Лёгкие доспехи" };
    if (feat.armorReq === "medium" && !charData.proficiencies.armor.medium) return { ok: false, reason: "Требуются Средние доспехи" };
    if (feat.armorReq === "heavy" && !charData.proficiencies.armor.heavy) return { ok: false, reason: "Требуются Тяжёлые доспехи" };
    if (feat.armorReq === "shield" && !charData.proficiencies.armor.shield) return { ok: false, reason: "Требуются Щиты" };

    if (!feat.repeatable && charData.selectedFeats[key]) return { ok: false, reason: "Уже взято" };
    return { ok: true, reason: "" };
}

export function grantFeatInstance(key, feat, choiceData = {}) {
    if (!charData.selectedFeats[key]) charData.selectedFeats[key] = { instances: [] };
    const instance = { ...choiceData };

    if (feat.grantArmor) {
        instance.oldArmor = {};
        feat.grantArmor.forEach(a => {
            instance.oldArmor[a] = charData.proficiencies.armor[a];
            charData.proficiencies.armor[a] = true;
        });
    }

    if (feat.grantWeapons) {
        instance.oldWeapons = {};
        Object.keys(feat.grantWeapons).forEach(w => {
            instance.oldWeapons[w] = charData.proficiencies.weapon[w];
            charData.proficiencies.weapon[w] = feat.grantWeapons[w];
        });
    }

    if (feat.grantTools) {
        if (!charData.proficiencies.tools) charData.proficiencies.tools = [];
        instance.addedTools = [];
        feat.grantTools.forEach(tKey => {
            if (!charData.proficiencies.tools.some(t => (t.key || t) === tKey)) {
                const tObj = { key: tKey };
                charData.proficiencies.tools.push(tObj);
                instance.addedTools.push(tObj);
            }
        });
    }

    if (feat.grantSaveProf && choiceData.stats && choiceData.stats[0]) {
        const st = choiceData.stats[0];
        if (charData.stats[st]) {
            instance.oldSave = { stat: st, oldProf: charData.stats[st].saveProf };
            charData.stats[st].saveProf = true;
        }
    }

    charData.selectedFeats[key].instances.push(instance);
    applyFeatBonuses();
    if (instance.addedTools && instance.addedTools.length > 0) updateInstrumentsUI();
}

export function revertFeatInstance(instance) {
    if (!instance) return;
    if (instance.oldArmor) Object.keys(instance.oldArmor).forEach(a => charData.proficiencies.armor[a] = instance.oldArmor[a]);
    if (instance.oldWeapons) Object.keys(instance.oldWeapons).forEach(w => charData.proficiencies.weapon[w] = instance.oldWeapons[w]);
    if (instance.oldSave) charData.stats[instance.oldSave.stat].saveProf = instance.oldSave.oldProf;
    if (instance.oldSkills) instance.oldSkills.forEach(sk => { if (charData.skills[sk.key]) charData.skills[sk.key].state = sk.oldState; });
    if (instance.addedTools) {
        instance.addedTools.forEach(t => {
            const idx = charData.proficiencies.tools?.findIndex(x => (x.key || x) === (t.key || t));
            if (idx !== undefined && idx > -1) charData.proficiencies.tools.splice(idx, 1);
        });
        updateInstrumentsUI();
    }
}

export function updateFeatsSelect() {
    const select = document.getElementById("featSelect");
    if (!select) return;

    const currentVal = select.value;
    const sortedKeys = Object.keys(featsData).sort((a, b) => featsData[a].name.localeCompare(featsData[b].name, 'ru'));

    let availableHtml = "";
    let unavailableHtml = "";

    sortedKeys.forEach(key => {
        const feat = featsData[key];
        if (!checkHardRequirements(feat)) return;

        const softReq = checkSoftRequirements(feat, key);
        const tooltipText = `Требования: ${feat.reqText || "Нет"}. ${softReq.ok ? "Доступно" : softReq.reason}`;

        if (softReq.ok) {
            availableHtml += `<option value="${key}" title="${tooltipText}" data-inspector="<b>${feat.name}:</b> Требования: ${feat.reqText}.<br>${feat.description}">${feat.name}</option>`;
        } else {
            unavailableHtml += `<option value="${key}" disabled title="${tooltipText}" style="color: var(--text-muted);" data-inspector="<b>${feat.name} [НЕДОСТУПНО]:</b> ${softReq.reason}.<br>${feat.description}">${feat.name} [${softReq.reason}]</option>`;
        }
    });

    select.innerHTML = `<option value="none">-- Выберите черту --</option>` + availableHtml + unavailableHtml;
    select.value = [...select.options].some(o => o.value === currentVal) ? currentVal : "none";
}

function getDynamicFeatAbilities(feat, instance = {}) {
    const statNames = { str: "Сила", dex: "Ловкость", con: "Телосложение", int: "Интеллект", wis: "Мудрость", cha: "Харизма" };
    return (feat.abilities || []).map(ab => {
        let desc = ab.description;
        if (ab.name === "Повышение характеристики" && instance.stats?.length > 0) {
            desc += `<br><br>(Выбрано: ${instance.stats.map(s => `<b>${statNames[s] || s} +1</b>`).join(", ")})`;
        } else if (ab.name === "Владение спасброском" && instance.stats?.[0]) {
            desc += `<br><br>(Выбрано: <b>Спасбросок ${statNames[instance.stats[0]] || ''}</b>)`;
        } else if (ab.name === "Владение и Экспертность" && instance.profKey && instance.expKey) {
            desc += `<br><br>(Владение: <b>${charData.skills[instance.profKey]?.name || instance.profKey}</b>, Экспертность: <b>${charData.skills[instance.expKey]?.name || instance.expKey}</b>)`;
        } else if ((ab.name === "Проницательный наблюдатель" || ab.name === "Знание основ" || ab.name === "Экспертность") && instance.boostedSkill) {
            desc += `<br><br>(Улучшение: <b>${charData.skills[instance.boostedSkill]?.name || instance.boostedSkill}</b>)`;
        }
        return { ...ab, description: desc };
    });
}

export function renderAssignedFeats() {
    const badgesContainer = document.getElementById("selectedFeatsList");
    const activeContainer = document.getElementById("activeFeaturesList");
    const passiveContainer = document.getElementById("passiveFeaturesList");
    const oneTimeContainer = document.getElementById("oneTimeFeaturesList");
    if (!badgesContainer) return;

    let badgesHtml = "";
    let activeHtml = "";
    let passiveHtml = "";
    let oneTimeHtml = "";

    const statNames = { str: "СИЛ", dex: "ЛОВ", con: "ТЕЛ", int: "ИНТ", wis: "МУД", cha: "ХАР" };

    const processFeature = (name, source, desc, type) => {
        const safeDesc = window.escapeHTML ? window.escapeHTML(desc) : desc.replace(/"/g, '&quot;');
        const maxCharges = calculateFeatureCharges(name);

        // ФИКС: Умная категоризация с учетом базы
        let category = type;
        if (category !== "oneTime" && category !== "active" && category !== "passive") {
            category = maxCharges > 0 ? "active" : "passive";
        }
        if (maxCharges > 0 && category !== "oneTime") category = "active";

        const color = category === 'oneTime' ? '#cbd5e1' : (category === 'active' ? 'var(--accent-yellow)' : 'var(--accent-success)');
        const card = `
            <div class="interactive-node" data-inspector="<b>${name} (${source}):</b><br>${safeDesc}"
                 style="padding: 8px 10px; margin-bottom: 8px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 6px;">
                <strong style="color: ${color}; font-size: 13.5px;">${name}</strong>
                <span style="font-size:11px; color: var(--text-muted); float: right;">${source.split(" ")[0]}</span>
            </div>`;

        if (category === "active") activeHtml += card;
        else if (category === "passive") passiveHtml += card;
        else if (category === "oneTime") oneTimeHtml += card;
    };

    Object.keys(charData.selectedFeats).forEach(key => {
        const featState = charData.selectedFeats[key];
        const feat = featsData[key];
        if (!feat) return;

        featState.instances.forEach((choice, idx) => {
            let choiceLabel = "";
            if (choice?.stats?.length > 0) choiceLabel = ` <span style="font-size:11px; color:var(--text-muted);">[+1 ${choice.stats.map(c => statNames[c] || c).join(", ")}]</span>`;
            else if (choice?.skilledType === "skills") choiceLabel = ` <span style="font-size:11px; color:var(--text-muted);">[3 Навыка]</span>`;
            else if (choice?.skilledType === "tools") choiceLabel = ` <span style="font-size:11px; color:var(--text-muted);">[3 Инструмента]</span>`;
            else if (choice?.boostedSkill) choiceLabel = ` <span style="font-size:11px; color:var(--text-muted);">[${charData.skills[choice.boostedSkill]?.name || choice.boostedSkill}]</span>`;

            badgesHtml += `
                <div class="interactive-node selected-feat-btn" data-key="${key}" data-idx="${idx}" data-inspector="<b>${feat.name}:</b> ${feat.description}<br><br><i>Нажмите для удаления.</i>"
                     style="display: flex; align-items: center; padding: 6px 12px; background: rgba(218, 34, 42, 0.15); border: 1px solid var(--accent); border-radius: 6px; cursor: pointer;">
                    <span style="color: #fff; font-weight: bold; font-size: 13px;">${feat.name}${choiceLabel}</span>
                </div>`;

            getDynamicFeatAbilities(feat, choice).forEach(ab => {
                processFeature(ab.name, feat.name.split(" ")[0], ab.description, ab.type);
            });
        });
    });

    const lvl = charData.origin.level || 1;

    const raceKey = charData.origin.raceKey;
    const raceObj = racesData[raceKey];
    if (raceObj && raceKey !== "none") {
        getDynamicRaceFeatures(raceKey, raceObj, charData.origin.raceChoices || {}, lvl).forEach(rf => {
            processFeature(rf.name, raceObj.name.split(" ")[0], rf.description, rf.type);
        });
    }

    const classFeatures = getDynamicClassFeatures(charData.origin.classKey, charData.origin.subclassKey, lvl);
    classFeatures.forEach(cf => {
        processFeature(cf.name, cf.sourceName, cf.description, cf.type);
    });

    badgesContainer.innerHTML = badgesHtml || `<p class="font-group-3" style="color: var(--text-muted); font-style: italic;">Черты не выбраны</p>`;
    if (activeContainer) activeContainer.innerHTML = activeHtml || `<p class="font-group-3" style="color: var(--text-muted); font-style: italic;">Нет активных умений</p>`;
    if (passiveContainer) passiveContainer.innerHTML = passiveHtml || `<p class="font-group-3" style="color: var(--text-muted); font-style: italic;">Нет пассивных умений</p>`;
    if (oneTimeContainer) oneTimeContainer.innerHTML = oneTimeHtml || `<p class="font-group-3" style="color: var(--text-muted); font-style: italic;">Нет единоразовых умений</p>`;

    badgesContainer.querySelectorAll('.selected-feat-btn').forEach(btn => {
        btn.onclick = () => {
            const k = btn.getAttribute("data-key");
            const i = parseInt(btn.getAttribute("data-idx"));
            const instance = charData.selectedFeats[k].instances[i];
            revertFeatInstance(instance);
            charData.selectedFeats[k].instances.splice(i, 1);
            if (charData.selectedFeats[k].instances.length === 0) delete charData.selectedFeats[k];
            applyFeatBonuses();
        };
    });

    if (typeof window.initGlobalInspector === "function") window.initGlobalInspector();
}

export function applyFeatBonuses() {
    ensureCharDataStructure();
    const lvl = charData.origin.level || 1;
    const pb = Math.ceil(lvl / 4) + 1;
    charData.origin.pb = pb;

    charData.bonuses.stats = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
    charData.bonuses.speed = 0;
    charData.bonuses.ac = 0;
    charData.bonuses.hpMax = 0;
    charData.bonuses.initiative = 0;

    Object.keys(charData.selectedFeats).forEach(key => {
        const featState = charData.selectedFeats[key];
        const feat = featsData[key];
        if (!feat) return;

        if (feat.bonuses?.stats) Object.keys(feat.bonuses.stats).forEach(s => charData.bonuses.stats[s] += feat.bonuses.stats[s] * featState.instances.length);
        if (feat.bonuses?.speed) charData.bonuses.speed += feat.bonuses.speed * featState.instances.length;
        if (feat.bonuses?.ac) charData.bonuses.ac += feat.bonuses.ac * featState.instances.length;
        if (feat.bonuses?.hpPerLevel) charData.bonuses.hpMax += (feat.bonuses.hpPerLevel * lvl) * featState.instances.length;
        if (feat.bonuses?.hpMaxFlat) charData.bonuses.hpMax += feat.bonuses.hpMaxFlat * featState.instances.length;
        if (key === "alert") charData.bonuses.initiative += pb * featState.instances.length;

        featState.instances.forEach(inst => {
            if (inst?.stats) inst.stats.forEach(st => { if (charData.bonuses.stats[st] !== undefined) charData.bonuses.stats[st] += 1; });
        });
    });

    recalculateStats();
    syncStatsUI();
    updateFeatsSelect();
    renderAssignedFeats();
}

export function bindAttributesEvents() {
    const addBtn = document.getElementById("addFeatBtn");
    const select = document.getElementById("featSelect");

    if (addBtn && select) {
        addBtn.onclick = () => {
            const key = select.value;
            if (key === "none") return;
            const feat = featsData[key];
            if (!feat) return;

            openUniversalFeatModal(key, feat);
            select.value = "none";
        };

        select.addEventListener("change", (e) => {
            const selectedOpt = e.target.options[e.target.selectedIndex];
            const textPanel = document.getElementById("inspectorDescriptionPanel");
            if (selectedOpt && selectedOpt.value !== "none" && textPanel) {
                textPanel.innerHTML = `<p class="font-group-3" style="text-align: justify; line-height: 1.45;">${selectedOpt.getAttribute("data-inspector")}</p>`;
            }
        });
    }

    document.getElementById("ufModalCancelBtn")?.addEventListener("click", () => document.getElementById("universalFeatModal")?.classList.remove("visible"));
}

function openUniversalFeatModal(key, feat) {
    const modal = document.getElementById("universalFeatModal");
    const title = document.getElementById("ufModalTitle");
    const desc = document.getElementById("ufModalDesc");
    const container = document.getElementById("ufModalDynamicChoices");
    const confirmBtn = document.getElementById("ufModalConfirmBtn");

    if (!modal || !container) return;

    title.innerText = feat.name.split(" [")[0];

    let fullDesc = `<b>Описание:</b> ${feat.description}<br><br>`;
    if (feat.abilities) {
        feat.abilities.forEach(ab => {
            fullDesc += `<span style="color:var(--accent-yellow)">${ab.name}:</span> ${ab.description}<br><br>`;
        });
    }
    desc.innerHTML = fullDesc;
    container.innerHTML = "";

    const statNames = { str: "Сила", dex: "Ловкость", con: "Телосложение", int: "Интеллект", wis: "Мудрость", cha: "Харизма" };

    if (key === "skill_expert") {
        const unprof = Object.keys(charData.skills).filter(k => charData.skills[k].state === 0).sort((a,b) => charData.skills[a].name.localeCompare(charData.skills[b].name, 'ru'));
        const prof = Object.keys(charData.skills).filter(k => charData.skills[k].state === 1).sort((a,b) => charData.skills[a].name.localeCompare(charData.skills[b].name, 'ru'));

        container.innerHTML += `
            <div>
                <label class="font-group-2">Характеристика (+1):</label>
                <select id="ufSeStat" class="input-field font-group-3" style="margin-bottom:10px;">
                    ${Object.keys(statNames).map(k => `<option value="${k}">${statNames[k]}</option>`).join("")}
                </select>
                <label class="font-group-2">Новое владение:</label>
                <select id="ufSeProf" class="input-field font-group-3" style="margin-bottom:10px;">
                    ${unprof.map(k => `<option value="${k}">${charData.skills[k].name}</option>`).join('')}
                </select>
                <label class="font-group-2">Экспертность:</label>
                <select id="ufSeExp" class="input-field font-group-3">
                    ${prof.map(k => `<option value="${k}">${charData.skills[k].name}</option>`).join('')}
                </select>
            </div>`;

        const profSel = container.querySelector("#ufSeProf");
        const expSel = container.querySelector("#ufSeExp");
        profSel.onchange = () => {
            const selectedProf = profSel.value;
            let expHtml = prof.map(k => `<option value="${k}">${charData.skills[k].name}</option>`).join('');
            if (selectedProf) expHtml += `<option value="${selectedProf}" style="color:var(--accent-yellow);">${charData.skills[selectedProf].name} (Только что получено)</option>`;
            expSel.innerHTML = expHtml;
        };
        profSel.onchange();
    }
    else if (key === "skilled") {
        container.innerHTML += `
            <div>
                <label class="font-group-2">Выберите тип владения:</label>
                <select id="ufSkilledMode" class="input-field font-group-3" style="margin-bottom:10px;">
                    <option value="skills">3 Навыка</option>
                    <option value="tools">3 Инструмента</option>
                </select>
                <div id="ufSkilledCheckboxes" style="max-height: 180px; overflow-y:auto; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px; display:flex; flex-direction:column; gap:8px;"></div>
            </div>`;

        const modeSel = container.querySelector("#ufSkilledMode");
        const cbBox = container.querySelector("#ufSkilledCheckboxes");
        const renderSkilledCbs = () => {
            let cbHtml = "";
            if (modeSel.value === "skills") {
                Object.keys(charData.skills).filter(k => charData.skills[k].state === 0).sort((a,b) => charData.skills[a].name.localeCompare(charData.skills[b].name, 'ru')).forEach(k => {
                    cbHtml += `<label class="custom-cb"><input type="checkbox" name="ufSkilledCb" value="${k}"><span></span> ${charData.skills[k].name}</label>`;
                });
            } else {
                Object.keys(instrumentsData).filter(k => !k.includes("instrument_of_the_bards")).sort((a,b) => instrumentsData[a].name.localeCompare(instrumentsData[b].name, 'ru')).forEach(iKey => {
                    cbHtml += `<label class="custom-cb"><input type="checkbox" name="ufSkilledCb" value="${iKey}"><span></span> ${instrumentsData[iKey].name}</label>`;
                });
            }
            cbBox.innerHTML = cbHtml;
        };
        modeSel.onchange = renderSkilledCbs;
        renderSkilledCbs();
    }
    else if (feat.skillBoostChoice) {
        const statOpts = feat.skillBoostChoice.statOptions || Object.keys(statNames);
        const skillOpts = feat.skillBoostChoice.skillOptions || Object.keys(charData.skills);
        const availableSkills = skillOpts.filter(k => feat.skillBoostChoice.allSkillsProf ? true : charData.skills[k].state < 2).sort((a,b) => charData.skills[a].name.localeCompare(charData.skills[b].name, 'ru'));

        container.innerHTML += `
            <div>
                <label class="font-group-2">Характеристика (+1):</label>
                <select id="ufStatSelect" class="input-field font-group-3" style="margin-bottom:10px;">
                    ${statOpts.map(k => `<option value="${k}">${statNames[k]}</option>`).join("")}
                </select>
                <label class="font-group-2">Выбор навыка для улучшения:</label>
                <select id="ufSkillBoost" class="input-field font-group-3">
                    ${availableSkills.map(k => `<option value="${k}">${charData.skills[k].name}</option>`).join("")}
                </select>
            </div>`;
    }
    else if (feat.choiceType === "stat" || feat.choiceType === "double_stat") {
        const opts = feat.choiceOptions || Object.keys(statNames);
        const count = (feat.choiceType === "double_stat") ? 2 : 1;
        container.innerHTML += `<label class="font-group-2" style="margin-bottom:8px;">${feat.choiceTitle || "Выберите характеристику (+1):"}</label>`;
        for (let i = 0; i < count; i++) {
            container.innerHTML += `
                <select id="ufStatOpt_${i}" class="font-group-3 input-field" style="margin-bottom:8px;">
                    ${opts.map(o => `<option value="${o}">${statNames[o]}</option>`).join('')}
                </select>`;
        }
    }

    if (feat.toolChoice) {
        container.innerHTML += `<label class="font-group-2" style="margin-bottom:8px; margin-top:10px;">${feat.toolChoice.title}</label>`;
        container.innerHTML += `<div id="ufToolCheckboxes" style="max-height: 180px; overflow-y:auto; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px; display:flex; flex-direction:column; gap:8px;"></div>`;

        let cbHtml = "";
        if (feat.toolChoice.type === "musical_options") {
            Object.keys(instrumentsData)
                .filter(k => instrumentsData[k].category === "Музыкальные инструменты")
                .sort((a,b) => instrumentsData[a].name.localeCompare(instrumentsData[b].name, 'ru'))
                .forEach(iKey => {
                    cbHtml += `<label class="custom-cb"><input type="checkbox" name="ufToolCb" value="${iKey}"><span></span> ${instrumentsData[iKey].name}</label>`;
                });
        } else if (feat.toolChoice.type === "artisan_category") {
            Object.keys(instrumentsData)
                .filter(k => instrumentsData[k].category === "Инструменты ремесленников")
                .sort((a,b) => instrumentsData[a].name.localeCompare(instrumentsData[b].name, 'ru'))
                .forEach(iKey => {
                    cbHtml += `<label class="custom-cb"><input type="checkbox" name="ufToolCb" value="${iKey}"><span></span> ${instrumentsData[iKey].name}</label>`;
                });
        }
        container.querySelector("#ufToolCheckboxes").innerHTML = cbHtml;
    }

    if(container.innerHTML === "") {
        container.innerHTML = `<p class="font-group-3" style="color:var(--text-muted); text-align:center;">У этой черты нет дополнительных выборов. Нажмите "Подтвердить", чтобы получить её.</p>`;
    }

    modal.classList.add("visible");
    const newConfirm = confirmBtn.cloneNode(true);
    confirmBtn.replaceWith(newConfirm);

    newConfirm.onclick = () => {
        const choiceData = {};
        const oldSkills = [];
        const addedTools = [];

        if (key === "skill_expert") {
            const stat = container.querySelector("#ufSeStat").value;
            const newProfKey = container.querySelector("#ufSeProf").value;
            const newExpKey = container.querySelector("#ufSeExp").value;

            oldSkills.push({ key: newProfKey, oldState: charData.skills[newProfKey].state });
            oldSkills.push({ key: newExpKey, oldState: charData.skills[newExpKey].state });

            charData.skills[newProfKey].state = Math.max(1, charData.skills[newProfKey].state);
            charData.skills[newExpKey].state = 2;

            choiceData.stats = [stat];
            choiceData.profKey = newProfKey;
            choiceData.expKey = newExpKey;
            choiceData.oldSkills = oldSkills;
        }
        else if (key === "skilled") {
            const mode = container.querySelector("#ufSkilledMode").value;
            const checked = container.querySelectorAll("input[name='ufSkilledCb']:checked");
            if (checked.length !== 3) { alert("Выберите ровно 3 пункта!"); return; }

            choiceData.skilledType = mode;
            if (mode === "skills") {
                checked.forEach(cb => {
                    oldSkills.push({ key: cb.value, oldState: charData.skills[cb.value].state });
                    charData.skills[cb.value].state = 1;
                });
                choiceData.oldSkills = oldSkills;
            } else {
                if (!charData.proficiencies.tools) charData.proficiencies.tools = [];
                checked.forEach(cb => {
                    const tObj = { key: cb.value };
                    charData.proficiencies.tools.push(tObj);
                    addedTools.push(tObj);
                });
                choiceData.addedTools = addedTools;
            }
        }
        else if (feat.skillBoostChoice) {
            const chosenStat = container.querySelector("#ufStatSelect").value;
            const chosenSkill = container.querySelector("#ufSkillBoost").value;

            if (feat.skillBoostChoice.allSkillsProf) {
                Object.keys(charData.skills).forEach(sk => {
                    oldSkills.push({ key: sk, oldState: charData.skills[sk].state });
                    charData.skills[sk].state = Math.max(1, charData.skills[sk].state);
                });
            } else {
                oldSkills.push({ key: chosenSkill, oldState: charData.skills[chosenSkill].state });
            }

            charData.skills[chosenSkill].state = Math.min(2, charData.skills[chosenSkill].state + 1);

            choiceData.stats = [chosenStat];
            choiceData.boostedSkill = chosenSkill;
            choiceData.oldSkills = oldSkills;
        }
        else if (feat.choiceType === "stat" || feat.choiceType === "double_stat") {
            choiceData.stats = [];
            container.querySelectorAll("select").forEach(sel => choiceData.stats.push(sel.value));
        }

        if (feat.toolChoice) {
            const checked = container.querySelectorAll("input[name='ufToolCb']:checked");
            if (checked.length !== feat.toolChoice.count) { alert(`Выберите ровно ${feat.toolChoice.count} пункта(ов).`); return; }

            if (!charData.proficiencies.tools) charData.proficiencies.tools = [];
            checked.forEach(cb => {
                const tObj = { key: cb.value };
                if (!charData.proficiencies.tools.some(t => (t.key || t) === tObj.key)) {
                    charData.proficiencies.tools.push(tObj);
                    addedTools.push(tObj);
                }
            });
            choiceData.addedTools = addedTools;
        }

        grantFeatInstance(key, feat, choiceData);
        modal.classList.remove("visible");
    };
}