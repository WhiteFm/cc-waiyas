// ==========================================
// СКРИПТ ВКЛАДКИ "ОСНОВНЫЕ ДАННЫЕ" (mainTab.js)
// ==========================================

import { charData } from '../../saves/tempSave.js';
import { syncStatsUI, bindStatsEventListeners, ensureCharDataStructure, levelQueue, processLevelQueue } from '../scripts/statsScript.js';
import { updateFeatsSelect, renderAssignedFeats, bindAttributesEvents, applyFeatBonuses } from '../scripts/attributesScript.js';
import { updateRacesSelect, bindRacesEvents, applyRaceBonuses } from '../scripts/racesScript.js';
import { classData } from '../data/classesData.js';
import { getDynamicClassFeatures, applyClassProficiencies } from '../scripts/classScript.js';
import { languagesData } from '../data/languagesData.js';
import { instrumentsData } from '../data/equipments/instrumentsData.js';
import { backgroundsData } from '../data/backgroundsData.js';
import { openBackgroundModal, revertCurrentBackground } from '../scripts/backgroundsScript.js';

export function initMainTab() {
    ensureCharDataStructure();
    populateClassDropdown();
    updateRacesSelect();
    updateBackgroundsSelect();

    const nameInput = document.getElementById("charName");
    if (nameInput) {
        nameInput.value = charData.origin.name || "";
        nameInput.addEventListener("input", (e) => {
            charData.origin.name = e.target.value;
            document.dispatchEvent(new Event('charDataUpdated')); // Добавлена эта строка
        });
        nameInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                charData.origin.name = e.target.value;
                nameInput.blur();
                document.dispatchEvent(new Event('charDataUpdated')); // И эта
            }
        });
    }

    bindClassEvents();
    bindStatsEventListeners();
    bindAttributesEvents();
    bindRacesEvents();
    bindLanguagesEvents();
    bindInstrumentsEvents();
    bindBackgroundsEvents();

    syncStatsUI();
    updateFeatsSelect();
    renderAssignedFeats();
    applyRaceBonuses();
    updateLanguagesUI();
    updateInstrumentsUI();

    updateSubclassDropdown(charData.origin.classKey);
    document.addEventListener('charDataUpdated', () => {
        updateSubclassDropdown(charData.origin.classKey);
        updateInstrumentsUI(); // Для обновления инструментов после левелапа
    });
}

function populateClassDropdown() {
    const classSelect = document.getElementById("classSelect");
    if (classSelect && typeof classData !== 'undefined') {
        let classHtml = `<option value="none">-- Выберите класс --</option>`;
        Object.keys(classData).sort((a, b) => classData[a].name.localeCompare(classData[b].name, 'ru')).forEach(key => {
            classHtml += `<option value="${key}">${classData[key].name}</option>`;
        });
        classSelect.innerHTML = classHtml;
        classSelect.value = charData.origin.classKey || "none";
    }
}

function bindClassEvents() {
    const classSelect = document.getElementById("classSelect");
    const subclassSelect = document.getElementById("subclassSelect");

    if (classSelect) {
        classSelect.addEventListener("change", (e) => {
            const key = e.target.value;

            if (key === "none") {
                charData.origin.classKey = "none";
                updateSubclassDropdown("none");
                syncStatsUI();
                return;
            }

            if (classData[key]) {
                openClassModal(key, classData[key]);
            }
        });
    }

    if (subclassSelect) {
        subclassSelect.addEventListener("change", (e) => {
            charData.origin.subclassKey = e.target.value;
            applyClassProficiencies();
            applyFeatBonuses();
        });
    }

    document.getElementById("classModalCancelBtn")?.addEventListener("click", () => {
        const modal = document.getElementById("classChoiceModal");
        if (modal) modal.classList.remove("visible");
        if (classSelect) classSelect.value = charData.origin.classKey || "none";
    });
}

function openClassModal(key, cls) {
    const modal = document.getElementById("classChoiceModal");
    const title = document.getElementById("classModalTitle");
    const desc = document.getElementById("classModalDesc");
    const confirmBtn = document.getElementById("classModalConfirmBtn");

    if (!modal || !desc) return;

    title.innerText = cls.name;

    let fullDesc = `<p style="margin-bottom: 15px; text-align: justify;">${cls.description || "Описание отсутствует."}</p>`;

    fullDesc += `<div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 6px; border-left: 3px solid var(--accent-success); margin-bottom: 15px;">`;
    fullDesc += `<h4 style="color: var(--accent-success); margin-bottom: 10px; margin-top: 0;">Характеристики класса:</h4>`;
    fullDesc += `<div style="margin-bottom: 8px; font-size: 13.5px;"><b style="color:var(--accent-yellow);">Кость хитов:</b> 1${cls.hitDice} за уровень</div>`;
    fullDesc += `<div style="margin-bottom: 8px; font-size: 13.5px;"><b style="color:var(--accent-yellow);">Основная характеристика:</b> ${cls.primaryStat || "Нет"}</div>`;

    const saves = (cls.saves || []).map(s => {
        const names = { str: "Сила", dex: "Ловкость", con: "Телосложение", int: "Интеллект", wis: "Мудрость", cha: "Харизма" };
        return names[s] || s;
    }).join(", ");
    if (saves) fullDesc += `<div style="margin-bottom: 8px; font-size: 13.5px;"><b style="color:var(--accent-yellow);">Спасброски:</b> ${saves}</div>`;

    fullDesc += `</div>`;

    const features = getDynamicClassFeatures(key, "none", 1);
    if (features.length > 0) {
        fullDesc += `<div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 6px; border-left: 3px solid var(--accent); margin-bottom: 15px;">`;
        fullDesc += `<h4 style="color: var(--accent); margin-bottom: 10px; margin-top: 0;">Умения 1-го уровня:</h4>`;
        features.forEach(f => {
            fullDesc += `<div style="margin-bottom: 8px; font-size: 13.5px; text-align: justify;"><b style="color:var(--accent-yellow);">${f.name}:</b> ${f.description}</div>`;
        });
        fullDesc += `</div>`;
    }

    desc.innerHTML = fullDesc;
    modal.classList.add("visible");

    const newConfirm = confirmBtn.cloneNode(true);
    confirmBtn.replaceWith(newConfirm);

    newConfirm.onclick = () => {
        charData.origin.classKey = key;
        if (cls.hitDice) charData.hitDice.type = cls.hitDice;
        charData.origin.subclassKey = "none";

        ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(s => charData.stats[s].saveProf = false);
        if (cls.saves) {
            cls.saves.forEach(s => { if (charData.stats[s]) charData.stats[s].saveProf = true; });
        }

        updateSubclassDropdown(key);
        applyClassProficiencies();
        applyFeatBonuses();

        // ВАЖНО: Вызов окна 1-го уровня для распределения стартовых навыков и инвентаря
        charData.origin.level = 0; // Временно сбрасываем, чтобы сымитировать рост
        levelQueue.push(1);
        processLevelQueue();

        modal.classList.remove("visible");
    };
}

function updateSubclassDropdown(classKey) {
    const subclassSelect = document.getElementById("subclassSelect");
    if (!subclassSelect) return;

    const level = charData.origin.level || 1;

    if (classKey === "none" || !classData[classKey] || level < 3) {
        subclassSelect.innerHTML = `<option value="none">Нет (Доступно с 3-го уровня)</option>`;
        subclassSelect.disabled = true;
        charData.origin.subclassKey = "none";
    } else {
        subclassSelect.disabled = false;
        let html = `<option value="none">-- Выберите подкласс --</option>`;
        const subclasses = classData[classKey].subclasses || {};
        Object.keys(subclasses).forEach(subKey => {
            html += `<option value="${subKey}">${subclasses[subKey].name}</option>`;
        });
        subclassSelect.innerHTML = html;
        subclassSelect.value = charData.origin.subclassKey || "none";
    }
}

export function updateBackgroundsSelect() {
    const bgSelect = document.getElementById("backgroundSelect");
    if (!bgSelect) return;

    let html = `<option value="none">-- Выберите предысторию --</option>`;
    Object.keys(backgroundsData).sort((a, b) => backgroundsData[a].name.localeCompare(backgroundsData[b].name, 'ru')).forEach(key => {
        html += `<option value="${key}">${backgroundsData[key].name}</option>`;
    });
    bgSelect.innerHTML = html;
    bgSelect.value = charData.origin.background || "none";
}

function bindBackgroundsEvents() {
    const bgSelect = document.getElementById("backgroundSelect");
    const modal = document.getElementById("backgroundModal");

    if (bgSelect) {
        bgSelect.addEventListener("change", (e) => {
            if (e.target.value !== "none") {
                openBackgroundModal(e.target.value);
            } else {
                revertCurrentBackground();
                charData.origin.background = "none";
                syncStatsUI();
                renderAssignedFeats();
                updateInstrumentsUI();
            }
        });
    }

    if (modal) {
        document.getElementById("cancelBackgroundBtn")?.addEventListener("click", () => {
            modal.classList.remove("visible");
            if (bgSelect) bgSelect.value = charData.origin.background || "none";
        });
    }
}

export function updateLanguagesUI() {
    const langSelect = document.getElementById("languageSelect");
    const selectedBox = document.getElementById("selectedLanguagesList");
    if (!langSelect || !selectedBox) return;

    if (!charData.proficiencies.languages) charData.proficiencies.languages = [];
    const knownLangs = charData.proficiencies.languages;
    const categories = { "Обычные языки": [], "Редкие языки": [], "Остальные языки": [] };

    Object.keys(languagesData).forEach(key => {
        if (!knownLangs.includes(key)) {
            const lang = languagesData[key];
            if (categories[lang.category]) categories[lang.category].push({ key, ...lang });
        }
    });

    let selectHtml = `<option value="none">-- Выберите язык --</option>`;
    Object.keys(categories).forEach(catName => {
        if (categories[catName].length > 0) {
            categories[catName].sort((a, b) => a.name.localeCompare(b.name, 'ru'));
            selectHtml += `<optgroup label="${catName}">`;
            categories[catName].forEach(lang => {
                selectHtml += `<option value="${lang.key}" data-inspector="<b>${lang.name}:</b> ${lang.description}">${lang.name}</option>`;
            });
            selectHtml += `</optgroup>`;
        }
    });
    langSelect.innerHTML = selectHtml;
    langSelect.value = "none";

    let badgesHtml = "";
    knownLangs.forEach((key, index) => {
        const lang = languagesData[key];
        if (lang) {
            const desc = `<b>${lang.name} (${lang.category}):</b> ${lang.description}<br><br><i>Нажмите, чтобы забыть язык.</i>`;
            badgesHtml += `
                <div class="interactive-node selected-lang-btn" data-index="${index}" data-inspector="${desc.replace(/"/g, '&quot;')}"
                     style="display: flex; align-items: center; padding: 6px 12px; background: rgba(46, 196, 182, 0.15); border: 1px solid var(--accent-success); border-radius: 6px; cursor: pointer;">
                    <span style="color: #fff; font-weight: bold; font-size: 13px;">${lang.name}</span>
                </div>`;
        }
    });

    selectedBox.innerHTML = badgesHtml || `<p class="font-group-3" style="color: var(--text-muted); font-style: italic; margin-top:5px;">Языки не выбраны</p>`;
    selectedBox.querySelectorAll('.selected-lang-btn').forEach(btn => {
        btn.onclick = () => { charData.proficiencies.languages.splice(parseInt(btn.getAttribute("data-index")), 1); updateLanguagesUI(); };
    });
    if (typeof window.initGlobalInspector === "function") window.initGlobalInspector();
}

function bindLanguagesEvents() {
    const addBtn = document.getElementById("addLanguageBtn");
    const langSelect = document.getElementById("languageSelect");

    if (addBtn && langSelect) {
        addBtn.onclick = () => {
            const selectedKey = langSelect.value;
            if (selectedKey !== "none" && !charData.proficiencies.languages.includes(selectedKey)) {
                charData.proficiencies.languages.push(selectedKey); updateLanguagesUI();
            }
        };
        langSelect.addEventListener("change", (e) => {
            const selectedOpt = e.target.options[e.target.selectedIndex];
            const textPanel = document.getElementById("inspectorDescriptionPanel");
            if (selectedOpt && selectedOpt.value !== "none" && textPanel) {
                textPanel.innerHTML = `<p class="font-group-3" style="text-align: justify; line-height: 1.45;">${selectedOpt.getAttribute("data-inspector")}</p>`;
            }
        });
    }
}

export function updateInstrumentsUI() {
    const instSelect = document.getElementById("instrumentSelect");
    const selectedBox = document.getElementById("selectedInstrumentsList");
    if (!instSelect || !selectedBox) return;

    if (!charData.proficiencies.tools) charData.proficiencies.tools = [];
    const knownTools = charData.proficiencies.tools;
    const categories = { "Инструменты ремесленников": [], "Музыкальные инструменты": [], "Игровые наборы": [], "Другие инструменты": [] };

    Object.keys(instrumentsData).forEach(key => {
        const item = instrumentsData[key];
        if (!knownTools.some(t => (t.key || t) === key) && !key.includes("instrument_of_the_bards")) {
            const cat = item.category || "Другие инструменты";
            if (categories[cat]) categories[cat].push({ key, ...item });
        }
    });

    let selectHtml = `<option value="none">-- Выберите инструмент --</option>`;
    Object.keys(categories).forEach(catName => {
        if (categories[catName].length > 0) {
            categories[catName].sort((a, b) => a.name.localeCompare(b.name, 'ru'));
            selectHtml += `<optgroup label="${catName}">`;
            categories[catName].forEach(inst => {
                let desc = `<b>${inst.name} (${inst.cost}):</b><br><b>Характеристика:</b> ${inst.stat || 'Нет'} | <b>Вес:</b> ${inst.weight}<br>${inst.description}`;
                selectHtml += `<option value="${inst.key}" data-inspector="${desc.replace(/"/g, '&quot;')}">${inst.name}</option>`;
            });
            selectHtml += `</optgroup>`;
        }
    });
    instSelect.innerHTML = selectHtml;
    instSelect.value = "none";

    let badgesHtml = "";
    knownTools.forEach((toolObj, index) => {
        const keyOrName = toolObj.key || toolObj;
        let inst = instrumentsData[keyOrName];

        if (inst) {
            const displayName = inst.name;
            let desc = `<b>${displayName} (${inst.cost}):</b><br>${inst.description}<br><br><i>Нажмите, чтобы удалить владение.</i>`;

            badgesHtml += `
                <div class="interactive-node selected-inst-btn" data-index="${index}" data-inspector="${desc.replace(/"/g, '&quot;')}"
                     style="display: flex; align-items: center; padding: 6px 12px; background: rgba(224, 168, 46, 0.15); border: 1px solid var(--accent-yellow); border-radius: 6px; cursor: pointer;">
                    <span style="color: #fff; font-weight: bold; font-size: 13px;">${displayName}</span>
                </div>`;
        }
    });

    selectedBox.innerHTML = badgesHtml || `<p class="font-group-3" style="color: var(--text-muted); font-style: italic; margin-top:5px;">Инструменты не выбраны</p>`;
    selectedBox.querySelectorAll('.selected-inst-btn').forEach(btn => {
        btn.onclick = () => { charData.proficiencies.tools.splice(parseInt(btn.getAttribute("data-index")), 1); updateInstrumentsUI(); };
    });
    if (typeof window.initGlobalInspector === "function") window.initGlobalInspector();
}

function bindInstrumentsEvents() {
    const addBtn = document.getElementById("addInstrumentBtn");
    const instSelect = document.getElementById("instrumentSelect");

    if (addBtn && instSelect) {
        addBtn.onclick = () => {
            const selectedKey = instSelect.value;
            if (selectedKey === "none") return;
            if (!charData.proficiencies.tools.some(t => (t.key || t) === selectedKey)) {
                charData.proficiencies.tools.push({ key: selectedKey });
                updateInstrumentsUI();
            }
        };
        instSelect.addEventListener("change", (e) => {
            const selectedOpt = e.target.options[e.target.selectedIndex];
            const textPanel = document.getElementById("inspectorDescriptionPanel");
            if (selectedOpt && selectedOpt.value !== "none" && textPanel) {
                textPanel.innerHTML = `<p class="font-group-3" style="text-align: justify; line-height: 1.45;">${selectedOpt.getAttribute("data-inspector")}</p>`;
            }
        });
    }
}