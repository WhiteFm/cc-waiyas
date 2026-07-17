// ==========================================
// СКРИПТ ВТОРОЙ ВКЛАДКИ (skillsTab.js)
// ==========================================

import { charData } from '../../saves/tempSave.js';
import { featsData } from '../data/attributesData.js';
import { racesData, getDynamicRaceFeatures } from '../data/racesData.js';
import { getDynamicClassFeatures } from '../scripts/classScript.js';
import { recalculateStats, calculateFeatureCharges } from '../scripts/statsScript.js';
import { initInspector } from './infoTab.js';
import { initCombatStatusUI } from '../scripts/combatStatusScript.js';

export function initSkillsTab() {
    if (!charData.combat.charges) charData.combat.charges = {};
    recalculateStats();
    autoSyncRaceResistances();
    attachSkillsUIEventListeners();
    initCombatStatusUI();
    syncAllSkillsUI();
    renderSkillsTabFeatures();

    // Вызываем глобальный рендер заметок, если он есть
    if(typeof window.renderGlobalNotes === "function") window.renderGlobalNotes();
    if(typeof window.initGlobalInspector === "function") window.initGlobalInspector();
}

function autoSyncRaceResistances() {
    if (!charData.combat.resistances) charData.combat.resistances = {};
    const race = charData.origin?.raceKey;
    const choices = charData.origin?.raceChoices || {};

    if (race === "dwarf") charData.combat.resistances.poison = true;
    if (race === "aasimar") { charData.combat.resistances.necrotic = true; charData.combat.resistances.radiant = true; }
    if (race === "tiefling_infernal") charData.combat.resistances.fire = true;
    if (race === "tiefling_abyssal") charData.combat.resistances.poison = true;
    if (race === "tiefling_chthonic") charData.combat.resistances.necrotic = true;
    if (race === "dragonborn") {
        const dmgMap = { white: "cold", bronze: "lightning", green: "poison", gold: "fire", red: "fire", brass: "fire", copper: "acid", silver: "cold", blue: "lightning", black: "acid" };
        if (dmgMap[choices.dragon_ancestry]) charData.combat.resistances[dmgMap[choices.dragon_ancestry]] = true;
    }
}

// ==== РЕНДЕР 2-Й ВКЛАДКИ (Только Активные и Пассивные умения) ====
export function renderSkillsTabFeatures() {
    const activeContainer = document.getElementById("skActiveFeaturesList");
    const passiveContainer = document.getElementById("skPassiveFeaturesList");
    if (!activeContainer || !passiveContainer) return;

    let activeHtml = "";
    let passiveHtml = "";

    const processFeatureWithCharges = (name, source, desc, type, entityKey) => {
        if (type === "oneTime") return; // Пропускаем Единоразовые умения для вкладки навыков

        const safeDesc = window.escapeHTML ? window.escapeHTML(desc) : desc.replace(/"/g, '&quot;');
        const maxCharges = calculateFeatureCharges(name);

        // Категоризация: если есть заряды, значит Активное, иначе Пассивное
        let category = maxCharges > 0 ? "active" : "passive";

        const chargeId = `charge_${entityKey}_${name.replace(/\s+/g, '_')}`;
        const currentCharge = charData.combat.charges[chargeId] !== undefined ? charData.combat.charges[chargeId] : maxCharges;

        let chargeInputHtml = "";
        if (maxCharges > 0) {
            chargeInputHtml = `
                <div class="feature-charges-box" title="Используемые заряды / максимум">
                    <input type="number" class="feature-charges-input" data-charge-id="${chargeId}" data-max="${maxCharges}" value="${currentCharge}" min="0" max="${maxCharges}">
                    <label>/ ${maxCharges}</label>
                </div>`;
        }

        const card = `
            <div class="interactive-node" data-inspector="<b>${name} (${source}):</b><br>${safeDesc}"
                 style="padding: 8px 10px; margin-bottom: 8px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 6px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color: ${category === 'active' ? 'var(--accent-yellow)' : 'var(--accent-success)'}; font-size: 13px;">${name}</strong>
                    <span style="font-size:11px; color: var(--text-muted);">${source.split(" ")[0]}</span>
                </div>
                ${chargeInputHtml}
            </div>`;

        if (category === "active") activeHtml += card;
        else passiveHtml += card;
    };

    // 1. ЧЕРТЫ
    Object.keys(charData.selectedFeats || {}).forEach(key => {
        const feat = featsData[key];
        if (!feat) return;
        feat.abilities?.forEach(ab => {
            processFeatureWithCharges(ab.name, feat.name.split(" ")[0], ab.description, ab.type, `feat_${key}`);
        });
    });

    // 2. РАСОВЫЕ ОСОБЕННОСТИ
    const raceKey = charData.origin?.raceKey;
    const raceObj = racesData[raceKey];
    const lvl = charData.origin?.level || 1;

    if (raceObj && raceKey !== "none") {
        getDynamicRaceFeatures(raceKey, raceObj, charData.origin?.raceChoices || {}, lvl).forEach(rf => {
            processFeatureWithCharges(rf.name, raceObj.name.split(" ")[0], rf.description, rf.type, `race_${raceKey}`);
        });
    }

    // 3. КЛАССОВЫЕ ОСОБЕННОСТИ
    const classFeatures = getDynamicClassFeatures(charData.origin.classKey, charData.origin.subclassKey, lvl);
    classFeatures.forEach(cf => {
        processFeatureWithCharges(cf.name, cf.sourceName, cf.description, cf.type, `class_${cf.sourceName}`);
    });

    activeContainer.innerHTML = activeHtml || `<p class="font-group-3" style="color: var(--text-muted); font-style: italic;">Нет активных умений</p>`;
    passiveContainer.innerHTML = passiveHtml || `<p class="font-group-3" style="color: var(--text-muted); font-style: italic;">Нет пассивных умений</p>`;

    document.querySelectorAll('.feature-charges-input').forEach(inp => {
        inp.oninput = (e) => {
            const max = parseInt(e.target.getAttribute("data-max"));
            let val = Math.min(max, Math.max(0, parseInt(e.target.value) || 0));
            e.target.value = val;
            charData.combat.charges[e.target.getAttribute("data-charge-id")] = val;
        };
    });
}

export function syncAllSkillsUI() {
    recalculateStats();
    if (document.getElementById("skProfBonusDisplay")) document.getElementById("skProfBonusDisplay").value = `+${charData.origin.pb}`;
    if (document.getElementById("initDisplay")) document.getElementById("initDisplay").innerText = (charData.combat.initiative >= 0 ? "+" : "") + charData.combat.initiative;
    if (document.getElementById("passivePerceptionDisplay")) document.getElementById("passivePerceptionDisplay").innerText = charData.combat.passivePerception;
    if (document.getElementById("heroicInspirationCb")) document.getElementById("heroicInspirationCb").checked = !!charData.combat.heroicInspiration;
    if (document.getElementById("combatSpeedDisplay")) document.getElementById("combatSpeedDisplay").innerText = charData.combat.speed + " фт.";
    if (document.getElementById("combatClimbDisplay")) document.getElementById("combatClimbDisplay").innerText = charData.combat.climbSpeed + " фт.";
    if (document.getElementById("combatFlyDisplay")) document.getElementById("combatFlyDisplay").innerText = charData.combat.flySpeed + " фт.";
    if (document.getElementById("acDisplay")) document.getElementById("acDisplay").innerText = charData.combat.ac;

    const stealthEl = document.getElementById("stealthDisadvantageDisplay");
    if (stealthEl) {
        stealthEl.innerText = charData.combat.stealthDisadvantage ? "Есть" : "Нет";
        stealthEl.style.color = charData.combat.stealthDisadvantage ? "var(--accent)" : "var(--accent-success)";
    }

    if (document.getElementById("combatHpCurrent")) document.getElementById("combatHpCurrent").value = charData.health.current;
    if (document.getElementById("combatHpMax")) document.getElementById("combatHpMax").value = charData.health.max;
    if (document.getElementById("combatHpTemp")) document.getElementById("combatHpTemp").value = charData.health.temp;
    if (document.getElementById("skHitDiceCurrent")) document.getElementById("skHitDiceCurrent").value = charData.hitDice.current;
    if (document.getElementById("skHitDiceMax")) document.getElementById("skHitDiceMax").value = charData.hitDice.max;
    if (document.getElementById("skHitDiceType")) document.getElementById("skHitDiceType").value = charData.hitDice.type;

    for (let i = 1; i <= 3; i++) {
        if (document.getElementById(`death_succ_${i}`)) document.getElementById(`death_succ_${i}`).checked = (charData.deathSaves.successes >= i);
        if (document.getElementById(`death_fail_${i}`)) document.getElementById(`death_fail_${i}`).checked = (charData.deathSaves.failures >= i);
    }

    ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(s => {
        const st = charData.stats[s];
        if (document.getElementById(`sk_val_${s}`)) document.getElementById(`sk_val_${s}`).innerText = st.val;
        if (document.getElementById(`sk_mod_${s}`)) document.getElementById(`sk_mod_${s}`).innerText = (st.mod >= 0 ? "+" : "") + st.mod;
        if (document.getElementById(`sk_save_${s}`)) document.getElementById(`sk_save_${s}`).checked = st.saveProf;

        const saveModEl = document.getElementById(`sk_save_mod_${s}`);
        if (saveModEl) {
            saveModEl.innerText = (st.saveMod >= 0 ? "+" : "") + st.saveMod;
            saveModEl.style.color = st.saveProf ? "var(--accent-success)" : "";
        }
    });

    Object.keys(charData.skills).forEach(skKey => {
        const sk = charData.skills[skKey];
        const modEl = document.getElementById(`sk_mod_${skKey}`);
        if (modEl) {
            modEl.innerText = (sk.mod >= 0 ? "+" : "") + sk.mod;
            if (sk.state === 1) modEl.style.color = "var(--accent-success)";
            else if (sk.state === 2) modEl.style.color = "var(--accent-yellow)";
            else modEl.style.color = "";
        }
        const btnGroup = document.querySelector(`.state-btn-group[data-skill="${skKey}"]`);
        if (btnGroup) {
            btnGroup.querySelectorAll('.st-btn').forEach(btn => btn.classList.toggle('active', parseInt(btn.getAttribute('data-state')) === sk.state));
        }
    });

    document.querySelectorAll('#damageResistancesContainer .status-badge-btn').forEach(btn => {
        const key = btn.getAttribute('data-key');
        if (key) {
            btn.classList.toggle('active-res', !!charData.combat.resistances[key]);
            btn.classList.toggle('active-vuln', !!charData.combat.vulnerabilities[key]);
        }
    });
    document.querySelectorAll('#conditionsContainer .status-badge-btn').forEach(btn => btn.classList.toggle('active-cond', !!charData.combat.conditions[btn.getAttribute('data-key')]));

    renderSkillsTabFeatures();
}

function attachSkillsUIEventListeners() {
    document.querySelectorAll('.col-skills .stepper-input, .col-combat .stepper-input').forEach(stepper => {
        const btnMinus = stepper.querySelector('.minus');
        const btnPlus = stepper.querySelector('.plus');
        const input = stepper.querySelector('input');
        if (btnMinus && btnPlus && input) {
            btnMinus.onclick = () => { input.stepDown(); input.dispatchEvent(new Event('input')); };
            btnPlus.onclick = () => { input.stepUp(); input.dispatchEvent(new Event('input')); };
        }
    });

    document.getElementById("heroicInspirationCb")?.addEventListener("change", e => charData.combat.heroicInspiration = e.target.checked);
    document.getElementById("combatHpCurrent")?.addEventListener("input", e => { charData.health.current = parseInt(e.target.value) || 0; syncAllSkillsUI(); });
    document.getElementById("combatHpTemp")?.addEventListener("input", e => { charData.health.temp = parseInt(e.target.value) || 0; syncAllSkillsUI(); });
    document.getElementById("skHitDiceCurrent")?.addEventListener("input", e => charData.hitDice.current = parseInt(e.target.value) || 0);

    for (let i = 1; i <= 3; i++) {
        document.getElementById(`death_succ_${i}`)?.addEventListener("change", e => { charData.deathSaves.successes = e.target.checked ? i : i - 1; syncAllSkillsUI(); });
        document.getElementById(`death_fail_${i}`)?.addEventListener("change", e => { charData.deathSaves.failures = e.target.checked ? i : i - 1; syncAllSkillsUI(); });
    }

    ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(s => {
        document.getElementById(`sk_save_${s}`)?.addEventListener("change", e => { charData.stats[s].saveProf = e.target.checked; syncAllSkillsUI(); });
    });

    document.querySelectorAll('.state-btn-group .st-btn').forEach(btn => {
        btn.onclick = () => {
            const group = btn.closest('.state-btn-group');
            const skillKey = group?.getAttribute('data-skill');
            if (skillKey && charData.skills[skillKey]) {
                charData.skills[skillKey].state = parseInt(btn.getAttribute('data-state')) || 0;
                syncAllSkillsUI();
            }
        };
    });
}