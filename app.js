// ==========================================
// ГЛАВНЫЙ РОУТЕР ПРИЛОЖЕНИЯ (app.js)
// ==========================================

import { initMainTab } from './js/tabs/mainTab.js';
import { initSkillsTab } from './js/tabs/skillsTab.js';
import { initBackpackTab } from './js/tabs/backpackTab.js';
import { initInspector } from './js/tabs/infoTab.js';
import { initSettingsTab } from './js/tabs/settingsTab.js';
import { initMagicbookTab } from './js/tabs/magicbookTab.js';

import { charData } from './saves/tempSave.js';
import { escapeHTML } from './js/scripts/utils.js';

import { classData } from './js/data/classesData.js';
import { weaponsData } from './js/data/equipments/weaponsData.js';

// Глобальная зачистка от мусорных цитат из баз данных
// Используем безопасную сборку регулярного выражения, чтобы избежать синтаксических ошибок
function stripCitationsGlobal() {
    const citeRegex = new RegExp("\\[c" + "ite: \\d+\\]", "g");
    Object.values(classData).forEach(cls => {
        if (cls.description) cls.description = cls.description.replace(citeRegex, "");
        if (cls.features) Object.values(cls.features).forEach(arr => arr.forEach(f => { if (f.description) f.description = f.description.replace(citeRegex, ""); }));
        if (cls.subclasses) Object.values(cls.subclasses).forEach(sub => {
            if (sub.features) Object.values(sub.features).forEach(arr => arr.forEach(f => { if (f.description) f.description = f.description.replace(citeRegex, ""); }));
        });
    });
    Object.values(weaponsData).forEach(w => {
        if (w.description) w.description = w.description.replace(citeRegex, "");
    });
}
stripCitationsGlobal();

let currentTabUrl = "";

// Таблица опыта по уровням
const XP_TABLE = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000];

async function loadTabContent(tabUrl) {
    if (currentTabUrl === tabUrl) return;

    const container = document.getElementById("dynamic-tab-content");
    const sidePanel = document.getElementById("independentSidePanel");

    try {
        const response = await fetch(tabUrl);
        if (!response.ok) throw new Error(`Ошибка загрузки ${tabUrl}`);

        container.innerHTML = await response.text();
        currentTabUrl = tabUrl;

        if (sidePanel) {
            if (tabUrl.includes("settingsUI")) sidePanel.classList.add("hidden");
            else sidePanel.classList.remove("hidden");
        }

        switch (tabUrl) {
            case "htmls/mainUI.html": if (typeof initMainTab === "function") initMainTab(); break;
            case "htmls/skillsUI.html": if (typeof initSkillsTab === "function") initSkillsTab(); break;
            case "htmls/backpackUI.html": if (typeof initBackpackTab === "function") initBackpackTab(); break;
            case "htmls/settingsUI.html": if (typeof initSettingsTab === "function") initSettingsTab(); break;
            case "htmls/magicbookUI.html": if (typeof initMagicbookTab === "function") initMagicbookTab(); break;
        }

        if (typeof window.initGlobalInspector === "function") window.initGlobalInspector();

    } catch (err) {
        console.error("🔥 Ошибка роутера:", err);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            if (btn.getAttribute("data-tab")) loadTabContent(btn.getAttribute("data-tab"));
        });
    });

    loadTabContent("htmls/mainUI.html");
    bindGlobalNoteEvents();
    renderGlobalNotes();
    initHeaderUI();
    initAvatarCropper();

    document.addEventListener('charDataUpdated', () => {
        initHeaderUI();
        if(typeof window.renderGlobalNotes === "function") window.renderGlobalNotes();
    });

    const sidePanel = document.getElementById("independentSidePanel");
    if (sidePanel) {
        const toggleBtn = document.createElement("button");
        toggleBtn.innerHTML = "📝 Инфо";
        toggleBtn.className = "mobile-panel-toggle";
        document.body.appendChild(toggleBtn);

        toggleBtn.onclick = () => {
            sidePanel.classList.toggle("mobile-open");
            toggleBtn.style.bottom = sidePanel.classList.contains("mobile-open") ? "32vh" : "20px";
        };
    }
});

// ==========================================
// ЛОГИКА ХЭДЕРА И АВАТАРА
// ==========================================

function initHeaderUI() {
    if (!charData.origin) charData.origin = {};
    if (!charData.origin.xp) charData.origin.xp = 0;

    const level = charData.origin.level || 1;
    const xp = charData.origin.xp;

    const charName = charData.origin.name && charData.origin.name.trim() !== "" ? charData.origin.name : "Без имени";
    const nameEl = document.getElementById('headerCharName');
    if (nameEl && nameEl.innerText !== charName) nameEl.innerText = charName;

    const levelEl = document.getElementById('headerLevelDisplay');
    if (levelEl && levelEl.innerText !== String(level)) levelEl.innerText = level;

    let currentLvlXp = XP_TABLE[level - 1] || 0;
    let nextLvlXp = XP_TABLE[level] || XP_TABLE[19];

    let isMax = level >= 20;
    let canLevelUp = !isMax && xp >= nextLvlXp;

    const xpText = document.getElementById('xpTextDisplay');
    const expectedXpText = isMax ? `${xp} ОП (Макс)` : `${xp} / ${nextLvlXp} ОП`;
    if (xpText && xpText.innerText !== expectedXpText) xpText.innerText = expectedXpText;

    let progress = 100;
    if (!isMax) {
        progress = ((xp - currentLvlXp) / (nextLvlXp - currentLvlXp)) * 100;
        if (progress < 0) progress = 0;
        if (progress > 100) progress = 100;
    }

    const barFill = document.getElementById('xpBarFill');
    const levelUpText = document.getElementById('xpLevelUpText');

    if (barFill && levelUpText) {
        barFill.style.width = progress + '%';

        if (canLevelUp) {
            levelUpText.style.opacity = 1;
            barFill.style.background = "linear-gradient(90deg, #f59e0b, #d97706)";
        } else {
            levelUpText.style.opacity = 0;
            barFill.style.background = "linear-gradient(90deg, var(--accent-success), #1b8a7f)";
        }
    }

    const img = document.getElementById('avatarImage');
    const ph = document.getElementById('avatarPlaceholder');

    if (img && ph) {
        if (charData.origin.avatar) {
            if (img.src !== charData.origin.avatar) {
                img.src = charData.origin.avatar;
            }
            img.style.display = 'block';
            ph.style.display = 'none';
        } else {
            if (img.src !== "") img.src = "";
            img.style.display = 'none';
            ph.style.display = 'block';
        }
    }
}

window.changeXp = function(multiplier) {
    const input = document.getElementById("xpChangeInput");
    const val = parseInt(input.value);
    if (!isNaN(val) && val > 0) {
        charData.origin.xp += (val * multiplier);
        if (charData.origin.xp < 0) charData.origin.xp = 0;
        input.value = "";
        initHeaderUI();
        document.dispatchEvent(new Event('charDataUpdated'));
    }
};

// ==========================================
// КРОППЕР ИЗОБРАЖЕНИЙ
// ==========================================

function initAvatarCropper() {
    const container = document.getElementById('avatarContainer');
    const input = document.getElementById('avatarInput');
    const modal = document.getElementById('cropModal');
    const cropImage = document.getElementById('cropImage');
    const zoomSlider = document.getElementById('cropZoom');
    const cropBox = document.getElementById('cropContainer');
    const hoverLayer = document.getElementById('avatarHoverLayer');

    let cropImgX = 0, cropImgY = 0, cropScale = 1;
    let isDraggingCrop = false, startDragX = 0, startDragY = 0;

    container.onmouseenter = () => hoverLayer.style.opacity = 1;
    container.onmouseleave = () => hoverLayer.style.opacity = 0;
    container.onclick = () => input.click();

    input.onchange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                cropImage.src = e.target.result;
                cropImage.onload = () => {
                    const scaleX = 250 / cropImage.naturalWidth;
                    const scaleY = 250 / cropImage.naturalHeight;
                    cropScale = Math.max(scaleX, scaleY);

                    zoomSlider.min = cropScale / 2;
                    zoomSlider.max = cropScale * 4;
                    zoomSlider.value = cropScale;

                    cropImgX = (250 - cropImage.naturalWidth * cropScale) / 2;
                    cropImgY = (250 - cropImage.naturalHeight * cropScale) / 2;

                    updateCropTransform();
                    modal.classList.add('visible');
                }
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    function updateCropTransform() {
        cropImage.style.transform = `translate(${cropImgX}px, ${cropImgY}px) scale(${cropScale})`;
    }

    zoomSlider.oninput = (e) => {
        const oldScale = cropScale;
        cropScale = parseFloat(e.target.value);
        const centerOffsetX = (250 / 2) - cropImgX;
        const centerOffsetY = (250 / 2) - cropImgY;
        cropImgX -= centerOffsetX * (cropScale / oldScale - 1);
        cropImgY -= centerOffsetY * (cropScale / oldScale - 1);
        updateCropTransform();
    };

    const startDrag = (e) => {
        isDraggingCrop = true;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        startDragX = clientX - cropImgX;
        startDragY = clientY - cropImgY;
        cropBox.style.cursor = 'grabbing';
        if(e.touches) e.preventDefault();
    };

    const drag = (e) => {
        if (isDraggingCrop) {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            cropImgX = clientX - startDragX;
            cropImgY = clientY - startDragY;
            updateCropTransform();
            if(e.touches) e.preventDefault();
        }
    };

    const stopDrag = () => {
        isDraggingCrop = false;
        cropBox.style.cursor = 'grab';
    };

    cropBox.onmousedown = startDrag;
    cropBox.ontouchstart = startDrag;
    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', drag, {passive: false});
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);

    document.getElementById('cropCancelBtn').onclick = () => {
        modal.classList.remove('visible');
        input.value = '';
    };

    document.getElementById('cropConfirmBtn').onclick = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#181b22';
        ctx.fillRect(0, 0, 300, 300);

        const sx = -cropImgX / cropScale;
        const sy = -cropImgY / cropScale;
        const sWidth = 250 / cropScale;
        const sHeight = 250 / cropScale;

        ctx.drawImage(cropImage, sx, sy, sWidth, sHeight, 0, 0, 300, 300);

        charData.origin.avatar = canvas.toDataURL('image/jpeg', 0.85);
        initHeaderUI();
        modal.classList.remove('visible');
        input.value = '';
        document.dispatchEvent(new Event('charDataUpdated'));
    };
}

// ==========================================
// ГЛОБАЛЬНАЯ ЛОГИКА ЗАМЕТОК
// ==========================================

window.renderGlobalNotes = function() {
    const container = document.getElementById("notesListContainer");
    if (!container) return;
    if (!charData.notes || charData.notes.length === 0) {
        container.innerHTML = `<p class="font-group-3" style="color: var(--text-muted); font-style: italic; padding: 15px; text-align: center;">Заметок пока нет</p>`;
        return;
    }

    let html = "";
    charData.notes.forEach((note, idx) => {
        const safeDesc = escapeHTML(`<b>Заметка: ${note.title}</b><br><br>${note.text}`);
        html += `
            <div class="inventory-item-row interactive-node note-item-row" data-inspector="${safeDesc}" style="cursor: pointer; padding: 8px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                <span class="inv-item-name" style="color: var(--accent-yellow); font-weight: bold; font-size: 13px;">📝 ${escapeHTML(note.title)}</span>
                <span class="delete-note-btn" data-idx="${idx}" title="Удалить" style="font-size: 14px; color: var(--accent); cursor: pointer; padding: 0 5px;">✕</span>
            </div>`;
    });
    container.innerHTML = html;

    container.querySelectorAll('.delete-note-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            charData.notes.splice(parseInt(btn.getAttribute("data-idx")), 1);
            window.renderGlobalNotes();
            document.dispatchEvent(new Event('charDataUpdated'));
        };
    });

    if (typeof window.initGlobalInspector === "function") window.initGlobalInspector();
};

function bindGlobalNoteEvents() {
    const addNoteBtn = document.getElementById("addNoteBtn");
    const modal = document.getElementById("noteCreateModal");
    const titleInp = document.getElementById("noteTitleInput");
    const textInp = document.getElementById("noteTextInput");
    const confirmBtn = document.getElementById("noteConfirmBtn");
    const cancelBtn = document.getElementById("noteCancelBtn");

    if (addNoteBtn && modal) {
        addNoteBtn.onclick = () => {
            titleInp.value = ""; textInp.value = "";
            modal.classList.add("visible");
        };

        confirmBtn.onclick = () => {
            const title = titleInp.value.trim() || "Без названия";
            const text = textInp.value.trim() || "Нет описания";
            if (!charData.notes) charData.notes = [];
            charData.notes.push({ title, text });
            window.renderGlobalNotes();
            modal.classList.remove("visible");
            document.dispatchEvent(new Event('charDataUpdated'));
        };

        cancelBtn.onclick = () => modal.classList.remove("visible");
    }
}