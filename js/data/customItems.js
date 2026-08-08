// БАЗА КАСТОМНЫХ ПРЕДМЕТОВ (customItems.js)
export const customItemsData = {
    "custom_1784999901410": {
        "name": "Кинжал “Тень присяги”",
        "category": "Простое рукопашное оружие",
        "type": "Оружие",
        "cost": "200 ЗМ",
        "weight": 1,
        "singleWeight": 1,
        "description": "<table style='width:100%; text-align:left; border-collapse:collapse; margin-bottom:8px; font-size:13px;'><tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--accent-success); padding:6px;'>Урон:</td><td style='padding:6px;'><b>1к4+1 (Колющий)</b><br><small>Скейл: Ловкость</small></td></tr><tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--text-muted); padding:6px;'>Свойства:</td><td style='padding:6px;'>Лёгкое, Метательное (дис. 20/60)</td></tr><tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--accent-success); padding:6px;'>Навык:</td><td style='padding:6px;'><b>+1 — Скрытность</b> при надевании</td></tr><tr style='border-bottom:1px solid var(--border-color);'><td style='color:var(--accent-success); padding:6px;'>Навык:</td><td style='padding:6px;'><b>+1 — Ловкость рук</b> при надевании</td></tr><tr><td style='color:var(--accent-success); padding:6px;'>Стоимость/Вес:</td><td style='padding:6px;'><b>200 ЗМ</b> / 1 фнт.</td></tr></table><p style='margin:0 0 10px; text-align:justify;'>Магическое оружие. Яд Тени (1/день):<br>Когда вы попадаете этим кинжалом по существу с преимуществом (Sneak Attack разрешён), вы можете активировать эффект яда:<br>• Цель делает спасбросок Телосложения DC 12.<br>• При провале — получает 1d6 урона от яда, и не может использовать реакции до начала своего следующего хода.</p><p style='margin:0 0 10px; text-align:justify;'>Тишина в руке:<br>• Пока вы держите кинжал — получаете +1 к проверкам Ловкости (Sleight of Hand)<br>• и +1 к проверкам Скрытности (Stealth), если не носите тяжёлую броню.</p>",
        "costInCp": 20000,
        "damage": "1к4+1",
        "damageType": "Колющий",
        "properties": "Лёгкое, Метательное (дис. 20/60)",
        "scalingAbility": "dex",
        "equipEffects": {
            "skills": {
                "stealth": 1,
                "sleight_of_hand": 1
            }
        }
    },
    "custom_1786209614468": {
        "name": "Плащ Теней Сумеречного Ветра",
        "category": "Плащ",
        "type": "Плащ",
        "cost": "400 ЗМ",
        "weight": 4,
        "singleWeight": 4,
        "description": "<table style='width:100%; text-align:left; border-collapse:collapse; margin-bottom:8px; font-size:13px;'><tr><td style='color:var(--accent-success); padding:6px;'>Стоимость/Вес:</td><td style='padding:6px;'><b>400 ЗМ</b> / 4 фнт.</td></tr></table><p style='margin:0 0 10px; text-align:justify;'>Этот лёгкий, тёмно-серый плащ переливается словно туман на границе дня и ночи. Легенды гласят, что его когда-то носил лазутчик Лунного Дозора, исчезнувший в Кормирских горах.</p><p style='margin:0 0 10px; text-align:justify;'>Пока вы находитесь в скрытности или в состоянии невидимости — вы получаете +2 к броску атаки.<br>Если при этом достигается естественная 20, помимо критического урона накладывается дополнительный эффект — например, оглушение цели на 1 раунд (определяет GM).</p><p style='margin:0 0 10px; text-align:justify;'>Зов Сумерек (1/день)<br>Как бонусное действие вы можете переместиться до 10 футов в пределах видимости, не провоцируя атаки возможности. Это движение представляет собой почти незаметный манёвр, сопровождаемый лёгким следом лунной пыли, исчезающим через секунды.</p>",
        "costInCp": 40000
    }
};
