// ==========================================
// ЛОГИКА ПРИМЕНЕНИЯ ПРЕДЫСТОРИЙ (backgroundsScript.js)
// ==========================================

import { charData } from '../../saves/tempSave.js';
import { backgroundsData } from '../data/backgroundsData.js';
import { syncStatsUI } from './statsScript.js';
import { updateFeatsSelect, renderAssignedFeats } from './attributesScript.js';
import { updateInstrumentsUI } from '../tabs/mainTab.js';

import { equipmentsData } from '../data/equipments/equipmentsData.js';
import { weaponsData } from '../data/equipments/weaponsData.js';
import { armorsData } from '../data/equipments/armorsData.js';
import { instrumentsData } from '../data/equipments/instrumentsData.js';

const STAT_NAMES = {
    str: "Сила", dex: "Ловкость", con: "Телосложение",
    int: "Интеллект", wis: "Мудрость", cha: "Харизма"
};

const TOOL_CHOICES = {
    artisan: [
        { key: "alchemists_supplies", label: "Инструменты алхимика" },
        { key: "potters_tools", label: "Инструменты гончара" },
        { key: "leatherworkers_tools", label: "Инструменты кожевника" },
        { key: "masons_tools", label: "Инструменты каменщика" },
        { key: "cartographers_tools", label: "Инструменты картографа" },
        { key: "smiths_tools", label: "Инструменты кузнеца" },
        { key: "brewers_supplies", label: "Инструменты пивовара" },
        { key: "carpenters_tools", label: "Инструменты плотника" },
        { key: "cooks_utensils", label: "Инструменты повара" },
        { key: "woodcarvers_tools", label: "Инструменты резчика по дереву" },
        { key: "cobblers_tools", label: "Инструменты сапожника" },
        { key: "glassblowers_tools", label: "Инструменты стеклодува" },
        { key: "weavers_tools", label: "Инструменты ткача" },
        { key: "painters_supplies", label: "Инструменты художника" },
        { key: "jewelers_tools", label: "Инструменты ювелира" }
    ],
    music: [
        { key: "inst_drum", label: "Барабан" },
        { key: "inst_bagpipes", label: "Волынка" },
        { key: "inst_viol", label: "Виола" },
        { key: "inst_lute", label: "Лютня" },
        { key: "inst_lyre", label: "Лира" },
        { key: "inst_horn", label: "Рожок" },
        { key: "inst_flute", label: "Флейта" },
        { key: "inst_pan_flute", label: "Флейта Пана" },
        { key: "inst_dulcimer", label: "Цимбалы" },
        { key: "inst_shawm", label: "Шалмей" }
    ],
    game: [
        { key: "game_dice", label: "Кости" },
        { key: "game_cards", label: "Карты" },
        { key: "game_dragon_chess", label: "Шахматы дракона" },
        { key: "game_three_dragon_ante", label: "Ставка трёх драконов" }
    ]
};

function findItemKeyByName(ruName) {
    const cleanName = ruName.split(' (')[0].trim();
    const all = {...equipmentsData, ...weaponsData, ...armorsData, ...instrumentsData};
    for (let key in all) {
        if (all[key].name.toLowerCase() === cleanName.toLowerCase()) return key;
    }
    return null;
}

export function openBackgroundModal(bgKey) {
    const bg = backgroundsData[bgKey];
    if (!bg) return;

    const modal = document.getElementById("backgroundModal");
    const container = document.getElementById("backgroundModalBody");
    if (!modal || !container) return;

    let statsHtml = `
        <div class="form-group" style="margin-bottom: 16px;">
            <label class="font-group-2" style="color: var(--accent-yellow);">Увеличение характеристик:</label>
            <div style="display:flex; gap:12px; margin-bottom:8px;">
                <label class="custom-cb"><input type="radio" name="statBoostMode" value="2_1" checked><span></span> +2 к одной и +1 к другой</label>
                <label class="custom-cb"><input type="radio" name="statBoostMode" value="1_1_1"><span></span> +1 к трём разным</label>
            </div>
            <div id="statSelectBox" style="display:flex; gap:10px; flex-wrap:wrap; background:var(--panel-inner); padding:10px; border-radius:6px;">
                <div style="flex:1;">
                    <span style="font-size:12px; color:var(--text-muted);">Характеристика +2:</span>
                    <select id="statPlus2" class="input-field">
                        ${bg.stats.map(s => `<option value="${s}">${STAT_NAMES[s]}</option>`).join('')}
                    </select>
                </div>
                <div style="flex:1;">
                    <span style="font-size:12px; color:var(--text-muted);">Характеристика +1:</span>
                    <select id="statPlus1" class="input-field">
                        ${bg.stats.map(s => `<option value="${s}">${STAT_NAMES[s]}</option>`).join('')}
                    </select>
                </div>
            </div>
        </div>
    `;

    let toolHtml = "";
    if (bg.needsToolChoice && TOOL_CHOICES[bg.needsToolChoice]) {
        const opts = TOOL_CHOICES[bg.needsToolChoice].map(t => `<option value="${t.key}">${t.label}</option>`).join('');
        toolHtml = `
            <div class="form-group" style="margin-bottom: 16px;">
                <label class="font-group-2" style="color: var(--accent-yellow);">Уточнение инструмента (${bg.tools}):</label>
                <select id="customToolChoice" class="input-field">${opts}</select>
            </div>`;
    }

    let skillsDisplay = bg.skillsRu.map((skName, i) => {
        const skKey = bg.skills[i];
        const isProf = charData.skills[skKey]?.state > 0;
        return isProf ? `<span style="color: var(--text-muted); text-decoration: line-through;" title="Владение уже получено другим способом">${skName}</span>` : `<span style="color: var(--accent-success);">${skName}</span>`;
    }).join(', ');

    container.innerHTML = `
        <h3 class="font-group-1" style="color:var(--accent-yellow); margin-bottom:10px;">${bg.name}</h3>
        <p class="font-group-3" style="margin-bottom:15px; text-align:justify;">${bg.description}</p>

        <div style="background:#11141a; padding:10px; border-radius:6px; margin-bottom:16px; font-size:13px;">
            <div><b style="color:var(--accent-success);">Черта:</b> ${bg.feat}</div>
            <div><b style="color:var(--accent-success);">Навыки:</b> ${skillsDisplay}</div>
            <div><b style="color:var(--accent-success);">Инструмент:</b> ${bg.tools}</div>
        </div>

        ${statsHtml}
        ${toolHtml}

        <div class="form-group" style="margin-bottom: 20px;">
            <label class="font-group-2" style="color: var(--accent-yellow);">Снаряжение на выбор:</label>
            <div style="display:flex; flex-direction:column; gap:8px;">
                <label class="custom-cb" style="align-items:flex-start;">
                    <input type="radio" name="equipOption" value="A" checked>
                    <span style="margin-top:2px;"></span>
                    <div style="font-size:13px;">
                        <b>Набор А:</b> ${bg.equipmentA.weapons.concat(bg.equipmentA.items).join(', ')} и <b>${bg.equipmentA.gp} ЗМ</b>.
                    </div>
                </label>
                <label class="custom-cb">
                    <input type="radio" name="equipOption" value="B">
                    <span></span>
                    <div style="font-size:13px;"><b>Набор Б:</b> 50 ЗМ (без стартовых предметов).</div>
                </label>
            </div>
        </div>
    `;

    const radios = container.querySelectorAll('input[name="statBoostMode"]');
    const statBox = container.querySelector('#statSelectBox');
    radios.forEach(r => r.addEventListener('change', (e) => {
        if (e.target.value === "1_1_1") {
            statBox.innerHTML = `<p style="color:var(--accent-success); font-size:13px; margin:0;">Все три характеристики (${bg.stats.map(s => STAT_NAMES[s]).join(', ')}) будут увеличены на +1.</p>`;
        } else {
            statBox.innerHTML = `
                <div style="flex:1;">
                    <span style="font-size:12px; color:var(--text-muted);">Характеристика +2:</span>
                    <select id="statPlus2" class="input-field">${bg.stats.map(s => `<option value="${s}">${STAT_NAMES[s]}</option>`).join('')}</select>
                </div>
                <div style="flex:1;">
                    <span style="font-size:12px; color:var(--text-muted);">Характеристика +1:</span>
                    <select id="statPlus1" class="input-field">${bg.stats.map(s => `<option value="${s}">${STAT_NAMES[s]}</option>`).join('')}</select>
                </div>`;
        }
    }));

    modal.classList.add("visible");

    document.getElementById("confirmBackgroundBtn").onclick = () => {
        applyBackgroundToCharData(bgKey, container);
        modal.classList.remove("visible");
    };
}

export function revertCurrentBackground() {
    if (!charData.backgroundState) return;
    const old = charData.backgroundState;

    if (old.skillsAdded && charData.skills) {
        old.skillsAdded.forEach(sk => {
            if (charData.skills[sk] && charData.skills[sk].state === 1) {
                charData.skills[sk].state = 0;
            }
        });
    }

    if (old.toolsAdded && charData.proficiencies?.tools) {
        charData.proficiencies.tools = charData.proficiencies.tools.filter(t => {
            const tKey = typeof t === "string" ? t : t.key;
            return !old.toolsAdded.includes(tKey);
        });
    }

    if (old.featAdded && charData.feats) {
        charData.feats = charData.feats.filter(f => f !== old.featAdded);
    }

    if (old.goldAdded && charData.inventory && charData.inventory.currency) {
        charData.inventory.currency.gp = Math.max(0, (charData.inventory.currency.gp || 0) - old.goldAdded);
    }

    if (old.itemsAdded && charData.inventory && charData.inventory.storage) {
        old.itemsAdded.forEach(itemKey => {
            const idx = charData.inventory.storage.findIndex(i => i.key === itemKey);
            if (idx !== -1) {
                if (charData.inventory.storage[idx].count > 1) charData.inventory.storage[idx].count -= 1;
                else charData.inventory.storage.splice(idx, 1);
            }
        });
    }

    charData.backgroundState = null;
}

export function applyBackgroundToCharData(bgKey, container) {
    const bg = backgroundsData[bgKey];
    if (!bg) return;

    revertCurrentBackground();

    if (!charData.origin) charData.origin = {};
    charData.origin.background = bgKey;

    if (!charData.inventory) charData.inventory = {};
    if (!charData.inventory.currency) charData.inventory.currency = { gp: 0, sp: 0, cp: 0, ep: 0, pp: 0 };
    if (!charData.inventory.storage) charData.inventory.storage = [];

    const state = {
        bgKey: bgKey,
        statsApplied: {},
        skillsAdded: [],
        toolsAdded: [],
        featAdded: null,
        goldAdded: 0,
        itemsAdded: []
    };

    const statMode = container.querySelector('input[name="statBoostMode"]:checked').value;
    if (statMode === "1_1_1") {
        bg.stats.forEach(s => {
            state.statsApplied[s] = (state.statsApplied[s] || 0) + 1;
        });
    } else {
        const s2 = container.querySelector('#statPlus2')?.value || bg.stats[0];
        const s1 = container.querySelector('#statPlus1')?.value || bg.stats[1];
        state.statsApplied[s2] = (state.statsApplied[s2] || 0) + 2;
        if (s1 !== s2) {
            state.statsApplied[s1] = (state.statsApplied[s1] || 0) + 1;
        }
    }

    if (!charData.skills) charData.skills = {};
    bg.skills.forEach(sk => {
        if (!charData.skills[sk]) charData.skills[sk] = { state: 0 };
        if (charData.skills[sk].state === 0) {
            charData.skills[sk].state = 1;
            state.skillsAdded.push(sk);
        }
    });

    if (!charData.proficiencies) charData.proficiencies = { tools: [], weapons: [], armor: [], languages: [] };
    if (!charData.proficiencies.tools) charData.proficiencies.tools = [];
    const chosenToolKey = container.querySelector('#customToolChoice')?.value;

    if (chosenToolKey && !charData.proficiencies.tools.some(t => (t.key || t) === chosenToolKey)) {
        charData.proficiencies.tools.push({ key: chosenToolKey });
        state.toolsAdded.push(chosenToolKey);
    }

    if (!charData.feats) charData.feats = [];
    if (!charData.feats.includes(bg.feat)) {
        charData.feats.push(bg.feat);
        state.featAdded = bg.feat;
    }

    const equipOption = container.querySelector('input[name="equipOption"]:checked').value;
    if (equipOption === "B") {
        charData.inventory.currency.gp = (charData.inventory.currency.gp || 0) + 50;
        state.goldAdded = 50;
    } else {
        charData.inventory.currency.gp = (charData.inventory.currency.gp || 0) + bg.equipmentA.gp;
        state.goldAdded = bg.equipmentA.gp;

        const allGivenItems = bg.equipmentA.items.concat(bg.equipmentA.weapons);
        allGivenItems.forEach(ruName => {
            let itemKey = findItemKeyByName(ruName) || ruName;

            if (bg.needsToolChoice && (ruName.includes("инструменты") || ruName.includes("Игровой набор") || ruName.includes("Музыкальный инструмент"))) {
                if (chosenToolKey) itemKey = chosenToolKey;
            }

            let qty = 1;
            const qtyMatch = ruName.match(/\((\d+)\s*шт\.\)/);
            if (qtyMatch) qty = parseInt(qtyMatch[1]);

            const existing = charData.inventory.storage.find(i => i.key === itemKey);
            if (existing) existing.count += qty;
            else charData.inventory.storage.push({ key: itemKey, count: qty, instanceId: Date.now() + Math.random() });

            for(let i=0; i<qty; i++) state.itemsAdded.push(itemKey);
        });
    }

    charData.backgroundState = state;

    syncStatsUI();
    updateFeatsSelect();
    renderAssignedFeats();
    updateInstrumentsUI();

    const bgSelect = document.getElementById("backgroundSelect");
    if (bgSelect) bgSelect.value = bgKey;
}