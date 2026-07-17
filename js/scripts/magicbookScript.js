// ==========================================
// ЛОГИКА И МАТЕМАТИКА (magicbookScript.js)
// ==========================================

import { charData } from '../../saves/tempSave.js';
import { spellsData } from '../data/magicbookData.js';

const CLASS_SPELL_STATS = {
    bard: "cha", cleric: "wis", druid: "wis", paladin: "cha",
    ranger: "wis", sorcerer: "cha", warlock: "cha", wizard: "int"
};

const STAT_NAMES = { str: "Сила", dex: "Ловкость", con: "Телосложение", int: "Интеллект", wis: "Мудрость", cha: "Харизма" };

const FULL_CASTER_SLOTS = {
    1: [2], 2: [3], 3: [4,2], 4: [4,3], 5: [4,3,2],
    6: [4,3,3], 7: [4,3,3,1], 8: [4,3,3,2], 9: [4,3,3,3,1], 10: [4,3,3,3,2],
    11: [4,3,3,3,2,1], 12: [4,3,3,3,2,1], 13: [4,3,3,3,2,1,1], 14: [4,3,3,3,2,1,1],
    15: [4,3,3,3,2,1,1,1], 16: [4,3,3,3,2,1,1,1], 17: [4,3,3,3,2,1,1,1,1],
    18: [4,3,3,3,3,1,1,1,1], 19: [4,3,3,3,3,2,1,1,1], 20: [4,3,3,3,3,2,2,1,1]
};

const HALF_CASTER_SLOTS = {
    1: [2], 2: [2], 3: [3], 4: [3], 5: [4,2], 6: [4,2], 7: [4,3], 8: [4,3],
    9: [4,3,2], 10: [4,3,2], 11: [4,3,3], 12: [4,3,3], 13: [4,3,3,1], 14: [4,3,3,1],
    15: [4,3,3,2], 16: [4,3,3,2], 17: [4,3,3,3,1], 18: [4,3,3,3,1], 19: [4,3,3,3,2], 20: [4,3,3,3,2]
};

const FULL_CASTER_PREP = { 1:4, 2:5, 3:6, 4:7, 5:9, 6:10, 7:11, 8:12, 9:14, 10:15, 11:16, 12:16, 13:17, 14:17, 15:18, 16:18, 17:19, 18:20, 19:21, 20:22 };
const HALF_CASTER_PREP = { 1:2, 2:3, 3:4, 4:5, 5:6, 6:6, 7:7, 8:7, 9:9, 10:9, 11:10, 12:10, 13:11, 14:11, 15:12, 16:12, 17:14, 18:14, 19:15, 20:15 };
const WARLOCK_KNOWN = { 1:2, 2:3, 3:4, 4:5, 5:6, 6:7, 7:8, 8:9, 9:10, 10:10, 11:11, 12:11, 13:12, 14:12, 15:13, 16:13, 17:14, 18:14, 19:15, 20:15 };
const SORCERER_KNOWN = { 1:2, 2:3, 3:4, 4:5, 5:6, 6:7, 7:8, 8:9, 9:10, 10:11, 11:12, 12:12, 13:13, 14:13, 15:14, 16:14, 17:15, 18:15, 19:15, 20:15 };

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

    if (["wizard", "cleric", "druid", "bard", "sorcerer"].includes(classKey)) return FULL_CASTER_SLOTS[level] || [];
    if (["paladin", "ranger"].includes(classKey)) return HALF_CASTER_SLOTS[level] || [];
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

    let maxCantrips = 0;
    let maxPrepared = 0;

    if (["wizard", "cleric", "bard", "druid", "warlock"].includes(classKey)) maxCantrips = level < 4 ? 3 : level < 10 ? 4 : 5;
    else if (classKey === "sorcerer") maxCantrips = 4;
    else if (["paladin", "ranger"].includes(classKey)) maxCantrips = 0;

    if (["wizard", "cleric", "druid", "bard"].includes(classKey)) maxPrepared = FULL_CASTER_PREP[level] || 4;
    else if (["paladin", "ranger"].includes(classKey)) maxPrepared = HALF_CASTER_PREP[level] || 2;
    else if (classKey === "warlock") maxPrepared = WARLOCK_KNOWN[level] || 2;
    else if (classKey === "sorcerer") maxPrepared = SORCERER_KNOWN[level] || 2;

    const innate = charData.magic?.innateSpells || [];
    const currentCantrips = charData.magic?.known.filter(k => spellsData[k]?.level === 0 && !innate.includes(k)).length || 0;
    const currentSpells = charData.magic?.prepared.filter(k => !innate.includes(k)).length || 0;

    return {
        cantrips: { current: currentCantrips, max: maxCantrips },
        spells: { current: currentSpells, max: maxPrepared }
    };
}