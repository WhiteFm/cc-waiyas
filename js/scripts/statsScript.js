// ==========================================
// ГЛАВНЫЙ МАТЕМАТИЧЕСКИЙ ДВИЖОК (statsScript.js)
// ==========================================

import { charData } from '../../saves/tempSave.js';
import { racesData } from '../data/racesData.js';
import { classData } from '../data/classesData.js';
import { applyFeatBonuses } from './attributesScript.js';
import { armorsData } from '../data/equipments/armorsData.js';
import { instrumentsData } from '../data/equipments/instrumentsData.js';
import { customItemsData } from '../data/customItems.js';

export { charData, charData as charState };

const POINT_BUY_COSTS = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };

const PACK_ITEMS = {
    "entertainers_pack": [
        {key: "waterskin", count: 1}, {key: "mirror", count: 1}, {key: "bell", count: 1},
        {key: "costume", count: 3}, {key: "oil", count: 8}, {key: "lantern_bullseye", count: 1},
        {key: "rations", count: 9}, {key: "backpack", count: 1}, {key: "bedroll", count: 1}, {key: "tinderbox", count: 1}
    ],
    "burglars_pack": [
        {key: "waterskin", count: 1}, {key: "rope", count: 1}, {key: "lantern_hooded", count: 1},
        {key: "backpack", count: 1}, {key: "bell", count: 1}, {key: "crowbar", count: 1},
        {key: "ball_bearings", count: 1}, {key: "oil", count: 7}, {key: "rations", count: 5},
        {key: "candle", count: 10}, {key: "tinderbox", count: 1}
    ],
    "diplomats_pack": [
        {key: "paper_sheet", count: 5}, {key: "perfume", count: 1}, {key: "lamp", count: 1},
        {key: "oil", count: 4}, {key: "clothes_fine", count: 1}, {key: "ink_pen", count: 5},
        {key: "parchment", count: 5}, {key: "chest", count: 1}, {key: "map_scroll_case", count: 2},
        {key: "tinderbox", count: 1}, {key: "ink", count: 1}
    ],
    "dungeoneers_pack": [
        {key: "waterskin", count: 1}, {key: "rope", count: 1}, {key: "caltrop_single", count: 20},
        {key: "crowbar", count: 1}, {key: "oil", count: 2}, {key: "rations", count: 10},
        {key: "backpack", count: 1}, {key: "tinderbox", count: 1}, {key: "torch", count: 10}
    ],
    "explorers_pack": [
        {key: "waterskin", count: 1}, {key: "rope", count: 1}, {key: "oil", count: 2},
        {key: "rations", count: 10}, {key: "backpack", count: 1}, {key: "bedroll", count: 1},
        {key: "tinderbox", count: 1}, {key: "torch", count: 10}
    ],
    "priests_pack": [
        {key: "lamp", count: 1}, {key: "robes", count: 1}, {key: "blanket", count: 1},
        {key: "rations", count: 7}, {key: "backpack", count: 1}, {key: "holy_water", count: 1}, {key: "tinderbox", count: 1}
    ],
    "scholars_pack": [
        {key: "book", count: 1}, {key: "lamp", count: 1}, {key: "oil", count: 10},
        {key: "parchment", count: 10}, {key: "ink_pen", count: 1}, {key: "backpack", count: 1},
        {key: "tinderbox", count: 1}, {key: "ink", count: 1}
    ]
};

const PACKS_EXPANSION = {
    "Набор артиста": PACK_ITEMS["entertainers_pack"],
    "entertainers_pack": PACK_ITEMS["entertainers_pack"],
    "Набор взломщика": PACK_ITEMS["burglars_pack"],
    "burglars_pack": PACK_ITEMS["burglars_pack"],
    "Набор дипломата": PACK_ITEMS["diplomats_pack"],
    "diplomats_pack": PACK_ITEMS["diplomats_pack"],
    "Набор исследователя подземелий": PACK_ITEMS["dungeoneers_pack"],
    "dungeoneers_pack": PACK_ITEMS["dungeoneers_pack"],
    "Набор путешественника": PACK_ITEMS["explorers_pack"],
    "explorers_pack": PACK_ITEMS["explorers_pack"],
    "Набор священника": PACK_ITEMS["priests_pack"],
    "priests_pack": PACK_ITEMS["priests_pack"],
    "Набор учёного": PACK_ITEMS["scholars_pack"],
    "scholars_pack": PACK_ITEMS["scholars_pack"]
};

export function ensureCharDataStructure() {
    if (!charData.bonuses) {
        charData.bonuses = { stats: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 }, speed: 0, ac: 0, hpMax: 0, initiative: 0 };
    }
    if (!charData.health.rolls) charData.health.rolls = [];
    if (!charData.inventory) charData.inventory = { equipped: { armor: null, weapons: [], rings: [], activeSet: 1 }, storage: [], currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 } };
    if (!charData.inventory.equipped) charData.inventory.equipped = { armor: null, weapons: [], rings: [], activeSet: 1 };
    if (!charData.proficiencies) charData.proficiencies = { armor: { light: false, medium: false, heavy: false, shield: false }, weapon: { simple: 0, martial: 0, other: false }, tools: [], languages: [] };
    if (!charData.magic) charData.magic = { slotsUsed: {}, sorceryPoints: 0 };
    if (charData.magic.sorceryPoints === undefined) charData.magic.sorceryPoints = 0;
}

export function calculateFeatureCharges(featName) {
    const pb = charData.origin?.pb || 2;
    const chaMod = charData.stats?.cha?.mod || 0;
    const wisMod = charData.stats?.wis?.mod || 0;
    const classKey = charData.origin?.classKey;
    const level = charData.origin?.level || 1;

    // Ресурсы классов
    if (classKey === "barbarian" && featName.includes("Ярость")) return level < 3 ? 2 : level < 6 ? 3 : level < 12 ? 4 : level < 17 ? 5 : level < 20 ? 6 : 99;
    if (classKey === "monk" && (featName.includes("Очки фокуса") || featName.includes("Очки сосредоточенности"))) return Math.max(1, level);
    if (classKey === "druid" && featName.includes("Дикий облик")) return level < 20 ? 2 : 99;
    if (classKey === "cleric" && featName.includes("Проведение божественности")) return level < 6 ? 2 : level < 18 ? 3 : 4;
    if (classKey === "paladin" && featName.includes("Проведение божественности")) return level < 11 ? 2 : 3;

    // Воин (Fighter)
    if (classKey === "fighter" && featName.includes("Второе дыхание")) return level < 4 ? 2 : level < 10 ? 3 : 4;
    if (classKey === "fighter" && featName.includes("Всплеск действий")) return level < 17 ? 1 : 2;
    if (classKey === "fighter" && featName.includes("Упорный")) return level < 9 ? 0 : level < 13 ? 1 : level < 17 ? 2 : 3;
    if (featName.includes("Боевое превосходство")) return level < 3 ? 0 : level < 7 ? 4 : level < 15 ? 5 : 6;

    // Паладин (Paladin)
    if (featName.includes("Возложение рук")) return level * 5;

    // Следопыт (Ranger)
    if (featName.includes("Неутомимый")) return pb;
    if (featName.includes("Природная завеса")) return Math.max(1, wisMod);

    // Колдун и Чародей (Warlock / Sorcerer)
    if (featName.includes("Врождённое чародейство")) return 2;
    if (featName.includes("Таинственный арканум")) return 1;

    // Ресурсы черт и других свойств
    if (featName.includes("Псионическая сила")) return pb * 2;
    if (featName.includes("Бардовское вдохновение")) return Math.max(1, chaMod);
    if (featName.includes("Лечащий свет")) return level + 1;
    if (featName.includes("Восстановление жизненной силы")) return 10;

    const pbCharges = ["Очки удачи", "Наследие великанов", "Оружие дыхания", "Выброс адреналина", "Ободряющая песня", "Знание камня", "Поддерживающие угощения", "Боевой священник", "Защищающая вспышка", "Корона света", "Шаги феи", "Удача Темнейшего"];
    if (pbCharges.some(n => featName.includes(n))) return pb;

    const oneCharges = [
        "Исцеляющие руки", "Небесное откровение", "Большая форма", "Драконий полёт", "Непоколебимая стойкость",
        "Заклинание 1-го уровня", "Магия Фей", "Теневая магия", "Защищённый разум", "Быстрый ритуал", "Безупречный прицел",
        "Последний рубеж", "Улучшение судьбы", "Чарующая магия", "Мантия величия", "Несокрушимое величие",
        "Инфернальное наследие (Ур. 3)", "Инфернальное наследие (Ур. 5)", "Наследие Бездны (Ур. 3)",
        "Наследие Бездны (Ур. 5)", "Хтоническое наследие (Ур. 3)", "Хтоническое наследие (Ур. 5)",
        "Магия Дроу (Ур. 3)", "Магия Дроу (Ур. 5)", "Магия Высших эльфов (Ур. 3)", "Магия Высших эльфов (Ур. 5)",
        "Магия Лесных эльфов (Ур. 3)", "Магия Лесных эльфов (Ур. 5)", "Чародейское восстановление",
        "Магическая изворотливость", "Магическое восстановление", "Божественное вмешательство",
        "Бессмертный страж", "Ангел возмездия", "Древний чемпион", "Священный ореол", "Живая легенда",
        "Искажающее схлопывание", "Крылья дракона", "Дракон-спутник", "Медитация порядка", "Заводная кавалькада",
        "Укрощённая волна", "Бросок сквозь ад", "Жгучее возмездие"
    ];
    if (oneCharges.some(n => featName.includes(n))) return 1;

    return 0;
}

window.longRest = function() {
    if (!confirm("Вы уверены, что хотите совершить Долгий отдых? Это восстановит всё здоровье, половину костей хитов, все ячейки заклинаний, заряды предметов и все способности.")) return;

    charData.health.current = charData.health.max;
    charData.hitDice.current = Math.min(charData.hitDice.max, charData.hitDice.current + Math.max(1, Math.floor(charData.hitDice.max / 2)));

    charData.health.temp = 0;

    if (!charData.deathSaves) charData.deathSaves = { successes: 0, failures: 0 };
    charData.deathSaves.successes = 0;
    charData.deathSaves.failures = 0;

    if (charData.magic) {
        charData.magic.slotsUsed = {};
        if (charData.origin.classKey === "sorcerer" && charData.origin.level >= 2) {
            charData.magic.sorceryPoints = charData.origin.level;
        }
    }

    charData.combat.charges = {};

    if (charData.origin.raceKey === "human") {
        charData.combat.heroicInspiration = true;
    }

    if (charData.inventory) {
        const resetItemCharges = (arr) => {
            if (!Array.isArray(arr)) return;
            arr.forEach(item => {
                if (item && item.charges !== undefined) {
                    delete item.charges;
                }
            });
        };
        resetItemCharges(charData.inventory.storage);
        if (charData.inventory.lists) Object.values(charData.inventory.lists).forEach(resetItemCharges);
        if (charData.inventory.equipped) {
            Object.values(charData.inventory.equipped).forEach(slot => {
                if (Array.isArray(slot)) resetItemCharges(slot);
                else if (slot) resetItemCharges([slot]);
            });
        }
    }

    applyFeatBonuses();
    document.dispatchEvent(new Event('charDataUpdated'));
    if (typeof window.syncAllSkillsUI === "function") window.syncAllSkillsUI();
    if (typeof window.renderInventoryUI === "function") window.renderInventoryUI();
};

window.shortRest = function() {
    if (!confirm("Вы уверены, что хотите совершить Короткий отдых? Здоровье восстанавливается вручную тратой костей хитов.")) return;

    if (!charData.deathSaves) charData.deathSaves = { successes: 0, failures: 0 };
    charData.deathSaves.successes = 0;
    charData.deathSaves.failures = 0;

    // Способности, которые восстанавливаются на Коротком отдыхе
    const shortRestFeatures = [
        "Второе дыхание",
        "Всплеск действий",
        "Боевое превосходство",
        "Порыв к действию",
        "Божественный канал",
        "Дикий облик",
        "Выброс адреналина",
        "Непоколебимая стойкость",
        "Оружие дыхания",
        "Знание камня",
        "Ободряющая песня",
        "Восстановление жизненной силы",
        "Очки фокуса",
        "Очки сосредоточенности",
        "Ци",
        "Проведение божественности",
        "Псионическая сила"
    ];

    if (charData.origin.classKey === "bard" && charData.origin.level >= 5) {
        shortRestFeatures.push("Бардовское вдохновение");
    }

    if (charData.combat && charData.combat.charges) {
        Object.keys(charData.combat.charges).forEach(key => {
            if (shortRestFeatures.some(f => key.includes(f))) {
                delete charData.combat.charges[key];
            }
        });
    }

    if (charData.origin.classKey === "warlock" && charData.magic) {
        charData.magic.slotsUsed = {};
    }

    if (charData.origin.classKey === "sorcerer" && charData.origin.level >= 5) {
        if (!charData.combat.charges["Чародейское восстановление"]) {
            const restoredSp = Math.floor(charData.origin.level / 2);
            const maxSp = charData.origin.level;
            charData.magic.sorceryPoints = Math.min(maxSp, (charData.magic.sorceryPoints || 0) + restoredSp);
            charData.combat.charges["Чародейское восстановление"] = 1;
        }
    }

    applyFeatBonuses();
    document.dispatchEvent(new Event('charDataUpdated'));
    if (typeof window.syncAllSkillsUI === "function") window.syncAllSkillsUI();
    if (typeof window.renderInventoryUI === "function") window.renderInventoryUI();
};

export function recalculateStats() {
    ensureCharDataStructure();
    const level = charData.origin.level || 1;
    charData.origin.pb = Math.ceil(level / 4) + 1;
    charData.hitDice.max = level;
    if (charData.hitDice.current > charData.hitDice.max) charData.hitDice.current = charData.hitDice.max;

    let totalPointBuyCost = 0;
    ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(key => {
        const statObj = charData.stats[key];

        let bonus = charData.bonuses?.stats?.[key] || 0;
        if (charData.backgroundState && charData.backgroundState.statsApplied) {
            bonus += charData.backgroundState.statsApplied[key] || 0;
        }

        statObj.val = statObj.base + bonus;
        statObj.mod = Math.floor((statObj.val - 10) / 2);
        statObj.saveMod = statObj.mod + (statObj.saveProf ? charData.origin.pb : 0);

        if (statObj.base > 8) {
            totalPointBuyCost += statObj.base <= 15 ? (POINT_BUY_COSTS[statObj.base] || 0) : (9 + (statObj.base - 15) * 2);
        }
    });

    const conMod = charData.stats.con.mod;
    const featHp = charData.bonuses?.hpMax || 0;
    const hitDieStr = charData.hitDice.type || "d8";
    const firstLevelMaxDie = parseInt(hitDieStr.replace("d", "")) || 8;
    const raceHpBonus = (charData.origin.raceKey === "dwarf") ? level : 0;

    const sumRolls = (charData.health.rolls || []).reduce((a, b) => a + b, 0);
    charData.health.max = firstLevelMaxDie + sumRolls + (conMod * level) + featHp + raceHpBonus;

    if (charData.health.current > charData.health.max) charData.health.current = charData.health.max;

    const hasJackOfAllTrades = (charData.origin.classKey === "bard" && charData.origin.level >= 2);
    const jackBonus = hasJackOfAllTrades ? Math.floor(charData.origin.pb / 2) : 0;

    Object.keys(charData.skills).forEach(skKey => {
        const sk = charData.skills[skKey];
        const statMod = charData.stats[sk.stat].mod;
        if (sk.state === 0) sk.mod = statMod + jackBonus;
        else if (sk.state === 1) sk.mod = statMod + charData.origin.pb;
        else if (sk.state === 2) sk.mod = statMod + (charData.origin.pb * 2);
    });

    let baseInitiative = charData.stats.dex.mod;
    const alertFeatCount = charData.selectedFeats["alert"] ? charData.selectedFeats["alert"].instances.length : 0;
    if (hasJackOfAllTrades && alertFeatCount === 0) {
        baseInitiative += jackBonus;
    }

    const raceObj = racesData[charData.origin.raceKey];
    let baseSpeed = raceObj?.speed || 30;
    charData.combat.speed = baseSpeed + (charData.bonuses?.speed || 0);

    let baseAc = 10 + charData.stats.dex.mod;
    let hasStealthDisadv = false;
    let failsStrRequirement = false;

    const eqArmor = charData.inventory.equipped.armor;
    const actSet = charData.inventory.equipped.activeSet || 1;
    const eqWeapons = (charData.inventory.equipped.weapons || []).filter(w => w.equipSlot && w.equipSlot.includes(`set${actSet}`));

    const eqShield = eqWeapons.find(w => {
        if (w.key && w.key.includes("shield")) return true;
        const itemDef = armorsData[w.key] || customItemsData[w.key];
        return itemDef && (itemDef.category === "Щит" || itemDef.type === "Щит");
    });

    if (eqArmor) {
        const armor = armorsData[eqArmor.key] || customItemsData[eqArmor.key];
        if (armor) {
            hasStealthDisadv = armor.stealth === "Помеха";

            const reqStr = parseInt((armor.strReq || "").replace(/\D/g, '')) || 0;
            if (reqStr > 0 && charData.stats.str.val < reqStr) failsStrRequirement = true;

            let hasArmorProf = true;
            const category = armor.category || "";
            if (category.includes("Лёгкий") || category.includes("Легкий")) hasArmorProf = charData.proficiencies.armor.light;
            else if (category.includes("Средний")) hasArmorProf = charData.proficiencies.armor.medium;
            else if (category.includes("Тяжёлый") || category.includes("Тяжелый")) hasArmorProf = charData.proficiencies.armor.heavy;

            if (!hasArmorProf) {
                baseAc = 10;
            } else {
                const baseArmorValue = parseInt(armor.ac) || 10;
                const maxDexMatch = (armor.ac || "").match(/(?:макс\.|max\.?)\s*(\d+)/i);

                if (maxDexMatch) {
                    const maxDexAllowed = parseInt(maxDexMatch[1]);
                    baseAc = baseArmorValue + Math.min(maxDexAllowed, charData.stats.dex.mod);
                } else if (category.includes("Тяжёлый") || category.includes("Тяжелый") || (armor.ac && !armor.ac.includes("Лов"))) {
                    baseAc = baseArmorValue;
                } else {
                    baseAc = baseArmorValue + charData.stats.dex.mod;
                }
            }
        }
    }

    if (eqShield) {
        const shieldDef = armorsData[eqShield.key] || customItemsData[eqShield.key];
        if (charData.proficiencies.armor.shield) {
            let sBonus = 2;
            if (shieldDef && shieldDef.ac) {
                const match = shieldDef.ac.match(/\+?(\d+)/);
                if (match) sBonus = parseInt(match[1]);
            }
            baseAc += sBonus;
        }
    }

    if (failsStrRequirement) {
        charData.combat.speed = Math.max(0, charData.combat.speed - 10);
    }

    charData.combat.climbSpeed = Math.floor(charData.combat.speed / 2);
    const hasFly = (charData.origin.raceKey === "dragonborn" && level >= 5) || (charData.origin.raceKey === "aasimar" && level >= 3);
    charData.combat.flySpeed = hasFly ? charData.combat.speed : 0;

    charData.combat.initiative = baseInitiative + (charData.bonuses?.initiative || 0);
    charData.combat.passivePerception = 10 + charData.skills.perception.mod;
    charData.combat.stealthDisadvantage = hasStealthDisadv;
    charData.combat.ac = baseAc + (charData.bonuses?.ac || 0);

    window.charData = charData;
    return totalPointBuyCost;
}

export function syncStatsUI() {
    const totalPbCost = recalculateStats();

    if (document.getElementById("charLevel")) document.getElementById("charLevel").value = charData.origin.level;
    if (document.getElementById("profBonusDisplay")) document.getElementById("profBonusDisplay").value = `+${charData.origin.pb}`;

    const statKeys = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    statKeys.forEach(key => {
        const statObj = charData.stats[key];
        const inputEl = document.getElementById(`stat_${key}`);
        const modEl = document.getElementById(`mod_${key}`);
        const costEl = document.getElementById(`cost_${key}`);

        if (inputEl && document.activeElement !== inputEl) inputEl.value = statObj.base;

        if (modEl) {
            modEl.innerHTML = `<span style="font-weight:900; font-size:15px;">${statObj.val}</span> <span style="font-size:12px; color:var(--text-muted);">(${statObj.mod >= 0 ? "+" : ""}${statObj.mod})</span>`;
            const hasBonus = (charData.bonuses?.stats?.[key] > 0) || (charData.backgroundState?.statsApplied?.[key] > 0);
            modEl.style.color = hasBonus ? "var(--accent-success)" : "";
        }
        if (costEl) costEl.innerText = statObj.base <= 15 ? (POINT_BUY_COSTS[statObj.base] || 0) : "9+";
    });

    const pbTotalEl = document.getElementById("pbTotal");
    if (pbTotalEl) {
        pbTotalEl.innerText = totalPbCost;
        pbTotalEl.style.color = totalPbCost > 27 ? "var(--accent)" : "#cbd5e1";
    }

    if (document.getElementById("hpMax")) document.getElementById("hpMax").value = charData.health.max;

    const hdDisplay = document.getElementById("hitDiceDisplay");
    if (hdDisplay) hdDisplay.innerText = `${charData.hitDice.max}${charData.hitDice.type}`;

    if (document.getElementById("prof_armor_light")) document.getElementById("prof_armor_light").checked = charData.proficiencies.armor.light;
    if (document.getElementById("prof_armor_medium")) document.getElementById("prof_armor_medium").checked = charData.proficiencies.armor.medium;
    if (document.getElementById("prof_armor_heavy")) document.getElementById("prof_armor_heavy").checked = charData.proficiencies.armor.heavy;
    if (document.getElementById("prof_armor_shield")) document.getElementById("prof_armor_shield").checked = charData.proficiencies.armor.shield;

    ['simple', 'martial'].forEach(wType => {
        const currentVal = Number(charData.proficiencies.weapon[wType]) || 0;
        const group = document.querySelector(`.weapon-st-group[data-weapon="${wType}"]`);
        if (group) {
            group.querySelectorAll('.st-btn').forEach(btn => {
                const btnState = parseInt(btn.getAttribute('data-state'));
                btn.classList.toggle('active', btnState === currentVal);
            });
        }
    });

    if (document.getElementById("prof_weapon_other")) document.getElementById("prof_weapon_other").checked = charData.proficiencies.weapon.other || false;
}

export let levelQueue = [];

export function processLevelQueue() {
    if (levelQueue.length === 0) {
        applyFeatBonuses();
        document.dispatchEvent(new Event('charDataUpdated'));
        return;
    }
    const nextLvl = levelQueue[0];
    openHpLevelUpModal(nextLvl);
}

export function bindStatsEventListeners() {
    document.querySelectorAll('.stepper-input').forEach(stepper => {
        const btnMinus = stepper.querySelector('.minus');
        const btnPlus = stepper.querySelector('.plus');
        const input = stepper.querySelector('input');

        if (btnMinus && btnPlus && input) {
            if (input.id === "charLevel") {
                btnMinus.onclick = () => {
                    const oldLvl = charData.origin.level || 1;
                    if (oldLvl > 1) {
                        charData.origin.level = oldLvl - 1;
                        if (charData.health.rolls && charData.health.rolls.length > 0) charData.health.rolls.pop();
                        applyFeatBonuses();
                        document.dispatchEvent(new Event('charDataUpdated'));
                    }
                };
                btnPlus.onclick = () => {
                    const oldLvl = charData.origin.level || 1;
                    if (oldLvl < 20) {
                        levelQueue.push(oldLvl + 1);
                        processLevelQueue();
                    }
                };
            } else {
                btnMinus.onclick = () => { input.stepDown(); input.dispatchEvent(new Event('input')); };
                btnPlus.onclick = () => { input.stepUp(); input.dispatchEvent(new Event('input')); };
            }
        }
    });

    const charLevelInput = document.getElementById("charLevel");
    if (charLevelInput) {
        charLevelInput.addEventListener("change", (e) => {
            let val = parseInt(e.target.value) || 1;
            val = Math.min(20, Math.max(1, val));
            const oldLvl = charData.origin.level || 1;

            if (val > oldLvl) {
                for (let i = oldLvl + 1; i <= val; i++) {
                    levelQueue.push(i);
                }
                e.target.value = oldLvl;
                processLevelQueue();
            } else if (val < oldLvl) {
                charData.origin.level = val;
                const diff = oldLvl - val;
                for(let i=0; i<diff; i++) {
                    if (charData.health.rolls && charData.health.rolls.length > 0) charData.health.rolls.pop();
                }
                applyFeatBonuses();
                document.dispatchEvent(new Event('charDataUpdated'));
            } else {
                e.target.value = oldLvl;
            }
        });
    }

    const statKeys = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    statKeys.forEach(key => {
        const inputEl = document.getElementById(`stat_${key}`);
        if (inputEl) {
            inputEl.addEventListener("input", (e) => {
                let newBase = parseInt(e.target.value) || 8;
                if (charData.origin.level === 1 && newBase > 15) {
                    newBase = 15;
                    e.target.value = 15;
                }
                charData.stats[key].base = Math.max(1, newBase);
                applyFeatBonuses();
            });
        }
    });

    document.getElementById("prof_armor_light")?.addEventListener("change", e => { charData.proficiencies.armor.light = e.target.checked; applyFeatBonuses(); });
    document.getElementById("prof_armor_medium")?.addEventListener("change", e => { charData.proficiencies.armor.medium = e.target.checked; applyFeatBonuses(); });
    document.getElementById("prof_armor_heavy")?.addEventListener("change", e => { charData.proficiencies.armor.heavy = e.target.checked; applyFeatBonuses(); });
    document.getElementById("prof_armor_shield")?.addEventListener("change", e => { charData.proficiencies.armor.shield = e.target.checked; applyFeatBonuses(); });

    document.querySelectorAll('.weapon-st-group .st-btn').forEach(btn => {
        btn.onclick = () => {
            const group = btn.closest('.weapon-st-group');
            const wType = group?.getAttribute('data-weapon');
            const newState = parseInt(btn.getAttribute('data-state')) || 0;
            if (wType) {
                charData.proficiencies.weapon[wType] = newState;
                applyFeatBonuses();
            }
        };
    });
}

const buildSkillChoiceHtml = (count, idPrefix, title) => {
    let opts = `<option value="none">-- Выберите навык --</option>`;
    Object.keys(charData.skills).forEach(k => opts += `<option value="${k}">${charData.skills[k].name}</option>`);

    let html = `<div style="margin-bottom:15px; text-align:left;"><label class="font-group-2" style="color:var(--accent-yellow);">${title} (Выберите ${count}):</label>`;
    for(let i=0; i<count; i++) {
        html += `<select id="${idPrefix}_${i}" class="font-group-3 input-field level-up-choice" style="margin-top:5px;" data-choice-type="skill">${opts}</select>`;
    }
    html += `</div>`;
    return html;
};

const buildExpertiseChoiceHtml = (count, idPrefix, title) => {
    let opts = `<option value="none">-- Выберите навык --</option>`;
    Object.keys(charData.skills).forEach(k => opts += `<option value="${k}">${charData.skills[k].name}</option>`);

    let html = `<div style="margin-bottom:15px; text-align:left;"><label class="font-group-2" style="color:var(--accent-yellow);">${title} (Выберите ${count}):</label>`;
    for(let i=0; i<count; i++) {
        html += `<select id="${idPrefix}_${i}" class="font-group-3 input-field level-up-choice" style="margin-top:5px;" data-choice-type="expertise">${opts}</select>`;
    }
    html += `</div>`;
    return html;
};

const buildToolChoiceHtml = (toolOpt, idPrefix, title) => {
    let opts = `<option value="none">-- Выберите инструмент --</option>`;
    Object.keys(instrumentsData).forEach(k => {
        if (toolOpt.type === "musical_options" && instrumentsData[k].category === "Музыкальные инструменты") {
            opts += `<option value="${k}">${instrumentsData[k].name}</option>`;
        } else if (toolOpt.type === "artisan_or_musical" && (instrumentsData[k].category === "Инструменты ремесленников" || instrumentsData[k].category === "Музыкальные инструменты")) {
            opts += `<option value="${k}">${instrumentsData[k].name}</option>`;
        }
    });

    let html = `<div style="margin-bottom:15px; text-align:left;"><label class="font-group-2" style="color:var(--accent-yellow);">${title} (Выберите ${toolOpt.count}):</label>`;
    for(let i=0; i<toolOpt.count; i++) {
        html += `<select id="${idPrefix}_${i}" class="font-group-3 input-field level-up-choice" style="margin-top:5px;" data-choice-type="tool">${opts}</select>`;
    }
    html += `</div>`;
    return html;
};

const buildEquipmentChoiceHtml = (equipOpts, idPrefix, title) => {
    let opts = `<option value="none">-- Выберите вариант --</option>`;
    Object.keys(equipOpts).forEach(k => opts += `<option value="${k}">${equipOpts[k].name}</option>`);

    return `<div style="margin-bottom:15px; text-align:left;">
        <label class="font-group-2" style="color:var(--accent-success);">${title}:</label>
        <select id="${idPrefix}" class="font-group-3 input-field level-up-choice" style="margin-top:5px;" data-choice-type="equipment">
            ${opts}
        </select>
    </div>`;
};

export function openHpLevelUpModal(newLevel) {
    const modal = document.getElementById("hpLevelUpModal");
    const dynContent = document.getElementById("levelUpDynamicContent");
    const rollInput = document.getElementById("hpLevelRollInput");
    const confirmBtn = document.getElementById("hpLevelConfirmBtn");
    const cancelBtn = document.getElementById("hpLevelCancelBtn");

    ensureCharDataStructure();

    if (!modal || !rollInput || !dynContent) {
        charData.origin.level = newLevel;
        levelQueue.shift();
        processLevelQueue();
        return;
    }

    const hitDie = charData.hitDice?.type || "d8";
    const dieMax = parseInt(hitDie.replace("d", "")) || 8;
    const avgRoll = Math.floor(dieMax / 2) + 1;

    let levelUpInfo = `<div style="font-size: 15px; margin-bottom: 10px;">Вы достигли <b>${newLevel}-го уровня</b>!</div>`;
    let bonuses = [];
    let extraHtml = "";

    const classKey = charData.origin.classKey;
    const cls = classData[classKey];

    if (cls && cls.features && cls.features[newLevel]) {
        cls.features[newLevel].forEach((f, idx) => {
            bonuses.push(f.name);
            if (f.skillChoice) extraHtml += buildSkillChoiceHtml(f.skillChoice, `base_sk_${idx}`, f.name);
            if (f.expertiseChoice) extraHtml += buildExpertiseChoiceHtml(f.expertiseChoice, `base_exp_${idx}`, f.name);
            if (f.toolChoice) extraHtml += buildToolChoiceHtml(f.toolChoice, `base_tool_${idx}`, f.toolChoice.title);
            if (f.equipmentChoice) extraHtml += buildEquipmentChoiceHtml(f.equipmentChoice, `base_equip_${idx}`, f.name);
        });
    }

    if (newLevel === 3 && cls && cls.subclasses) {
        bonuses.push("Выбор подкласса и особенностей архетипа.");
        let subOpts = `<option value="none">-- Выберите подкласс --</option>`;
        Object.keys(cls.subclasses).forEach(k => subOpts += `<option value="${k}">${cls.subclasses[k].name}</option>`);

        extraHtml += `
            <div style="margin-bottom: 15px; text-align: left;">
                <label class="font-group-2">Выберите подкласс:</label>
                <select id="levelUpSubclassSelect" class="font-group-3 input-field">${subOpts}</select>
            </div>
            <div id="subclassFeaturesDynamic"></div>
        `;
    } else if (newLevel > 3 && charData.origin.subclassKey && charData.origin.subclassKey !== "none") {
        const subCls = cls.subclasses[charData.origin.subclassKey];
        if (subCls && subCls.features && subCls.features[newLevel]) {
            subCls.features[newLevel].forEach((f, idx) => {
                bonuses.push(f.name);
                if (f.skillChoice) extraHtml += buildSkillChoiceHtml(f.skillChoice, `sub_sk_${idx}`, f.name);
                if (f.expertiseChoice) extraHtml += buildExpertiseChoiceHtml(f.expertiseChoice, `sub_exp_${idx}`, f.name);
                if (f.toolChoice) extraHtml += buildToolChoiceHtml(f.toolChoice, `sub_tool_${idx}`, f.toolChoice.title);
                if (f.equipmentChoice) extraHtml += buildEquipmentChoiceHtml(f.equipmentChoice, `sub_equip_${idx}`, f.name);
            });
        }
    }

    if ([4, 8, 12, 16, 19].includes(newLevel)) {
        bonuses.push("Увеличение характеристик или выбор новой Черты.");
        extraHtml += `<div style="margin-bottom: 15px; text-align: left; background: rgba(224, 168, 46, 0.1); border-left: 3px solid var(--accent-yellow); padding: 8px;"><span style="font-size: 13px; color: var(--accent-yellow);"><b>Внимание:</b> Не забудьте выбрать новую черту на панели «Происхождение»!</span></div>`;
    }
    if ([5, 9, 13, 17].includes(newLevel)) bonuses.push("Увеличение Бонуса Мастерства.");

    if (bonuses.length > 0) {
        levelUpInfo += `<div style="text-align: left; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 6px; margin-bottom: 15px;">
            <b style="color: var(--accent-yellow);">Получено:</b>
            <ul style="margin: 5px 0 0 20px; font-size: 13px; color: var(--text-color);">
                <li>${bonuses.join("</li><li>")}</li>
            </ul>
        </div>`;
    }

    dynContent.innerHTML = levelUpInfo + extraHtml;

    if (newLevel === 1) {
        rollInput.parentElement.style.display = "none";
    } else {
        rollInput.parentElement.style.display = "block";
        rollInput.value = avgRoll;
    }

    const updateDropdowns = () => {
        const skillSelects = dynContent.querySelectorAll(`.level-up-choice[data-choice-type="skill"]`);
        const expSelects = dynContent.querySelectorAll(`.level-up-choice[data-choice-type="expertise"]`);
        const toolSelects = dynContent.querySelectorAll(`.level-up-choice[data-choice-type="tool"]`);

        const selectedSkills = Array.from(skillSelects).map(s => s.value).filter(v => v !== "none");
        const selectedExps = Array.from(expSelects).map(s => s.value).filter(v => v !== "none");
        const selectedTools = Array.from(toolSelects).map(s => s.value).filter(v => v !== "none");

        skillSelects.forEach(sel => {
            Array.from(sel.options).forEach(opt => {
                if (opt.value === "none") return;
                if (charData.skills[opt.value]?.state > 0) {
                    opt.disabled = true;
                } else if (selectedSkills.includes(opt.value) && sel.value !== opt.value) {
                    opt.disabled = true;
                } else {
                    opt.disabled = false;
                }
            });
        });

        expSelects.forEach(sel => {
            Array.from(sel.options).forEach(opt => {
                if (opt.value === "none") return;
                const isProf = charData.skills[opt.value]?.state === 1;
                const isJustSelected = selectedSkills.includes(opt.value);

                if (charData.skills[opt.value]?.state === 2) {
                    opt.disabled = true;
                } else if (!isProf && !isJustSelected) {
                    opt.disabled = true;
                    if (sel.value === opt.value) sel.value = "none";
                } else if (selectedExps.includes(opt.value) && sel.value !== opt.value) {
                    opt.disabled = true;
                } else {
                    opt.disabled = false;
                }
            });
        });

        const knownTools = (charData.proficiencies.tools || []).map(t => t.key || t);
        toolSelects.forEach(sel => {
            Array.from(sel.options).forEach(opt => {
                if (opt.value === "none") return;
                if (knownTools.includes(opt.value)) {
                    opt.disabled = true;
                } else if (selectedTools.includes(opt.value) && sel.value !== opt.value) {
                    opt.disabled = true;
                } else {
                    opt.disabled = false;
                }
            });
        });
    };

    dynContent.addEventListener("change", (e) => {
        if (e.target.classList.contains("level-up-choice")) updateDropdowns();
    });

    const subSel = document.getElementById("levelUpSubclassSelect");
    const subDyn = document.getElementById("subclassFeaturesDynamic");
    if (subSel && subDyn) {
        subSel.addEventListener("change", (e) => {
            const subKey = e.target.value;
            subDyn.innerHTML = "";
            if (subKey !== "none" && cls.subclasses[subKey] && cls.subclasses[subKey].features[newLevel]) {
                const sFeats = cls.subclasses[subKey].features[newLevel];
                let sHtml = "";
                sFeats.forEach((f, idx) => {
                    if (f.expertiseChoice) sHtml += buildExpertiseChoiceHtml(f.expertiseChoice, `sub_exp_${idx}`, f.name);
                    if (f.skillChoice) sHtml += buildSkillChoiceHtml(f.skillChoice, `sub_sk_${idx}`, f.name);
                    if (f.toolChoice) sHtml += buildToolChoiceHtml(f.toolChoice, `sub_tool_${idx}`, f.toolChoice.title);
                    if (f.equipmentChoice) sHtml += buildEquipmentChoiceHtml(f.equipmentChoice, `sub_equip_${idx}`, f.name);
                });
                subDyn.innerHTML = sHtml;
                updateDropdowns();
            }
        });
    }

    updateDropdowns();
    modal.classList.add("visible");

    const newConfirm = confirmBtn.cloneNode(true);
    confirmBtn.replaceWith(newConfirm);
    const newCancel = cancelBtn.cloneNode(true);
    cancelBtn.replaceWith(newCancel);

    newConfirm.onclick = () => {
        let chosenToolsThisLevel = [];

        document.querySelectorAll(".level-up-choice").forEach(sel => {
            if(sel.value !== "none") {
                const type = sel.getAttribute("data-choice-type");
                if (type === "expertise") charData.skills[sel.value].state = 2;
                else if (type === "skill") charData.skills[sel.value].state = 1;
                else if (type === "tool") {
                    charData.proficiencies.tools.push({key: sel.value});
                    chosenToolsThisLevel.push(sel.value);
                }
            }
        });

        if (subSel && subSel.value !== "none") {
            charData.origin.subclassKey = subSel.value;
            const mainSubSelect = document.getElementById("subclassSelect");
            if(mainSubSelect) {
                mainSubSelect.value = subSel.value;
                mainSubSelect.disabled = false;
            }
        }

        const processEquipmentGrant = (itemsArr) => {
            if (!itemsArr) return;
            itemsArr.forEach(item => {
                if (PACKS_EXPANSION[item.key]) {
                    PACKS_EXPANSION[item.key].forEach(packItem => {
                        charData.inventory.storage.push({ key: packItem.key, count: packItem.count * item.count, instanceId: Date.now() + Math.random() });
                    });
                } else {
                    charData.inventory.storage.push({ key: item.key, count: item.count, instanceId: Date.now() + Math.random() });
                }
            });
        };

        if (cls && cls.features && cls.features[newLevel]) {
            cls.features[newLevel].forEach((f, idx) => {
                if (f.grantEquipment) {
                    processEquipmentGrant(f.grantEquipment);
                }
                if (f.grantCurrency) {
                    Object.keys(f.grantCurrency).forEach(c => charData.inventory.currency[c] += f.grantCurrency[c]);
                }
                if (f.equipmentChoice) {
                    const sel = document.getElementById(`base_equip_${idx}`) || document.getElementById(`sub_equip_${idx}`);
                    if (sel && sel.value !== "none") {
                        const chosen = f.equipmentChoice[sel.value];
                        if (chosen.grantEquipment) {
                            processEquipmentGrant(chosen.grantEquipment);
                        }
                        if (chosen.grantDynamicTool) {
                            chosenToolsThisLevel.forEach(toolKey => {
                                charData.inventory.storage.push({ key: toolKey, count: 1, instanceId: Date.now() + Math.random() });
                            });
                        }
                        if (chosen.grantCurrency) {
                            Object.keys(chosen.grantCurrency).forEach(c => charData.inventory.currency[c] += chosen.grantCurrency[c]);
                        }
                    }
                }
            });
        }

        if (newLevel > 1) {
            const addedRoll = parseInt(rollInput.value) || avgRoll;
            if (!charData.health.rolls) charData.health.rolls = [];
            charData.health.rolls.push(addedRoll);
        }

        charData.origin.level = newLevel;
        levelQueue.shift();
        modal.classList.remove("visible");

        if (levelQueue.length > 0) {
            setTimeout(() => processLevelQueue(), 150);
        } else {
            applyFeatBonuses();
            if (typeof window.updateInstrumentsUI === "function") window.updateInstrumentsUI();
            if (typeof window.renderInventoryUI === "function") window.renderInventoryUI();
            document.dispatchEvent(new Event('charDataUpdated'));
        }
    };

    newCancel.onclick = () => {
        levelQueue = [];
        modal.classList.remove("visible");
        applyFeatBonuses();
        document.dispatchEvent(new Event('charDataUpdated'));
    };
}