// ==========================================
// КОНТРОЛЛЕР ВИДОВ И РАС (racesScript.js)
// ==========================================

import { charData } from '../../saves/tempSave.js';
import { racesData, getDynamicRaceFeatures } from '../data/racesData.js';
import { recalculateStats, syncStatsUI } from './statsScript.js';
import { renderAssignedFeats } from './attributesScript.js';

export function updateRacesSelect() {
    const select = document.getElementById("raceSelect");
    if (!select) return;

    let html = `<option value="none">-- Выберите вид --</option>`;
    Object.keys(racesData).forEach(key => {
        const r = racesData[key];
        const safeDesc = r.description.replace(/"/g, '&quot;');
        html += `<option value="${key}" data-inspector="<b>${r.name}:</b><br>${safeDesc}">${r.name}</option>`;
    });

    select.innerHTML = html;
    select.value = charData.origin.raceKey || "none";
}

export function bindRacesEvents() {
    const select = document.getElementById("raceSelect");
    const modal = document.getElementById("raceChoiceModal");

    if (select) {
        select.addEventListener("change", (e) => {
            const key = e.target.value;

            if (key === "none") {
                revertRaceSkillChoice();
                charData.origin.raceKey = "none";
                charData.origin.raceChoices = {};
                charData.origin.size = "Средний";
                applyRaceBonuses();
                return;
            }

            const race = racesData[key];
            if (!race) return;

            // ВСЕГДА открываем модальное окно для подтверждения и чтения описания
            openRaceModal(key, race);
        });
    }

    if (modal) {
        document.getElementById("raceModalCancelBtn")?.addEventListener("click", () => {
            modal.classList.remove("visible");
            // Если игрок отменил выбор, возвращаем селект к текущей выбранной расе
            if (select) select.value = charData.origin.raceKey || "none";
        });
    }
}

// Откат навыка, который был выбран в прошлой расе (например, у Человека или Эльфа)
function revertRaceSkillChoice() {
    const oldChoices = charData.origin.raceChoices || {};
    const skillKey = oldChoices.elf_skill || oldChoices.human_skill;
    if (skillKey && charData.skills[skillKey]) {
        // Убираем владение, только если оно было получено именно расой (т.е. равно 1)
        if (charData.skills[skillKey].state === 1) {
            charData.skills[skillKey].state = 0;
        }
    }
}

function openRaceModal(key, race) {
    const modal = document.getElementById("raceChoiceModal");
    const title = document.getElementById("raceModalTitle");
    const desc = document.getElementById("raceModalDesc");
    const container = document.getElementById("raceModalChoicesContainer");
    const confirmBtn = document.getElementById("raceModalConfirmBtn");

    if (!modal || !container) return;

    title.innerText = race.name;

    // 1. Сначала генерируем выпадающие списки (селекты)
    let html = "";
    if (race.choices && race.choices.length > 0) {
        race.choices.forEach(ch => {
            html += `
                <div style="margin-bottom: 12px;">
                    <label class="font-group-2" style="margin-bottom:6px;">${ch.title}</label>
                    <select class="font-group-3 input-field race-choice-sel" data-id="${ch.id}">`;
            ch.options.forEach(opt => {
                html += `<option value="${opt.value}">${opt.label}</option>`;
            });
            html += `</select></div>`;
        });
    } else {
        html = `<p class="font-group-3" style="color:var(--text-muted); text-align:center;">Для этой расы нет дополнительных настроек. Нажмите "Выбрать", чтобы применить.</p>`;
    }
    container.innerHTML = html;

    // 2. Функция, которая динамически обновляет описание на основе выбранных опций
    const updateModalDescription = () => {
        const choicesObj = {};
        container.querySelectorAll(".race-choice-sel").forEach(sel => {
            choicesObj[sel.getAttribute("data-id")] = sel.value;
        });

        const lvl = charData.origin.level || 1;
        // Получаем динамические особенности для предпросмотра
        const dynamicFeatures = getDynamicRaceFeatures(key, race, choicesObj, lvl);

        let fullDesc = `<p style="margin-bottom: 15px; text-align: justify;">${race.description}</p>`;
        fullDesc += `<div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 6px; border-left: 3px solid var(--accent-success); margin-bottom: 15px;">`;
        fullDesc += `<h4 style="color: var(--accent-success); margin-bottom: 10px; margin-top: 0;">Особенности расы:</h4>`;

        dynamicFeatures.forEach(f => {
            fullDesc += `<div style="margin-bottom: 8px; font-size: 13.5px; text-align: justify;"><b style="color:var(--accent-yellow);">${f.name}:</b> ${f.description}</div>`;
        });

        fullDesc += `</div>`;
        desc.innerHTML = fullDesc;
    };

    // 3. Вешаем слушатели на селекты, чтобы при изменении (например, вида великана) обновлялось описание
    container.querySelectorAll(".race-choice-sel").forEach(sel => {
        sel.addEventListener("change", updateModalDescription);
    });

    // 4. Запускаем обновление описания один раз при открытии, чтобы отрисовать начальный выбор
    updateModalDescription();

    modal.classList.add("visible");
    const newConfirm = confirmBtn.cloneNode(true);
    confirmBtn.replaceWith(newConfirm);

    newConfirm.onclick = () => {
        // Сначала откатываем навык старой расы, если он был
        revertRaceSkillChoice();

        const choicesObj = {};
        container.querySelectorAll(".race-choice-sel").forEach(sel => {
            choicesObj[sel.getAttribute("data-id")] = sel.value;
        });

        charData.origin.raceKey = key;
        charData.origin.raceChoices = choicesObj;

        const chosenSize = choicesObj.aasimar_size || choicesObj.tiefling_size || choicesObj.human_size || race.size || "Средний";
        charData.origin.size = chosenSize.includes("Маленький") ? "Маленький" : "Средний";

        const chosenSkill = choicesObj.elf_skill || choicesObj.human_skill;
        if (chosenSkill && charData.skills[chosenSkill]) {
            charData.skills[chosenSkill].state = Math.max(1, charData.skills[chosenSkill].state);
        }

        applyRaceBonuses();
        modal.classList.remove("visible");
    };
}

export function applyRaceBonuses() {
    const key = charData.origin.raceKey;
    const race = racesData[key];
    const passiveBox = document.getElementById("assignedFeaturesDisplay");

    if (!race || key === "none") {
        if (passiveBox) passiveBox.innerHTML = `<p class="font-group-3" style="color: var(--text-muted); font-style: italic;">Особенности не выбраны</p>`;
        recalculateStats();
        syncStatsUI();
        if (typeof renderAssignedFeats === "function") renderAssignedFeats();
        return;
    }

    const lvl = charData.origin.level || 1;
    const dynamicFeatures = getDynamicRaceFeatures(key, race, charData.origin.raceChoices || {}, lvl);
    let passiveHtml = "";

    // Отрисовываем пассивные особенности в первой вкладке под расой
    dynamicFeatures.forEach(feat => {
        if (feat.type !== "active") {
            const safeDesc = feat.description.replace(/"/g, '&quot;');
            passiveHtml += `
                <div class="interactive-node" data-inspector="<b>${feat.name} (${race.name}):</b><br>${safeDesc}"
                     style="padding: 8px 10px; margin-bottom: 8px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 6px;">
                    <strong style="color: var(--accent-success); font-size: 13.5px;">${feat.name}</strong>
                    <span style="font-size:11px; color: var(--text-muted); float: right;">${race.name.split(" ")[0]}</span>
                </div>`;
        }
    });

    if (passiveBox) passiveBox.innerHTML = passiveHtml || `<p class="font-group-3" style="color: var(--text-muted); font-style: italic;">Нет пассивных особенностей</p>`;

    // --- Обработка врождённых заклинаний от расы ---
    if (!charData.magic) charData.magic = { known: [], prepared: [], innateSpells: [] };
    if (!charData.magic.innateSpells) charData.magic.innateSpells = [];

    // Очищаем старые врождённые заклинания
    charData.magic.known = charData.magic.known.filter(sp => !charData.magic.innateSpells.includes(sp));
    charData.magic.prepared = charData.magic.prepared.filter(sp => !charData.magic.innateSpells.includes(sp));
    charData.magic.innateSpells = [];

    // Словарь заклинаний по уровням для рас
    const raceSpells = {
        aasimar: { 1: ["light"] },
        gnome_forest: { 1: ["minor_illusion", "speak_with_animals"] },
        gnome_rock: { 1: ["mending", "prestidigitation"] },
        elf_drow: { 1: ["dancing_lights"], 3: ["faerie_fire"], 5: ["darkness"] },
        elf_high: { 1: ["prestidigitation"], 3: ["detect_magic"], 5: ["misty_step"] }, // prestidigitation используется как база
        elf_wood: { 1: ["druidcraft"], 3: ["longstrider"], 5: ["pass_without_trace"] },
        tiefling_infernal: { 1: ["fire_bolt", "thaumaturgy"], 3: ["hellish_rebuke"], 5: ["darkness"] },
        tiefling_abyssal: { 1: ["poison_spray", "thaumaturgy"], 3: ["ray_of_sickness"], 5: ["hold_person"] },
        tiefling_chthonic: { 1: ["chill_touch", "thaumaturgy"], 3: ["false_life"], 5: ["ray_of_enfeeblishment"] }
    };

    const mySpells = raceSpells[key];
    if (mySpells) {
        Object.keys(mySpells).forEach(reqLvl => {
            if (lvl >= Number(reqLvl)) {
                mySpells[reqLvl].forEach(spellKey => {
                    charData.magic.innateSpells.push(spellKey);
                    if (!charData.magic.known.includes(spellKey)) charData.magic.known.push(spellKey);
                    if (!charData.magic.prepared.includes(spellKey)) charData.magic.prepared.push(spellKey);
                });
            }
        });
    }

    recalculateStats();
    syncStatsUI();
    if (typeof renderAssignedFeats === "function") renderAssignedFeats();
    if (typeof window.initGlobalInspector === "function") window.initGlobalInspector();
}