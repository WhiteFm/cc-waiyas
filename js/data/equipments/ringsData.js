// ==========================================
// БАЗА МАГИЧЕСКИХ КОЛЕЦ PHB 2024 (ringsData.js)
// ==========================================

import { generateUniversalItemHTML } from '../../scripts/utils.js';

export const ringsData = {
    ring_of_the_ram: {
        name: "Кольцо барана", type: "Кольцо", weight: 0.1, cost: "4 000 ЗМ",
        maxCharges: 3, consumableWithCharges: false,
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "0.1 фнт",
            effect: "Это кольцо восстанавливает 1к3 потраченных зарядов на каждом рассвете. Вы можете действием Магия потратить от 1 до 3 зарядов и совершить дальнобойную атаку заклинанием... При попадании цель получает 2к10 Силового урона за заряд."
        })
    },
    ring_of_animal_influence: {
        name: "Кольцо влияния на животных", type: "Кольцо", weight: 0.1, cost: "4 000 ЗМ",
        maxCharges: 3, consumableWithCharges: false,
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Редкий", attunement: "Нет", cost: "4 000 ЗМ", weight: "0.1 фнт",
            effect: "Это кольцо восстанавливает 1к3 потраченных зарядов на каждом рассвете. Вы можете потратить 1 заряд, чтобы сотворить с его помощью одно из заклинаний: Дружба с животными, Разговор с животными, Ужас."
        })
    },
    ring_of_protection: {
        name: "Кольцо защиты", type: "Кольцо", weight: 0.1, cost: "4 000 ЗМ",
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "0.1 фнт",
            effect: "Пока вы носите это кольцо, вы получаете бонус +1 к Классу Защиты и спасброскам."
        })
    },
    ring_of_mind_shielding: {
        name: "Кольцо защиты разума", type: "Кольцо", weight: 0.1, cost: "400 ЗМ",
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: "0.1 фнт",
            effect: "Пока вы носите это кольцо, вы невосприимчивы к магии, позволяющей другим существам читать ваши мысли, определять ваше мировоззрение или лжёте ли вы."
        })
    },
    ring_of_water_elemental_command: {
        name: "Кольцо командования (Вода)", type: "Кольцо", weight: 0.1, cost: "200 000 ЗМ",
        maxCharges: 5, consumableWithCharges: false,
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Легендарный", attunement: "Требуется настройка", cost: "200 000 ЗМ", weight: "0.1 фнт",
            effect: "Кольцо имеет 5 зарядов. Пока вы носите это кольцо, можете сотворить с его помощью заклинание: Град (2 заряда), Ледяная стена (3 заряда), Сотворение воды (1 заряд), Цунами (5 зарядов)."
        })
    },
    ring_of_air_elemental_command: {
        name: "Кольцо командования (Воздух)", type: "Кольцо", weight: 0.1, cost: "200 000 ЗМ",
        maxCharges: 5, consumableWithCharges: false,
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Легендарный", attunement: "Требуется настройка", cost: "200 000 ЗМ", weight: "0.1 фнт",
            effect: "Кольцо имеет 5 зарядов. Пока вы носите это кольцо, можете сотворить с его помощью заклинание: Порыв ветра (2 заряда), Стена ветров (1 заряд), Цепная молния (3 заряда)."
        })
    },
    ring_of_earth_elemental_command: {
        name: "Кольцо командования (Земля)", type: "Кольцо", weight: 0.1, cost: "200 000 ЗМ",
        maxCharges: 5, consumableWithCharges: false,
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Легендарный", attunement: "Требуется настройка", cost: "200 000 ЗМ", weight: "0.1 фнт",
            effect: "Кольцо имеет 5 зарядов. Пока вы носите это кольцо, можете сотворить с его помощью заклинание: Землетрясение (5 зарядов), Каменная кожа (3 заряда), Каменная стена (3 заряда)."
        })
    },
    ring_of_fire_elemental_command: {
        name: "Кольцо командования (Огонь)", type: "Кольцо", weight: 0.1, cost: "200 000 ЗМ",
        maxCharges: 5, consumableWithCharges: false,
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Легендарный", attunement: "Требуется настройка", cost: "200 000 ЗМ", weight: "0.1 фнт",
            effect: "Кольцо имеет 5 зарядов. Пока вы носите это кольцо, можете сотворить с его помощью заклинание: Огненная буря (4 заряда), Огненная стена (3 заряда), Огненный шар (2 заряда)."
        })
    },
    ring_of_invisibility: {
        name: "Кольцо невидимости", type: "Кольцо", weight: 0.1, cost: "200 000 ЗМ",
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Легендарный", attunement: "Требуется настройка", cost: "200 000 ЗМ", weight: "0.1 фнт",
            effect: "Пока вы носите это кольцо, можете действием Магия получить состояние Невидимый."
        })
    },
    ring_of_spell_turning: {
        name: "Кольцо отражения заклинаний", type: "Кольцо", weight: 0.1, cost: "200 000 ЗМ",
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Легендарный", attunement: "Требуется настройка", cost: "200 000 ЗМ", weight: "0.1 фнт",
            effect: "Вы совершаете с Преимуществом спасброски против заклинаний. Если вы преуспеваете в спасброске против заклинания 7-го уровня или ниже, вы можете Реакцией отразить это заклинание обратно в заклинателя."
        })
    },
    ring_of_shooting_stars: {
        name: "Кольцо падающих звёзд", type: "Кольцо", weight: 0.1, cost: "40 000 ЗМ",
        maxCharges: 6, consumableWithCharges: false,
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: "0.1 фнт",
            effect: "Кольцо восстанавливает 1к6 потраченных зарядов на рассвете. Вы можете тратить заряды, чтобы использовать заклинания Огонь фей, Падающие звёзды (от 1 до 3 зарядов) или Сферы молний (2 заряда)."
        })
    },
    ring_of_feather_falling: {
        name: "Кольцо падения пёрышком", type: "Кольцо", weight: 0.1, cost: "4 000 ЗМ",
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "0.1 фнт",
            effect: "Когда вы падаете, пока носите это кольцо, вы опускаетесь со скоростью 60 футов в раунд и не получаете урона от падения."
        })
    },
    ring_of_swimming: {
        name: "Кольцо плавания", type: "Кольцо", weight: 0.1, cost: "400 ЗМ",
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Необычный", attunement: "Нет", cost: "400 ЗМ", weight: "0.1 фнт",
            effect: "Пока вы носите это кольцо, Вы обладаете Скоростью плавания 40 футов."
        })
    },
    ring_of_djinni_summoning: {
        name: "Кольцо призыва джинна", type: "Кольцо", weight: 0.1, cost: "200 000 ЗМ",
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Легендарный", attunement: "Требуется настройка", cost: "200 000 ЗМ", weight: "0.1 фнт",
            effect: "Пока вы носите это кольцо, можете действием Магия вызвать конкретного Джинна со Стихийного плана Воздуха на 1 час."
        })
    },
    ring_of_x_ray_vision: {
        name: "Кольцо проникающего зрения", type: "Кольцо", weight: 0.1, cost: "4 000 ЗМ",
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "0.1 фнт",
            effect: "Пока вы носите это кольцо, вы можете действием Магия обрести проникающее зрение дальностью 30 футов на 1 минуту."
        })
    },
    ring_of_jumping: {
        name: "Кольцо прыжков", type: "Кольцо", weight: 0.1, cost: "400 ЗМ",
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: "0.1 фнт",
            effect: "Пока вы носите это кольцо, вы можете сотворять с его помощью Прыжок, нацеливаясь только на себя."
        })
    },
    ring_of_regeneration: {
        name: "Кольцо регенерации", type: "Кольцо", weight: 0.1, cost: "40 000 ЗМ",
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: "0.1 фнт",
            effect: "Пока вы носите это кольцо, вы каждые 10 минут восстанавливаете 1к6 Хитов, если у вас есть хотя бы 1 Хит."
        })
    },
    ring_of_free_action: {
        name: "Кольцо свободных действий", type: "Кольцо", weight: 0.1, cost: "4 000 ЗМ",
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "0.1 фнт",
            effect: "Ваше перемещение по Труднопроходимой местности не затрачивает дополнительного перемещения, и никакая магия не может сделать вас Парализованным."
        })
    },
    ring_of_resistance: {
        name: "Кольцо сопротивления", type: "Кольцо", weight: 0.1, cost: "4 000 ЗМ",
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Редкий", attunement: "Нет", cost: "4 000 ЗМ", weight: "0.1 фнт",
            effect: "Пока вы носите кольцо, вы обладаете Сопротивлением одному из типов урона (в зависимости от самоцвета)."
        })
    },
    ring_of_telekinesis: {
        name: "Кольцо телекинеза", type: "Кольцо", weight: 0.1, cost: "40 000 ЗМ",
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: "0.1 фнт",
            effect: "Пока вы носите это кольцо, вы можете сотворять с его помощью Телекинез."
        })
    },
    ring_of_warmth: {
        name: "Кольцо тепла", type: "Кольцо", weight: 0.1, cost: "400 ЗМ",
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: "0.1 фнт",
            effect: "Оно снижает получаемый вами урон Холодом на 2к8. Вы не подвергаетесь вредоносным эффектам низких температур."
        })
    },
    ring_of_three_wishes: {
        name: "Кольцо трёх желаний", type: "Кольцо", weight: 0.1, cost: "200 000 ЗМ",
        maxCharges: 3, consumableWithCharges: true,
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Легендарный", attunement: "Нет", cost: "200 000 ЗМ", weight: "0.1 фнт",
            effect: "Пока вы носите это кольцо, можете потратить 1 из 3 его зарядов, чтобы сотворить Желание. При 0 зарядов кольцо становится немагическим."
        })
    },
    ring_of_evasion: {
        name: "Кольцо уклонения", type: "Кольцо", weight: 0.1, cost: "4 000 ЗМ",
        maxCharges: 3, consumableWithCharges: false,
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "0.1 фнт",
            effect: "Это кольцо восстанавливает 1к3 потраченных зарядов на каждом рассвете. Когда вы проваливаете спасбросок Ловкости, вы можете Реакцией потратить 1 заряд и преуспеть в этом спасброске."
        })
    },
    ring_of_water_walking: {
        name: "Кольцо хождения по воде", type: "Кольцо", weight: 0.1, cost: "400 ЗМ",
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Необычный", attunement: "Нет", cost: "400 ЗМ", weight: "0.1 фнт",
            effect: "Пока вы носите это кольцо, вы можете сотворять Хождение по воде, нацеливаясь только на себя."
        })
    },
    ring_of_spell_storing: {
        name: "Кольцо хранения заклинаний", type: "Кольцо", weight: 0.1, cost: "4 000 ЗМ",
        maxCharges: 5, consumableWithCharges: false,
        description: generateUniversalItemHTML({
            type: "Кольцо", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "0.1 фнт",
            effect: "Кольцо может хранить суммарно вплоть до 5 уровней заклинаний (зарядов) единомоментно. Когда заклинание сотворено из кольца, оно освобождает занимаемые уровни."
        })
    }
};