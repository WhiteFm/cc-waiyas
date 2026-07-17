// ==========================================
// БАЗА НАРУЧЕЙ И ПЕРЧАТОК PHB 2024 (bracersData.js)
// ==========================================

import { generateUniversalItemHTML } from '../../scripts/utils.js';

export const bracersData = {
    bracers_of_defense: {
        name: "Наручи защиты", type: "Наручи", weight: 1.5, cost: "4 000 ЗМ",
        description: generateUniversalItemHTML({ type: "Наручи", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "1.5 фнт", effect: "Пока вы носите эти наручи и не носите ни доспехов, ни Щита, вы обладаете бонусом +2 к Классу Защиты." })
    },
    bracers_of_archery: {
        name: "Наручи стрельбы из лука", type: "Наручи", weight: 1.0, cost: "400 ЗМ",
        description: generateUniversalItemHTML({ type: "Наручи", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: "1.0 фнт", effect: "Пока вы носите эти наручи, вы обладаете владением Длинным и Коротким луками, и вы получаете бонус +2 к броскам урона при использовании таких луков." })
    },
    wraps_of_unarmed_might_1: {
        name: "Обмотки безоружной мощи +1", type: "Наручи", weight: 0.5, cost: "400 ЗМ",
        description: generateUniversalItemHTML({ type: "Наручи", rarity: "Необычный", attunement: "Нет", cost: "400 ЗМ", weight: "0.5 фнт", effect: "Пока вы носите эти обмотки, вы обладаете бонусом +1 к броскам атаки и урона ваших Безоружных ударов." })
    },
    wraps_of_unarmed_might_2: {
        name: "Обмотки безоружной мощи +2", type: "Наручи", weight: 0.5, cost: "4 000 ЗМ",
        description: generateUniversalItemHTML({ type: "Наручи", rarity: "Редкий", attunement: "Нет", cost: "4 000 ЗМ", weight: "0.5 фнт", effect: "Пока вы носите эти обмотки, вы обладаете бонусом +2 к броскам атаки и урона ваших Безоружных ударов." })
    },
    wraps_of_unarmed_might_3: {
        name: "Обмотки безоружной мощи +3", type: "Наручи", weight: 0.5, cost: "40 000 ЗМ",
        description: generateUniversalItemHTML({ type: "Наручи", rarity: "Очень редкий", attunement: "Нет", cost: "40 000 ЗМ", weight: "0.5 фнт", effect: "Пока вы носите эти обмотки, вы обладаете бонусом +3 к броскам атаки и урона ваших Безоружных ударов." })
    },
    gloves_of_thievery: {
        name: "Перчатки воровства", type: "Наручи", weight: 0.1, cost: "400 ЗМ",
        description: generateUniversalItemHTML({ type: "Наручи", rarity: "Необычный", attunement: "Нет", cost: "400 ЗМ", weight: "0.1 фнт", effect: "Эти перчатки неощутимы при ношении. Вы обладаете бонусом +5 к проверкам Ловкости (Ловкость рук)." })
    },
    gloves_of_missile_snaring: {
        name: "Перчатки ловли снарядов", type: "Наручи", weight: 0.5, cost: "400 ЗМ",
        description: generateUniversalItemHTML({ type: "Наручи", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: "0.5 фнт", effect: "Вы можете Реакцией уменьшить получаемый урон от дальнобойного оружия на 1к10 + Ловкость." })
    },
    gloves_of_swimming_and_climbing: {
        name: "Перчатки плавания и лазания", type: "Наручи", weight: 0.5, cost: "400 ЗМ",
        description: generateUniversalItemHTML({ type: "Наручи", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: "0.5 фнт", effect: "У вас есть Скорость лазания и Скорость плавания, равные вашей Скорости, и бонус +5 к Атлетике для плавания и лазания." })
    },
    mythallar_bracelet: {
        name: "Браслет из мифаллара", type: "Наручи", weight: 0.2, cost: "100 ЗМ",
        description: generateUniversalItemHTML({ type: "Наручи", rarity: "Обычный", attunement: "Нет", cost: "100 ЗМ", weight: "0.2 фнт", effect: "Действием Магия вы можете снять одну из трех бусин с браслета, чтобы получить Преимущество в проверках Атлетики на 1 минуту." })
    }
};