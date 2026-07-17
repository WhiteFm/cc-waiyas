// ==========================================
// СКРИПТ ВКЛАДКИ СНАРЯЖЕНИЯ (backpackTab.js)
// ==========================================

import { charData } from '../../saves/tempSave.js';
import { syncAllSkillsUI } from './skillsTab.js';
import { spellsData } from '../data/magicbookData.js';

import { ammoData } from '../data/equipments/ammoData.js';
import { amuletsData } from '../data/equipments/amuletsData.js';
import { armorsData } from '../data/equipments/armorsData.js';
import { beltsData } from '../data/equipments/beltsData.js';
import { bracersData } from '../data/equipments/bracersData.js';
import { cloaksData } from '../data/equipments/cloaksData.js';
import { equipmentsData } from '../data/equipments/equipmentsData.js';
import { footwearData } from '../data/equipments/footwearsData.js';
import { headwearData } from '../data/equipments/headwearData.js';
import { instrumentsData } from '../data/equipments/instrumentsData.js';
import { poisonsData } from '../data/equipments/poisonsData.js';
import { potionsData } from '../data/equipments/potionsData.js';
import { ringsData } from '../data/equipments/ringsData.js';
import { substancesData } from '../data/equipments/substancesData.js';
import { weaponsData } from '../data/equipments/weaponsData.js';
import { packsData } from '../data/equipments/packsData.js';
import { customItemsData } from '../data/customItems.js';

const ALL_ITEMS_MAP = {
    ...ammoData, ...amuletsData, ...armorsData, ...beltsData, ...bracersData,
    ...cloaksData, ...equipmentsData, ...footwearData, ...headwearData,
    ...instrumentsData, ...poisonsData, ...potionsData,
    ...ringsData, ...substancesData, ...weaponsData, ...packsData, ...customItemsData
};

ALL_ITEMS_MAP['spell_scroll_base'] = {
    name: "Свиток заклинания (выбор)", type: "Снаряжение", category: "Снаряжение", cost: "Зависит от ур.", weight: 0.01,
    description: "Позволяет выбрать заклинание и создать магический свиток."
};

window.parseCurrencyToCp = function(str) {
    if (!str) return 0;
    let cp = 0;
    const cleanStr = str.replace(/(\d)\s+(?=\d)/g, "$1");
    const matches = cleanStr.match(/([\d.,]+)\s*(ЗМ|СМ|ММ|ЭМ|ПМ)/gi);
    if (matches) {
        matches.forEach(m => {
            const valStr = m.match(/[\d.,]+/)[0];
            const curStr = m.match(/[А-Яа-я]+/)[0].toUpperCase();
            const val = parseFloat(valStr.replace(',', '.'));
            if (curStr === 'ММ') cp += val;
            else if (curStr === 'СМ') cp += val * 10;
            else if (curStr === 'ЭМ') cp += val * 50;
            else if (curStr === 'ЗМ') cp += val * 100;
            else if (curStr === 'ПМ') cp += val * 1000;
        });
    }
    return cp;
}

Object.keys(ALL_ITEMS_MAP).forEach(key => {
    const item = ALL_ITEMS_MAP[key];
    item.singleWeight = typeof item.weight === 'number' ? item.weight : parseFloat(item.weight) || 0;
    if(item.costInCp === undefined) item.costInCp = window.parseCurrencyToCp(item.cost);
});

function formatCurrencyFromCp(cp) {
    if (cp === 0) return "0 ЗМ";
    let str = [];
    let gp = Math.floor(cp / 100);
    let sp = Math.floor((cp % 100) / 10);
    let remCp = Math.round(cp % 10);
    if (gp > 0) str.push(`${gp} ЗМ`);
    if (sp > 0) str.push(`${sp} СМ`);
    if (remCp > 0) str.push(`${remCp} ММ`);
    return str.join(" ");
}

const ITEM_ROUTING = {
    "Шлем": "head", "Лёгкий доспех": "armor", "Средний доспех": "armor", "Тяжёлый доспех": "armor",
    "Щит": "weapons", "Плащ": "cloak", "Амулет": "amulet", "Наручи": "bracers",
    "Пояс": "belt", "Поножи": "boots", "Кольцо": "rings",
    "Простое рукопашное оружие": "weapons", "Простое дальнобойное оружие": "weapons",
    "Воинское рукопашное оружие": "weapons", "Воинское дальнобойное оружие": "weapons",
    "Яд": "potionBag", "Зелье": "potionBag", "Эликсир": "potionBag", "Масло": "potionBag", "Вещество": "potionBag", "Наркотик": "potionBag",
    "Боеприпасы": "ammunitionList", "Боеприпас": "ammunitionList",
    "Снаряжение": "equipmentList", "Контейнеры": "equipmentList", "Инструмент": "equipmentList",
    "Другие инструменты": "equipmentList", "Музыкальные инструменты": "equipmentList", "Игровые наборы": "equipmentList",
    "Инструменты ремесленников": "equipmentList", "Магические инструменты": "equipmentList"
};

function createScrollDbItem(spellKey) {
    const sp = spellsData[spellKey];
    if (!sp) return null;
    const scrollCosts = { 0: "25 ЗМ", 1: "50 ЗМ", 2: "250 ЗМ", 3: "500 ЗМ", 4: "2500 ЗМ", 5: "5000 ЗМ", 6: "10000 ЗМ", 7: "25000 ЗМ", 8: "50000 ЗМ", 9: "100000 ЗМ" };
    const cost = scrollCosts[sp.level] || "50 ЗМ";
    return {
        name: `Свиток: ${sp.name}`, type: "Снаряжение", category: "Снаряжение", cost: cost, weight: 0.01, singleWeight: 0.01, costInCp: window.parseCurrencyToCp(cost),
        description: `<b>Свиток заклинания (${sp.level === 0 ? 'Заговор' : sp.level + ' ур.'})</b><br>${sp.description}`
    };
}

function ensureDynamicItemsExist() {
    if (!charData.inventory) return;
    const allInv = [...(charData.inventory.storage || []), ...(charData.inventory.lists?.equipmentList || []), ...(charData.inventory.lists?.potionBag || [])];
    allInv.forEach(item => {
        if (item && item.key && item.key.startsWith('spell_scroll_') && item.key !== 'spell_scroll_base') {
            const spellKey = item.key.replace('spell_scroll_', '');
            if (!ALL_ITEMS_MAP[item.key] && spellsData && spellsData[spellKey]) {
                ALL_ITEMS_MAP[item.key] = createScrollDbItem(spellKey);
            }
        }
    });
}

function normalizeInventoryKeys() {
    if (!charData.inventory) return;
    const fixArray = (arr) => {
        if (!Array.isArray(arr)) return;
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            if (item && item.key && !ALL_ITEMS_MAP[item.key]) {
                let cleanName = item.key.replace(/\s*\(?\d+\s*(шт|штук|порц|дней|день|болт|стрел|фляг|фляги)\.?\)?/gi, '').trim();
                const match = item.key.match(/\(?(\d+)\s*(шт|штук|порц|дней|день|болт|стрел|фляг|фляги)\.?\)?/i);
                let multiplier = match ? parseInt(match[1]) || 1 : 1;
                if (cleanName.toLowerCase() === "стрелы") cleanName = "Стрела";
                if (cleanName.toLowerCase() === "арбалетные болты") cleanName = "Арбалетный болт";
                const foundKey = Object.keys(ALL_ITEMS_MAP).find(k => (ALL_ITEMS_MAP[k].name || "").toLowerCase() === cleanName.toLowerCase() || k.toLowerCase() === cleanName.toLowerCase());
                if (foundKey) { item.key = foundKey; item.count = (item.count === multiplier) ? multiplier : (item.count || 1) * multiplier; }
            }
        }
    };
    fixArray(charData.inventory.storage);
    if (charData.inventory.lists) Object.values(charData.inventory.lists).forEach(fixArray);
    if (charData.inventory.equipped) {
        Object.keys(charData.inventory.equipped).forEach(slot => {
            const eqItem = charData.inventory.equipped[slot];
            if (Array.isArray(eqItem)) fixArray(eqItem); else if (eqItem) fixArray([eqItem]);
        });
    }
}

class InventoryManager {
    constructor() { this.initStructure(); }
    initStructure() {
        if (!charData.inventory) charData.inventory = {};
        if (!charData.inventory.currency) charData.inventory.currency = { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };
        if (!charData.inventory.storage) charData.inventory.storage = [];
        if (!charData.inventory.equipped) charData.inventory.equipped = { head: null, armor: null, cloak: null, amulet: null, bracers: null, belt: null, boots: null, rings: [], weapons: [], activeSet: 1 };
        if (!charData.inventory.equipped.weapons) charData.inventory.equipped.weapons = [];
        if (!charData.inventory.equipped.rings) charData.inventory.equipped.rings = [];
        if (!charData.inventory.lists) charData.inventory.lists = { ammunitionList: [], potionBag: [], equipmentList: [] };
    }
    equipItem(instanceId) {
        const itemIndex = charData.inventory.storage.findIndex(i => i.instanceId === instanceId);
        if (itemIndex === -1) return;
        const invItem = charData.inventory.storage[itemIndex];
        const dbItem = ALL_ITEMS_MAP[invItem.key];
        if (!dbItem) return;
        const targetSlot = ITEM_ROUTING[dbItem.category] || ITEM_ROUTING[dbItem.type];
        if (!targetSlot) { alert("Этот предмет нельзя экипировать!"); return; }

        let itemToMove = { ...invItem, count: invItem.count };
        if (Array.isArray(charData.inventory.lists[targetSlot])) {
            const existing = charData.inventory.lists[targetSlot].find(i => i.key === invItem.key && i.charges === invItem.charges);
            if (existing) existing.count += invItem.count; else charData.inventory.lists[targetSlot].push(itemToMove);
            charData.inventory.storage.splice(itemIndex, 1);
        } else if (targetSlot === "rings") {
            if (charData.inventory.equipped.rings.length < 2) { itemToMove.count = 1; charData.inventory.equipped.rings.push(itemToMove); this._reduceOrRemoveFromStorage(itemIndex, invItem, 1); }
            else { window.openRingReplaceModal(instanceId); return; }
        } else if (targetSlot === "weapons") {
            window.openWeaponEquipModal(instanceId); return;
        } else {
            const oldItem = charData.inventory.equipped[targetSlot];
            if (oldItem) {
                const existing = charData.inventory.storage.find(i => i.key === oldItem.key && i.charges === oldItem.charges);
                if (existing) existing.count += oldItem.count; else charData.inventory.storage.push({ ...oldItem });
            }
            itemToMove.count = 1; charData.inventory.equipped[targetSlot] = itemToMove; this._reduceOrRemoveFromStorage(itemIndex, invItem, 1);
            if (targetSlot === "armor") syncAllSkillsUI();
        }
        renderInventoryUI();
    }
    _reduceOrRemoveFromStorage(index, item, countToReduce = 1) {
        item.count -= countToReduce;
        if (item.count <= 0) charData.inventory.storage.splice(index, 1);
    }
    unequipWeapon(equipSlot) {
        const arr = charData.inventory.equipped.weapons;
        const idx = arr.findIndex(w => w.equipSlot === equipSlot);
        if (idx > -1) {
            let removedItem = arr.splice(idx, 1)[0]; delete removedItem.equipSlot;
            const existing = charData.inventory.storage.find(i => i.key === removedItem.key && i.charges === removedItem.charges);
            if (existing) existing.count += removedItem.count; else charData.inventory.storage.push(removedItem);
            syncAllSkillsUI(); renderInventoryUI();
        }
    }
    unequipItem(slotType, instanceId = null) {
        let removedItem = null;
        if (slotType === "rings") {
            const arr = charData.inventory.equipped[slotType];
            const idx = arr.findIndex(i => i.instanceId === instanceId);
            if (idx > -1) { removedItem = arr.splice(idx, 1)[0]; if (removedItem.equipSlot) delete removedItem.equipSlot; }
        } else if (Array.isArray(charData.inventory.lists[slotType])) {
            const arr = charData.inventory.lists[slotType];
            const idx = arr.findIndex(i => i.instanceId === instanceId);
            if (idx > -1) removedItem = arr.splice(idx, 1)[0];
        } else {
            removedItem = charData.inventory.equipped[slotType]; charData.inventory.equipped[slotType] = null;
        }
        if (removedItem) {
            const existing = charData.inventory.storage.find(i => i.key === removedItem.key && i.charges === removedItem.charges);
            if (existing) existing.count += removedItem.count; else charData.inventory.storage.push({ ...removedItem });
            if (slotType === "armor") syncAllSkillsUI();
            renderInventoryUI();
        }
    }
}
window.invManager = new InventoryManager();

export function initBackpackTab() {
    window.invManager.initStructure();
    if (!charData.inventory.equipped.activeSet) charData.inventory.equipped.activeSet = 1;
    ensureDynamicItemsExist();
    normalizeInventoryKeys();
    renderInventoryUI();
    attachBackpackEventListeners();

    if (!window.backpackListenerBound) {
        document.addEventListener('charDataUpdated', () => {
            if (document.getElementById("storageListContainer")) {
                window.invManager.initStructure();
                renderInventoryUI();
            }
        });
        window.backpackListenerBound = true;
    }
}

window.renderInventoryUI = renderInventoryUI;
function renderInventoryUI() {
    ensureDynamicItemsExist(); normalizeInventoryKeys(); renderStorage(); renderEquippedSlots(); renderLists(); renderWalletUI(); calculateAndDisplayWeight();
    if (typeof window.initGlobalInspector === "function") window.initGlobalInspector();
}

const COIN_ICONS = {
    gp: `<svg width="24" height="24" viewBox="0 0 20 20" style="vertical-align:middle;"><circle cx="10" cy="10" r="9" fill="url(#gpGrad)" stroke="#b8860b" stroke-width="1"/><defs><radialGradient id="gpGrad"><stop offset="0%" stop-color="#ffe866"/><stop offset="100%" stop-color="#e6b800"/></radialGradient></defs></svg>`,
    pp: `<svg width="20" height="20" viewBox="0 0 20 20" style="vertical-align:middle;"><polygon points="10,1 19,6 19,14 10,19 1,14 1,6" fill="url(#ppGrad)" stroke="#8c8c8c" stroke-width="1"/><defs><radialGradient id="ppGrad"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#c0c0c0"/></radialGradient></defs></svg>`,
    ep: `<svg width="18" height="18" viewBox="0 0 20 20" style="vertical-align:middle;"><polygon points="10,1 18,10 10,19 2,10" fill="url(#epGrad)" stroke="#2b6b6b" stroke-width="1"/><defs><radialGradient id="epGrad"><stop offset="0%" stop-color="#a8e6e6"/><stop offset="100%" stop-color="#4e9f9f"/></radialGradient></defs></svg>`,
    sp: `<svg width="18" height="18" viewBox="0 0 20 20" style="vertical-align:middle;"><circle cx="10" cy="10" r="9" fill="url(#spGrad)" stroke="#808080" stroke-width="1"/><defs><radialGradient id="spGrad"><stop offset="0%" stop-color="#fdfdfd"/><stop offset="100%" stop-color="#b0b0b0"/></radialGradient></defs></svg>`,
    cp: `<svg width="18" height="18" viewBox="0 0 20 20" style="vertical-align:middle;"><circle cx="10" cy="10" r="9" fill="url(#cpGrad)" stroke="#7a3b22" stroke-width="1"/><defs><radialGradient id="cpGrad"><stop offset="0%" stop-color="#e38d6d"/><stop offset="100%" stop-color="#b54d24"/></radialGradient></defs></svg>`
};

function renderWalletUI() {
    let walletWrapper = document.getElementById("walletWrapper");
    if (!walletWrapper) {
        const eqContainer = document.getElementById("equipmentListContainer");
        if (eqContainer && eqContainer.parentElement) {
            walletWrapper = document.createElement("div");
            walletWrapper.id = "walletWrapper";
            walletWrapper.style.display = "flex";
            walletWrapper.style.gap = "15px";
            walletWrapper.style.marginTop = "20px";
            walletWrapper.style.flexWrap = "wrap";
            eqContainer.parentElement.appendChild(walletWrapper);
        } else return;
    }

    if (!charData.inventory.currency) charData.inventory.currency = { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };
    const c = charData.inventory.currency;
    const totalInGp = (c.cp / 100 + c.sp / 10 + c.ep / 2 + c.gp + c.pp * 10).toFixed(2);

    walletWrapper.innerHTML = `
        <div class="backpack-col-box" style="flex: 1.6; min-width: 250px; margin-top: 0; display: flex; flex-direction: column;">
            <div class="backpack-header" style="border-left-color: var(--accent-yellow); display: flex; justify-content: space-between; align-items: center;">
                <span class="title">Кошелёк (Общ: ${totalInGp} ЗМ)</span>
            </div>
            <div style="display: flex; flex-direction: column; padding: 15px 12px; gap: 15px; background: rgba(0,0,0,0.2); border-radius: 0 0 8px 8px; flex: 1;">
                <div style="text-align: center; margin-bottom: 5px;">
                    <label style="display: flex; align-items:center; justify-content:center; margin-bottom: 6px;" title="Золотые монеты (ЗМ)">${COIN_ICONS.gp}</label>
                    <input type="number" class="highlight-box math-val text-center" value="${c.gp}" onchange="window.updateCurrency('gp', this.value)" style="width: 110px; border-color: var(--accent-yellow); color: var(--accent-yellow); font-size: 20px; font-weight: 900; -moz-appearance: textfield; margin: 0 auto; display: block;">
                </div>
                <div style="display: flex; justify-content: space-between; gap: 8px;">
                    <div style="flex: 1; text-align: center;"><label style="display: flex; align-items:center; justify-content:center; margin-bottom: 6px;" title="Медные монеты (ММ)">${COIN_ICONS.cp}</label><input type="number" class="highlight-box math-val text-center" value="${c.cp}" onchange="window.updateCurrency('cp', this.value)" style="width: 100%; -moz-appearance: textfield;"></div>
                    <div style="flex: 1; text-align: center;"><label style="display: flex; align-items:center; justify-content:center; margin-bottom: 6px;" title="Серебряные монеты (СМ)">${COIN_ICONS.sp}</label><input type="number" class="highlight-box math-val text-center" value="${c.sp}" onchange="window.updateCurrency('sp', this.value)" style="width: 100%; -moz-appearance: textfield;"></div>
                    <div style="flex: 1; text-align: center;"><label style="display: flex; align-items:center; justify-content:center; margin-bottom: 6px;" title="Электрумовые монеты (ЭМ)">${COIN_ICONS.ep}</label><input type="number" class="highlight-box math-val text-center" value="${c.ep}" onchange="window.updateCurrency('ep', this.value)" style="width: 100%; -moz-appearance: textfield;"></div>
                    <div style="flex: 1; text-align: center;"><label style="display: flex; align-items:center; justify-content:center; margin-bottom: 6px;" title="Платиновые монеты (ПМ)">${COIN_ICONS.pp}</label><input type="number" class="highlight-box math-val text-center" value="${c.pp}" onchange="window.updateCurrency('pp', this.value)" style="width: 100%; -moz-appearance: textfield;"></div>
                </div>
                <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 0;">
                <div style="display: flex; gap: 10px;">
                    <div style="flex: 1; display: flex; gap: 4px;">
                        <input type="number" id="add_curr_val" class="highlight-box math-val text-center mini" placeholder="0" min="0" style="flex:1; -moz-appearance: textfield; background: rgba(0,0,0,0.3); border-color: rgba(255,255,255,0.1);">
                        <select id="add_curr_type" class="font-group-3 input-field" style="padding: 0 4px; width: 60px; height: 26px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); font-size: 12px; text-align: center;"><option value="gp">ЗМ</option><option value="cp">ММ</option><option value="sp">СМ</option><option value="ep">ЭМ</option><option value="pp">ПМ</option></select>
                        <button onclick="window.addCurrency()" class="step-btn" title="Добавить монеты" style="background: var(--accent-success); color: #0a0d14; font-weight: bold; height: 26px; width: 26px; font-size: 14px; border-radius: 4px;">+</button>
                    </div>
                    <div style="flex: 1; display: flex; gap: 4px;">
                        <input type="number" id="sub_curr_val" class="highlight-box math-val text-center mini" placeholder="0" min="0" style="flex:1; -moz-appearance: textfield; background: rgba(0,0,0,0.3); border-color: rgba(255,255,255,0.1);">
                        <select id="sub_curr_type" class="font-group-3 input-field" style="padding: 0 4px; width: 60px; height: 26px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); font-size: 12px; text-align: center;"><option value="gp">ЗМ</option><option value="cp">ММ</option><option value="sp">СМ</option><option value="ep">ЭМ</option><option value="pp">ПМ</option></select>
                        <button onclick="window.subCurrency()" class="step-btn" title="Отнять монеты (со сдачей)" style="background: var(--accent); color: #0a0d14; font-weight: bold; height: 26px; width: 26px; font-size: 14px; border-radius: 4px;">−</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="backpack-col-box" style="flex: 1.2; min-width: 140px; margin-top: 0; display: flex; flex-direction: column;">
            <div class="backpack-header" style="border-left-color: var(--accent-success);"><span class="title">ОТДЫХ</span></div>
            <div style="display: flex; flex-direction: column; gap: 12px; padding: 15px 12px; background: rgba(0,0,0,0.2); border-radius: 0 0 8px 8px; flex: 1; justify-content: center;">
                <button class="settings-btn btn-dark" onclick="window.shortRest()" style="padding: 10px; font-size: 13px;">☕ Короткий</button>
                <button class="settings-btn btn-green" onclick="window.longRest()" style="padding: 10px; font-size: 13px;">⛺ Долгий</button>
            </div>
        </div>
    `;
}

window.updateCurrency = function(type, val) { let num = parseInt(val) || 0; if (num < 0) num = 0; charData.inventory.currency[type] = num; renderWalletUI(); calculateAndDisplayWeight(); };
window.addCurrency = function() { const type = document.getElementById("add_curr_type").value; const val = parseInt(document.getElementById("add_curr_val").value) || 0; if (val > 0) { charData.inventory.currency[type] += val; renderWalletUI(); calculateAndDisplayWeight(); } };
window.subCurrency = function() {
    const type = document.getElementById("sub_curr_type").value; const val = parseInt(document.getElementById("sub_curr_val").value) || 0; if (val <= 0) return;
    const c = charData.inventory.currency; let costCp = val;
    if (type === 'sp') costCp *= 10; if (type === 'ep') costCp *= 50; if (type === 'gp') costCp *= 100; if (type === 'pp') costCp *= 1000;
    let totalCp = c.cp + (c.sp * 10) + (c.ep * 50) + (c.gp * 100) + (c.pp * 1000);
    if (totalCp < costCp) { alert("У вас недостаточно средств в кошельке!"); return; }
    if (c[type] >= val) { c[type] -= val; } else {
        totalCp -= costCp; c.pp = Math.floor(totalCp / 1000); totalCp %= 1000; c.gp = Math.floor(totalCp / 100); totalCp %= 100;
        c.ep = Math.floor(totalCp / 50); totalCp %= 50; c.sp = Math.floor(totalCp / 10); totalCp %= 10; c.cp = totalCp;
    }
    renderWalletUI(); calculateAndDisplayWeight();
};

function renderStorage() { renderInventoryList(charData.inventory.storage, document.getElementById("storageListContainer"), 'storage', false); }
function renderLists() { ['ammunitionList', 'potionBag', 'equipmentList'].forEach(listName => { renderInventoryList(charData.inventory.lists[listName], document.getElementById(`${listName}Container`), listName, true); }); }

function renderInventoryList(list, container, listType, isList) {
    if (!container) return;
    if (list.length === 0) { container.innerHTML = `<p class="font-group-3" style="color: var(--text-muted); font-style: italic; padding: 15px; text-align: center;">${isList ? 'Пусто' : 'Хранилище пусто'}</p>`; return; }
    let html = "";
    list.forEach((itemObj, idx) => {
        const dbItem = ALL_ITEMS_MAP[itemObj.key] || { name: itemObj.key, singleWeight: 0, category: "", type: "" };
        const displayName = dbItem.name || itemObj.key;
        const isEquippable = ITEM_ROUTING[dbItem.category] || ITEM_ROUTING[dbItem.type];
        const hasCharges = !!dbItem.maxCharges;
        let weightDisplay = dbItem.singleWeight * itemObj.count;
        if (hasCharges && dbItem.consumableWithCharges && itemObj.charges !== undefined) weightDisplay = (dbItem.singleWeight / dbItem.maxCharges) * itemObj.charges * itemObj.count;
        if (itemObj.instanceId === undefined) itemObj.instanceId = Date.now() + Math.random();

        html += `
        <div class="inventory-item-row interactive-node" data-inspector="${formatInspector(dbItem)}">
            <div style="flex: 1; min-width: 0; padding-right: 8px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;"><div class="inv-item-name">${displayName}</div><button onclick="event.stopPropagation(); window.deleteItem('${listType}', ${idx}, ${isList})" title="Удалить предмет" style="background:none; border:none; color:var(--accent); cursor:pointer; font-size:15px; padding:0 6px; margin-top:-2px; line-height:1;">✕</button></div>
                <span class="inv-item-weight">${Math.round(weightDisplay * 100)/100} фнт.</span>
            </div>
            <div class="inv-controls" style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
                <div style="display:flex; align-items:center; gap:4px;">
                    <span style="font-size:11px; color:var(--text-muted); margin-right:4px;">Кол-во:</span>
                    <button class="step-btn minus" onclick="changeItemCount('${listType}', ${idx}, -1, ${isList})">−</button><input type="number" class="highlight-box math-val mini" value="${itemObj.count}" onchange="window.updateItemCountManual('${listType}', ${idx}, ${isList}, this.value)" style="width:36px; padding:0; text-align:center; -moz-appearance:textfield; outline:none; border:1px solid var(--border-color); background:transparent; color:var(--text-color);"><button class="step-btn plus" onclick="changeItemCount('${listType}', ${idx}, 1, ${isList})">+</button>
                    ${isEquippable && !isList ? `<button class="step-btn equip-btn" style="margin-left:4px;" onclick="window.invManager.equipItem(${itemObj.instanceId})">⇪</button>` : ''}
                    ${isList ? `<button class="step-btn" style="margin-left:4px;" onclick="window.invManager.unequipItem('${listType}', ${itemObj.instanceId})">↧</button>` : ''}
                </div>
                ${hasCharges ? `
                <div style="display:flex; align-items:center; gap:4px;">
                    <span style="font-size:11px; color:var(--accent-yellow); margin-right:4px;">Заряды:</span>
                    <button class="step-btn minus" onclick="changeItemCharges('${listType}', ${idx}, -1, ${isList})">−</button><input type="number" class="highlight-box math-val mini" value="${itemObj.charges !== undefined ? itemObj.charges : dbItem.maxCharges}" onchange="window.updateItemChargesManual('${listType}', ${idx}, ${isList}, this.value)" style="width:36px; padding:0; text-align:center; -moz-appearance:textfield; outline:none; border:1px solid var(--accent-yellow); color:var(--accent-yellow); background:transparent;"><button class="step-btn plus" onclick="changeItemCharges('${listType}', ${idx}, 1, ${isList})">+</button>
                </div>` : ''}
            </div>
        </div>`;
    });
    container.innerHTML = html;
}

function renderEquippedSlots() {
    const eq = charData.inventory.equipped;
    ['head', 'armor', 'cloak', 'amulet', 'bracers', 'belt', 'boots'].forEach(slot => {
        const disp = document.getElementById(`disp_${slot}`); const slotEl = document.getElementById(`slot_${slot}`);
        if (!disp) return;
        if (eq[slot]) {
            const item = ALL_ITEMS_MAP[eq[slot].key]; disp.innerHTML = `<span style="color:var(--text-color); font-weight:bold; font-size:13px; text-align:center;">${item.name}</span> <span style="font-size:10px; color:var(--accent); cursor:pointer; margin-top:4px;">[Снять]</span>`;
            if (slotEl) { slotEl.setAttribute("data-inspector", formatInspector(item)); slotEl.onclick = () => window.invManager.unequipItem(slot); }
        } else {
            disp.innerHTML = `<span style="color:var(--text-muted);">Пусто</span>`; if (slotEl) { slotEl.setAttribute("data-inspector", `Свободный слот`); slotEl.onclick = null; }
        }
    });

    for (let i = 0; i < 2; i++) {
        const disp = document.getElementById(`disp_rings_${i}`); const slotEl = document.getElementById(`slot_rings_${i}`);
        if (!disp) continue;
        const itemObj = eq.rings[i];
        if (itemObj) {
            const item = ALL_ITEMS_MAP[itemObj.key]; disp.innerHTML = `<div style="display:flex; flex-direction:column; align-items:center;"><span style="color:var(--text-color); font-weight:bold; font-size:13px; text-align:center;">${item.name}</span> <span style="font-size:10px; color:var(--accent); cursor:pointer; margin-top:4px;">[Снять]</span></div>`;
            if (slotEl) { slotEl.setAttribute("data-inspector", formatInspector(item)); slotEl.onclick = () => window.invManager.unequipItem("rings", itemObj.instanceId); }
        } else {
            disp.innerHTML = `<span style="color:var(--text-muted);">Пусто</span>`; if (slotEl) { slotEl.setAttribute("data-inspector", `Свободный слот для кольца`); slotEl.onclick = null; }
        }
    }

    const actSet = eq.activeSet || 1;
    const wrap1 = document.getElementById("weapon_set_1_wrap");
    const wrap2 = document.getElementById("weapon_set_2_wrap");
    if (wrap1) wrap1.style.borderColor = actSet === 1 ? "var(--accent-success)" : "transparent";
    if (wrap2) wrap2.style.borderColor = actSet === 2 ? "var(--accent-success)" : "transparent";

    const weaponSlots = ['set1_main', 'set1_off', 'set2_main', 'set2_off'];
    weaponSlots.forEach(slot => {
        const disp = document.getElementById(`disp_w_${slot}`); const slotEl = document.getElementById(`slot_w_${slot}`);
        if (!disp) return;

        const itemObj = eq.weapons.find(w => w.equipSlot === slot);
        if (itemObj) {
            const item = ALL_ITEMS_MAP[itemObj.key]; let extraHtml = "";
            if (item.damage) {
                let statKey = "str";
                if (item.properties?.includes("Фехтовальное")) statKey = (charData.stats.dex?.val || 0) > (charData.stats.str?.val || 0) ? "dex" : "str";
                else if (item.category?.includes("дальнобойное")) statKey = "dex";

                const statMod = charData.stats[statKey]?.mod || 0;
                let isProf = false;
                if (item.category.includes("Простое")) {
                    if (charData.proficiencies.weapon.simple === 2) isProf = true;
                    else if (charData.proficiencies.weapon.simple === 1 && (item.properties.includes("Лёгкое") || item.properties.includes("Фехтовальное"))) isProf = true;
                } else if (item.category.includes("Воинское")) {
                    if (charData.proficiencies.weapon.martial === 2) isProf = true;
                    else if (charData.proficiencies.weapon.martial === 1 && (item.properties.includes("Лёгкое") || item.properties.includes("Фехтовальное"))) isProf = true;
                }

                const pb = charData.origin.pb || 2; const atkMod = statMod + (isProf ? pb : 0); const atkStr = atkMod >= 0 ? `+${atkMod}` : `${atkMod}`;
                let dmgMod = statMod;
                if (slot.includes("off")) { const hasDualWielding = charData.selectedFeats && charData.selectedFeats["fs_two_weapon"]; if (!hasDualWielding && dmgMod > 0) dmgMod = 0; }
                const dmgStr = dmgMod !== 0 ? (dmgMod > 0 ? `+${dmgMod}` : `${dmgMod}`) : "";
                extraHtml = `<div style="display:flex; justify-content:center; gap:8px; margin-top:2px;"><span style="font-size: 11px; color: var(--accent-success); font-weight:bold;" title="Бонус атаки">⚔️ Атака: ${atkStr}</span><span style="font-size: 11px; color: var(--accent-yellow); font-weight:bold;" title="Урон">🩸 Урон: ${item.damage}${dmgStr}</span></div>`;
            }
            disp.innerHTML = `<span style="color:var(--text-color); font-weight:bold; font-size:13px; text-align:center;">${item.name}</span>${extraHtml}<span style="font-size:10px; color:var(--accent); cursor:pointer; margin-top:4px;">[Снять]</span>`;
            if (slotEl) { slotEl.setAttribute("data-inspector", formatInspector(item)); slotEl.onclick = () => window.invManager.unequipWeapon(slot); }
        } else {
            const isMain = slot.includes("_main");
            const partnerSlot = isMain ? slot.replace("_main", "_off") : slot.replace("_off", "_main");
            const partnerWeaponObj = eq.weapons.find(w => w.equipSlot === partnerSlot);

            let isBlockedBy2H = false;
            if (partnerWeaponObj) {
                const partnerDbItem = ALL_ITEMS_MAP[partnerWeaponObj.key];
                const canWield2HInOneHand = charData.selectedFeats && charData.selectedFeats["titan_grip"];
                if (partnerDbItem && partnerDbItem.properties && partnerDbItem.properties.includes("Двуручное") && !canWield2HInOneHand) {
                    isBlockedBy2H = true;
                }
            }

            if (isBlockedBy2H) {
                disp.innerHTML = `<span style="color:var(--accent-yellow); font-style:italic;">Занято (Двуручное)</span>`;
                if (slotEl) { slotEl.setAttribute("data-inspector", `Этот слот занят, так как в другой руке находится двуручное оружие.`); slotEl.onclick = null; }
            } else {
                disp.innerHTML = `<span style="color:var(--text-muted);">Пусто</span>`;
                if (slotEl) { slotEl.setAttribute("data-inspector", `Свободный слот для оружия`); slotEl.onclick = null; }
            }
        }
    });
}

function equipWeaponToSlot(instanceId, equipSlot) {
    const itemIndex = charData.inventory.storage.findIndex(i => i.instanceId === instanceId);
    if (itemIndex === -1) return;

    const invItem = charData.inventory.storage[itemIndex];
    const dbItem = ALL_ITEMS_MAP[invItem.key];

    const is2H = dbItem && dbItem.properties && dbItem.properties.includes("Двуручное");
    const canWield2HInOneHand = charData.selectedFeats && charData.selectedFeats["titan_grip"];
    const isMain = equipSlot.includes("_main");
    const partnerSlot = isMain ? equipSlot.replace("_main", "_off") : equipSlot.replace("_off", "_main");

    const unequipSilently = (slot) => {
        const oldWeaponIdx = charData.inventory.equipped.weapons.findIndex(w => w.equipSlot === slot);
        if (oldWeaponIdx > -1) {
            const oldWeapon = charData.inventory.equipped.weapons.splice(oldWeaponIdx, 1)[0];
            delete oldWeapon.equipSlot;
            const existing = charData.inventory.storage.find(i => i.key === oldWeapon.key && i.charges === oldWeapon.charges);
            if (existing) existing.count += oldWeapon.count;
            else charData.inventory.storage.push(oldWeapon);
        }
    };

    if (is2H && !canWield2HInOneHand) {
        unequipSilently(partnerSlot);
    }

    const partnerWeaponObj = charData.inventory.equipped.weapons.find(w => w.equipSlot === partnerSlot);
    if (partnerWeaponObj) {
        const partnerDbItem = ALL_ITEMS_MAP[partnerWeaponObj.key];
        if (partnerDbItem && partnerDbItem.properties && partnerDbItem.properties.includes("Двуручное") && !canWield2HInOneHand) {
            unequipSilently(partnerSlot);
        }
    }

    unequipSilently(equipSlot);

    let itemToMove = { ...invItem, count: 1, equipSlot: equipSlot };
    charData.inventory.equipped.weapons.push(itemToMove);
    window.invManager._reduceOrRemoveFromStorage(itemIndex, invItem, 1);

    syncAllSkillsUI();
    renderInventoryUI();
}

window.openWeaponEquipModal = function(instanceId) {
    const modal = document.getElementById("weaponEquipModal"); if (!modal) return;
    const getWName = (slot) => {
        const w = charData.inventory.equipped.weapons.find(w => w.equipSlot === slot);
        if(!w) {
            const isMain = slot.includes("_main");
            const partnerSlot = isMain ? slot.replace("_main", "_off") : slot.replace("_off", "_main");
            const partnerW = charData.inventory.equipped.weapons.find(pw => pw.equipSlot === partnerSlot);
            if (partnerW) {
                const partnerDb = ALL_ITEMS_MAP[partnerW.key];
                const canWield2HInOneHand = charData.selectedFeats && charData.selectedFeats["titan_grip"];
                if (partnerDb && partnerDb.properties && partnerDb.properties.includes("Двуручное") && !canWield2HInOneHand) {
                    return "Занято двуручным";
                }
            }
            return "Пусто";
        }
        const dbItem = ALL_ITEMS_MAP[w.key]; return dbItem ? dbItem.name : "Пусто";
    };

    document.getElementById("weq_set1_main").innerText = `Правая (${getWName('set1_main')})`; document.getElementById("weq_set1_off").innerText = `Левая (${getWName('set1_off')})`;
    document.getElementById("weq_set2_main").innerText = `Правая (${getWName('set2_main')})`; document.getElementById("weq_set2_off").innerText = `Левая (${getWName('set2_off')})`;
    modal.classList.add("visible");

    const setupBtn = (btnId, slotName) => { document.getElementById(btnId).onclick = () => { equipWeaponToSlot(instanceId, slotName); modal.classList.remove("visible"); }; };
    setupBtn("weq_set1_main", "set1_main"); setupBtn("weq_set1_off", "set1_off"); setupBtn("weq_set2_main", "set2_main"); setupBtn("weq_set2_off", "set2_off");
    document.getElementById("weaponEquipCancelBtn").onclick = () => modal.classList.remove("visible");
};

window.openRingReplaceModal = function(instanceId) {
    const modal = document.getElementById("ringReplaceModal"); if (!modal) return;
    const rings = charData.inventory.equipped.rings; const n1 = ALL_ITEMS_MAP[rings[0].key]; const n2 = ALL_ITEMS_MAP[rings[1].key];
    document.getElementById("ringReplaceBtn_0").innerText = `Снять: ${n1 ? n1.name : 'Кольцо 1'}`; document.getElementById("ringReplaceBtn_1").innerText = `Снять: ${n2 ? n2.name : 'Кольцо 2'}`;
    modal.classList.add("visible");
    const setupBtn = (btnId, index) => {
        document.getElementById(btnId).onclick = () => {
            const oldRing = rings.splice(index, 1)[0]; const existing = charData.inventory.storage.find(i => i.key === oldRing.key && i.charges === oldRing.charges);
            if (existing) existing.count += oldRing.count; else charData.inventory.storage.push({ ...oldRing });
            const itemIndex = charData.inventory.storage.findIndex(i => i.instanceId === instanceId);
            const invItem = charData.inventory.storage[itemIndex]; let itemToMove = { ...invItem, count: 1 };
            rings.splice(index, 0, itemToMove); window.invManager._reduceOrRemoveFromStorage(itemIndex, invItem, 1);
            renderInventoryUI(); modal.classList.remove("visible");
        };
    };
    setupBtn("ringReplaceBtn_0", 0); setupBtn("ringReplaceBtn_1", 1);
    document.getElementById("ringReplaceCancelBtn").onclick = () => modal.classList.remove("visible");
};

window.deleteItem = function(listType, idx, isList) { const targetArray = isList ? charData.inventory.lists[listType] : charData.inventory.storage; targetArray.splice(idx, 1); renderInventoryUI(); };
window.updateItemCountManual = function(listType, idx, isList, val) { const targetArray = isList ? charData.inventory.lists[listType] : charData.inventory.storage; const itemObj = targetArray[idx]; let newCount = parseInt(val); if (isNaN(newCount) || newCount < 0) newCount = 0; itemObj.count = newCount; if (itemObj.count <= 0) targetArray.splice(idx, 1); renderInventoryUI(); };
window.changeItemCount = function(listType, idx, delta, isList = false) { const targetArray = isList ? charData.inventory.lists[listType] : charData.inventory.storage; const itemObj = targetArray[idx]; itemObj.count += delta; if (itemObj.count <= 0) targetArray.splice(idx, 1); renderInventoryUI(); };
window.updateItemChargesManual = function(listType, idx, isList, val) {
    const targetArray = isList ? charData.inventory.lists[listType] : charData.inventory.storage; const itemObj = targetArray[idx]; const dbItem = ALL_ITEMS_MAP[itemObj.key];
    let newCharges = parseInt(val); if (isNaN(newCharges) || newCharges < 0) newCharges = 0; if (dbItem.maxCharges && newCharges > dbItem.maxCharges) newCharges = dbItem.maxCharges;
    itemObj.charges = newCharges;
    if (itemObj.charges <= 0) { if (dbItem.consumableWithCharges) { if (itemObj.count > 1) { itemObj.count -= 1; itemObj.charges = dbItem.maxCharges; } else targetArray.splice(idx, 1); } else itemObj.charges = 0; }
    renderInventoryUI();
};
window.changeItemCharges = function(listType, idx, delta, isList = false) {
    const targetArray = isList ? charData.inventory.lists[listType] : charData.inventory.storage; const itemObj = targetArray[idx]; const dbItem = ALL_ITEMS_MAP[itemObj.key];
    if (itemObj.charges === undefined && dbItem.maxCharges) itemObj.charges = dbItem.maxCharges;
    if (itemObj.charges !== undefined && dbItem.maxCharges) {
        itemObj.charges += delta; if (itemObj.charges > dbItem.maxCharges) itemObj.charges = dbItem.maxCharges;
        if (itemObj.charges <= 0) { if (dbItem.consumableWithCharges) { if (itemObj.count > 1) { itemObj.count -= 1; itemObj.charges = dbItem.maxCharges; } else targetArray.splice(idx, 1); } else itemObj.charges = 0; }
    }
    renderInventoryUI();
};

let cart = []; let itemPickerMode = 'items';
function attachBackpackEventListeners() {
    document.getElementById("addStorageBtn")?.addEventListener("click", openItemPickerModal);
    document.getElementById("itemPickerCancelBtn")?.addEventListener("click", () => document.getElementById("itemPickerModal").classList.remove("visible"));
    document.getElementById("itemPickerConfirmBtn")?.addEventListener("click", applyCartItems);
    document.getElementById("itemSearchInput")?.addEventListener("input", renderModalSearchList);
    document.getElementById("swapWeaponsBtn")?.addEventListener("click", () => {
        charData.inventory.equipped.activeSet = charData.inventory.equipped.activeSet === 1 ? 2 : 1;
        renderEquippedSlots();
        syncAllSkillsUI();
        document.dispatchEvent(new Event('charDataUpdated'));
    });
}

function openItemPickerModal() {
    const modal = document.getElementById("itemPickerModal"); const searchInput = document.getElementById("itemSearchInput"); if (searchInput) searchInput.value = "";
    cart = []; itemPickerMode = 'items'; renderModalSearchList(); renderCart(); modal.classList.add("visible");
}

function renderModalSearchList() {
    const listContainer = document.getElementById("modalItemsList"); const searchInput = document.getElementById("itemSearchInput"); const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    if (itemPickerMode === 'spells') {
        const spellsToShow = Object.keys(spellsData).filter(key => spellsData[key].name.toLowerCase().includes(query)).sort((a, b) => spellsData[a].name.localeCompare(spellsData[b].name, 'ru'));
        let html = `<div style="padding: 10px; text-align: center; color: var(--accent-yellow); border-bottom: 1px solid var(--border-color); font-weight:bold;">Выберите заклинание для свитка:</div>`;
        spellsToShow.forEach(sk => { const sp = spellsData[sk]; const lvlStr = sp.level === 0 ? 'Заговор' : sp.level + ' ур.'; html += `<div class="spell-picker-row interactive-node" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="window.addScrollToCart('${sk}')"><div class="spell-picker-name">${sp.name} <br><small style="color:var(--text-muted);">${lvlStr}</small></div><span style="font-size: 16px; color: var(--accent-success); font-weight: bold; padding: 0 10px;">+</span></div>`; });
        listContainer.innerHTML = html; return;
    }
    const itemsToShow = Object.keys(ALL_ITEMS_MAP).filter(key => (ALL_ITEMS_MAP[key].name || "").toLowerCase().includes(query)).sort((a, b) => ALL_ITEMS_MAP[a].name.localeCompare(ALL_ITEMS_MAP[b].name, 'ru'));
    if (itemsToShow.length === 0) { listContainer.innerHTML = `<p class="font-group-3 text-center" style="padding: 20px; color: var(--text-muted); font-style: italic;">Предметы не найдены.</p>`; return; }
    listContainer.innerHTML = itemsToShow.map(key => {
        const item = ALL_ITEMS_MAP[key]; const clickAction = key === 'spell_scroll_base' ? 'window.openScrollSpellPicker()' : `window.addToCart('${key}')`;
        return `<div class="spell-picker-row interactive-node" data-inspector="${formatInspector(item)}" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onclick="${clickAction}"><div class="spell-picker-name">${item.name} <br><small style="color:var(--text-muted);">${item.cost || '0 ЗМ'}</small></div><span style="font-size: 16px; color: var(--accent-success); font-weight: bold; padding: 0 10px;">+</span></div>`;
    }).join('');
    if (typeof window.initGlobalInspector === "function") window.initGlobalInspector();
}

window.openScrollSpellPicker = function() { itemPickerMode = 'spells'; const searchInput = document.getElementById("itemSearchInput"); if (searchInput) searchInput.value = ""; renderModalSearchList(); };
window.addScrollToCart = function(spellKey) { const scrollKey = `spell_scroll_${spellKey}`; if (!ALL_ITEMS_MAP[scrollKey]) ALL_ITEMS_MAP[scrollKey] = createScrollDbItem(spellKey); window.addToCart(scrollKey); itemPickerMode = 'items'; const searchInput = document.getElementById("itemSearchInput"); if (searchInput) searchInput.value = ""; renderModalSearchList(); };
window.addToCart = function(key) { const existing = cart.find(i => i.key === key); if (existing) existing.qty += 1; else cart.push({ key: key, qty: 1 }); renderCart(); };
window.removeFromCart = function(index) { if (cart[index].qty > 1) cart[index].qty -= 1; else cart.splice(index, 1); renderCart(); };

function renderCart() {
    const cartContainer = document.getElementById("cartItemsList"); const totalCostEl = document.getElementById("cartTotalCost");
    if (cart.length === 0) { cartContainer.innerHTML = `<p class="font-group-3 text-center" style="padding: 20px; color: var(--text-muted); font-style: italic; font-size: 13px;">Корзина пуста.</p>`; totalCostEl.innerText = "0 ЗМ"; return; }
    let html = ""; let totalCp = 0;
    cart.forEach((cartItem, idx) => {
        const dbItem = ALL_ITEMS_MAP[cartItem.key]; totalCp += (dbItem.costInCp || 0) * cartItem.qty;
        html += `<div class="interactive-node" data-inspector="${formatInspector(dbItem)}" style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 8px 10px; border-radius: 6px; border: 1px solid var(--border-color);"><div style="flex: 1; min-width: 0; padding-right: 8px;"><div style="font-size: 13px; color: var(--text-color); font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${dbItem.name}</div><div style="font-size: 11px; color: var(--accent-yellow);">${dbItem.cost} <span style="color: var(--text-muted);">x${cartItem.qty} шт.</span></div></div><button class="step-btn minus" style="width: 24px; height: 24px;" onclick="event.stopPropagation(); window.removeFromCart(${idx})">✕</button></div>`;
    });
    cartContainer.innerHTML = html; totalCostEl.innerText = formatCurrencyFromCp(totalCp);
    if (typeof window.initGlobalInspector === "function") window.initGlobalInspector();
}

function applyCartItems() {
    cart.forEach(cartItem => {
        const dbItem = ALL_ITEMS_MAP[cartItem.key]; const qty = cartItem.qty;
        const existing = charData.inventory.storage.find(i => i.key === cartItem.key && (i.charges === undefined || i.charges === dbItem.maxCharges));
        if (existing) existing.count += qty; else { const newItem = { key: cartItem.key, count: qty, instanceId: Date.now() + Math.random() }; if (dbItem.maxCharges) newItem.charges = dbItem.maxCharges; charData.inventory.storage.push(newItem); }
    });
    document.getElementById("itemPickerModal").classList.remove("visible"); renderInventoryUI();
}

function formatInspector(item) { if (!item) return ""; let html = `<b>${item.name}</b><br>`; if (item.description) html += item.description; return html.replace(/"/g, '&quot;'); }

export function calculateAndDisplayWeight() {
    let totalWeight = 0;
    const getW = (itemObj) => { const dbItem = ALL_ITEMS_MAP[itemObj.key]; if (!dbItem) return 0; let baseW = dbItem.singleWeight * itemObj.count; if (dbItem.maxCharges && dbItem.consumableWithCharges && itemObj.charges !== undefined) baseW = (dbItem.singleWeight / dbItem.maxCharges) * itemObj.charges * itemObj.count; return baseW; };
    charData.inventory.storage.forEach(i => { totalWeight += getW(i); });
    Object.values(charData.inventory.lists).forEach(list => { list.forEach(i => { totalWeight += getW(i); }); });
    ['head', 'armor', 'cloak', 'amulet', 'bracers', 'belt', 'boots'].forEach(slot => { if(charData.inventory.equipped[slot]) totalWeight += getW(charData.inventory.equipped[slot]); });
    charData.inventory.equipped.rings.forEach(i => { totalWeight += getW(i); }); charData.inventory.equipped.weapons.forEach(i => { totalWeight += getW(i); });

    const c = charData.inventory.currency || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }; const coinCount = c.cp + c.sp + c.ep + c.gp + c.pp; totalWeight += coinCount / 50;
    const strVal = charData.stats?.str?.val || 10; const size = charData.origin?.size || "Средний";
    let multiplier = 15; if (size === "Крошечный") multiplier = 7.5; else if (size === "Большой") multiplier = 30; else if (size === "Огромный") multiplier = 60; else if (size === "Гигантский") multiplier = 120;
    const maxCapacity = strVal * multiplier; const pushCapacity = maxCapacity * 2;
    const displayEl = document.getElementById("weightCounterDisplay"); const statusLabel = document.getElementById("capacityStatusLabel"); const sizeEl = document.getElementById("backpackSizeDisplay"); const pushEl = document.getElementById("pushCounterDisplay");
    if (displayEl) displayEl.innerHTML = `${Math.round(totalWeight * 100)/100} / ${maxCapacity} фнт.`;
    if (pushEl) pushEl.innerHTML = `до ${pushCapacity} фнт.`;
    if (statusLabel) { if (totalWeight > maxCapacity) { statusLabel.innerText = "ПЕРЕГРУЗ!"; statusLabel.style.color = "var(--accent)"; } else { statusLabel.innerText = "В норме"; statusLabel.style.color = "var(--accent-success)"; } }
    if (sizeEl) sizeEl.innerText = size;
}