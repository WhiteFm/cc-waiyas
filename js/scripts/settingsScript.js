// ==========================================
// ЛОГИКА СОХРАНЕНИЙ И ФАЙЛОВ (settingsScript.js)
// ==========================================

import { charData } from '../../saves/tempSave.js';

export function getSavedCharactersRegistry() {
    const reg = localStorage.getItem('dnd_saves_registry');
    return reg ? JSON.parse(reg) : {};
}

function saveRegistry(registry) {
    localStorage.setItem('dnd_saves_registry', JSON.stringify(registry));
}

export function updateSavedCountUI() {
    const countDisplay = document.getElementById("savedCountDisplay");
    if (countDisplay) {
        countDisplay.innerText = Object.keys(getSavedCharactersRegistry()).length;
    }
}

// Вспомогательная функция для визуального подтверждения
function showButtonFeedback(elementId, successText) {
    const btn = document.getElementById(elementId);
    if (!btn) return;
    const oldText = btn.innerText;
    btn.innerText = successText;
    btn.style.filter = "brightness(1.5)";
    btn.style.borderColor = "var(--accent-success)";
    setTimeout(() => {
        btn.innerText = oldText;
        btn.style.filter = "";
        btn.style.borderColor = "";
    }, 1500);
}

// ==========================================
// ТЕНЕВОЕ АВТОСОХРАНЕНИЕ
// ==========================================
export function autoSaveCharacter() {
    if (!charData.origin) return;
    const name = charData.origin.name?.trim();

    // Не автосохраняем пустых болванчиков
    if (!name || name === "Без имени") return;

    const registry = getSavedCharactersRegistry();
    // Если персонажа еще нет в базе (он не был сохранен вручную с паролем), не автосохраняем
    if (!registry[name]) return;

    const date = new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const saveData = {
        charData: charData,
        saveDate: date,
        level: charData.origin.level || 1
    };

    registry[name] = {
        level: saveData.level,
        saveDate: saveData.saveDate,
        hasPassword: !!charData.origin.password
    };

    try {
        localStorage.setItem(`dnd_char_${name}`, JSON.stringify(saveData));
        saveRegistry(registry);
    } catch (e) {
        console.error("Фоновое автосохранение не удалось:", e);
    }
}

// Привязываем автосохранение к любому изменению на листе!
document.addEventListener('charDataUpdated', () => {
    autoSaveCharacter();
});

// ==========================================
// РУЧНОЕ СОХРАНЕНИЕ (Установка пароля)
// ==========================================
export function quickSaveCharacter() {
    if (!charData.origin) charData.origin = {};
    const name = charData.origin.name?.trim();

    if (!name || name === "Без имени") {
        alert("Пожалуйста, укажите имя персонажа во вкладке 'Основные данные' перед сохранением.");
        return;
    }

    // Если персонаж сохраняется ВПЕРВЫЕ, спрашиваем пароль
    if (charData.origin.password === undefined) {
        const password = prompt(`Сохранение персонажа: ${name}\n\nВведите пароль для защиты.\n(Оставьте поле пустым, если пароль не нужен):`, "");
        if (password === null) return;
        charData.origin.password = password.trim() !== "" ? btoa(password) : "";
    }

    const registry = getSavedCharactersRegistry();
    const date = new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const saveData = {
        charData: charData,
        saveDate: date,
        level: charData.origin.level || 1
    };

    registry[name] = {
        level: saveData.level,
        saveDate: saveData.saveDate,
        hasPassword: !!charData.origin.password
    };

    try {
        localStorage.setItem(`dnd_char_${name}`, JSON.stringify(saveData));
        saveRegistry(registry);
        updateSavedCountUI();
        showButtonFeedback("proxySaveBtn", "Сохранено ✓");
    } catch (e) {
        alert("Ошибка сохранения! Возможно, превышен лимит памяти браузера.");
        console.error(e);
    }
}

// ==========================================
// ЗАГРУЗКА ИЗ БРАУЗЕРА
// ==========================================
export function quickLoadCharacter(name) {
    const savedStr = localStorage.getItem(`dnd_char_${name}`);
    if (!savedStr) { alert("Сохранение не найдено!"); return; }

    let saveData;
    try { saveData = JSON.parse(savedStr); } catch (e) { alert("Файл сохранения поврежден!"); return; }

    const loadedOrigin = saveData.charData?.origin || {};

    if (loadedOrigin.password) {
        const pass = prompt(`Персонаж "${name}" защищен паролем.\n\nВведите пароль:`, "");
        if (pass === null) return;
        if (btoa(pass) !== loadedOrigin.password) { alert("Неверный пароль!"); return; }
    }

    Object.keys(charData).forEach(key => delete charData[key]);
    Object.assign(charData, saveData.charData);

    document.dispatchEvent(new Event('charDataUpdated'));
    showButtonFeedback("proxyLoadBtn", "Загружено ✓");
}

export function deleteCharacterFromRegistry(name) {
    const savedStr = localStorage.getItem(`dnd_char_${name}`);
    if (savedStr) {
        let saveData = JSON.parse(savedStr);
        const loadedOrigin = saveData.charData?.origin || {};
        if (loadedOrigin.password) {
            const pass = prompt(`Для удаления "${name}" введите пароль:`, "");
            if (pass === null) return;
            if (btoa(pass) !== loadedOrigin.password) { alert("Неверный пароль!"); return; }
        }
    }
    const registry = getSavedCharactersRegistry();
    delete registry[name];
    saveRegistry(registry);
    localStorage.removeItem(`dnd_char_${name}`);
    updateSavedCountUI();
}

// ==========================================
// ЭКСПОРТ / ИМПОРТ ФАЙЛОВ
// ==========================================
export function exportCharacterToFile() {
    const name = charData.origin?.name?.trim() || "Unknown";
    autoSaveCharacter();

    const dataStr = JSON.stringify(charData, null, 4);
    const fileContent = `// Сохранение персонажа: ${name}\nexport const charData = ${dataStr};\n`;

    const blob = new Blob([fileContent], { type: "text/javascript" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${name.replace(/\s+/g, '_')}_Save.js`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    showButtonFeedback("proxyExportBtn", "Экспортировано ✓");
}

export function importCharacterFromFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            let content = e.target.result;

            // ИЩЕМ НАЧАЛО И КОНЕЦ JSON ОБЪЕКТА (чтобы отрезать все текстовые комментарии вроде "// Сохранение...")
            const firstBrace = content.indexOf('{');
            const lastBrace = content.lastIndexOf('}');
            if (firstBrace === -1 || lastBrace === -1) throw new Error("JSON структура не найдена в файле.");

            content = content.substring(firstBrace, lastBrace + 1);

            const parsedData = JSON.parse(content);
            const loadedOrigin = parsedData.origin || {};

            if (loadedOrigin.password) {
                const pass = prompt(`Файл "${file.name}" защищен паролем.\n\nВведите пароль:`, "");
                if (pass === null) { document.getElementById("fileImportInput").value = ""; return; }
                if (btoa(pass) !== loadedOrigin.password) {
                    alert("Неверный пароль! Загрузка отменена.");
                    document.getElementById("fileImportInput").value = "";
                    return;
                }
            }

            Object.keys(charData).forEach(key => delete charData[key]);
            Object.assign(charData, parsedData);

            // Тихая регистрация загруженного персонажа в LocalStorage браузера
            const name = loadedOrigin.name?.trim() || "Unknown";
            const registry = getSavedCharactersRegistry();
            const date = new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

            registry[name] = {
                level: loadedOrigin.level || 1,
                saveDate: date,
                hasPassword: !!loadedOrigin.password
            };

            localStorage.setItem(`dnd_char_${name}`, JSON.stringify({
                charData: charData,
                saveDate: date,
                level: loadedOrigin.level || 1
            }));

            saveRegistry(registry);
            updateSavedCountUI();

            document.dispatchEvent(new Event('charDataUpdated'));
            showButtonFeedback("proxyImportBtn", "Импортировано ✓");
        } catch (err) {
            console.error(err);
            alert("Ошибка чтения файла! Убедитесь, что это правильный файл персонажа.");
        }
        document.getElementById("fileImportInput").value = "";
    };
    reader.readAsText(file);
}