// ==========================================
// УНИВЕРСАЛЬНЫЙ ИНСПЕКТОР ОПИСАНИЙ (infoTab.js)
// ==========================================

import { statsData } from '../data/statsData.js';

let lastTouchedNode = null;
let touchTimeout = null;

export function initInspector() {
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

    if (!window.touchInspectorBound) {
        document.addEventListener('click', (e) => {
            if (e.pointerType === 'touch' || (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents)) {
                const node = e.target.closest('[data-inspector]');
                if (!node) return;

                if (lastTouchedNode !== node) {
                    e.preventDefault();
                    e.stopPropagation();
                    lastTouchedNode = node;

                    const keyOrText = node.getAttribute("data-inspector");
                    const descText = statsData[keyOrText] || keyOrText;
                    textPanel.innerHTML = `<p class="font-group-3" style="text-align: justify; line-height: 1.45;">${descText}</p>`;

                    clearTimeout(touchTimeout);
                    touchTimeout = setTimeout(() => { lastTouchedNode = null; }, 2500);
                } else {
                    lastTouchedNode = null;
                    clearTimeout(touchTimeout);
                }
            }
        }, { capture: true });
        window.touchInspectorBound = true;
    }
}

window.initGlobalInspector = initInspector;