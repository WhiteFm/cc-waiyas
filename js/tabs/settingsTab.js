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
import { damageTypesData } from '../scripts/combatStatusScript.js';

const STAT_NAMES = { str: "Сила", dex: "Ловкость", con: "Телосложение", int: "Интеллект", wis: "Мудрость", cha: "Харизма" };
const SKILL_NAMES = {
    acrobatics: "Акробатика", animal_handling: "Уход за животными", arcana: "Тайная магия",
    athletics: "Атлетика", deception: "Обман", history: "История", insight: "Проницательность",
    intimidation: "Запугивание", investigation: "Анализ", medicine: "Медицина", nature: "Природа",
    perception: "Восприятие", performance: "Выступление", persuasion: "Убеждение",
    religion: "Религия", sleight_of_hand: "Ловкость рук", stealth: "Скрытность", survival: "Выживание"
};
const selectOptions = (items, emptyLabel = "Не выбрано") =>
    `<option value="">${emptyLabel}</option>` +
    Object.entries(items).map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
const DAMAGE_TYPE_OPTIONS = `<option value="">Без типа</option>` +
    Object.values(damageTypesData).map(damage => `<option value="${damage.name}">${damage.icon} ${damage.name}</option>`).join("");
const DAMAGE_EFFECT_NAMES = Object.fromEntries(
    Object.entries(damageTypesData).map(([key, damage]) => [key, `${damage.icon} ${damage.name}`])
);
const EFFECT_TYPE_NAMES = {
    stat: "Характеристика", skill: "Навык", initiative: "Инициатива",
    save: "Спасбросок", resistance: "Сопротивление", vulnerability: "Уязвимость",
    spell_slot: "Ячейки заклинаний", prepared_spells: "Подготовленные заклинания",
    prepared_cantrips: "Подготовленные заговоры"
};
const SPELL_LEVEL_NAMES = Object.fromEntries(
    Array.from({ length: 9 }, (_, index) => [String(index + 1), `${index + 1} уровень`])
);
const CATEGORY_OPTIONS = [
    "Снаряжение", "Боеприпасы", "Зелье", "Яд", "Эликсир", "Масло", "Вещество", "Наркотик",
    "Простое рукопашное оружие", "Простое дальнобойное оружие",
    "Воинское рукопашное оружие", "Воинское дальнобойное оружие",
    "Лёгкий доспех", "Средний доспех", "Тяжёлый доспех", "Щит",
    "Шлем", "Плащ", "Амулет", "Наручи", "Пояс", "Поножи", "Кольцо",
    "Контейнеры", "Инструмент", "Другие инструменты", "Музыкальные инструменты",
    "Игровые наборы", "Инструменты ремесленников", "Магические инструменты"
];
const TYPE_OPTIONS = [
    "Снаряжение", "Оружие", "Доспех", "Щит", "Шлем", "Плащ", "Амулет", "Наручи",
    "Пояс", "Поножи", "Кольцо", "Боеприпас", "Зелье", "Яд", "Инструмент"
];
const optionList = values => values.map(value => `<option value="${value}">${value}</option>`).join("");
const templateValues = field => [...new Set([
    ...(field === "category" ? CATEGORY_OPTIONS : TYPE_OPTIONS),
    ...Object.values(ALL_TEMPLATES).map(item => item[field]).filter(Boolean)
])];

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
                    <div><label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Категория:</label><select id="forgeCategory" class="input-field font-group-3">${optionList(templateValues("category"))}</select></div>
                    <div><label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Тип / слот:</label><select id="forgeType" class="input-field font-group-3">${optionList(templateValues("type"))}</select></div>
                    <div><label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Цена:</label><input type="text" id="forgeCost" class="input-field font-group-3" placeholder="10 ЗМ"></div>
                    <div><label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Вес (фнт):</label><input type="number" step="0.1" id="forgeWeight" class="input-field font-group-3" placeholder="2.0"></div>
                </div>

                <div style="margin-top:16px; padding:14px; border:1px solid rgba(239,68,68,.35); border-radius:9px; background:rgba(239,68,68,.04);">
                    <div style="font-weight:bold; color:var(--accent); margin-bottom:10px; font-size:14px;">⚔️ Данные оружия</div>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr)); gap:10px;">
                    <div><label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Урон:</label><input type="text" id="forgeDamage" class="input-field font-group-3" placeholder="1к8"></div>
                    <div><label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Тип урона:</label><select id="forgeDamageType" class="input-field font-group-3">${DAMAGE_TYPE_OPTIONS}</select></div>
                    <div><label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Бонус к броску атаки:</label><input type="number" id="forgeAttackBonus" class="input-field font-group-3" value="0" placeholder="+1 / -1"></div>
                    <div>
                        <label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Скейл от характеристики:</label>
                        <select id="forgeScalingAbility" class="input-field font-group-3">
                            <option value="auto">Автоматически</option>
                            <option value="finesse">СИЛ или ЛОВ (большая)</option>
                            <option value="str">Сила</option>
                            <option value="dex">Ловкость</option>
                            <option value="con">Телосложение</option>
                            <option value="int">Интеллект</option>
                            <option value="wis">Мудрость</option>
                            <option value="cha">Харизма</option>
                        </select>
                    </div>
                    <div style="grid-column: 1 / -1;"><label class="font-group-3" style="color: var(--text-muted); font-size: 11px;">Свойства оружия:</label><input type="text" id="forgeProperties" class="input-field font-group-3" placeholder="Фехтовальное, Лёгкое"></div>
                    </div>
                </div>

                <div style="margin-top:12px; padding:14px; border:1px solid rgba(59,130,246,.35); border-radius:9px; background:rgba(59,130,246,.04);">
                    <div style="font-weight:bold; color:#60a5fa; margin-bottom:10px; font-size:14px;">🛡️ Данные доспеха</div>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:10px;">
                        <div><label class="font-group-3" style="color:var(--text-muted);font-size:11px;">Формула КЗ:</label><input type="text" id="forgeAc" class="input-field font-group-3" placeholder="14 + модификатор Лов (макс. 2)"></div>
                        <div><label class="font-group-3" style="color:var(--text-muted);font-size:11px;">Помеха Скрытности:</label><select id="forgeStealth" class="input-field font-group-3"><option value="—">Нет</option><option value="Помеха">Есть</option></select></div>
                    </div>
                </div>

                <div style="margin-top:12px; padding:14px; border:1px solid rgba(34,197,94,.35); border-radius:9px; background:rgba(34,197,94,.04);">
                    <div style="font-weight:bold; color:var(--accent-success); margin-bottom:10px; font-size:14px;">✨ Эффекты при надевании</div>
                    <label class="font-group-3" style="color:var(--text-muted);font-size:11px;">Бонусы, сопротивления и уязвимости:</label>
                    <div id="forgeEffectsContainer"></div>
                    <button type="button" class="settings-btn btn-dark" id="forgeAddEffectBtn" style="margin:6px 0 12px;">＋ Добавить эффект</button>
                    <div style="max-width:240px;"><label class="font-group-3" style="color:var(--text-muted);font-size:11px;">Бонус к КЗ:</label><input type="number" id="forgeAcBonus" class="input-field font-group-3" value="0" placeholder="+1 / -1"></div>

                    <div style="font-weight:bold;color:var(--accent-yellow);font-size:12px;margin:8px 0;">Ответный урон при попадании по владельцу</div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <div><label class="font-group-3" style="color:var(--text-muted);font-size:11px;">Урон:</label><input type="text" id="forgeRetaliationDice" class="input-field font-group-3" placeholder="2к4"></div>
                        <div><label class="font-group-3" style="color:var(--text-muted);font-size:11px;">Тип урона:</label><select id="forgeRetaliationType" class="input-field font-group-3">${DAMAGE_TYPE_OPTIONS}</select></div>
                    </div>
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

    function getEffectTargets(kind) {
        if (kind === "stat" || kind === "save") return STAT_NAMES;
        if (kind === "skill") return SKILL_NAMES;
        if (kind === "resistance" || kind === "vulnerability") return DAMAGE_EFFECT_NAMES;
        if (kind === "spell_slot") return SPELL_LEVEL_NAMES;
        if (kind === "prepared_spells") return { prepared: "Максимум подготовленных" };
        if (kind === "prepared_cantrips") return { cantrips: "Максимум подготовленных заговоров" };
        return { initiative: "Инициатива" };
    }

    function updateEffectRow(row, target = "") {
        const kind = row.querySelector(".forge-effect-kind").value;
        const targetSelect = row.querySelector(".forge-effect-target");
        const bonusInput = row.querySelector(".forge-effect-bonus");
        targetSelect.innerHTML = selectOptions(getEffectTargets(kind), "Выберите цель");
        if (["initiative", "prepared_spells", "prepared_cantrips"].includes(kind)) {
            const fixedTargets = {
                initiative: ["initiative", "Инициатива"],
                prepared_spells: ["prepared", "Максимум подготовленных"],
                prepared_cantrips: ["cantrips", "Максимум подготовленных заговоров"]
            };
            const [fixedTarget, fixedLabel] = fixedTargets[kind];
            targetSelect.innerHTML = `<option value="${fixedTarget}">${fixedLabel}</option>`;
            targetSelect.disabled = true;
        } else {
            targetSelect.disabled = false;
            targetSelect.value = target;
        }
        bonusInput.style.display = ["resistance", "vulnerability"].includes(kind) ? "none" : "";
    }

    function createEffectRow(kind = "stat", target = "", bonus = 0) {
        const row = document.createElement("div");
        row.className = "forge-effect-row";
        row.style.cssText = "display:grid;grid-template-columns:minmax(140px,1.2fr) minmax(150px,1.5fr) minmax(75px,.6fr) 40px;gap:8px;margin-bottom:6px;align-items:center;";
        row.innerHTML = `
            <select class="input-field font-group-3 forge-effect-kind">${selectOptions(EFFECT_TYPE_NAMES, "Вид эффекта")}</select>
            <select class="input-field font-group-3 forge-effect-target"></select>
            <input type="number" class="input-field font-group-3 forge-effect-bonus" value="${Number(bonus) || 0}" placeholder="+2 / -1">
            <button type="button" class="settings-btn btn-dark forge-remove-effect" title="Удалить" style="padding:8px;">×</button>`;
        row.querySelector(".forge-effect-kind").value = kind;
        updateEffectRow(row, target);
        return row;
    }

    function renderEffectRows(entries = []) {
        const container = document.getElementById("forgeEffectsContainer");
        if (!container) return;
        container.innerHTML = "";
        const rows = entries.length ? entries : [["stat", "", 0]];
        rows.forEach(([kind, target, bonus]) => container.appendChild(createEffectRow(kind, target, bonus)));
    }

    function collectEffectRows() {
        const result = { stats: {}, skills: {}, saves: {}, initiative: 0, resistances: [], vulnerabilities: [], spellSlots: {}, preparedSpells: 0, preparedCantrips: 0 };
        document.querySelectorAll("#forgeEffectsContainer .forge-effect-row").forEach(row => {
            const kind = row.querySelector(".forge-effect-kind").value;
            const target = row.querySelector(".forge-effect-target").value;
            const bonus = parseInt(row.querySelector(".forge-effect-bonus").value, 10) || 0;
            if (kind === "stat" && target && bonus) result.stats[target] = (result.stats[target] || 0) + bonus;
            if (kind === "skill" && target && bonus) result.skills[target] = (result.skills[target] || 0) + bonus;
            if (kind === "save" && target && bonus) result.saves[target] = (result.saves[target] || 0) + bonus;
            if (kind === "initiative" && bonus) result.initiative += bonus;
            if (kind === "spell_slot" && target && bonus) result.spellSlots[target] = (result.spellSlots[target] || 0) + bonus;
            if (kind === "prepared_spells" && bonus) result.preparedSpells += bonus;
            if (kind === "prepared_cantrips" && bonus) result.preparedCantrips += bonus;
            if (kind === "resistance" && target && !result.resistances.includes(target)) result.resistances.push(target);
            if (kind === "vulnerability" && target && !result.vulnerabilities.includes(target)) result.vulnerabilities.push(target);
        });
        return result;
    }

    function setSelectValue(id, value) {
        const select = document.getElementById(id);
        if (!select) return;
        if (value && ![...select.options].some(option => option.value === value)) {
            select.add(new Option(value, value));
        }
        select.value = value;
    }

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
        else if (e.target.id === "forgeAddEffectBtn") {
            document.getElementById("forgeEffectsContainer")?.appendChild(createEffectRow());
        } else if (e.target.classList.contains("forge-remove-effect")) {
            const row = e.target.closest(".forge-effect-row");
            const container = row?.parentElement;
            row?.remove();
            if (container && !container.children.length) {
                container.appendChild(createEffectRow());
            }
        }
        else if (e.target !== searchInput && e.target !== searchResults) {
            if (searchResults) searchResults.style.display = "none";
        }
    });

    searchInput?.addEventListener("input", (e) => renderSearchList(e.target.value.toLowerCase().trim()));
    document.getElementById("forgeEffectsContainer")?.addEventListener("change", e => {
        if (e.target.classList.contains("forge-effect-kind")) updateEffectRow(e.target.closest(".forge-effect-row"));
    });

    function saveItemToFile() {
        const key = document.getElementById("forgeKey").value.trim();
        if (!key || !/^[a-zA-Z0-9_]+$/.test(key)) { alert("Ключ (ID) должен содержать только английские буквы и _ !"); return; }

        const costStr = document.getElementById("forgeCost").value.trim() || "0 ЗМ";
        const weight = parseFloat(document.getElementById("forgeWeight").value) || 0;
        const damage = document.getElementById("forgeDamage").value.trim();
        const damageType = document.getElementById("forgeDamageType").value.trim();
        const attackBonus = parseInt(document.getElementById("forgeAttackBonus").value, 10) || 0;
        const scalingAbility = document.getElementById("forgeScalingAbility").value;
        const properties = document.getElementById("forgeProperties").value.trim();
        const ac = document.getElementById("forgeAc").value.trim();
        const stealth = document.getElementById("forgeStealth").value;
        const forgeEffects = collectEffectRows();
        const acBonus = parseInt(document.getElementById("forgeAcBonus").value) || 0;
        const retaliationDice = document.getElementById("forgeRetaliationDice").value.trim();
        const retaliationType = document.getElementById("forgeRetaliationType").value.trim();
        const signed = value => value > 0 ? `+${value}` : `${value}`;

        let htmlDesc = `<table style='width:100%; text-align:left; border-collapse:collapse; margin-bottom:8px; font-size:13px;'>`;
        if (damage) {
            const abilityNames = { auto: "автоматически", finesse: "СИЛ или ЛОВ (большая)", str: "Сила", dex: "Ловкость", con: "Телосложение", int: "Интеллект", wis: "Мудрость", cha: "Харизма" };
            htmlDesc += `<tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--accent-success); padding:6px;'>Урон:</td><td style='padding:6px;'><b>${damage} (${damageType})</b><br><small>Скейл: ${abilityNames[scalingAbility]}</small></td></tr>`;
        }
        if (attackBonus) htmlDesc += `<tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--accent-success); padding:6px;'>Бросок атаки:</td><td style='padding:6px;'><b>${signed(attackBonus)}</b> при использовании этого оружия</td></tr>`;
        if (properties) htmlDesc += `<tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--text-muted); padding:6px;'>Свойства:</td><td style='padding:6px;'>${properties}</td></tr>`;
        if (ac) htmlDesc += `<tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--accent-success); padding:6px;'>КЗ:</td><td style='padding:6px;'><b>${ac}</b></td></tr>`;
        if (ac && stealth === "Помеха") htmlDesc += `<tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--accent); padding:6px;'>Скрытность:</td><td style='padding:6px;'><b>Помеха</b></td></tr>`;
        Object.entries(forgeEffects.stats).forEach(([target, bonus]) => {
            htmlDesc += `<tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--accent-success); padding:6px;'>Характеристика:</td><td style='padding:6px;'><b>${signed(bonus)} — ${STAT_NAMES[target]}</b> при надевании</td></tr>`;
        });
        Object.entries(forgeEffects.skills).forEach(([target, bonus]) => {
            htmlDesc += `<tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--accent-success); padding:6px;'>Навык:</td><td style='padding:6px;'><b>${signed(bonus)} — ${SKILL_NAMES[target]}</b> при надевании</td></tr>`;
        });
        Object.entries(forgeEffects.saves).forEach(([target, bonus]) => {
            htmlDesc += `<tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--accent-success); padding:6px;'>Спасбросок:</td><td style='padding:6px;'><b>${signed(bonus)} — ${STAT_NAMES[target]}</b> при надевании</td></tr>`;
        });
        if (forgeEffects.initiative) htmlDesc += `<tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--accent-success); padding:6px;'>Инициатива:</td><td style='padding:6px;'><b>${signed(forgeEffects.initiative)}</b> при надевании</td></tr>`;
        Object.entries(forgeEffects.spellSlots).forEach(([level, count]) => {
            htmlDesc += `<tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--accent-success); padding:6px;'>Ячейки заклинаний:</td><td style='padding:6px;'><b>${signed(count)} яч. ${level}-го уровня</b> при надевании</td></tr>`;
        });
        if (forgeEffects.preparedSpells) htmlDesc += `<tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--accent-success); padding:6px;'>Подготовка:</td><td style='padding:6px;'><b>${signed(forgeEffects.preparedSpells)}</b> к максимуму подготовленных заклинаний</td></tr>`;
        if (forgeEffects.preparedCantrips) htmlDesc += `<tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--accent-success); padding:6px;'>Заговоры:</td><td style='padding:6px;'><b>${signed(forgeEffects.preparedCantrips)}</b> к максимуму подготовленных заговоров</td></tr>`;
        forgeEffects.resistances.forEach(target => {
            htmlDesc += `<tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--accent-success); padding:6px;'>Сопротивление:</td><td style='padding:6px;'><b>${damageTypesData[target]?.name || target}</b> при надевании</td></tr>`;
        });
        forgeEffects.vulnerabilities.forEach(target => {
            htmlDesc += `<tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--accent); padding:6px;'>Уязвимость:</td><td style='padding:6px;'><b>${damageTypesData[target]?.name || target}</b> при надевании</td></tr>`;
        });
        if (acBonus) htmlDesc += `<tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--accent-success); padding:6px;'>Бонус КЗ:</td><td style='padding:6px;'><b>${signed(acBonus)}</b> при надевании</td></tr>`;
        if (retaliationDice) htmlDesc += `<tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--accent-yellow); padding:6px;'>Ответный урон:</td><td style='padding:6px;'><b>${retaliationDice} (${retaliationType || "Без типа"})</b>, когда по владельцу попадают атакой</td></tr>`;
        htmlDesc += `<tr><td style='color:var(--accent-success); padding:6px;'>Стоимость/Вес:</td><td style='padding:6px;'><b>${costStr}</b> / ${weight} фнт.</td></tr></table>`;
        const effectText = document.getElementById("forgeEffect").value.trim();
        const formattedEffect = effectText
            .split(/\n{2,}/)
            .map(paragraph => `<p style='margin:0 0 10px; text-align:justify;'>${paragraph.replace(/\n/g, "<br>")}</p>`)
            .join("");
        htmlDesc += formattedEffect;

        const newItem = {
            name: document.getElementById("forgeName").value.trim() || "Неизвестный предмет",
            category: document.getElementById("forgeCategory").value.trim() || "Снаряжение",
            type: document.getElementById("forgeType").value.trim() || "Снаряжение",
            cost: costStr, weight: weight, singleWeight: weight, description: htmlDesc,
            costInCp: window.parseCurrencyToCp ? window.parseCurrencyToCp(costStr) : 0
        };
        if (damage) {
            newItem.damage = damage;
            newItem.damageType = damageType;
            newItem.properties = properties;
            newItem.scalingAbility = scalingAbility;
        }
        if (attackBonus) newItem.attackBonus = attackBonus;
        if (ac) { newItem.ac = ac; newItem.stealth = stealth; }

        const equipEffects = {};
        if (Object.keys(forgeEffects.stats).length) equipEffects.stats = forgeEffects.stats;
        if (Object.keys(forgeEffects.skills).length) equipEffects.skills = forgeEffects.skills;
        if (Object.keys(forgeEffects.saves).length) equipEffects.saves = forgeEffects.saves;
        if (forgeEffects.initiative) equipEffects.initiative = forgeEffects.initiative;
        if (Object.keys(forgeEffects.spellSlots).length) equipEffects.spellSlots = forgeEffects.spellSlots;
        if (forgeEffects.preparedSpells) equipEffects.preparedSpells = forgeEffects.preparedSpells;
        if (forgeEffects.preparedCantrips) equipEffects.preparedCantrips = forgeEffects.preparedCantrips;
        if (forgeEffects.resistances.length) equipEffects.resistances = forgeEffects.resistances;
        if (forgeEffects.vulnerabilities.length) equipEffects.vulnerabilities = forgeEffects.vulnerabilities;
        if (acBonus) equipEffects.ac = acBonus;
        if (retaliationDice) {
            equipEffects.retaliationDamage = {
                dice: retaliationDice,
                type: retaliationType || "Без типа",
                trigger: "Когда по вам попадают атакой"
            };
        }
        if (Object.keys(equipEffects).length > 0) newItem.equipEffects = equipEffects;

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
        setSelectValue("forgeCategory", item.category || "Снаряжение");
        setSelectValue("forgeType", item.type || "Снаряжение");
        document.getElementById("forgeCost").value = item.cost || "";
        document.getElementById("forgeWeight").value = item.weight || 0;
        document.getElementById("forgeDamage").value = item.damage || "";
        setSelectValue("forgeDamageType", item.damageType || "");
        document.getElementById("forgeAttackBonus").value = item.attackBonus || 0;
        document.getElementById("forgeScalingAbility").value = item.scalingAbility || "auto";
        document.getElementById("forgeProperties").value = item.properties || "";
        document.getElementById("forgeAc").value = item.ac || "";
        document.getElementById("forgeStealth").value = item.stealth === "Помеха" ? "Помеха" : "—";
        const effectRows = [
            ...Object.entries(item.equipEffects?.stats || {}).map(([target, bonus]) => ["stat", target, bonus]),
            ...Object.entries(item.equipEffects?.skills || {}).map(([target, bonus]) => ["skill", target, bonus]),
            ...Object.entries(item.equipEffects?.saves || {}).map(([target, bonus]) => ["save", target, bonus]),
            ...(item.equipEffects?.initiative ? [["initiative", "initiative", item.equipEffects.initiative]] : []),
            ...Object.entries(item.equipEffects?.spellSlots || {}).map(([level, count]) => ["spell_slot", level, count]),
            ...(item.equipEffects?.preparedSpells ? [["prepared_spells", "prepared", item.equipEffects.preparedSpells]] : []),
            ...(item.equipEffects?.preparedCantrips ? [["prepared_cantrips", "cantrips", item.equipEffects.preparedCantrips]] : []),
            ...(item.equipEffects?.resistances || []).map(target => ["resistance", target, 0]),
            ...(item.equipEffects?.vulnerabilities || []).map(target => ["vulnerability", target, 0])
        ];
        renderEffectRows(effectRows);
        document.getElementById("forgeAcBonus").value = item.equipEffects?.ac || 0;
        document.getElementById("forgeRetaliationDice").value = item.equipEffects?.retaliationDamage?.dice || "";
        setSelectValue("forgeRetaliationType", item.equipEffects?.retaliationDamage?.type || "");
        let cleanDesc = item.description || "";
        const paragraphs = [...cleanDesc.matchAll(/<p[^>]*>(.*?)<\/p>/gis)];
        document.getElementById("forgeEffect").value = paragraphs.length
            ? paragraphs.map(match => match[1].replace(/<br\s*\/?>/gi, '\n').replace(/<\/?[^>]+(>|$)/g, "")).join("\n\n").trim()
            : cleanDesc.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '').trim();
    }

    function clearForgeForm() {
        document.querySelectorAll("#itemForgeModal input:not(#forgeKey), #itemForgeModal textarea").forEach(el => el.value = "");
        document.getElementById("forgeScalingAbility").value = "auto";
        document.getElementById("forgeStealth").value = "—";
        document.getElementById("forgeCategory").value = "Снаряжение";
        document.getElementById("forgeType").value = "Снаряжение";
        document.getElementById("forgeDamageType").value = "";
        document.getElementById("forgeRetaliationType").value = "";
        document.getElementById("forgeAttackBonus").value = 0;
        renderEffectRows();
        document.getElementById("forgeAcBonus").value = 0;
    }
}
