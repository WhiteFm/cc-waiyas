// ==========================================
// БАЗА ПЛАЩЕЙ И МАНТИЙ PHB 2024 (cloaksData.js)
// ==========================================

import { generateUniversalItemHTML } from '../../scripts/utils.js';

export const cloaksData = {
    wings_of_flying: {
        name: "Крылья полёта", type: "Плащ", weight: 2.0, cost: "4 000 ЗМ",
        description: generateUniversalItemHTML({ type: "Плащ", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "2.0 фнт", effect: "Пока вы носите этот плащ, вы можете действием Магия превратить его в пару крыльев, дающих Скорость полёта 60 футов." })
    },
    robe_of_the_archmagi: {
        name: "Мантия архимага", type: "Плащ", weight: 3.0, cost: "200 000 ЗМ",
        description: generateUniversalItemHTML({ type: "Плащ", rarity: "Легендарный", attunement: "Требуется настройка", cost: "200 000 ЗМ", weight: "3.0 фнт", effect: "Базовый КЗ 15 + ЛОВ. Сопротивление магии. Сл спасброска заклинаний и бонус атаки увеличиваются на 2." })
    },
    robe_of_eyes: {
        name: "Мантия глаз", type: "Плащ", weight: 2.5, cost: "4 000 ЗМ",
        description: generateUniversalItemHTML({ type: "Плащ", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "2.5 фнт", effect: "Дарует Преимущество на Восприятие. Тёмное зрение 120 футов и Истинное зрение 120 футов." })
    },
    robe_of_stars: {
        name: "Мантия звёзд", type: "Плащ", weight: 2.0, cost: "40 000 ЗМ",
        description: generateUniversalItemHTML({ type: "Плащ", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: "2.0 фнт", effect: "Вы обладаете бонусом +1 к спасброскам. Можете снять звезду, чтобы сотворить Волшебная стрела 5-го уровня." })
    },
    robe_of_useful_items: {
        name: "Мантия полезных предметов", type: "Плащ", weight: 2.0, cost: "400 ЗМ",
        description: generateUniversalItemHTML({ type: "Плащ", rarity: "Необычный", attunement: "Нет", cost: "400 ЗМ", weight: "2.0 фнт", effect: "Пока вы носите эту мантию, вы можете действием Магия оторвать одну из заплат, превращая её в полезный объект." })
    },
    robe_of_scintillating_colors: {
        name: "Мантия сияющих цветов", type: "Плащ", weight: 2.0, cost: "40 000 ЗМ",
        description: generateUniversalItemHTML({ type: "Плащ", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: "2.0 фнт", effect: "В течение эффекта мантия излучает Яркий свет, а существа совершают с Помехой броски атаки против вас." })
    },
    mantle_of_spell_resistance: {
        name: "Мантия сопротивления заклинаниям", type: "Плащ", weight: 2.0, cost: "4 000 ЗМ",
        description: generateUniversalItemHTML({ type: "Плащ", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "2.0 фнт", effect: "Пока вы носите эту мантию, вы совершаете с Преимуществом спасброски против заклинаний." })
    },
    natures_mantle: {
        name: "Одеяние природы", type: "Плащ", weight: 1.5, cost: "400 ЗМ",
        description: generateUniversalItemHTML({ type: "Плащ", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: "1.5 фнт", effect: "Вы можете использовать его как Заклинательную фокусировку. Вы можете Бонусным действием совершить Затаивание." })
    },
    cloak_of_protection: {
        name: "Плащ защиты", type: "Плащ", weight: 1.0, cost: "400 ЗМ",
        description: generateUniversalItemHTML({ type: "Плащ", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: "1.0 фнт", effect: "Пока вы носите этот плащ, вы получаете бонус +1 к Классу Защиты и спасброскам." })
    },
    cloak_of_the_bat: {
        name: "Плащ летучей мыши", type: "Плащ", weight: 2.0, cost: "4 000 ЗМ",
        description: generateUniversalItemHTML({ type: "Плащ", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "2.0 фнт", effect: "Преимущество на Скрытность. В темноте можно летать со Скоростью 40 футов или превратиться в летучую мышь." })
    },
    cloak_of_many_fashions: {
        name: "Плащ множества стилей", type: "Плащ", weight: 1.0, cost: "100 ЗМ",
        description: generateUniversalItemHTML({ type: "Плащ", rarity: "Обычный", attunement: "Нет", cost: "100 ЗМ", weight: "1.0 фнт", effect: "Бонусным действием можно изменить стиль, цвет и видимые качества этой одежды." })
    },
    cloak_of_invisibility: {
        name: "Плащ невидимости", type: "Плащ", weight: 1.5, cost: "200 000 ЗМ",
        maxCharges: 3, consumableWithCharges: false,
        description: generateUniversalItemHTML({ type: "Плащ", rarity: "Легендарный", attunement: "Требуется настройка", cost: "200 000 ЗМ", weight: "1.5 фнт", effect: "Имеет 3 заряда. Можно натянуть капюшон на голову и потратить 1 заряд, получая состояние Невидимый на 1 час." })
    },
    cloak_of_arachnida: {
        name: "Плащ паука", type: "Плащ", weight: 2.0, cost: "40 000 ЗМ",
        description: generateUniversalItemHTML({ type: "Плащ", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: "2.0 фнт", effect: "Вы получаете Сопротивление яду, Скорость лазания (Паучье лазанье) и можете ходить по паутине." })
    },
    cloak_of_the_manta_ray: {
        name: "Плащ ската", type: "Плащ", weight: 1.5, cost: "400 ЗМ",
        description: generateUniversalItemHTML({ type: "Плащ", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: "1.5 фнт", effect: "Пока вы носите этот плащ, вы можете дышать под водой и обладаете Скоростью плавания 60 футов." })
    },
    cloak_of_displacement: {
        name: "Плащ ускользания", type: "Плащ", weight: 1.5, cost: "4 000 ЗМ",
        description: generateUniversalItemHTML({ type: "Плащ", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "1.5 фнт", effect: "Создаёт иллюзию, что вы стоите чуть поодаль: существа совершают с Помехой броски атаки по вам." })
    },
    cape_of_the_mountebank: {
        name: "Плащ шарлатана", type: "Плащ", weight: 1.5, cost: "4 000 ЗМ",
        description: generateUniversalItemHTML({ type: "Плащ", rarity: "Редкий", attunement: "Нет", cost: "4 000 ЗМ", weight: "1.5 фнт", effect: "Вы можете действием Магия сотворить Переносящую дверь раз в день." })
    },
    billowing_cloak: {
        name: "Развевающийся плащ", type: "Плащ", weight: 1.0, cost: "100 ЗМ",
        description: generateUniversalItemHTML({ type: "Плащ", rarity: "Обычный", attunement: "Нет", cost: "100 ЗМ", weight: "1.0 фнт", effect: "Пока вы носите этот плащ, вы можете Бонусным действием заставить его драматически развеваться." })
    },
    cloak_of_elvenkind: {
        name: "Эльфийский плащ", type: "Плащ", weight: 1.0, cost: "400 ЗМ",
        description: generateUniversalItemHTML({ type: "Плащ", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: "1.0 фнт", effect: "Проверки Восприятия, направленные на вас, совершаются с Помехой, и вы совершаете с Преимуществом Скрытность." })
    }
};