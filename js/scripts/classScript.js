// ==========================================
// УНИВЕРСАЛЬНАЯ ЛОГИКА КЛАССОВ (classScript.js)
// ==========================================

import { charData } from '../../saves/tempSave.js';
import { classData } from '../data/classesData.js';

function cleanDesc(desc) {
    if (!desc) return "";
    // Собираем регулярное выражение безопасно, чтобы системный парсер его не удалил
    const citeRegex = new RegExp("\\[c" + "ite: \\d+\\]", "g");
    return desc.replace(citeRegex, "");
}

export function getDynamicClassFeatures(classKey, subclassKey, level) {
    if (!classKey || classKey === "none" || !classData[classKey]) return [];

    const cls = classData[classKey];
    const features = [];

    if (cls.features) {
        Object.keys(cls.features).forEach(reqLvl => {
            if (level >= Number(reqLvl)) {
                cls.features[reqLvl].forEach(f => {
                    features.push({ ...f, description: cleanDesc(f.description), sourceName: cls.name });
                });
            }
        });
    }

    if (subclassKey && subclassKey !== "none" && cls.subclasses && cls.subclasses[subclassKey]) {
        const subCls = cls.subclasses[subclassKey];
        if (subCls.features) {
            Object.keys(subCls.features).forEach(reqLvl => {
                if (level >= Number(reqLvl)) {
                    subCls.features[reqLvl].forEach(f => {
                        features.push({ ...f, description: cleanDesc(f.description), sourceName: subCls.name });
                    });
                }
            });
        }
    }
    return features;
}

export function applyClassProficiencies() {
    if (!charData || !charData.origin) return;

    const classKey = charData.origin.classKey;
    const subclassKey = charData.origin.subclassKey;
    if (!classKey || classKey === "none" || !classData[classKey]) return;

    const cls = classData[classKey];

    if (cls.baseArmorProf) {
        cls.baseArmorProf.forEach(prof => {
            if (charData.proficiencies.armor[prof] !== undefined) charData.proficiencies.armor[prof] = true;
        });
    }

    if (cls.baseWeaponProf) {
        cls.baseWeaponProf.forEach(prof => {
            if (prof === "other") charData.proficiencies.weapon.other = true;
            else if (prof === "martial_1") charData.proficiencies.weapon.martial = Math.max(charData.proficiencies.weapon.martial || 0, 1);
            else if (charData.proficiencies.weapon[prof] !== undefined) charData.proficiencies.weapon[prof] = Math.max(charData.proficiencies.weapon[prof] || 0, 2);
        });
    }

    if (subclassKey && subclassKey !== "none" && cls.subclasses && cls.subclasses[subclassKey]) {
        const subCls = cls.subclasses[subclassKey];
        if (subCls.bonusArmorProf) {
            subCls.bonusArmorProf.forEach(prof => {
                if (charData.proficiencies.armor[prof] !== undefined) charData.proficiencies.armor[prof] = true;
            });
        }
        if (subCls.bonusWeaponProf) {
            subCls.bonusWeaponProf.forEach(prof => {
                if (prof === "other") charData.proficiencies.weapon.other = true;
                else if (prof === "martial_1") charData.proficiencies.weapon.martial = Math.max(charData.proficiencies.weapon.martial || 0, 1);
                else if (charData.proficiencies.weapon[prof] !== undefined) charData.proficiencies.weapon[prof] = Math.max(charData.proficiencies.weapon[prof] || 0, 2);
            });
        }
    }
}