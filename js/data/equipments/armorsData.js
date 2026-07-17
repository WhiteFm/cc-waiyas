// ==========================================
// БАЗА ДОСПЕХОВ PHB 2024 (armorsData.js)
// ==========================================

import { generateUniversalItemHTML } from '../../scripts/utils.js';

export const armorsData = {
    // ----------------------------------------------------
    // ЛЁГКИЕ ДОСПЕХИ
    // ----------------------------------------------------
    padded: {
        name: "Стёганный", type: "Доспех", category: "Лёгкий доспех", ac: "11 + модификатор Лов", strReq: "—", stealth: "Помеха", weight: 8.0, cost: "5 ЗМ",
        description: generateArmorHTML("Лёгкий доспех", "11 + модификатор Лов", "—", "Помеха")
    },
    leather: {
        name: "Кожаный", type: "Доспех", category: "Лёгкий доспех", ac: "11 + модификатор Лов", strReq: "—", stealth: "—", weight: 10.0, cost: "10 ЗМ",
        description: generateArmorHTML("Лёгкий доспех", "11 + модификатор Лов", "—", "—")
    },
    studded_leather: {
        name: "Проклёпанный кожаный", type: "Доспех", category: "Лёгкий доспех", ac: "12 + модификатор Лов", strReq: "—", stealth: "—", weight: 13.0, cost: "45 ЗМ",
        description: generateArmorHTML("Лёгкий доспех", "12 + модификатор Лов", "—", "—")
    },

    // ----------------------------------------------------
    // СРЕДНИЕ ДОСПЕХИ
    // ----------------------------------------------------
    hide: {
        name: "Шкурный", type: "Доспех", category: "Средний доспех", ac: "12 + модификатор Лов (макс. 2)", strReq: "—", stealth: "—", weight: 12.0, cost: "10 ЗМ",
        description: generateArmorHTML("Средний доспех", "12 + модификатор Лов (макс. 2)", "—", "—")
    },
    chain_shirt: {
        name: "Кольчужная рубаха", type: "Доспех", category: "Средний доспех", ac: "13 + модификатор Лов (макс. 2)", strReq: "—", stealth: "—", weight: 20.0, cost: "50 ЗМ",
        description: generateArmorHTML("Средний доспех", "13 + модификатор Лов (макс. 2)", "—", "—")
    },
    scale_mail: {
        name: "Чешуйчатый", type: "Доспех", category: "Средний доспех", ac: "14 + модификатор Лов (макс. 2)", strReq: "—", stealth: "Помеха", weight: 45.0, cost: "50 ЗМ",
        description: generateArmorHTML("Средний доспех", "14 + модификатор Лов (макс. 2)", "—", "Помеха")
    },
    breastplate: {
        name: "Кираса", type: "Доспех", category: "Средний доспех", ac: "14 + модификатор Лов (макс. 2)", strReq: "—", stealth: "—", weight: 20.0, cost: "400 ЗМ",
        description: generateArmorHTML("Средний доспех", "14 + модификатор Лов (макс. 2)", "—", "—")
    },
    half_plate: {
        name: "Полулаты", type: "Доспех", category: "Средний доспех", ac: "15 + модификатор Лов (макс. 2)", strReq: "—", stealth: "Помеха", weight: 40.0, cost: "750 ЗМ",
        description: generateArmorHTML("Средний доспех", "15 + модификатор Лов (макс. 2)", "—", "Помеха")
    },

    // ----------------------------------------------------
    // ТЯЖЁЛЫЕ ДОСПЕХИ
    // ----------------------------------------------------
    ring_mail: {
        name: "Колечный", type: "Доспех", category: "Тяжёлый доспех", ac: "14", strReq: "—", stealth: "Помеха", weight: 40.0, cost: "30 ЗМ",
        description: generateArmorHTML("Тяжёлый доспех", "14", "—", "Помеха")
    },
    chain_mail: {
        name: "Кольчуга", type: "Доспех", category: "Тяжёлый доспех", ac: "16", strReq: "Сил 13", stealth: "Помеха", weight: 55.0, cost: "75 ЗМ",
        description: generateArmorHTML("Тяжёлый доспех", "16", "Сил 13", "Помеха")
    },
    splint: {
        name: "Наборный", type: "Доспех", category: "Тяжёлый доспех", ac: "17", strReq: "Сил 15", stealth: "Помеха", weight: 60.0, cost: "200 ЗМ",
        description: generateArmorHTML("Тяжёлый доспех", "17", "Сил 15", "Помеха")
    },
    plate: {
        name: "Латы", type: "Доспех", category: "Тяжёлый доспех", ac: "18", strReq: "Сил 15", stealth: "Помеха", weight: 65.0, cost: "1500 ЗМ",
        description: generateArmorHTML("Тяжёлый доспех", "18", "Сил 15", "Помеха")
    },

    // ----------------------------------------------------
    // ЩИТЫ
    // ----------------------------------------------------
    shield: {
        name: "Щит", type: "Щит", category: "Щит", ac: "+2", strReq: "—", stealth: "—", weight: 6.0, cost: "10 ЗМ",
        description: generateArmorHTML("Щит", "+2 к КЗ", "—", "—")
    }
};

/**
 * Вспомогательная функция для генерации HTML-таблицы описания доспехов
 */
function generateArmorHTML(category, ac, strReq, stealth) {
    const stealthText = stealth === "Помеха" ? "<span style='color:var(--accent); font-weight:bold;'>Помеха</span>" : "—";
    const strReqText = strReq !== "—" ? `<span style='color:var(--accent-yellow); font-weight:bold;'>${strReq}</span>` : "—";

    return `
    <table style='width:100%; text-align:left; border-collapse:collapse; margin-top:8px; font-size:13px;'>
        <tr style='border-bottom:1px solid var(--border-color);'><td style='font-weight:bold; color:var(--text-muted); padding:6px 4px; width:150px;'>Категория:</td><td style='padding:6px 4px;'>${category}</td></tr>
        <tr style='border-bottom:1px solid var(--border-color);'><td style='font-weight:bold; color:var(--accent-success); padding:6px 4px;'>Класс Защиты (КЗ):</td><td style='padding:6px 4px;'><b>${ac}</b></td></tr>
        <tr style='border-bottom:1px solid var(--border-color);'><td style='font-weight:bold; color:var(--text-muted); padding:6px 4px;'>Требуемая сила:</td><td style='padding:6px 4px;'>${strReqText}</td></tr>
        <tr><td style='font-weight:bold; color:var(--text-muted); padding:6px 4px;'>Скрытность:</td><td style='padding:6px 4px;'>${stealthText}</td></tr>
    </table>
    `;
}