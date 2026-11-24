# OkuLand — сайт

Статический сайт OkuLand: единый абонемент на детские кружки и секции.
Чистый HTML/CSS/JS без сборки — можно открыть `index.html` в браузере или выложить на GitHub Pages / любой хостинг.

## Страницы
- `index.html` — главная
- `kruzhki.html` — каталог кружков с фильтрами
- `ceny.html` — тарифы Kids / Family
- `partneram.html` — для кружков и студий, форма заявки
- `kompaniyam.html` — корпоративный абонемент
- `faq.html` — вопросы и ответы
- `o-nas.html` — о компании
- `404.html` — страница «не найдено» (GitHub Pages подхватит её сама)

## Что заменить перед запуском
- Кружки в каталоге — демо-данные в `assets/js/main.js` (массив `STUDIOS`).
- Цены — `PRICES` в `assets/js/main.js`.
- Формы заявок пока только показывают подтверждение: подключите отправку (WhatsApp, Telegram-бот, CRM).
- Ссылки на App Store, Google Play, Kaspi, оферту и политику конфиденциальности; телефон и e-mail в подвале.
- Фотографии в `assets/img/photos/` — убедитесь, что у вас есть права на их использование (лицензия стока или собственные фото с согласием родителей).

## Как сделан редизайн (v2)
Использованы: taste-skill (Leonxlnx), impeccable (pbakaus), playwright-cli (Microsoft) для проверки в браузере, подход img2threejs для 3D-шаңырака,
DESIGN.md по формату awesome-design-md (идеи pill-кнопок из Uber DESIGN.md) и галереи navbar.gallery, footer.design, cta.gallery,
404s.design, unsection.com, bentogrids.com, 60fps.design, motionsites.ai. Описание дизайн-системы — в `DESIGN.md`.
Three.js r160 лежит в `assets/vendor/` (лицензия MIT).

## Бренд
Цвета, шрифты и логотипы — по брендбуку OkuLand: Telegram Blue `#2AABEE`, Code Blue `#007ACC`, шрифты Nunito и Nunito Sans. Логотипы в `assets/img/brand/`.
