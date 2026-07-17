// ==========================================
// БАЗА СНАРЯЖЕНИЯ И ЭКИПИРОВКИ PHB 2024 (equipmentsData.js)
// ==========================================

import { generateUniversalItemHTML } from '../../scripts/utils.js';

export const equipmentsData = {
    alchemists_fire: {
        name: "Алхимический огонь", type: "Снаряжение", category: "Снаряжение", cost: "50 ЗМ", weight: 1.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "50 ЗМ", weight: "1.0 фнт", effect: "Когда вы совершаете действие Атака, вы можете заменить одну из своих атак метанием фляжки с Алхимическим огнём. Выберите один видимый вами объект или существо в пределах 20 футов от вас. Цель должна преуспеть в спасброске Ловкости (Сл 8 + ваш модификатор Ловкости + ваш Бонус владения), иначе получит 1к4 урона Огнём и начнёт гореть." })
    },
    block_and_tackle: {
        name: "Блок и лебёдка", type: "Снаряжение", category: "Снаряжение", cost: "1 ЗМ", weight: 5.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "1 ЗМ", weight: "5.0 фнт", effect: "Блок и лебёдка позволяют вам поднять вес в четыре раза больший, чем обычно." })
    },
    barrel: {
        name: "Бочка", type: "Снаряжение", category: "Контейнеры", cost: "2 ЗМ", weight: 40.0,
        description: generateUniversalItemHTML({ type: "Контейнер", cost: "2 ЗМ", weight: "40.0 фнт", effect: "Бочка вмещает не более 40 галлонов жидкости или 4 кубических футов других товаров." })
    },
    paper_sheet: {
        name: "Бумага (лист)", type: "Снаряжение", category: "Снаряжение", cost: "2 СМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "2 СМ", weight: "0.1 фнт", effect: "На один лист Бумаги помещается около 250 рукописных слов." })
    },
    waterskin: {
        name: "Бурдюк (полный)", type: "Снаряжение", category: "Контейнеры", cost: "2 СМ", weight: 5.0,
        maxCharges: 4, consumableWithCharges: true,
        description: generateUniversalItemHTML({ type: "Контейнер", cost: "2 СМ", weight: "5.0 фнт", effect: "Бурдюк вмещает не более 4 пинт жидкости (зарядов). Если вы не пьёте достаточно воды, вы рискуете получить Обезвоживание." })
    },
    glass_bottle: {
        name: "Бутылка, стеклянная", type: "Снаряжение", category: "Контейнеры", cost: "2 ЗМ", weight: 2.0,
        description: generateUniversalItemHTML({ type: "Контейнер", cost: "2 ЗМ", weight: "2.0 фнт", effect: "Стеклянная бутылка вмещает не более 1 1/2 пинты (0,75 л)." })
    },
    bucket: {
        name: "Ведро", type: "Снаряжение", category: "Контейнеры", cost: "5 ММ", weight: 2.0,
        description: generateUniversalItemHTML({ type: "Контейнер", cost: "5 ММ", weight: "2.0 фнт", effect: "Ведро вмещает не более половины кубического фута содержимого." })
    },
    rope: {
        name: "Верёвка (50 фт.)", type: "Снаряжение", category: "Снаряжение", cost: "1 ЗМ", weight: 10.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "1 ЗМ", weight: "10.0 фнт", effect: "Действием Использование вы можете завязать на Верёвке узел. Верёвка может быть разорвана успешной проверкой Силы (Атлетика) Сл 20. Вы можете связать Верёвкой несогласное существо, только если оно является Схваченным, Недееспособным или Опутанным." })
    },
    iron_pot: {
        name: "Горшок, железный", type: "Снаряжение", category: "Снаряжение", cost: "2 ЗМ", weight: 10.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "2 ЗМ", weight: "10.0 фнт", effect: "Железный горшок вмещает не более 1 галлона (3,75 литра)." })
    },
    perfume: {
        name: "Духи", type: "Снаряжение", category: "Снаряжение", cost: "5 ЗМ", weight: 0.2,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "5 ЗМ", weight: "0.2 фнт", effect: "В течение 1 часа после того, как вы нанесли на себя Духи, вы совершаете с Преимуществом проверки Харизмы (Убеждение), совершаемые для того, чтобы повлиять на Равнодушных Гуманоидов в пределах 5 футов от вас." })
    },
    lock: {
        name: "Замок", type: "Снаряжение", category: "Снаряжение", cost: "10 ЗМ", weight: 1.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "10 ЗМ", weight: "1.0 фнт", effect: "Вместе с Замком идёт и ключ. Без ключа существо может вскрыть Замок, преуспев в проверке Ловкости (Ловкость рук) Сл 15 с использованием Воровских инструментов." })
    },
    mirror: {
        name: "Зеркало", type: "Снаряжение", category: "Снаряжение", cost: "5 ЗМ", weight: 0.5,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "5 ЗМ", weight: "0.5 фнт", effect: "Ручное Зеркало из стали полезно не только для нанесения косметики, но и чтобы заглядывать за углы и подавать сигнал отражённым светом." })
    },
    caltrop_single: {
        name: "Калтроп (1 шт)", type: "Снаряжение", category: "Снаряжение", cost: "5 ММ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "5 ММ", weight: "0.1 фнт", effect: "Действием Использование вы можете рассыпать 20 таких калтропов, покрывая область 5 × 5 футов. Существо, впервые за ход входящее в эту область, должно преуспеть в спасброске Ловкости Сл 15, иначе получит 1 Колющего урона, и его Скорость снизится до 0 до начала его следующего хода." })
    },
    manacles: {
        name: "Кандалы", type: "Снаряжение", category: "Снаряжение", cost: "2 ЗМ", weight: 6.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "2 ЗМ", weight: "6.0 фнт", effect: "Действием Использование вы можете оковать Кандалами несогласное существо Маленького или Среднего размера, если оно Схвачено, Недееспособно или Опутано, преуспев в проверке Ловкости Сл 13." })
    },
    map: {
        name: "Карта", type: "Снаряжение", category: "Снаряжение", cost: "1 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "1 ЗМ", weight: "0.1 фнт", effect: "Если вы сверяетесь с точной картой, вы получаете бонус +5 к проверкам Мудрости (Выживание), совершаемым для поиска пути в изображенном на ней месте." })
    },
    book: {
        name: "Книга", type: "Снаряжение", category: "Снаряжение", cost: "25 ЗМ", weight: 5.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "25 ЗМ", weight: "5.0 фнт", effect: "Если вы обращаетесь к нехудожественной книге в хорошем состоянии, то получаете бонус +5 к проверкам Интеллекта (История, Природа, Религия или Тайная магия) по этой теме." })
    },
    bell: {
        name: "Колокольчик", type: "Снаряжение", category: "Снаряжение", cost: "1 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "1 ЗМ", weight: "0.1 фнт", effect: "Действием Использование можно позвонить в Колокольчик и издать звук, слышимый на расстоянии не более 60 футов." })
    },
    quiver: {
        name: "Колчан", type: "Снаряжение", category: "Контейнеры", cost: "1 ЗМ", weight: 1.0,
        description: generateUniversalItemHTML({ type: "Контейнер", cost: "1 ЗМ", weight: "1.0 фнт", effect: "Колчан вмещает не более 20 Стрел." })
    },
    climbers_kit: {
        name: "Комплект для лазания", type: "Снаряжение", category: "Снаряжение", cost: "25 ЗМ", weight: 12.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "25 ЗМ", weight: "12.0 фнт", effect: "Комплект для лазания включает в себя накладные подошвы, перчатки, страховочную привязь и шлямбуры. Действием Использование вы можете применить Комплект для лазания, чтобы закрепиться; сделав это, вы не сможете упасть более чем на 25 футов от точки страховки." })
    },
    healers_kit: {
        name: "Комплект целителя", type: "Снаряжение", category: "Снаряжение", cost: "5 ЗМ", weight: 3.0,
        maxCharges: 10, consumableWithCharges: true,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "5 ЗМ", weight: "3.0 фнт", effect: "Комплект целителя рассчитан на 10 применений (зарядов). Действием Использование вы можете потратить одно из них и стабилизировать Бессознательное существо с 0 Хитов, не совершая проверку Мудрости (Медицина)." })
    },
    basket: {
        name: "Корзина", type: "Снаряжение", category: "Контейнеры", cost: "4 СМ", weight: 2.0,
        description: generateUniversalItemHTML({ type: "Контейнер", cost: "4 СМ", weight: "2.0 фнт", effect: "Корзина вмещает груз объёмом не более 2 кубических футов и весом не более 40 фунтов." })
    },
    costume: {
        name: "Костюм", type: "Снаряжение", category: "Снаряжение", cost: "5 ЗМ", weight: 4.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "5 ЗМ", weight: "4.0 фнт", effect: "Надев Костюм, вы совершаете с Преимуществом проверки характеристик, направленные на то, чтобы выдать себя за кого-то, кому присущ подобный наряд." })
    },
    pouch: {
        name: "Кошель", type: "Снаряжение", category: "Контейнеры", cost: "5 СМ", weight: 0.5,
        description: generateUniversalItemHTML({ type: "Контейнер", cost: "5 СМ", weight: "0.5 фнт", effect: "Кошель вмещает не более 6 фунтов веса в объёме не более 1/5 кубического фута." })
    },
    grappling_hook: {
        name: "Крюк-кошка", type: "Снаряжение", category: "Снаряжение", cost: "2 ЗМ", weight: 4.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "2 ЗМ", weight: "4.0 фнт", effect: "Действием Использование вы можете забросить крюк-кошку на перила, выступ или другое подходящее место в пределах 50 футов от вас; крюк зацепится, если вы преуспеете в проверке Ловкости (Акробатика) Сл 13." })
    },
    jug: {
        name: "Кувшин", type: "Снаряжение", category: "Контейнеры", cost: "2 ММ", weight: 4.0,
        description: generateUniversalItemHTML({ type: "Контейнер", cost: "2 ММ", weight: "4.0 фнт", effect: "Кувшин вмещает не более 1 галлона (3,75 литра)." })
    },
    lamp: {
        name: "Лампа", type: "Снаряжение", category: "Снаряжение", cost: "5 СМ", weight: 1.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "5 СМ", weight: "1.0 фнт", effect: "Лампа заправляется Маслом и при горении испускает Яркий свет в пределах 15 футов и Тусклый свет в пределах ещё 30 футов." })
    },
    fishing_line: {
        name: "Леска", type: "Снаряжение", category: "Снаряжение", cost: "1 СМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "1 СМ", weight: "0.1 фнт", effect: "Длина лески — 10 футов. Вы можете завязать на ней узел действием Использование." })
    },
    ladder: {
        name: "Лестница", type: "Снаряжение", category: "Снаряжение", cost: "1 СМ", weight: 25.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "1 СМ", weight: "25.0 фнт", effect: "Высота лестницы составляет 10 футов. Передвижение по ней вверх или вниз считается лазанием." })
    },
    crowbar: {
        name: "Ломик", type: "Снаряжение", category: "Снаряжение", cost: "2 ЗМ", weight: 5.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "2 ЗМ", weight: "5.0 фнт", effect: "Вы совершаете с Преимуществом проверки Силы, если используете Ломик там, где он может быть применён как рычаг." })
    },
    shovel: {
        name: "Лопата", type: "Снаряжение", category: "Снаряжение", cost: "2 ЗМ", weight: 5.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "2 ЗМ", weight: "5.0 фнт", effect: "Вы можете использовать Лопату, чтобы за 1 час работы выкопать в почве яму в виде куба со стороной 5 футов." })
    },
    arcane_focus_crystal: {
        name: "Магическая фокусировка (Кристалл)", type: "Снаряжение", category: "Снаряжение", cost: "10 ЗМ", weight: 1.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "10 ЗМ", weight: "1.0 фнт", effect: "Волшебники, Колдуны и Чародеи могут использовать её в качестве Заклинательной фокусировки." })
    },
    arcane_focus_orb: {
        name: "Магическая фокусировка (Сфера)", type: "Снаряжение", category: "Снаряжение", cost: "20 ЗМ", weight: 3.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "20 ЗМ", weight: "3.0 фнт", effect: "Волшебники, Колдуны и Чародеи могут использовать её в качестве Заклинательной фокусировки." })
    },
    arcane_focus_rod: {
        name: "Магическая фокусировка (Жезл)", type: "Снаряжение", category: "Снаряжение", cost: "10 ЗМ", weight: 2.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "10 ЗМ", weight: "2.0 фнт", effect: "Волшебники, Колдуны и Чародеи могут использовать её в качестве Заклинательной фокусировки." })
    },
    arcane_focus_staff: {
        name: "Магическая фокусировка (Посох)", type: "Снаряжение", category: "Снаряжение", cost: "5 ЗМ", weight: 4.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "5 ЗМ", weight: "4.0 фнт", effect: "Волшебники, Колдуны и Чародеи могут использовать её в качестве Заклинательной фокусировки." })
    },
    arcane_focus_wand: {
        name: "Магическая фокусировка (Палочка)", type: "Снаряжение", category: "Снаряжение", cost: "10 ЗМ", weight: 1.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "10 ЗМ", weight: "1.0 фнт", effect: "Волшебники, Колдуны и Чародеи могут использовать её в качестве Заклинательной фокусировки." })
    },
    robes: {
        name: "Мантия", type: "Снаряжение", category: "Снаряжение", cost: "1 ЗМ", weight: 4.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "1 ЗМ", weight: "4.0 фнт", effect: "Мантия имеет профессиональное или церемониальное значение. На некоторые мероприятия допускаются только существа одетые в Мантии." })
    },
    ball_bearings: {
        name: "Металлические шарики (мешочек)", type: "Снаряжение", category: "Снаряжение", cost: "1 ЗМ", weight: 2.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "1 ЗМ", weight: "2.0 фнт", effect: "Действием Использование вы можете высыпать Металлические шарики. Они покрывают область 10 × 10 футов. Существо, впервые за ход входящее в эту область, должно преуспеть в спасброске Ловкости Сл 10, иначе станет Сбитым с ног." })
    },
    sack: {
        name: "Мешок", type: "Снаряжение", category: "Контейнеры", cost: "1 ММ", weight: 0.5,
        description: generateUniversalItemHTML({ type: "Контейнер", cost: "1 ММ", weight: "0.5 фнт", effect: "Мешок вмещает груз объёмом не более 1 кубического фута и весом не более 30 фунтов." })
    },
    component_pouch: {
        name: "Мешочек с компонентами", type: "Снаряжение", category: "Снаряжение", cost: "25 ЗМ", weight: 2.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "25 ЗМ", weight: "2.0 фнт", effect: "Водонепроницаемый Мешочек с компонентами полон отделений, в которых хранятся все не имеющие стоимости Материальные компоненты для заклинаний." })
    },
    clothes_travelers: {
        name: "Одежда, дорожная", type: "Снаряжение", category: "Снаряжение", cost: "2 ЗМ", weight: 4.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "2 ЗМ", weight: "4.0 фнт", effect: "Дорожная одежда изготавливается из крепкой ткани и предназначена для путешествий в различных условиях." })
    },
    clothes_fine: {
        name: "Одежда, отличная", type: "Снаряжение", category: "Снаряжение", cost: "15 ЗМ", weight: 6.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "15 ЗМ", weight: "6.0 фнт", effect: "Отличная одежда изготавливается из дорогих тканей и искусно украшается. В некоторые места допускаются только одетые в такую одежду существа." })
    },
    blanket: {
        name: "Одеяло", type: "Снаряжение", category: "Снаряжение", cost: "5 СМ", weight: 3.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "5 СМ", weight: "3.0 фнт", effect: "Завернувшись в Одеяло, вы совершаете с Преимуществом спасброски против чрезвычайного холода." })
    },
    hunting_trap: {
        name: "Охотничий капкан", type: "Снаряжение", category: "Снаряжение", cost: "5 ЗМ", weight: 25.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "5 ЗМ", weight: "25.0 фнт", effect: "Действием Использование вы можете установить Охотничий капкан. Наступившее существо должно преуспеть в спасброске Ловкости Сл 13, иначе получит 1к4 Колющего урона, а его Скорость снизится до 0. Для освобождения нужна проверка Силы Сл 13." })
    },
    tent: {
        name: "Палатка", type: "Снаряжение", category: "Снаряжение", cost: "2 ЗМ", weight: 20.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "2 ЗМ", weight: "20.0 фнт", effect: "В Палатке могут спать не более двух существ Маленького или Среднего размера." })
    },
    parchment: {
        name: "Пергамент", type: "Снаряжение", category: "Снаряжение", cost: "1 СМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "1 СМ", weight: "0.1 фнт", effect: "На один лист Пергамента помещается около 250 рукописных слов." })
    },
    ink_pen: {
        name: "Писчее перо", type: "Снаряжение", category: "Снаряжение", cost: "2 ММ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "2 ММ", weight: "0.1 фнт", effect: "Писчее перо используется с Чернилами для письма или рисования." })
    },
    spyglass: {
        name: "Подзорная труба", type: "Снаряжение", category: "Снаряжение", cost: "1 000 ЗМ", weight: 1.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "1 000 ЗМ", weight: "1.0 фнт", effect: "Рассматриваемые в подзорную трубу объекты увеличиваются в два раза." })
    },
    rations: {
        name: "Рацион (1 день)", type: "Снаряжение", category: "Снаряжение", cost: "5 СМ", weight: 2.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "5 СМ", weight: "2.0 фнт", effect: "Рационы состоят из готовой к употреблению в путешествии пищи, среди которой вяленое мясо, сухофрукты, галеты и орехи." })
    },
    backpack: {
        name: "Рюкзак", type: "Снаряжение", category: "Контейнеры", cost: "2 ЗМ", weight: 5.0,
        description: generateUniversalItemHTML({ type: "Контейнер", cost: "2 ЗМ", weight: "5.0 фнт", effect: "Рюкзак вмещает груз объёмом не более 1 кубического фута и весом не более 30 фунтов. Он также может служить седельной сумкой." })
    },
    candle: {
        name: "Свеча", type: "Снаряжение", category: "Снаряжение", cost: "1 ММ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "1 ММ", weight: "0.1 фнт", effect: "Зажжённая Свеча в течение 1 часа испускает Яркий свет в пределах 5 футов и Тусклый свет в пределах ещё 5 футов." })
    },
    holy_water: {
        name: "Святая вода", type: "Снаряжение", category: "Снаряжение", cost: "25 ЗМ", weight: 1.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "25 ЗМ", weight: "1.0 фнт", effect: "Вы можете метнуть флягу со Святой водой в существо в 20 футах. Цель преуспевает в спасброске Ловкости Сл 8 + ваш мод Ловкости + БМ, иначе получает 2к8 урона Излучением, если она Исчадие или Нежить." })
    },
    holy_symbol_amulet: {
        name: "Священный символ (Амулет)", type: "Снаряжение", category: "Снаряжение", cost: "5 ЗМ", weight: 1.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "5 ЗМ", weight: "1.0 фнт", effect: "Жрецы и Паладины могут использовать Священные символы в качестве Заклинательной фокусировки." })
    },
    holy_symbol_emblem: {
        name: "Священный символ (Эмблема)", type: "Снаряжение", category: "Снаряжение", cost: "5 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "5 ЗМ", weight: "0.1 фнт", effect: "Жрецы и Паладины могут использовать Священные символы в качестве Заклинательной фокусировки (на ткани или Щите)." })
    },
    holy_symbol_reliquary: {
        name: "Священный символ (Реликварий)", type: "Снаряжение", category: "Снаряжение", cost: "5 ЗМ", weight: 2.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "5 ЗМ", weight: "2.0 фнт", effect: "Жрецы и Паладины могут использовать Священные символы в качестве Заклинательной фокусировки." })
    },
    net: {
        name: "Сеть", type: "Снаряжение", category: "Снаряжение", cost: "1 ЗМ", weight: 3.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "1 ЗМ", weight: "3.0 фнт", effect: "Цель в 15 футах делает спасбросок Ловкости Сл 8 + ваш мод Ловкости + БМ, иначе становится Опутанной." })
    },
    signal_whistle: {
        name: "Сигнальный свисток", type: "Снаряжение", category: "Снаряжение", cost: "5 ММ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "5 ММ", weight: "0.1 фнт", effect: "Действием Использование можно подуть в Сигнальный свисток, издав звук, слышный на расстоянии до 600 футов." })
    },
    bedroll: {
        name: "Спальник", type: "Снаряжение", category: "Снаряжение", cost: "1 ЗМ", weight: 7.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "1 ЗМ", weight: "7.0 фнт", effect: "В Спальнике может спать одно существо. Находясь в Спальнике, вы автоматически преуспеваете в спасбросках против чрезвычайного холода." })
    },
    chest: {
        name: "Сундук", type: "Снаряжение", category: "Контейнеры", cost: "5 ЗМ", weight: 25.0,
        description: generateUniversalItemHTML({ type: "Контейнер", cost: "5 ЗМ", weight: "25.0 фнт", effect: "Сундук вмещает не более 12 кубических футов содержимого." })
    },
    portable_ram: {
        name: "Таран, портативный", type: "Снаряжение", category: "Снаряжение", cost: "4 ЗМ", weight: 35.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "4 ЗМ", weight: "35.0 фнт", effect: "Вы можете использовать Портативный таран, чтобы вышибать двери (+4 к проверке Силы)." })
    },
    tinderbox: {
        name: "Трутница", type: "Снаряжение", category: "Снаряжение", cost: "5 СМ", weight: 1.0,
        maxCharges: 10, consumableWithCharges: false,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "5 СМ", weight: "1.0 фнт", effect: "Контейнер с кремнем и огнивом для розжига (10 использований, после чего нужно пополнить трут). Бонусным действием зажигает Лампу или Факел." })
    },
    map_scroll_case: {
        name: "Тубус для карт и свитков", type: "Снаряжение", category: "Контейнеры", cost: "1 ЗМ", weight: 1.0,
        description: generateUniversalItemHTML({ type: "Контейнер", cost: "1 ЗМ", weight: "1.0 фнт", effect: "Тубус для карт и свитков вмещает не более 10 листов Бумаги или 5 листов Пергамента." })
    },
    magnifying_glass: {
        name: "Увеличительное стекло", type: "Снаряжение", category: "Снаряжение", cost: "100 ЗМ", weight: 0.5,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "100 ЗМ", weight: "0.5 фнт", effect: "Используя Увеличительное стекло, вы совершаете с Преимуществом проверки характеристик для оценки предмета со множеством мелких деталей." })
    },
    torch: {
        name: "Факел", type: "Снаряжение", category: "Снаряжение", cost: "1 ММ", weight: 1.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "1 ММ", weight: "1.0 фнт", effect: "Факел горит в течение 1 часа, испуская Яркий свет в пределах 20 футов и Тусклый свет в пределах ещё 20 футов." })
    },
    vial: {
        name: "Флакон", type: "Снаряжение", category: "Контейнеры", cost: "1 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Контейнер", cost: "1 ЗМ", weight: "0.1 фнт", effect: "Флакон вмещает не более 4 унций (100 грамм) жидкости." })
    },
    flask: {
        name: "Фляга", type: "Снаряжение", category: "Контейнеры", cost: "2 ЗМ", weight: 1.0,
        description: generateUniversalItemHTML({ type: "Контейнер", cost: "2 ЗМ", weight: "1.0 фнт", effect: "Фляга вмещает не более 1 пинты (0,5 л) жидкости." })
    },
    druidic_focus_sprig: {
        name: "Фокусировка друидов (Омела)", type: "Снаряжение", category: "Снаряжение", cost: "1 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "1 ЗМ", weight: "0.1 фнт", effect: "Друиды и Следопыты могут использовать Фокусировки друидов в качестве Заклинательной фокусировки." })
    },
    druidic_focus_staff: {
        name: "Фокусировка друидов (Посох)", type: "Снаряжение", category: "Снаряжение", cost: "5 ЗМ", weight: 4.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "5 ЗМ", weight: "4.0 фнт", effect: "Друиды и Следопыты могут использовать Фокусировки друидов в качестве Заклинательной фокусировки." })
    },
    druidic_focus_wand: {
        name: "Фокусировка друидов (Палочка)", type: "Снаряжение", category: "Снаряжение", cost: "10 ЗМ", weight: 1.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "10 ЗМ", weight: "1.0 фнт", effect: "Друиды и Следопыты могут использовать Фокусировки друидов в качестве Заклинательной фокусировки." })
    },
    lantern_hooded: {
        name: "Фонарь, закрытый", type: "Снаряжение", category: "Снаряжение", cost: "5 ЗМ", weight: 2.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "5 ЗМ", weight: "2.0 фнт", effect: "Заправляется Маслом. Яркий свет в пределах 30 футов и Тусклый свет ещё 30 футов." })
    },
    lantern_bullseye: {
        name: "Фонарь, направленный", type: "Снаряжение", category: "Снаряжение", cost: "10 ЗМ", weight: 2.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "10 ЗМ", weight: "2.0 фнт", effect: "Заправляется Маслом. Яркий свет в 60-футовом Конусе и Тусклый свет ещё на 60 футов." })
    },
    crossbow_bolt_case: {
        name: "Футляр для болтов", type: "Снаряжение", category: "Контейнеры", cost: "1 ЗМ", weight: 1.0,
        description: generateUniversalItemHTML({ type: "Контейнер", cost: "1 ЗМ", weight: "1.0 фнт", effect: "Футляр вмещает не более 20 арбалетных болтов." })
    },
    chain: {
        name: "Цепь (10 фт)", type: "Снаряжение", category: "Снаряжение", cost: "5 ЗМ", weight: 10.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "5 ЗМ", weight: "10.0 фнт", effect: "Действием Использование вы можете обернуть Цепью существо в пределах 5 футов, если преуспеете в Силе Сл 13." })
    },
    ink: {
        name: "Чернила", type: "Снаряжение", category: "Снаряжение", cost: "10 ЗМ", weight: 0.1,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "10 ЗМ", weight: "0.1 фнт", effect: "Чернила находятся в 1-унцевой бутылочке. Этого достаточно для написания около 500 листов." })
    },
    pole: {
        name: "Шест (10 фт)", type: "Снаряжение", category: "Снаряжение", cost: "5 ММ", weight: 7.0,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "5 ММ", weight: "7.0 фнт", effect: "Если при Прыжке вам необходимо совершить проверку Силы (Атлетика), вы можете совершить её с Преимуществом, если прыгаете с Шестом." })
    },
    iron_spike_single: {
        name: "Железный шип (1 шт)", type: "Снаряжение", category: "Снаряжение", cost: "1 СМ", weight: 0.5,
        description: generateUniversalItemHTML({ type: "Снаряжение", cost: "1 СМ", weight: "0.5 фнт", effect: "Металлический колышек для заклинивания дверей или крепления веревки." })
    }
};