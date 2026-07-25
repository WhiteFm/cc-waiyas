import { ammoData } from '../data/equipments/ammoData.js';
import { amuletsData } from '../data/equipments/amuletsData.js';
import { armorsData } from '../data/equipments/armorsData.js';
import { beltsData } from '../data/equipments/beltsData.js';
import { bracersData } from '../data/equipments/bracersData.js';
import { cloaksData } from '../data/equipments/cloaksData.js';
import { equipmentsData } from '../data/equipments/equipmentsData.js';
import { footwearData } from '../data/equipments/footwearsData.js';
import { headwearData } from '../data/equipments/headwearData.js';
import { instrumentsData } from '../data/equipments/instrumentsData.js';
import { ringsData } from '../data/equipments/ringsData.js';
import { substancesData } from '../data/equipments/substancesData.js';
import { weaponsData } from '../data/equipments/weaponsData.js';
import { customItemsData } from '../data/customItems.js';

export const EQUIPMENT_DEFINITIONS = {
    ...ammoData, ...amuletsData, ...armorsData, ...beltsData, ...bracersData,
    ...cloaksData, ...equipmentsData, ...footwearData, ...headwearData,
    ...instrumentsData, ...ringsData, ...substancesData, ...weaponsData,
    ...customItemsData
};

export function getActiveEquippedItems(charData) {
    const equipped = charData.inventory?.equipped || {};
    const result = [];

    ['head', 'armor', 'cloak', 'amulet', 'bracers', 'belt', 'boots'].forEach(slot => {
        if (equipped[slot]) result.push(equipped[slot]);
    });
    (equipped.rings || []).forEach(item => result.push(item));
    (charData.inventory?.lists?.equipmentList || []).forEach(item => {
        if (EQUIPMENT_DEFINITIONS[item.key]?.equipEffects) result.push(item);
    });

    const activeSet = equipped.activeSet || 1;
    (equipped.weapons || [])
        .filter(item => item.equipSlot?.startsWith(`set${activeSet}_`))
        .forEach(item => result.push(item));

    return result;
}

export function collectEquipmentEffects(charData) {
    const totals = {
        stats: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
        statMinimums: {},
        statCaps: {},
        skills: {},
        ac: 0,
        baseAc: null,
        baseAcAddsDex: false,
        retaliationDamage: []
    };

    const activeItems = getActiveEquippedItems(charData);
    const hasArmor = activeItems.some(item => {
        const def = EQUIPMENT_DEFINITIONS[item.key];
        return def && (def.type === 'Доспех' || def.category?.includes('доспех'));
    });
    const hasShield = activeItems.some(item => {
        const def = EQUIPMENT_DEFINITIONS[item.key];
        return def && (def.type === 'Щит' || def.category === 'Щит');
    });

    activeItems.forEach(item => {
        const def = EQUIPMENT_DEFINITIONS[item.key];
        const effects = def?.equipEffects;
        if (!effects) return;
        if (effects.requiresUnarmored && (hasArmor || hasShield)) return;

        Object.entries(effects.stats || {}).forEach(([key, value]) => {
            if (totals.stats[key] !== undefined) totals.stats[key] += Number(value) || 0;
        });
        Object.entries(effects.statMinimums || {}).forEach(([key, value]) => {
            totals.statMinimums[key] = Math.max(totals.statMinimums[key] || 0, Number(value) || 0);
        });
        Object.entries(effects.statCaps || {}).forEach(([key, value]) => {
            totals.statCaps[key] = Math.max(totals.statCaps[key] || 0, Number(value) || 0);
        });
        Object.entries(effects.skills || {}).forEach(([key, value]) => {
            totals.skills[key] = (totals.skills[key] || 0) + (Number(value) || 0);
        });
        if (effects.allSkills) totals.allSkills = (totals.allSkills || 0) + Number(effects.allSkills);
        totals.ac += Number(effects.ac) || 0;
        if (effects.baseAc && (!totals.baseAc || effects.baseAc > totals.baseAc)) {
            totals.baseAc = Number(effects.baseAc);
            totals.baseAcAddsDex = !!effects.baseAcAddsDex;
        }

        if (effects.retaliationDamage?.dice) {
            totals.retaliationDamage.push({
                itemKey: item.key,
                itemName: def.name,
                dice: effects.retaliationDamage.dice,
                type: effects.retaliationDamage.type || 'Без типа',
                trigger: effects.retaliationDamage.trigger || 'Когда по вам попадают атакой'
            });
        }
    });

    return totals;
}
