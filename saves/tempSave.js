// ==========================================
// ГЛОБАЛЬНОЕ ХРАНИЛИЩЕ ПЕРСОНАЖА (tempSave.js)
// ==========================================

export const charData = {
    origin: {
        name: "",
        avatar: null, // Хранит Base64 обрезанного изображения
        xp: 0,        // Очки опыта
        level: 1,
        pb: 2,
        classKey: "none",
        subclassKey: "none",
        raceKey: "none",
        raceChoices: {},
        size: "Средний",
        background: "none",
        backgroundState: null
    },

    stats: {
        str: { base: 8, val: 8, mod: -1, saveProf: false, saveMod: -1 },
        dex: { base: 8, val: 8, mod: -1, saveProf: false, saveMod: -1 },
        con: { base: 8, val: 8, mod: -1, saveProf: false, saveMod: -1 },
        int: { base: 8, val: 8, mod: -1, saveProf: false, saveMod: -1 },
        wis: { base: 8, val: 8, mod: -1, saveProf: false, saveMod: -1 },
        cha: { base: 8, val: 8, mod: -1, saveProf: false, saveMod: -1 }
    },

    hitDice: { current: 1, max: 1, type: "d8" },
    health: { current: 10, max: 10, temp: 0, baseRolled: 0 },
    deathSaves: { successes: 0, failures: 0 },

    combat: {
        initiative: 0, speed: 30, climbSpeed: 15, flySpeed: 0, ac: 10,
        passivePerception: 10, stealthDisadvantage: false, heroicInspiration: false,
        resistances: {}, vulnerabilities: {}, conditions: {}, charges: {}
    },

    proficiencies: {
        armor: { light: false, medium: false, heavy: false, shield: false },
        weapon: { simple: 0, martial: 0, other: false },
        tools: [], languages: []
    },

    skills: {
        acrobatics:      { name: "Акробатика",        stat: "dex", state: 0, mod: 0 },
        animal_handling: { name: "Уход за животными", stat: "wis", state: 0, mod: 0 },
        arcana:          { name: "Тайная магия",      stat: "int", state: 0, mod: 0 },
        athletics:       { name: "Атлетика",          stat: "str", state: 0, mod: 0 },
        deception:       { name: "Обман",             stat: "cha", state: 0, mod: 0 },
        history:         { name: "История",           stat: "int", state: 0, mod: 0 },
        insight:         { name: "Проницательность",  stat: "wis", state: 0, mod: 0 },
        intimidation:    { name: "Запугивание",       stat: "cha", state: 0, mod: 0 },
        investigation:   { name: "Расследование",     stat: "int", state: 0, mod: 0 },
        medicine:        { name: "Медицина",          stat: "wis", state: 0, mod: 0 },
        nature:          { name: "Природа",           stat: "int", state: 0, mod: 0 },
        perception:      { name: "Восприятие",        stat: "wis", state: 0, mod: 0 },
        performance:     { name: "Выступление",       stat: "cha", state: 0, mod: 0 },
        persuasion:      { name: "Убеждение",         stat: "cha", state: 0, mod: 0 },
        religion:        { name: "Религия",           stat: "int", state: 0, mod: 0 },
        sleight_of_hand: { name: "Ловкость рук",      stat: "dex", state: 0, mod: 0 },
        stealth:         { name: "Скрытность",        stat: "dex", state: 0, mod: 0 },
        survival:        { name: "Выживание",         stat: "wis", state: 0, mod: 0 }
    },

    selectedFeats: {}, notes: [],
    magic: { known: [], prepared: [], slotsUsed: {}, sorceryPoints: 0, secondaryStatKey: "none" },
    inventory: {
        currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
        equipped: { head: null, armor: null, cloak: null, amulet: null, bracers: null, belt: null, boots: null, rings: [], weapons: [] },
        lists: { ammunitionList: [], potionBag: [], equipmentList: [] },
        storage: []
    },
    bonuses: { stats: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 }, speed: 0, ac: 0, hpMax: 0, initiative: 0 }
};
window.charData = charData;