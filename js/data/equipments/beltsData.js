// ==========================================
// БАЗА ПОЯСОВ PHB 2024 (beltsData.js)
// ==========================================

import { generateUniversalItemHTML } from '../../scripts/utils.js';

export const beltsData = {
    belt_of_stone_giant_strength: {
        name: "Пояс силы каменного великана", type: "Пояс", weight: 1.5, cost: "40 000 ЗМ",
        description: generateUniversalItemHTML({ type: "Пояс", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: "1.5 фнт", effect: "Пока вы носите этот пояс, ваше значение Силы становится равно 23." })
    },
    belt_of_frost_giant_strength: {
        name: "Пояс силы ледяного великана", type: "Пояс", weight: 1.5, cost: "40 000 ЗМ",
        description: generateUniversalItemHTML({ type: "Пояс", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: "1.5 фнт", effect: "Пока вы носите этот пояс, ваше значение Силы становится равно 23." })
    },
    belt_of_cloud_giant_strength: {
        name: "Пояс силы облачного великана", type: "Пояс", weight: 1.5, cost: "200 000 ЗМ",
        description: generateUniversalItemHTML({ type: "Пояс", rarity: "Легендарный", attunement: "Требуется настройка", cost: "200 000 ЗМ", weight: "1.5 фнт", effect: "Пока вы носите этот пояс, ваше значение Силы становится равно 27." })
    },
    belt_of_fire_giant_strength: {
        name: "Пояс силы огненного великана", type: "Пояс", weight: 1.5, cost: "40 000 ЗМ",
        description: generateUniversalItemHTML({ type: "Пояс", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: "1.5 фнт", effect: "Пока вы носите этот пояс, ваше значение Силы становится равно 25." })
    },
    belt_of_hill_giant_strength: {
        name: "Пояс силы холмового великана", type: "Пояс", weight: 1.5, cost: "4 000 ЗМ",
        description: generateUniversalItemHTML({ type: "Пояс", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "1.5 фнт", effect: "Пока вы носите этот пояс, ваше значение Силы становится равно 21." })
    },
    belt_of_storm_giant_strength: {
        name: "Пояс силы штормового великана", type: "Пояс", weight: 1.5, cost: "200 000 ЗМ",
        description: generateUniversalItemHTML({ type: "Пояс", rarity: "Легендарный", attunement: "Требуется настройка", cost: "200 000 ЗМ", weight: "1.5 фнт", effect: "Пока вы носите этот пояс, ваше значение Силы становится равно 29." })
    }
};