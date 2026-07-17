// ==========================================
// ГЛОБАЛЬНЫЕ УТИЛИТЫ И ПОМОЩНИКИ (utils.js)
// ==========================================

/**
 * Надежная защита от XSS-уязвимостей при рендере пользовательского текста в HTML
 */
export function escapeHTML(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

window.escapeHTML = escapeHTML;

/**
 * Универсальный генератор HTML-таблиц для всех предметов.
 * (В будущем можно будет заменить им дублирующиеся функции во всех файлах Data)
 */
export function generateUniversalItemHTML({ type, rarity, attunement, cost, weight, effect }) {
    let rarityHtml = rarity ? `<tr style='border-bottom:1px solid var(--border-color);'><td style='font-weight:bold; color:var(--text-muted); padding:6px 4px;'>Редкость:</td><td style='padding:6px 4px;'>${rarity}</td></tr>` : "";

    let attunementHtml = "";
    if (attunement) {
        const attunementStyle = attunement.includes("Требуется") ? "color:var(--accent-yellow); font-weight:bold;" : "color:var(--text-muted);";
        attunementHtml = `<tr style='border-bottom:1px solid var(--border-color);'><td style='font-weight:bold; color:var(--text-muted); padding:6px 4px;'>Настройка:</td><td style='padding:6px 4px; ${attunementStyle}'>${attunement}</td></tr>`;
    }

    const weightText = (weight && weight !== "—") ? weight : "незначительный";
    const costText = cost ? cost : "Нет цены";

    return `
    <p style='margin-bottom: 10px; line-height: 1.45; text-align: justify;'>${effect}</p>
    <table style='width:100%; text-align:left; border-collapse:collapse; margin-top:8px; font-size:13px;'>
        <tr style='border-bottom:1px solid var(--border-color);'><td style='font-weight:bold; color:var(--text-muted); padding:6px 4px; width:120px;'>Категория:</td><td style='padding:6px 4px;'>${type}</td></tr>
        ${rarityHtml}
        ${attunementHtml}
        <tr style='border-bottom:1px solid var(--border-color);'><td style='font-weight:bold; color:var(--accent-success); padding:6px 4px;'>Стоимость / Вес:</td><td style='padding:6px 4px;'><b>${costText}</b> / ${weightText}</td></tr>
    </table>
    `;
}