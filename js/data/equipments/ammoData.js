// ==========================================
// БАЗА БОЕПРИПАСОВ PHB 2024 (ammoData.js)
// ==========================================

import { generateUniversalItemHTML } from '../../scripts/utils.js';

export const ammoData = {
    arrow: {
        name: "Стрела", type: "Боеприпас", category: "Боеприпасы", container: "Колчан", weight: 0.05, cost: "5 ММ",
        description: generateUniversalItemHTML({ type: "Боеприпас", cost: "5 ММ", weight: "0.05 фнт", effect: "Стрелы используются для стрельбы из коротких и длинных луков. Обычно хранятся в колчане." })
    },
    crossbow_bolt: {
        name: "Арбалетный болт", type: "Боеприпас", category: "Боеприпасы", container: "Футляр для болтов", weight: 0.075, cost: "5 ММ",
        description: generateUniversalItemHTML({ type: "Боеприпас", cost: "5 ММ", weight: "0.075 фнт", effect: "Болты используются для стрельбы из лёгких, тяжёлых и одноручных арбалетов. Обычно хранятся в футляре." })
    },
    firearm_bullet: {
        name: "Огнестрельная пуля", type: "Боеприпас", category: "Боеприпасы", container: "Кошель", weight: 0.2, cost: "3 СМ",
        description: generateUniversalItemHTML({ type: "Боеприпас", cost: "3 СМ", weight: "0.2 фнт", effect: "Свинцовые пули, используемые для ведения огня из огнестрельного оружия, такого как мушкеты и пистоли." })
    },
    sling_bullet: {
        name: "Снаряд для пращи", type: "Боеприпас", category: "Боеприпасы", container: "Кошель", weight: 0.075, cost: "2 ММ",
        description: generateUniversalItemHTML({ type: "Боеприпас", cost: "2 ММ", weight: "0.075 фнт", effect: "Свинцовые или каменные снаряды, специально сбалансированные для метания из пращи." })
    },
    blowgun_needle: {
        name: "Игла для трубки", type: "Боеприпас", category: "Боеприпасы", container: "Кошель", weight: 0.02, cost: "2 ММ",
        description: generateUniversalItemHTML({ type: "Боеприпас", cost: "2 ММ", weight: "0.02 фнт", effect: "Маленькие острые иглы. Перед выстрелом из духовой трубки их часто покрывают ядом для дополнительного урона." })
    }
};