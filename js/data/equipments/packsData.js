// ==========================================
// БАЗА НАБОРОВ СНАРЯЖЕНИЯ PHB 2024 (packsData.js)
// Общее количество предметов в этом файле: 7
// ==========================================

export const packsData = {
    entertainers_pack: {
        name: "Набор артиста",
        type: "Снаряжение",
        cost: "40 ЗМ",
        weight: "38.0 фнт",
        description: generateEquipmentHTML("Снаряжение", "40 ЗМ", "38.0 фнт", "Набор артиста включает Бурдюк, Зеркало, Колокольчик, 3 Костюма, 8 фляг Масла, Направленный фонарь, Рационы на 9 дней, Рюкзак, Спальник и Трутницу.")
    },
    burglars_pack: {
        name: "Набор взломщика",
        type: "Снаряжение",
        cost: "16 ЗМ",
        weight: "45.0 фнт",
        description: generateEquipmentHTML("Снаряжение", "16 ЗМ", "45.0 фнт", "Набор взломщика включает Бурдюк, Верёвку, Закрытый фонарь, Рюкзак, Колокольчик, Ломик, Металлические шарики, 7 фляг Масла, Рационы на 5 дней, 10 Свечей, Трутницу.")
    },
    diplomats_pack: {
        name: "Набор дипломата",
        type: "Снаряжение",
        cost: "39 ЗМ",
        weight: "36.0 фнт",
        description: generateEquipmentHTML("Снаряжение", "39 ЗМ", "36.0 фнт", "Набор дипломата включает в себя 5 листов Бумаги, Духи, Лампу, 4 фляги Масла, Отличную одежду, 5 Писчих перьев, 5 листов Пергамента, Сундук, 2 Тубуса для карт и свитков, Трутницу и Чернила.")
    },
    dungeoneers_pack: {
        name: "Набор исследователя подземелий",
        type: "Снаряжение",
        cost: "12 ЗМ",
        weight: "59.0 фнт",
        description: generateEquipmentHTML("Снаряжение", "12 ЗМ", "59.0 фнт", "Набор исследователя подземелий включает Бурдюк, Верёвку, Калтропы, Ломик, 2 фляги Масла, Рационы на 10 дней, Рюкзак, Трутницу и 10 Факелов.")
    },
    explorers_pack: {
        name: "Набор путешественника",
        type: "Снаряжение",
        cost: "10 ЗМ",
        weight: "59.0 фнт",
        description: generateEquipmentHTML("Снаряжение", "10 ЗМ", "59.0 фнт", "Набор путешественника включает Бурдюк, Верёвку, 2 фляги Масла, Рационы на 10 дней, Рюкзак, Спальник, Трутницу и 10 Факелов.")
    },
    priests_pack: {
        name: "Набор священника",
        type: "Снаряжение",
        cost: "33 ЗМ",
        weight: "25.0 фнт",
        description: generateEquipmentHTML("Снаряжение", "33 ЗМ", "25.0 фнт", "Набор священника включает Лампу, Мантию, Одеяло, Рационы на 7 дней, Рюкзак, Святую воду и Трутницу.")
    },
    scholars_pack: {
        name: "Набор учёного",
        type: "Снаряжение",
        cost: "40 ЗМ",
        weight: "18.0 фнт",
        description: generateEquipmentHTML("Снаряжение", "40 ЗМ", "18.0 фнт", "Набор учёного включает Книгу, Лампу, 10 фляг Масла, 10 листов Пергамента, Писчее перо, Рюкзак, Трутницу и Чернила.")
    }
};

/**
 * Вспомогательная функция для генерации HTML-таблицы описания элементов снаряжения
 */
function generateEquipmentHTML(type, cost, weight, effect) {
    return `
    <p style='margin-bottom: 10px; line-height: 1.45; text-align: justify;'>${effect}</p>
    <table style='width:100%; text-align:left; border-collapse:collapse; margin-top:8px; font-size:13px;'>
        <tr style='border-bottom:1px solid var(--border-color);'><td style='font-weight:bold; color:var(--text-muted); padding:6px 4px; width:120px;'>Категория:</td><td style='padding:6px 4px;'>${type}</td></tr>
        <tr style='border-bottom:1px solid var(--border-color);'><td style='font-weight:bold; color:var(--accent-success); padding:6px 4px;'>Стоимость / Вес:</td><td style='padding:6px 4px;'><b>${cost}</b> / ${weight}</td></tr>
    </table>
    `;
}