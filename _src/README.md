# מקור המדריך

- `build.py`: חותך ומטשטש צילומי מסך (מקור: צילומים גולמיים, לא נשמרים כאן) ומפיק `figs.json` עם מיקומי הסימונים.
- `render.py`: בונה את `index.html` מ `figs.json`, `guide.css`, `guide.js`. נכשל אם יש מקף ארוך או בינוני.
- PDF: `chrome-headless-shell --print-to-pdf=cloudchat-golive-guide.pdf index.html`.
- מצב הצגה: כפתור "מצב הצגה" או `?present`, מעבר בחצים, Esc ליציאה.
- צילומי קלאודצ'אט מחשבון אמיתי עם טשטוש; צילומי הפורטל ממערכת הדגמה עם נתונים סינתטיים.
