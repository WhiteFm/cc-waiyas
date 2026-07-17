// ==========================================
// КОНТРОЛЛЕР ВКЛАДКИ НАСТРОЕК И КУЗНИЦЫ (settingsTab.js)
// ==========================================

import {
    quickSaveCharacter, quickLoadCharacter, getSavedCharactersRegistry,
    deleteCharacterFromRegistry, updateSavedCountUI,
    exportCharacterToFile, importCharacterFromFile
} from '../scripts/settingsScript.js';

import { customItemsData } from '../data/customItems.js';
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

const ALL_TEMPLATES = {
    ...ammoData, ...amuletsData, ...armorsData, ...beltsData, ...bracersData,
    ...cloaksData, ...equipmentsData, ...footwearData, ...headwearData,
    ...instrumentsData, ...poisonsData, ...potionsData,
    ...ringsData, ...substancesData, ...weaponsData
};

export function initSettingsTab() {
    updateSavedCountUI();
    const fileInput = document.getElementById("fileImportInput");
    if (fileInput) {
        fileInput.onchange = (e) => {
            if (e.target.files.length > 0) importCharacterFromFile(e.target.files[0]);
        };
    }
    const closeBtn = document.getElementById("closeSaveListBtn");
    if (closeBtn) closeBtn.onclick = () => document.getElementById("saveListModal").classList.remove("visible");

    renderForgeUI();
    attachForgeListeners();
}

function openSaveListModal() {
    const modal = document.getElementById("saveListModal");
    const container = document.getElementById("saveListContainer");
    if (!modal || !container) return;

    const registry = getSavedCharactersRegistry();
    const names = Object.keys(registry);

    if (names.length === 0) {
        container.innerHTML = `<p class="font-group-3 text-center" style="padding: 20px; color: var(--text-muted);">Список пуст.</p>`;
    } else {
        let html = "";
        names.forEach(name => {
            const info = registry[name];
            const lockIcon = info.hasPassword ? '<span title="Защищено паролем">🔒</span>' : '';

            html += `
                <div class="inventory-item-row" style="background: var(--panel-inner); border-radius: 6px; padding: 10px; display:flex; flex-wrap:wrap; gap:10px; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-weight: bold; color: #fff; font-size: 14px;">${name} ${lockIcon}</div>
                        <div style="font-size: 11px; color: var(--text-muted);">Уровень ${info.level} | ${info.saveDate}</div>
                    </div>
                    <div style="display: flex; gap: 6px; flex-wrap:wrap;">
                        <button class="settings-btn btn-green load-char-btn" data-name="${name}" style="padding: 6px 12px; font-size:11px; flex:1;">Загрузить</button>
                        <button class="settings-btn btn-red del-char-btn" data-name="${name}" style="padding: 6px 10px; font-size:11px; flex:0;">✕</button>
                    </div>
                </div>`;
        });
        container.innerHTML = html;

        container.querySelectorAll('.load-char-btn').forEach(btn => {
            btn.onclick = () => {
                quickLoadCharacter(btn.getAttribute("data-name"));
                modal.classList.remove("visible");
            };
        });

        container.querySelectorAll('.del-char-btn').forEach(btn => {
            btn.onclick = () => {
                if (confirm("Точно удалить?")) {
                    deleteCharacterFromRegistry(btn.getAttribute("data-name"));
                    openSaveListModal();
                }
            };
        });
    }
    modal.classList.add("visible");
}

function renderForgeUI() {
    if (document.getElementById("itemForgeWrapper")) return;
    const targetContainer = document.getElementById("settingsContainer") || document.body;

    const forgeWrapper = document.createElement("div");
    forgeWrapper.id = "itemForgeWrapper";
    forgeWrapper.style.width = "100%";
    forgeWrapper.style.display = "grid";
    forgeWrapper.style.gridTemplateColumns = "repeat(auto-fit, minmax(260px, 1fr))";
    forgeWrapper.style.gap = "20px";
    forgeWrapper.style.marginTop = "15px";

    forgeWrapper.innerHTML = `
        <div style="background: #161920; padding: 20px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 10px 30px rgba(0,0,0,0.3); display: flex; flex-direction: column;">
            <div class="font-group-1" style="color: var(--accent-yellow); font-size: 18px; margin-bottom: 5px;"><span style="font-size: 22px;">⚒️</span> Кузница предметов</div>
            <div class="font-group-3" style="color: var(--text-muted); margin-bottom: 20px; flex: 1;">Создавайте кастомные артефакты, оружие и броню.</div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="settings-btn btn-green" id="btnCreateItem" style="flex:1; min-width: 120px;">+ Создать</button>
                <button class="settings-btn btn-yellow" id="btnEditItem" style="flex:1; min-width: 120px;">✎ Изменить</button>
            </div>
        </div>
        <div style="background: #161920; padding: 20px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 10px 30px rgba(0,0,0,0.3); display: flex; flex-direction: column;">
            <div class="font-group-1" style="color: var(--accent-success); font-size: 18px; margin-bottom: 5px;"><span style="font-size: 22px;">💾</span> Сохранения</div>
            <div class="font-group-3" style="color: var(--text-muted); margin-bottom: 20px; flex: 1;">Управление файлами и базой данных браузера.</div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px;">
                <button class="settings-btn btn-red" id="proxySaveBtn">Записать</button>
                <button class="settings-btn btn-blue" id="proxyLoadBtn">Список</button>
                <button class="settings-btn btn-dark" id="proxyExportBtn">Экспорт .js</button>
                <button class="settings-btn btn-dark" id="proxyImportBtn">Импорт .js</button>
            </div>
        </div>
    `;
    targetContainer.appendChild(forgeWrapper);

    if (!document.getElementById("itemForgeModal")) {
        const modal = document.createElement("div");
        modal.id = "itemForgeModal";
        modal.className = "modal-overlay";
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px; width: 95%; text-align: left; max-height: 90vh; overflow-y: auto;">
                <h3 id="forgeModalTitle" class="font-group-1" style="color: var(--accent-yellow); margin-top: 0; text-align: center;">Создание предмета</h3>
                <div style="display: flex; flex-direction: column; margin-bottom: 15px; position: relative;">
                    <label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Поиск основы (шаблона):</label>
                    <input type="text" id="forgeSearchInput" class="input-field font-group-3" placeholder="Введите название предмета..." autocomplete="off">
                    <div id="forgeSearchResults" style="position: absolute; top: 100%; left: 0; right: 0; max-height: 180px; overflow-y: auto; background: #1a1e24; border: 1px solid var(--border-color); z-index: 100; display: none; box-shadow: 0 4px 10px rgba(0,0,0,0.5);"></div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;">
                    <div><label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Ключ (ID - англ.):</label><input type="text" id="forgeKey" class="input-field font-group-3" placeholder="custom_sword_1"></div>
                    <div><label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Название:</label><input type="text" id="forgeName" class="input-field font-group-3"></div>
                    <div><label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Категория:</label><input type="text" id="forgeCategory" class="input-field font-group-3" placeholder="Воинское оружие"></div>
                    <div><label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Тип:</label><input type="text" id="forgeType" class="input-field font-group-3" placeholder="Оружие, Снаряжение"></div>
                    <div><label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Цена:</label><input type="text" id="forgeCost" class="input-field font-group-3" placeholder="10 ЗМ"></div>
                    <div><label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Вес (фнт):</label><input type="number" step="0.1" id="forgeWeight" class="input-field font-group-3" placeholder="2.0"></div>
                </div>

                <hr style="border-color: rgba(255,255,255,0.1); margin: 15px 0;">
                <div style="font-weight: bold; color: var(--accent); margin-bottom: 10px; font-size: 13px;">Характеристики Оружия / Доспеха</div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;">
                    <div><label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Урон:</label><input type="text" id="forgeDamage" class="input-field font-group-3" placeholder="1к8"></div>
                    <div><label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Тип урона:</label><input type="text" id="forgeDamageType" class="input-field font-group-3" placeholder="Рубящий"></div>
                    <div style="grid-column: 1 / -1;"><label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Свойства оружия:</label><input type="text" id="forgeProperties" class="input-field font-group-3" placeholder="Фехтовальное, Лёгкое"></div>
                    <div><label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Класс Защиты (КЗ):</label><input type="text" id="forgeAc" class="input-field font-group-3" placeholder="14 + мод Лов"></div>
                    <div><label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Скрытность:</label><input type="text" id="forgeStealth" class="input-field font-group-3" placeholder="Помеха / —"></div>
                </div>

                <hr style="border-color: rgba(255,255,255,0.1); margin: 15px 0;">
                <div>
                    <label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Описание / Эффект:</label>
                    <textarea id="forgeEffect" class="input-field font-group-3" style="height: 80px; resize: vertical;" placeholder="Опишите свойства предмета..."></textarea>
                </div>

                <div style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;">
                    <button class="settings-btn btn-green" id="forgeSaveBtn" style="flex:1; min-width: 140px;">Сохранить в файл</button>
                    <button class="settings-btn btn-dark" onclick="document.getElementById('itemForgeModal').classList.remove('visible')" style="flex:1; min-width: 140px;">Отмена</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

function attachForgeListeners() {
    let mode = 'new';

    // ЗАЩИТА ОТ ДУБЛИРОВАНИЯ СОБЫТИЙ:
    if (window.forgeListenersBound) return;
    window.forgeListenersBound = true;

    const modal = document.getElementById("itemForgeModal");
    const searchInput = document.getElementById("forgeSearchInput");
    const searchResults = document.getElementById("forgeSearchResults");

    document.body.addEventListener("click", (e) => {
        if (e.target.id === "proxySaveBtn") quickSaveCharacter();
        else if (e.target.id === "proxyLoadBtn") openSaveListModal();
        else if (e.target.id === "proxyExportBtn") exportCharacterToFile();
        else if (e.target.id === "proxyImportBtn") document.getElementById("fileImportInput")?.click();
        else if (e.target.id === "btnCreateItem") {
            mode = 'new'; document.getElementById("forgeModalTitle").innerText = "Создание предмета";
            clearForgeForm(); document.getElementById("forgeKey").value = "custom_" + Date.now();
            document.getElementById("forgeKey").disabled = false; modal.classList.add("visible");
        } else if (e.target.id === "btnEditItem") {
            mode = 'edit'; document.getElementById("forgeModalTitle").innerText = "Редактирование кастомного предмета";
            clearForgeForm(); modal.classList.add("visible"); renderSearchList("");
        } else if (e.target.id === "forgeSaveBtn") saveItemToFile();
        else if (e.target !== searchInput && e.target !== searchResults) {
            if (searchResults) searchResults.style.display = "none";
        }
    });

    searchInput?.addEventListener("input", (e) => renderSearchList(e.target.value.toLowerCase().trim()));

    function saveItemToFile() {
        const key = document.getElementById("forgeKey").value.trim();
        if (!key || !/^[a-zA-Z0-9_]+$/.test(key)) { alert("Ключ (ID) должен содержать только английские буквы и _ !"); return; }

        const costStr = document.getElementById("forgeCost").value.trim() || "0 ЗМ";
        const weight = parseFloat(document.getElementById("forgeWeight").value) || 0;
        const damage = document.getElementById("forgeDamage").value.trim();
        const damageType = document.getElementById("forgeDamageType").value.trim();
        const properties = document.getElementById("forgeProperties").value.trim();
        const ac = document.getElementById("forgeAc").value.trim();

        let htmlDesc = `<table style='width:100%; text-align:left; border-collapse:collapse; margin-bottom:8px; font-size:13px;'>`;
        if (damage) htmlDesc += `<tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--accent-success); padding:6px;'>Урон:</td><td style='padding:6px;'><b>${damage} (${damageType})</b></td></tr>`;
        if (properties) htmlDesc += `<tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--text-muted); padding:6px;'>Свойства:</td><td style='padding:6px;'>${properties}</td></tr>`;
        if (ac) htmlDesc += `<tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--accent-success); padding:6px;'>КЗ:</td><td style='padding:6px;'><b>${ac}</b></td></tr>`;
        htmlDesc += `<tr><td style='color:var(--accent-success); padding:6px;'>Стоимость/Вес:</td><td style='padding:6px;'><b>${costStr}</b> / ${weight} фнт.</td></tr></table>`;
        htmlDesc += `<p style='margin-bottom: 0; text-align: justify;'>${document.getElementById("forgeEffect").value.trim()}</p>`;

        const newItem = {
            name: document.getElementById("forgeName").value.trim() || "Неизвестный предмет",
            category: document.getElementById("forgeCategory").value.trim() || "Снаряжение",
            type: document.getElementById("forgeType").value.trim() || "Снаряжение",
            cost: costStr, weight: weight, singleWeight: weight, description: htmlDesc,
            costInCp: window.parseCurrencyToCp ? window.parseCurrencyToCp(costStr) : 0
        };
        if (damage) { newItem.damage = damage; newItem.damageType = damageType; newItem.properties = properties; }
        if (ac) { newItem.ac = ac; newItem.stealth = document.getElementById("forgeStealth").value.trim(); }

        customItemsData[key] = newItem;
        let fileContent = `// БАЗА КАСТОМНЫХ ПРЕДМЕТОВ (customItems.js)\nexport const customItemsData = ` + JSON.stringify(customItemsData, null, 4) + `;\n`;

        const blob = new Blob([fileContent], { type: "text/javascript" });
        const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "customItems.js";
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
        alert(`Предмет успешно создан!\nЗамените файл "customItems.js" в папке "js/data/" и обновите страницу.`);
        modal.classList.remove("visible");
    }

    function renderSearchList(query) {
        let dbToSearch = mode === 'new' ? ALL_TEMPLATES : customItemsData;
        const results = Object.keys(dbToSearch).filter(k => (dbToSearch[k].name || "").toLowerCase().includes(query)).slice(0, 20);
        if (results.length === 0) { searchResults.style.display = "none"; return; }
        searchResults.style.display = "block";
        searchResults.innerHTML = results.map(k => `<div class="interactive-node" style="padding:10px; cursor:pointer; border-bottom:1px solid var(--border-color);" data-key="${k}"><b style="color:var(--accent-yellow);">${dbToSearch[k].name}</b></div>`).join('');
        searchResults.querySelectorAll('.interactive-node').forEach(n => n.onclick = () => {
            loadItemToForm(n.getAttribute("data-key"), dbToSearch[n.getAttribute("data-key")]);
            searchResults.style.display = "none"; searchInput.value = "";
        });
    }

    function loadItemToForm(key, item) {
        if (mode === 'edit') { document.getElementById("forgeKey").value = key; document.getElementById("forgeKey").disabled = true; }
        document.getElementById("forgeName").value = item.name || "";
        document.getElementById("forgeCategory").value = item.category || "";
        document.getElementById("forgeType").value = item.type || "";
        document.getElementById("forgeCost").value = item.cost || "";
        document.getElementById("forgeWeight").value = item.weight || 0;
        document.getElementById("forgeDamage").value = item.damage || "";
        document.getElementById("forgeDamageType").value = item.damageType || "";
        document.getElementById("forgeProperties").value = item.properties || "";
        document.getElementById("forgeAc").value = item.ac || "";
        document.getElementById("forgeStealth").value = item.stealth || "";
        let cleanDesc = item.description || "";
        const descMatch = cleanDesc.match(/<p[^>]*>(.*?)<\/p>/is);
        document.getElementById("forgeEffect").value = (descMatch && descMatch[1] ? descMatch[1].replace(/<br>/g, '\n').replace(/<\/?[^>]+(>|$)/g, "") : cleanDesc.replace(/<[^>]*>/g, '')).trim();
    }

    function clearForgeForm() {
        document.querySelectorAll("#itemForgeModal input:not(#forgeKey), #itemForgeModal textarea").forEach(el => el.value = "");
    }
}