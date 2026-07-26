// ==========================================
// ЛОГИКА И МАТЕМАТИКА (magicbookScript.js)
// ==========================================

import { charData } from '../../saves/tempSave.js';
import { spellsData } from '../data/magicbookData.js';
import { collectEquipmentEffects } from './equipmentEffects.js';

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
    if (!charData.magic.innateSpells) charData.magic.innateSpells = [];
    if (!charData.magic.alwaysPrepared) charData.magic.alwaysPrepared = [];
    if (!charData.magic.autoGrantedSpells) charData.magic.autoGrantedSpells = [];
    if (!charData.magic.manualSpells) {
        charData.magic.manualSpells = charData.magic.known.filter(key => !charData.magic.autoGrantedSpells.includes(key));
    }
    if (!charData.magic.slotsUsed) charData.magic.slotsUsed = {};

    const alwaysPrepared = getAlwaysPreparedSpells();
    const removedGrants = charData.magic.autoGrantedSpells.filter(key => !alwaysPrepared.includes(key));
    removedGrants.forEach(key => {
        if (!charData.magic.manualSpells.includes(key)) {
            charData.magic.known = charData.magic.known.filter(spellKey => spellKey !== key);
            charData.magic.prepared = charData.magic.prepared.filter(spellKey => spellKey !== key);
        }
    });
    alwaysPrepared.forEach(key => {
        if (!charData.magic.known.includes(key)) charData.magic.known.push(key);
        if (!charData.magic.prepared.includes(key)) charData.magic.prepared.push(key);
    });
    charData.magic.autoGrantedSpells = [...alwaysPrepared];
    charData.magic.known = [...new Set(charData.magic.known)];
    charData.magic.prepared = [...new Set(charData.magic.prepared)];
    charData.magic.manualSpells = [...new Set(charData.magic.manualSpells)];
}

export function getAlwaysPreparedSpells() {
    const magic = charData.magic || {};
    const selectedFeats = charData.selectedFeats || {};
    const classKey = charData.origin?.classKey || "none";
    const level = charData.origin?.level || 1;
    const featGrantedSpells = [];
    if (selectedFeats.shadow_touched) featGrantedSpells.push("invisibility");
    if (selectedFeats.fey_touched) featGrantedSpells.push("misty_step");
    if (selectedFeats.telepathic) featGrantedSpells.push("detect_thoughts");
    if (selectedFeats.telekinetic) featGrantedSpells.push("mage_hand");

    const classGrantedSpells = [];
    if (classKey === "druid") classGrantedSpells.push("speak_with_animals");
    if (classKey === "paladin") {
        classGrantedSpells.push("divine_smite");
        if (level >= 5) classGrantedSpells.push("find_steed");
    }
    if (classKey === "ranger") classGrantedSpells.push("hunters_mark");

    return [...new Set([
        ...(magic.innateSpells || []),
        ...(magic.alwaysPrepared || []),
        ...featGrantedSpells,
        ...classGrantedSpells
    ])].filter(key => spellsData[key]);
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

    let slots = [];
    if (["wizard", "cleric", "druid", "bard", "sorcerer"].includes(classKey)) slots = [...(FULL_CASTER_SLOTS[level] || [])];
    else if (["paladin", "ranger"].includes(classKey)) slots = [...(HALF_CASTER_SLOTS[level] || [])];
    if (classKey === "warlock") {
        let count = 1; let slotLvl = 1;
        if (level >= 2) count = 2;
        if (level >= 11) count = 3;
        if (level >= 17) count = 4;
        slotLvl = Math.min(5, Math.ceil(level / 2));
        const arr = [0,0,0,0,0,0,0,0,0];
        arr[slotLvl - 1] = count;
        slots = arr;
    }
    const equipmentSlots = collectEquipmentEffects(charData).spellSlots;
    Object.entries(equipmentSlots).forEach(([spellLevel, count]) => {
        const index = Number(spellLevel) - 1;
        if (index >= 0 && index < 9) {
            while (slots.length <= index) slots.push(0);
            slots[index] = Math.max(0, (slots[index] || 0) + Number(count));
        }
    });
    return slots;
}

export function getSpellLimits() {
    ensureMagicBookStructure();
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

    const alwaysPrepared = getAlwaysPreparedSpells();
    const equipmentMagicEffects = collectEquipmentEffects(charData);
    const equipmentPreparedBonus = equipmentMagicEffects.preparedSpells;
    const equipmentCantripBonus = equipmentMagicEffects.preparedCantrips;
    const bonusCantrips = alwaysPrepared.filter(key => spellsData[key]?.level === 0).length;
    const bonusSpells = alwaysPrepared.filter(key => spellsData[key]?.level > 0).length;
    const currentCantrips = charData.magic.known.filter(key => spellsData[key]?.level === 0).length;
    const currentSpells = charData.magic.prepared.filter(key => spellsData[key]?.level > 0).length;

    return {
        cantrips: {
            current: currentCantrips,
            max: Math.max(0, maxCantrips + bonusCantrips + equipmentCantripBonus),
            bonus: bonusCantrips + equipmentCantripBonus
        },
        spells: {
            current: currentSpells,
            max: Math.max(0, maxPrepared + bonusSpells + equipmentPreparedBonus),
            bonus: bonusSpells + equipmentPreparedBonus
        }
    };
}
