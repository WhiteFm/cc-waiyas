// ==========================================
// УНИВЕРСАЛЬНЫЙ ИНСПЕКТОР ОПИСАНИЙ (infoTab.js)
// ==========================================

import { statsData } from '../data/statsData.js';

export function initInspector() {
    // Ищем глобальную панель в index.html
    const textPanel = document.getElementById("inspectorDescriptionPanel");
    if (!textPanel) return;

    const inspectableElements = document.querySelectorAll("[data-inspector]");

    inspectableElements.forEach(node => {
        node.onmouseenter = () => {
            const keyOrText = node.getAttribute("data-inspector");
            const descText = statsData[keyOrText] || keyOrText;
            textPanel.innerHTML = `<p class="font-group-3" style="text-align: justify; line-height: 1.45;">${descText}</p>`;
        };

        if (node.classList.contains('interactive-node') && !node.classList.contains('selected-feat-btn')) {
            node.onmouseleave = () => {
                node.style.background = "";
            };
            node.onmouseover = () => {
                node.style.background = "rgba(255, 255, 255, 0.06)";
            };
        }
    });
}

// Экспортируем в окно, чтобы роутер (app.js) мог дергать инспектор при переключении вкладок
window.initGlobalInspector = initInspector;