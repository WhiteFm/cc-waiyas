// ==========================================
// КОНТРОЛЛЕР ВКЛАДКИ ЗАКЛИНАНИЙ (magicbookTab.js)
// ==========================================

import { charData } from '../../saves/tempSave.js';
import { spellsData } from '../data/magicbookData.js';
import {
    ensureMagicBookStructure, getPrimaryCasterMetrics, getSecondaryCasterMetrics,
    getAvailableSpellSlots, getSpellLimits
} from '../scripts/magicbookScript.js';
import { initInspector } from './infoTab.js';

export function initMagicbookTab() {
    ensureMagicBookStructure();

    if (charData.magic && Object.keys(charData.magic.slotsUsed || {}).length === 0) {
        charData.magic.bonusSlots = {};
    }

    renderCasterStats();
    renderSorceryPoints();
    renderSpellSlots();
    renderSpellTables();
    attachMagicbookListeners();
    initInspector();
}

function renderCasterStats() {
    const primary = getPrimaryCasterMetrics();
    const secondary = getSecondaryCasterMetrics();
    const limits = getSpellLimits();

    const pBox = document.getElementById("primaryCasterBox");
    if (pBox) {
        pBox.style.opacity = primary.isCaster ? "1" : "0.4";
        document.getElementById("mb_primary_stat").innerText = primary.statName;
        document.getElementById("mb_primary_mod").innerText = (primary.mod >= 0 ? "+" : "") + primary.mod;
        document.getElementById("mb_primary_dc").innerText = primary.dc || "—";
        document.getElementById("mb_primary_attack").innerText = (primary.attack >= 0 ? "+" : "") + primary.attack;
    }

    const secSel = document.getElementById("mb_secondary_select");
    if (secSel) {
        secSel.value = charData.magic.secondaryStatKey;
        document.getElementById("mb_secondary_mod").innerText = secondary.isCaster ? (secondary.mod >= 0 ? "+" : "") + secondary.mod : "—";
        document.getElementById("mb_secondary_dc").innerText = secondary.isCaster ? secondary.dc : "—";
        document.getElementById("mb_secondary_attack").innerText = secondary.isCaster ? (secondary.attack >= 0 ? "+" : "") + secondary.attack : "—";
    }

    if (document.getElementById("mb_cantrips_limit")) {
        document.getElementById("mb_cantrips_limit").innerText = `${limits.cantrips.current} / ${limits.cantrips.max}`;
        document.getElementById("mb_spells_limit").innerText = `${limits.spells.current} / ${limits.spells.max}`;
    }
}

function renderSorceryPoints() {
    const box = document.getElementById("sorceryPointsBox");
    if (!box) return;

    const isSorc = charData.origin?.classKey === "sorcerer" && charData.origin?.level >= 2;

    if (isSorc) {
        box.style.display = "block";
        box.style.opacity = "1";
        box.style.pointerEvents = "auto";
        if (charData.magic.sorceryPoints === undefined) charData.magic.sorceryPoints = charData.origin.level;

        box.innerHTML = `
            <div style="background: rgba(0,0,0,0.2); border-left: 3px solid var(--accent-yellow); padding: 12px 15px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div>
                    <div style="font-size: 15px; font-weight: bold; color: var(--accent-yellow); margin-bottom: 4px;">Источник магии (Чародей)</div>
                    <div style="font-size: 12px; color: var(--text-muted);">Очки чародейства: <b style="color:var(--text-color); font-size: 14px;">${charData.magic.sorceryPoints}</b> / ${charData.origin.level}</div>
                </div>
                <button class="step-btn" onclick="window.openSorceryModal()" style="width: auto; padding: 8px 18px; height: auto; font-weight: bold; background: linear-gradient(135deg, var(--accent-yellow), #d4af37); color: #0a0d14; border: none; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); font-size: 13px; transition: 0.2s;" onmouseover="this.style.filter='brightness(1.2)'" onmouseout="this.style.filter='brightness(1)'">Управление</button>
            </div>
        `;
    } else {
        box.style.display = "none";
    }
}

window.openSorceryModal = function() {
    let modal = document.getElementById("sorceryModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "sorceryModal";
        modal.className = "modal-overlay";
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 420px; text-align: center; border: 1px solid var(--accent-yellow); background: var(--panel-bg);">
                <h3 class="font-group-1" style="color: var(--accent-yellow); margin-top: 0; font-size: 22px;">Очки чародейства</h3>
                <p class="font-group-3" style="color: var(--text-muted); font-size: 13px;">Используются для создания бонусных ячеек заклинаний и применения Метамагии.</p>
                <div style="font-size: 32px; font-weight: 900; color: var(--accent-success); margin: 20px 0; text-shadow: 0 0 10px rgba(46, 196, 182, 0.4);">
                    <span id="sorceryPointsCurrent">0</span> <span style="color:var(--text-muted); font-size:24px;">/</span> <span id="sorceryPointsMax" style="color:var(--text-color); font-size:24px;">0</span>
                </div>
                <hr style="border-color: rgba(255,255,255,0.1); margin: 20px 0;">
                <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                    <div style="flex: 1; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                        <h4 style="margin: 0 0 12px 0; color: var(--accent-success); font-size: 14px;">Создать ячейку</h4>
                        <select id="createSlotLevel" class="input-field font-group-3" style="margin-bottom: 15px; text-align: center;">
                            <option value="1">1 ур. (2 очка)</option>
                            <option value="2">2 ур. (3 очка)</option>
                            <option value="3">3 ур. (5 очков)</option>
                            <option value="4">4 ур. (6 очков)</option>
                            <option value="5">5 ур. (7 очков)</option>
                        </select>
                        <button class="modal-btn" onclick="window.convertSpToSlot()" style="background: var(--accent-success); color: #0a0d14; width: 100%; font-weight: bold;">Создать</button>
                    </div>
                    <div style="flex: 1; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                        <h4 style="margin: 0 0 12px 0; color: var(--accent); font-size: 14px;">Разобрать ячейку</h4>
                        <select id="burnSlotLevel" class="input-field font-group-3" style="margin-bottom: 15px; text-align: center;">
                            <option value="1">1 ур. (+1 очко)</option>
                            <option value="2">2 ур. (+2 очка)</option>
                            <option value="3">3 ур. (+3 очка)</option>
                            <option value="4">4 ур. (+4 очка)</option>
                            <option value="5">5 ур. (+5 очков)</option>
                        </select>
                        <button class="modal-btn" onclick="window.convertSlotToSp()" style="background: var(--accent); color: #0a0d14; width: 100%; font-weight: bold;">Разобрать</button>
                    </div>
                </div>
                <button class="modal-btn" onclick="document.getElementById('sorceryModal').classList.remove('visible')">Закрыть</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    window.updateSorceryModalUI();
    modal.classList.add("visible");
};

window.updateSorceryModalUI = function() {
    if (!charData.magic) charData.magic = { slotsUsed: {}, sorceryPoints: 0 };
    const maxSp = charData.origin.classKey === 'sorcerer' && charData.origin.level >= 2 ? charData.origin.level : 0;

    document.getElementById("sorceryPointsCurrent").innerText = charData.magic.sorceryPoints;
    document.getElementById("sorceryPointsMax").innerText = maxSp;
    renderSorceryPoints();
};

window.convertSpToSlot = function() {
    const level = parseInt(document.getElementById("createSlotLevel").value);
    const costs = {1:2, 2:3, 3:5, 4:6, 5:7};
    const cost = costs[level];

    if (charData.magic.sorceryPoints < cost) {
        alert("Недостаточно Очков чародейства!");
        return;
    }

    charData.magic.sorceryPoints -= cost;

    if (!charData.magic.bonusSlots) charData.magic.bonusSlots = {};
    charData.magic.bonusSlots[level] = (charData.magic.bonusSlots[level] || 0) + 1;

    window.updateSorceryModalUI();
    renderSpellSlots();
    document.dispatchEvent(new Event('charDataUpdated'));
};

window.convertSlotToSp = function() {
    const level = parseInt(document.getElementById("burnSlotLevel").value);
    const maxSp = charData.origin.classKey === 'sorcerer' && charData.origin.level >= 2 ? charData.origin.level : 0;

    if (charData.magic.sorceryPoints >= maxSp) {
        alert("Очки чародейства уже на максимуме!");
        return;
    }

    const baseSlots = getAvailableSpellSlots();
    const baseCount = baseSlots[level - 1] || 0;
    const bonusCount = charData.magic.bonusSlots?.[level] || 0;
    const totalCount = baseCount + bonusCount;

    let foundUnused = null;
    for(let i = 0; i < totalCount; i++) {
        const slotId = `slot_lvl${level}_idx${i}`;
        if (!charData.magic.slotsUsed[slotId]) {
            foundUnused = slotId;
            break;
        }
    }

    if (!foundUnused) {
        alert("Нет доступных (не потраченных) ячеек этого уровня!");
        return;
    }

    charData.magic.slotsUsed[foundUnused] = true;
    charData.magic.sorceryPoints = Math.min(maxSp, charData.magic.sorceryPoints + level);

    window.updateSorceryModalUI();
    renderSpellSlots();
    document.dispatchEvent(new Event('charDataUpdated'));
};

function renderSpellSlots() {
    const container = document.getElementById("spellSlotsContainer");
    if (!container) return;

    if (!charData.magic.bonusSlots) charData.magic.bonusSlots = {};
    if (Object.keys(charData.magic.slotsUsed || {}).length === 0) charData.magic.bonusSlots = {};

    const baseSlots = getAvailableSpellSlots();
    let html = "";
    let hasSlots = false;

    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(auto-fit, minmax(110px, 1fr))";
    container.style.gap = "15px";
    container.style.background = "transparent";
    container.style.border = "none";
    container.style.padding = "0";

    baseSlots.forEach((baseCount, idx) => {
        const lvl = idx + 1;
        const bonusCount = charData.magic.bonusSlots[lvl] || 0;
        const totalCount = baseCount + bonusCount;

        if (totalCount > 0) {
            hasSlots = true;

            html += `
            <div style="background: var(--panel-inner); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <span style="font-family: 'Segoe UI Black', sans-serif; font-size: 13px; color: var(--accent-yellow); margin-bottom: 12px; text-transform: uppercase;">${lvl} Уровень</span>
                <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
            `;

            for (let i = 0; i < totalCount; i++) {
                const slotId = `slot_lvl${lvl}_idx${i}`;
                const isUsed = !!charData.magic.slotsUsed[slotId];
                const isBonus = i >= baseCount;

                const bg = !isUsed ? (isBonus ? "var(--accent-yellow)" : "var(--accent-success)") : "#11141a";
                const border = !isUsed ? "none" : "1px solid var(--text-muted)";
                const shadow = !isUsed ? (isBonus ? "0 0 12px rgba(224, 168, 46, 0.6)" : "0 0 10px rgba(46, 196, 182, 0.6)") : "none";

                html += `
                    <div class="spell-slot-gem" data-slot="${slotId}" data-used="${isUsed}" title="Ячейка ${lvl} уровня (${!isUsed ? 'Доступна' : 'Потрачена'})${isBonus ? ' [Бонусная]' : ''}"
                         style="width: 16px; height: 16px; border-radius: 2px; background: ${bg}; border: ${border}; box-shadow: ${shadow}; transform: rotate(45deg); cursor: pointer; transition: transform 0.2s ease, background 0.2s ease; position: relative;">
                         ${!isUsed ? `<div style="position:absolute; top:3px; left:3px; right:3px; bottom:3px; background: rgba(255,255,255,0.4); border-radius: 1px;"></div>` : ''}
                    </div>
                `;
            }
            html += `</div></div>`;
        }
    });

    if (!hasSlots) {
        container.style.display = "block";
        container.innerHTML = `<p class="font-group-3" style="color:var(--text-muted); text-align: center; padding: 20px; background: var(--panel-inner); border-radius: 8px; border: 1px solid var(--border-color);">У вас пока нет ячеек заклинаний</p>`;
        return;
    }

    container.innerHTML = html;

    container.querySelectorAll('.spell-slot-gem').forEach(gem => {
        gem.onclick = () => {
            const slotId = gem.getAttribute("data-slot");
            const currentlyUsed = gem.getAttribute("data-used") === "true";

            if (currentlyUsed) delete charData.magic.slotsUsed[slotId];
            else charData.magic.slotsUsed[slotId] = true;

            renderSpellSlots();
            document.dispatchEvent(new Event('charDataUpdated'));
        };

        gem.onmouseenter = () => { gem.style.transform = "rotate(45deg) scale(1.25)"; };
        gem.onmouseleave = () => { gem.style.transform = "rotate(45deg) scale(1)"; };
    });
}

function renderSpellTables() {
    const prepContainer = document.getElementById("preparedSpellsContainer");
    const bookContainer = document.getElementById("bookSpellsContainer");
    if (!prepContainer || !bookContainer) return;

    let prepHtml = "";
    charData.magic.prepared.forEach((key, idx) => {
        const sp = spellsData[key];
        if (sp) {
            prepHtml += `
                <div class="inventory-item-row interactive-node spell-prep-grid-row" data-inspector="<b>${sp.name}:</b><br>${sp.description}">
                    <span class="highlight-box math-val mini" style="width:28px; text-align:center;">${sp.level}</span>
                    <span class="inv-item-name spell-grid-name">${sp.name}</span>
                    <button class="step-btn minus unprep-btn" data-idx="${idx}" title="Убрать из подготовленных">✕</button>
                </div>`;
        }
    });
    prepContainer.innerHTML = prepHtml || `<p class="font-group-3 text-center" style="padding:15px; color:var(--text-muted);">Список пуст</p>`;

    let bookHtml = `
        <div style="padding: 10px; text-align: center; border-bottom: 1px solid var(--border-color); flex-shrink:0;">
            <button id="addSpellToBookBtn" class="modal-btn" style="padding: 6px 20px; font-size:13px; background:var(--accent-yellow); color:#0a0d14;">+ Добавить заклинание в книгу</button>
        </div>`;

    charData.magic.known.forEach((key, idx) => {
        const sp = spellsData[key];
        if (sp) {
            const isPrep = charData.magic.prepared.includes(key);

            let actionBtnHtml = "";
            if (sp.level === 0) {
                actionBtnHtml = `<span class="spell-status-badge cantrip-badge">Заговор</span>`;
            } else if (!isPrep) {
                actionBtnHtml = `<button class="step-btn prep-btn spell-action-btn" data-key="${key}">Подготовить</button>`;
            } else {
                actionBtnHtml = `<span class="spell-status-badge ready-badge">Готово</span>`;
            }

            bookHtml += `
                <div class="inventory-item-row interactive-node spell-book-grid-row" data-inspector="<b>${sp.name} (${sp.school}):</b><br><b>Время:</b> ${sp.time} | <b>Дистанция:</b> ${sp.range}<br><br>${sp.description}">
                    <span class="highlight-box math-val mini" style="width:28px; text-align:center;">${sp.level === 0 ? '0' : sp.level}</span>
                    <span class="inv-item-name spell-grid-name">${sp.name}</span>
                    <span class="spell-time-badge">${sp.time}</span>
                    <div class="spell-tags-box">
                        <span class="badge-tag ${sp.conc ? 'active-conc' : ''}" title="Концентрация">К</span>
                        <span class="badge-tag ${sp.ritual ? 'active-rit' : ''}" title="Ритуал">Р</span>
                        <span class="badge-tag ${sp.m ? 'active-mat' : ''}" title="Материальный компонент">М</span>
                    </div>
                    <div class="spell-controls-box">
                        ${actionBtnHtml}
                        <button class="step-btn del-spell-btn" data-idx="${idx}" title="Удалить из книги">✕</button>
                    </div>
                </div>`;
        }
    });
    bookContainer.innerHTML = bookHtml;

    prepContainer.querySelectorAll('.unprep-btn').forEach(b => b.onclick = () => { charData.magic.prepared.splice(parseInt(b.getAttribute("data-idx")), 1); renderCasterStats(); renderSpellTables(); initInspector(); });
    bookContainer.querySelectorAll('.prep-btn').forEach(b => b.onclick = () => { charData.magic.prepared.push(b.getAttribute("data-key")); renderCasterStats(); renderSpellTables(); initInspector(); });
    bookContainer.querySelectorAll('.del-spell-btn').forEach(b => b.onclick = () => {
        const removedKey = charData.magic.known[parseInt(b.getAttribute("data-idx"))];
        charData.magic.known.splice(parseInt(b.getAttribute("data-idx")), 1);
        charData.magic.prepared = charData.magic.prepared.filter(k => k !== removedKey);
        renderCasterStats(); renderSpellTables(); initInspector();
    });
    document.getElementById("addSpellToBookBtn")?.addEventListener("click", openSpellPickerModal);
}

function openSpellPickerModal() {
    const modal = document.getElementById("spellPickerModal");
    const container = document.getElementById("spellPickerContainer");
    const confirmBtn = document.getElementById("spellPickerConfirmBtn");
    const inspectorPanel = document.getElementById("spellModalInspectorPanel");
    if (!modal || !container) return;

    const classKey = charData.origin?.classKey || "wizard";
    const availableSlots = getAvailableSpellSlots();

    let maxSpellLvl = 1;
    for (let i = 0; i < availableSlots.length; i++) {
        if (availableSlots[i] > 0) maxSpellLvl = i + 1;
    }
    if (classKey === "warlock") {
        maxSpellLvl = Math.min(5, Math.ceil((charData.origin.level || 1) / 2));
    }

    const available = Object.keys(spellsData).filter(key => {
        const sp = spellsData[key];
        return !charData.magic.known.includes(key) && sp.level <= maxSpellLvl && (sp.classes.includes(classKey) || classKey === "none");
    }).sort((a,b) => spellsData[a].level === spellsData[b].level ? spellsData[a].name.localeCompare(spellsData[b].name, 'ru') : spellsData[a].level - spellsData[b].level);

    let html = "";
    let currentLvl = -1;
    available.forEach(key => {
        const sp = spellsData[key];
        if (sp.level !== currentLvl) {
            currentLvl = sp.level;
            html += `<div style="font-weight:bold; color:var(--accent-yellow); margin: 14px 0 6px 0; border-bottom:1px solid var(--border-color); flex-shrink:0;">${currentLvl === 0 ? 'Заговоры (0 уровень)' : currentLvl + ' уровень'}</div>`;
        }
        const safeDesc = window.escapeHTML ? window.escapeHTML(sp.description) : sp.description.replace(/"/g, '&quot;');
        const fullDescHtml = `<b>${sp.name} (${sp.school}, ${sp.level === 0 ? 'Заговор' : sp.level + ' уровень'})</b><br><br><b>Время сотворения:</b> ${sp.time}<br><b>Дистанция:</b> ${sp.range}<br><b>Компоненты:</b> ${[sp.v?'В':null, sp.s?'С':null, sp.m?'М':null].filter(Boolean).join(', ')}<br><b>Концентрация:</b> ${sp.conc?'Да':'Нет'} | <b>Ритуал:</b> ${sp.ritual?'Да':'Нет'}<br><br>${safeDesc}`;

        html += `
            <label class="spell-picker-row interactive-node spell-picker-item" data-full-desc="${fullDescHtml}">
                <div class="spell-picker-lvl">${sp.level}</div>
                <div class="custom-cb" style="margin:0; flex-shrink:0;">
                    <input type="checkbox" name="newSpellCb" value="${key}">
                    <span></span>
                </div>
                <div class="spell-picker-name">${sp.name}</div>
            </label>`;
    });

    container.innerHTML = html || `<p class="text-center" style="padding:20px; color:var(--text-muted);">Нет доступных заклинаний для вашего класса и уровня</p>`;
    if (inspectorPanel) {
        inspectorPanel.innerHTML = `<p style="color:var(--text-muted); font-style:italic;">Наведите мышь на заклинание в списке слева, чтобы прочитать его полное описание здесь.</p>`;
    }

    modal.classList.add("visible");

    container.querySelectorAll('.spell-picker-item').forEach(item => {
        item.onmouseenter = () => {
            if (inspectorPanel) {
                inspectorPanel.innerHTML = `<div style="text-align:justify; line-height:1.45;">${item.getAttribute("data-full-desc")}</div>`;
            }
        };
    });

    confirmBtn.onclick = () => {
        container.querySelectorAll('input[name="newSpellCb"]:checked').forEach(cb => charData.magic.known.push(cb.value));
        renderCasterStats(); renderSpellTables(); modal.classList.remove("visible"); initInspector();
        document.dispatchEvent(new Event('charDataUpdated'));
    };
}

function attachMagicbookListeners() {
    document.getElementById("mb_secondary_select")?.addEventListener("change", (e) => {
        charData.magic.secondaryStatKey = e.target.value; renderCasterStats();
        document.dispatchEvent(new Event('charDataUpdated'));
    });
    document.getElementById("spellPickerCancelBtn")?.addEventListener("click", () => document.getElementById("spellPickerModal")?.classList.remove("visible"));
}