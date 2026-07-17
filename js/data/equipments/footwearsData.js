// ==========================================
// БАЗА ОБУВИ И ПОНОЖЕЙ PHB 2024 (footwearData.js)
// ==========================================

import { generateUniversalItemHTML } from '../../scripts/utils.js';

export const footwearData = {
    boots_of_the_winterlands: {
        name: "Заполярные сапоги", type: "Поножи", weight: 2.0, cost: "400 ЗМ",
        description: generateUniversalItemHTML({ type: "Поножи", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: "2.0 фнт", effect: "Вы обладаете Сопротивлением урону Холодом и игнорируете Труднопроходимую местность, созданную льдом или снегом." })
    },
    winged_boots: {
        name: "Крылатые сапоги", type: "Поножи", weight: 1.5, cost: "400 ЗМ",
        maxCharges: 4, consumableWithCharges: false,
        description: generateUniversalItemHTML({ type: "Поножи", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: "1.5 фнт", effect: "Имеют 4 заряда. Вы можете потратить 1 заряд, чтобы получить Скорость полёта 30 футов на 1 час." })
    },
    boots_of_levitation: {
        name: "Сапоги левитации", type: "Поножи", weight: 1.0, cost: "4 000 ЗМ",
        description: generateUniversalItemHTML({ type: "Поножи", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "1.0 фнт", effect: "Пока вы носите эти ботинки, вы можете сотворять на себя Левитацию." })
    },
    boots_of_false_tracks: {
        name: "Сапоги ложных следов", type: "Поножи", weight: 1.0, cost: "100 ЗМ",
        description: generateUniversalItemHTML({ type: "Поножи", rarity: "Обычный", attunement: "Требуется настройка", cost: "100 ЗМ", weight: "1.0 фнт", effect: "Оставляемые ими следы могут быть следами любого Гуманоида вашего размера." })
    },
    boots_of_speed: {
        name: "Сапоги скорости", type: "Поножи", weight: 1.5, cost: "4 000 ЗМ",
        description: generateUniversalItemHTML({ type: "Поножи", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "1.5 фнт", effect: "Бонусным действием сапоги удваивают вашу Скорость, а любое существо, совершающее по вам Провоцированную атаку, совершает её с Помехой." })
    },
    boots_of_striding_and_springing: {
        name: "Сапоги ходьбы и прыжков", type: "Поножи", weight: 1.5, cost: "400 ЗМ",
        description: generateUniversalItemHTML({ type: "Поножи", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: "1.5 фнт", effect: "Ваша Скорость становится равна 30 футов (не уменьшается бронёй). Вы можете прыгнуть на расстояние до 30 футов, потратив всего 10 футов перемещения." })
    },
    elven_boots: {
        name: "Эльфийские сапоги", type: "Поножи", weight: 1.0, cost: "400 ЗМ",
        description: generateUniversalItemHTML({ type: "Поножи", rarity: "Необычный", attunement: "Нет", cost: "400 ЗМ", weight: "1.0 фнт", effect: "Ваши шаги не издают звуков; кроме того, вы совершаете с Преимуществом проверки Ловкости (Скрытность)." })
    }
};