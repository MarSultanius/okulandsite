/* OkuLand — меню, тарифы, каталог, формы */
(function () {
  // мобильное меню
  var burger = document.querySelector('.burger');
  var menu = document.querySelector('.nav__menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
  }
  // выпадающие меню
  document.querySelectorAll('.dd').forEach(function (dd) {
    var btn = dd.querySelector('button');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var was = dd.classList.contains('open');
      document.querySelectorAll('.dd.open').forEach(function (d) { d.classList.remove('open'); d.querySelector('button').setAttribute('aria-expanded', 'false'); });
      if (!was) { dd.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('.dd.open').forEach(function (d) { d.classList.remove('open'); d.querySelector('button').setAttribute('aria-expanded', 'false'); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.querySelectorAll('.dd.open').forEach(function (d) { d.classList.remove('open'); });
  });

  // тарифы
  var PRICES = {
    kids:   { 1: 24990, 3: 64990, 6: 119990, 12: 199990 },
    family: { 1: 39990, 3: 104990, 6: 194990, 12: 329990 }
  };
  var VISITS = { kids: '12 посещений в месяц', family: '20 посещений в месяц на всю семью' };
  var fmt = function (n) { return n.toLocaleString('ru-RU').replace(/ |,/g, ' ') + ' ₸'; };
  var monthWord = function (m) { return m === 1 ? '1 месяц' : m + (m < 5 ? ' месяца' : ' месяцев'); };
  function renderPlans(root, plan) {
    var html = [1, 3, 6, 12].map(function (m) {
      var total = PRICES[plan][m], per = Math.round(total / m), base = PRICES[plan][1] * m, pop = m === 12;
      var freeze = m >= 6 ? 'Заморозка до ' + (m === 12 ? 30 : 14) + ' дней' : 'Без заморозки';
      return '<article class="plan' + (pop ? ' plan--pop' : '') + '">' +
        (pop ? '<span class="plan__badge">Самый выгодный</span>' : '') +
        '<h3>' + monthWord(m) + '</h3>' +
        '<div class="plan__per">' + fmt(per) + ' <small>в месяц</small></div>' +
        '<p class="plan__tot">' + (m > 1 ? '<s>' + fmt(base) + '</s> ' : '') + fmt(total) + ' за весь срок</p>' +
        '<ul><li>' + VISITS[plan] + '</li><li>Все кружки города</li><li>' + freeze + '</li><li>Пробное занятие для друга</li></ul>' +
        '<div class="btns"><a class="btn btn--main btn--sm" href="#download">Скачать приложение</a><a class="btn btn--kaspi btn--sm" href="#download">Оформить в Kaspi</a></div>' +
        '</article>';
    }).join('');
    root.querySelector('.plans').innerHTML = html;
  }
  document.querySelectorAll('[data-pricing]').forEach(function (root) {
    var plan = 'kids';
    renderPlans(root, plan);
    root.querySelectorAll('[data-plan]').forEach(function (b) {
      b.addEventListener('click', function () {
        plan = b.dataset.plan;
        root.querySelectorAll('[data-plan]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        renderPlans(root, plan);
      });
    });
  });

  // каталог
  var list = document.getElementById('studios');
  if (list) {
    var CATS = { sport: 'Спорт и ОФП', swim: 'Плавание', football: 'Футбол', basket: 'Баскетбол', fight: 'Единоборства', dance: 'Танцы и балет', music: 'Музыка', science: 'Наука', art: 'Творчество', code: 'Программирование', robo: 'Робототехника', chess: 'Шахматы', eng: 'Английский' };
    // ДЕМО-ДАННЫЕ: заменить на реальных партнёров после подписания договоров
    var STUDIOS = [
      ['Гимнастика «Грация»', 'sport', [4, 12], 'Нур-Актобе', 'ул. Есет батыра, 101', 9.8, true, 'gymnastics'],
      ['Бассейн «Дельфин»', 'swim', [5, 17], 'Батыс-2', 'ул. Бокенбай батыра, 156', 9.6, true, 'swimming'],
      ['ФК «Жастар»', 'football', [5, 14], 'Жилгородок', 'ул. Шернияза, 9', 9.5, true, 'football'],
      ['Баскетбол «Slam»', 'basket', [7, 17], '12 мкр', 'мкр. 12, д. 14', 9.4, false, 'basketball'],
      ['Бокс «Барыс»', 'fight', [7, 17], '11 мкр', 'мкр. 11, д. 2', 9.5, true, 'boxing'],
      ['Балет «Аққу»', 'dance', [4, 14], 'Центр', 'ул. Айтеке би, 8', 9.9, false, 'ballet'],
      ['Музыкальная студия «Rock Kids»', 'music', [6, 17], 'Центр', 'ул. Пушкина, 3', 9.7, true, 'music'],
      ['Лаборатория «Юный химик»', 'science', [6, 13], 'Батыс-2', 'ул. Тауелсіздік, 12', 9.8, true, 'science'],
      ['Арт-студия «Палитра»', 'art', [4, 12], 'Жилгородок', 'ул. Маресьева, 77', 9.6, true, 'art'],
      ['ОФП «Сильные дети»', 'sport', [7, 15], 'Нур-Актобе', 'ул. Санкибай батыра, 22', 9.3, true, 'ofp'],
      ['Аквашкола «Капелька»', 'swim', [3, 7], '12 мкр', 'мкр. 12, д. 5А', 9.7, true, 'swim-kid'],
      ['Школа программирования', 'code', [8, 17], 'Центр', 'пр. Абилкайыр хана, 40', 9.8, true, null],
      ['Робототехника «RoboKids»', 'robo', [6, 14], 'Батыс-2', 'ул. Тауелсіздік, 30', 9.6, true, null],
      ['Шахматный клуб «Ақ Ферзь»', 'chess', [5, 15], 'Центр', 'ул. Айтеке би, 21', 9.9, false, null],
      ['Английский «Speak Up»', 'eng', [5, 17], 'Нур-Актобе', 'ул. Есет батыра, 55', 9.5, true, null]
    ];
    var fcat = document.getElementById('fcat'), fdist = document.getElementById('fdist'), fage = document.getElementById('fage'), fq = document.getElementById('fq');
    Object.keys(CATS).forEach(function (k) { fcat.add(new Option(CATS[k], k)); });
    Array.from(new Set(STUDIOS.map(function (s) { return s[3]; }))).sort().forEach(function (d) { fdist.add(new Option(d, d)); });
    var params = new URLSearchParams(location.search);
    if (params.get('cat') && CATS[params.get('cat')]) fcat.value = params.get('cat');
    function render() {
      var q = fq.value.trim().toLowerCase(), c = fcat.value, a = +fage.value, d = fdist.value;
      var res = STUDIOS.filter(function (s) {
        return (!c || s[1] === c) && (!d || s[3] === d) && (!a || (s[2][0] <= a && s[2][1] >= a)) &&
          (!q || (s[0] + ' ' + CATS[s[1]]).toLowerCase().indexOf(q) > -1);
      });
      list.innerHTML = res.length ? res.map(function (s) {
        var img = s[7] ? '<img src="assets/img/photos/' + s[7] + '.webp" alt="' + CATS[s[1]] + ' для детей" loading="lazy" width="600" height="400">'
                       : '<img class="studio__shan" src="assets/img/brand/okuland-shanyrak-white.svg" alt="">';
        return '<article class="studio"><div class="studio__img">' + img + '</div><div class="studio__body">' +
          '<div class="studio__row"><h3>' + s[0] + '</h3><span class="rate">★ ' + s[5] + '</span></div>' +
          '<div class="tags"><span class="tag">' + CATS[s[1]] + '</span><span class="tag">' + s[2][0] + '–' + s[2][1] + ' лет</span>' + (s[6] ? '<span class="tag">Есть пробное</span>' : '') + '</div>' +
          '<p class="meta">' + s[3] + ', ' + s[4] + '</p></div></article>';
      }).join('') : '<p class="empty">По этим фильтрам кружков пока нет. Попробуйте другой район или возраст.</p>';
    }
    [fq, fcat, fage, fdist].forEach(function (el) { el.addEventListener('input', render); });
    render();
  }

  // формы (до подключения CRM/WhatsApp показывают подтверждение)
  document.querySelectorAll('form[data-form]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      f.querySelector('.form__ok').style.display = 'block';
      f.querySelector('button[type="submit"]').disabled = true;
    });
  });

  // год в подвале
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

/* v2: фото-главы направлений — фото справа меняется, когда глава доходит до середины экрана */
(function () {
  var stage = document.querySelector('.chapters__stage');
  if (!stage || !('IntersectionObserver' in window)) return;
  var imgs = stage.querySelectorAll('img');
  var label = stage.querySelector('.chapters__label');
  var chapters = document.querySelectorAll('.chapter');
  function show(i) {
    chapters.forEach(function (c, k) { c.classList.toggle('is-on', k === i); });
    imgs.forEach(function (im, k) { im.classList.toggle('is-on', k === i); });
    if (label) label.textContent = chapters[i].querySelector('h3').textContent;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) show([].indexOf.call(chapters, e.target)); });
  }, { rootMargin: '-45% 0px -45% 0px' });
  chapters.forEach(function (c) { io.observe(c); });
  show(0);
})();
