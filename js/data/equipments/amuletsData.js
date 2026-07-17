// ==========================================
// БАЗА АМУЛЕТОВ И ТАЛИСМАНОВ PHB 2024 (amuletsData.js)
// ==========================================

import { generateUniversalItemHTML } from '../../scripts/utils.js';

export const amuletsData = {
    amulet_of_proof_against_detection: {
        name: "Амулет защиты от обнаружения и поиска", type: "Амулет", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: 0.2,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: "0.2 фнт", effect: "Пока вы носите этот амулет, вас нельзя выбрать целью заклинаний Прорицания или воспринять через магические сенсоры ясновидения, если вы сами этого не позволите." })
    },
    amulet_of_health: {
        name: "Aмулет здоровья", type: "Амулет", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: 0.2,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "0.2 фнт", effect: "Пока вы носите этот амулет, ваше значение Телосложения равно 19. Амулет не оказывает эффекта, если ваше значение Телосложения без него уже равно 19 или выше." })
    },
    amulet_of_the_planes: {
        name: "Амулет планов", type: "Амулет", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: 0.3,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: "0.3 фнт", effect: "Вы можете действием Магия назвать хорошо вам известное местоположение на другом плане бытия и переместиться туда (спасбросок Инт 15)." })
    },
    dark_shard_amulet: {
        name: "Амулет тёмного осколка", type: "Амулет", rarity: "Обычный", attunement: "Требуется настройка Колдуном", cost: "100 ЗМ", weight: 0.2,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Обычный", attunement: "Требуется настройка Колдуном", cost: "100 ЗМ", weight: "0.2 фнт", effect: "Вы можете использовать амулет как Заклинательную фокусировку. Раз в день можете попытаться сотворить неизвестный заговор Колдуна." })
    },
    apparatus_of_kwalish: {
        name: "Аппарат Квалиша", type: "Амулет", rarity: "Легендарный", attunement: "Нет", cost: "200 000 ЗМ", weight: 500.0,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Легендарный", attunement: "Нет", cost: "200 000 ЗМ", weight: "500.0 фнт", effect: "Этот предмет поначалу выглядит как запечатанный железный бочонок. Люк позволяет двум существам залезть внутрь. Аппарат плавает и может погружаться." })
    },
    brooch_of_shielding: {
        name: "Брошь защиты", type: "Амулет", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: "0.1 фнт", effect: "Пока вы носите эту брошь, вы обладаете Сопротивлением Силовому урону и Иммунитетом к урону заклинания Волшебные стрелы." })
    },
    ioun_stone_greater_absorption: {
        name: "Камень Айун (большое поглощение)", type: "Амулет", rarity: "Легендарный", attunement: "Требуется настройка", cost: "200 000 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Легендарный", attunement: "Требуется настройка", cost: "200 000 ЗМ", weight: "0.1 фнт", effect: "Пока камень летает вокруг вашей головы, вы можете Реакцией отменить заклинание 8-го уровня или ниже. Как только камень отменит суммарно 20 уровней заклинаний, он выгорает." })
    },
    ioun_stone_protection: {
        name: "Камень Айун (защита)", type: "Амулет", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "0.1 фнт", effect: "Пока эта серо-розовая призма вращается вокруг вашей головы, вы обладаете бонусом +1 к КЗ." })
    },
    ioun_stone_mastery: {
        name: "Камень Айун (искусность)", type: "Амулет", rarity: "Легендарный", attunement: "Требуется настройка", cost: "200 000 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Легендарный", attunement: "Требуется настройка", cost: "200 000 ЗМ", weight: "0.1 фнт", effect: "Пока эта бледно-зелёная призма вращается вокруг вашей головы, ваш Бонус владения увеличивается на 1." })
    },
    ioun_stone_leadership: {
        name: "Камень Айун (лидерство)", type: "Амулет", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: "0.1 фнт", effect: "Пока эта сфера вращается вокруг вашей головы, ваше значение Харизмы увеличивается на 2, но не выше 20." })
    },
    ioun_stone_awareness: {
        name: "Камень Айун (осведомлённость)", type: "Амулет", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "0.1 фнт", effect: "Пока этот ромбоид вращается вокруг вашей головы, вы совершаете с Преимуществом броски Инициативы и проверки Восприятия." })
    },
    ioun_stone_sustenance: {
        name: "Камень Айун (питание)", type: "Амулет", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "0.1 фнт", effect: "Пока этот прозрачный веретенообразный камень вращается вокруг вашей головы, вам не нужно ни есть, ни пить." })
    },
    ioun_stone_absorption: {
        name: "Камень Айун (поглощение)", type: "Амулет", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: "0.1 фнт", effect: "Вы можете Реакцией отменить заклинание 4-го уровня или ниже. Как только камень отменит 20 уровней заклинаний, он выгорает." })
    },
    ioun_stone_agility: {
        name: "Камень Айун (проворство)", type: "Амулет", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: "0.1 фнт", effect: "Пока эта тёмно-красная сфера вращается вокруг вашей головы, ваше значение Ловкости увеличивается на 2, но не выше 20." })
    },
    ioun_stone_insight: {
        name: "Камень Айун (проницательность)", type: "Амулет", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: "0.1 фнт", effect: "Пока эта ярко-синяя сфера вращается вокруг вашей головы, ваше значение Мудрости увеличивается на 2, но не выше 20." })
    },
    ioun_stone_intellect: {
        name: "Камень Айун (рассудок)", type: "Амулет", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: "0.1 фнт", effect: "Пока эта сфера вращается вокруг вашей головы, ваше значение Интеллекта увеличивается на 2, но не выше 20." })
    },
    ioun_stone_regeneration: {
        name: "Камень Айун (регенерация)", type: "Амулет", rarity: "Легендарный", attunement: "Требуется настройка", cost: "200 000 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Легендарный", attunement: "Требуется настройка", cost: "200 000 ЗМ", weight: "0.1 фнт", effect: "Вы восстанавливаете 15 Хитов в конце каждого часа, в течение которого этот жемчужно-белый камень вращается вокруг вашей головы." })
    },
    ioun_stone_reserve: {
        name: "Камень Айун (резерв)", type: "Амулет", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "0.1 фнт", effect: "Эта призма хранит сотворенные в неё заклинания. Этот камень может хранить до 4-х уровней заклинаний одновременно." })
    },
    ioun_stone_strength: {
        name: "Камень Айун (сила)", type: "Амулет", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: "0.1 фнт", effect: "Пока этот бледно-синий ромбоид вращается вокруг вашей головы, ваше значение Силы увеличивается на 2, но не выше 20." })
    },
    ioun_stone_fortitude: {
        name: "Камень Айун (стойкость)", type: "Амулет", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Очень редкий", attunement: "Требуется настройка", cost: "40 000 ЗМ", weight: "0.1 фнт", effect: "Пока этот розовый ромбоид вращается вокруг вашей головы, ваше значение Телосложения увеличивается на 2, но не выше 20." })
    },
    stone_of_good_luck: {
        name: "Камень удачи", type: "Амулет", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: "0.1 фнт", effect: "Пока этот полированный агат при вас, вы обладаете бонусом +1 к проверкам характеристик и спасброскам." })
    },
    periapt_of_wound_closure: {
        name: "Медальон затягивающихся ран", type: "Амулет", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: 0.2,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: "0.2 фнт", effect: "Заменяйте спасбросок от Смерти «9» или ниже на «10». Удваивает количество Хитов, восстанавливаемых Костями хитов." })
    },
    periapt_of_proof_against_poison: {
        name: "Медальон защиты от яда", type: "Амулет", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: 0.2,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Редкий", attunement: "Требуется настройка", cost: "4 000 ЗМ", weight: "0.2 фнт", effect: "Пока вы носите этот медальон, вы обладаете Иммунитетом к состоянию Отравленный и урону Ядом." })
    },
    periapt_of_health: {
        name: "Медальон здоровья", type: "Амулет", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: 0.2,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: "0.2 фнт", effect: "Раз в день вы можете восстановить 2к4 + 2 Хитов. Вы совершаете с Преимуществом спасброски на избежание состояния Отравленный." })
    },
    medallion_of_thoughts: {
        name: "Медальон мыслей", type: "Амулет", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: "0.1 фнт", effect: "Этот медальон имеет 5 зарядов. Пока вы носите его, вы можете потратить 1 заряд, чтобы сотворить заклинание Обнаружение мыслей." })
    },
    clockwork_amulet: {
        name: "Механистический амулет", type: "Амулет", rarity: "Обычный", attunement: "Нет", cost: "100 ЗМ", weight: 0.2,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Обычный", attunement: "Нет", cost: "100 ЗМ", weight: "0.2 фнт", effect: "Когда вы совершаете бросок атаки, можете не бросать к20, а считать, что на кости выпало «10». Использовать можно 1 раз в день." })
    },
    necklace_of_adaptation: {
        name: "Ожерелье адаптации", type: "Амулет", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: 0.2,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Необычный", attunement: "Требуется настройка", cost: "400 ЗМ", weight: "0.2 фнт", effect: "Вы можете нормально дышать в любой среде и совершаете с Преимуществом спасброски на избежание состояния Отравленный." })
    },
    necklace_of_prayer_beads: {
        name: "Ожерелье молитвенных чёток", type: "Амулет", rarity: "Редкий", attunement: "Требуется настройка Друидом, Жрецом или Паладином", cost: "4 000 ЗМ", weight: 0.5,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Редкий", attunement: "Требуется настройка (Друид, Жрец, Паладин)", cost: "4 000 ЗМ", weight: "0.5 фнт", effect: "На ожерелье 1к4+2 магических бусин. В каждой хранится заклинание: Благословение, Лечение ран, Страж веры и др." })
    },
    necklace_of_fireballs: {
        name: "Ожерелье огненных шаров", type: "Амулет", rarity: "Редкий", attunement: "Нет", cost: "4 000 ЗМ", weight: 0.4,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Редкий", attunement: "Нет", cost: "4 000 ЗМ", weight: "0.4 фнт", effect: "На ожерелье висит 1к6 + 3 бусин. Вы можете отсоединить бусину и бросить её; она взрывается, как Огненный шар 3-го уровня." })
    },
    talisman_of_the_sphere: {
        name: "Талисман сферы", type: "Амулет", rarity: "Легендарный", attunement: "Требуется настройка", cost: "200 000 ЗМ", weight: 0.2,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Легендарный", attunement: "Требуется настройка", cost: "200 000 ЗМ", weight: "0.2 фнт", effect: "Вы совершаете с Преимуществом проверки Интеллекта для управления Сферой аннигиляции." })
    },
    talisman_of_pure_good: {
        name: "Талисман чистого добра", type: "Амулет", rarity: "Легендарный", attunement: "Требуется настройка Жрецом или Паладином", cost: "200 000 ЗМ", weight: 0.3,
        description: generateUniversalItemHTML({ type: "Амулет", rarity: "Легендарный", attunement: "Требуется настройка (Жрец, Паладин)", cost: "200 000 ЗМ", weight: "0.3 фнт", effect: "Исчадие или Нежить получает 8к6 урона Излучением, коснувшись талисмана. +2 к броскам атаки заклинаниями." })
    }
};