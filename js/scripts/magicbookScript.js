// ==========================================
// ЛОГИКА И МАТЕМАТИКА (magicbookScript.js)
// ==========================================

import { charData } from '../../saves/tempSave.js';
import { spellsData } from '../data/magicbookData.js';

// Карта основных характеристик заклинателей D&D 2024
const CLASS_SPELL_STATS = {
    bard: "cha", cleric: "wis", druid: "wis", paladin: "cha",
    ranger: "wis", sorcerer: "cha", warlock: "cha", wizard: "int"
};

const STAT_NAMES = { str: "Сила", dex: "Ловкость", con: "Телосложение", int: "Интеллект", wis: "Мудрость", cha: "Харизма" };

// Прогрессия ячеек заклинаний для полных заклинателей (1-20 ур.)
const FULL_CASTER_SLOTS = {
    1: [2], 2: [3], 3: [4,2], 4: [4,3], 5: [4,3,2],
    6: [4,3,3], 7: [4,3,3,1], 8: [4,3,3,2], 9: [4,3,3,3,1], 10: [4,3,3,3,2],
    11: [4,3,3,3,2,1], 12: [4,3,3,3,2,1], 13: [4,3,3,3,2,1,1], 14: [4,3,3,3,2,1,1],
    15: [4,3,3,3,2,1,1,1], 16: [4,3,3,3,2,1,1,1], 17: [4,3,3,3,2,1,1,1,1],
    18: [4,3,3,3,3,1,1,1,1], 19: [4,3,3,3,3,2,1,1,1], 20: [4,3,3,3,3,2,2,1,1]
};

// Полукастеры (Паладин, Следопыт)
const HALF_CASTER_SLOTS = {
    1: [2], 2: [2], 3: [3], 4: [3], 5: [4,2], 6: [4,2], 7: [4,3], 8: [4,3],
    9: [4,3,2], 10: [4,3,2], 11: [4,3,3], 12: [4,3,3], 13: [4,3,3,1], 14: [4,3,3,1],
    15: [4,3,3,2], 16: [4,3,3,2], 17: [4,3,3,3,1], 18: [4,3,3,3,1], 19: [4,3,3,3,2], 20: [4,3,3,3,2]
};

export function ensureMagicBookStructure() {
    if (!charData.magic) {
        charData.magic = {
            known: [],
            prepared: [],
            slotsUsed: {},
            sorceryPoints: 0,
            secondaryStatKey: "none"
        };
    }
    if (!charData.magic.known) charData.magic.known = [];
    if (!charData.magic.prepared) charData.magic.prepared = [];
    if (!charData.magic.slotsUsed) charData.magic.slotsUsed = {};
}

export function calculateSpellcastingMetrics(statKey) {
    if (!statKey || statKey === "none" || !charData.stats[statKey]) {
        return { isCaster: false, statName: "Нет", mod: 0, dc: 0, attack: 0 };
    }
    const pb = charData.origin?.pb || 2;
    const mod = charData.stats[statKey].mod || 0;
    return {
        isCaster: true,
        statName: STAT_NAMES[statKey],
        mod: mod,
        dc: 8 + mod + pb,
        attack: mod + pb
    };
}

export function getPrimaryCasterMetrics() {
    const classKey = charData.origin?.classKey || "none";
    const statKey = CLASS_SPELL_STATS[classKey] || "none";
    return calculateSpellcastingMetrics(statKey);
}

export function getSecondaryCasterMetrics() {
    ensureMagicBookStructure();
    return calculateSpellcastingMetrics(charData.magic.secondaryStatKey);
}

export function getAvailableSpellSlots() {
    const classKey = charData.origin?.classKey || "none";
    const level = charData.origin?.level || 1;

    if (["wizard", "cleric", "druid", "bard", "sorcerer"].includes(classKey)) {
        return FULL_CASTER_SLOTS[level] || [];
    }
    if (["paladin", "ranger"].includes(classKey)) {
        return HALF_CASTER_SLOTS[level] || [];
    }
    if (classKey === "warlock") {
        let count = 1; let slotLvl = 1;
        if (level >= 2) count = 2;
        if (level >= 11) count = 3;
        if (level >= 17) count = 4;
        slotLvl = Math.min(5, Math.ceil(level / 2));
        const arr = [0,0,0,0,0,0,0,0,0];
        arr[slotLvl - 1] = count;
        return arr;
    }
    return [];
}

export function getSpellLimits() {
    const classKey = charData.origin?.classKey || "none";
    const level = charData.origin?.level || 1;
    const primary = getPrimaryCasterMetrics();

    let maxCantrips = 0;
    let maxPrepared = 0;

    if (primary.isCaster) {
        if (["cleric", "wizard", "bard", "druid", "warlock"].includes(classKey)) maxCantrips = 2;
        else if (classKey === "sorcerer") maxCantrips = 4;
        else if (["paladin", "ranger"].includes(classKey)) maxCantrips = 0;
        else maxCantrips = 2;

        if (classKey !== "paladin" && classKey !== "ranger") {
            if (level >= 4) maxCantrips += 1;
            if (level >= 10) maxCantrips += 1;
        }

        maxPrepared = Math.max(1, level + primary.mod);
    }

    return {
        cantrips: { current: charData.magic?.known.filter(k => spellsData[k]?.level === 0).length || 0, max: maxCantrips },
        spells: { current: charData.magic?.prepared.length || 0, max: maxPrepared }
    };
}

export function convertSorceryPoints(slotLevel, toPoints) {
    ensureMagicBookStructure();
    const level = charData.origin?.level || 1;
    const classKey = charData.origin?.classKey || "none";

    if (classKey !== "sorcerer" || level < 2) {
        alert("Конвертация доступна только Чародеям 2-го уровня и выше!"); return;
    }

    const costMap = { 1: { sp: 2, minLvl: 2 }, 2: { sp: 3, minLvl: 3 }, 3: { sp: 5, minLvl: 5 }, 4: { sp: 6, minLvl: 7 }, 5: { sp: 7, minLvl: 9 } };
    const rule = costMap[slotLevel];

    if (!rule || level < rule.minLvl) {
        alert(`Для работы с ячейками ${slotLevel}-го уровня требуется ${rule?.minLvl || 9}-й уровень Чародея!`); return;
    }

    if (toPoints) {
        charData.magic.sorceryPoints = Math.min(level, (charData.magic.sorceryPoints || 0) + slotLevel);
    } else {
        if ((charData.magic.sorceryPoints || 0) < rule.sp) {
            alert(`Недостаточно очков чародейства! Требуется: ${rule.sp} ОЧ.`); return;
        }
        charData.magic.sorceryPoints -= rule.sp;
    }
}