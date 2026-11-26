(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var phone = window.matchMedia('(max-width: 720px)');

  /* ---------- герой: черта между OKU и LAND раскрывается в пилюлю ---------- */
  var pill = document.getElementById('pill');
  var line = pill.querySelector('.pill__line');
  var tag = document.getElementById('pillTag');
  var halves = document.querySelectorAll('.word__half');
  var foot = document.querySelectorAll('.bento--hero > .t:not(.t--word)');
  var rule = document.querySelector('.hero__rule');
  var ease = 'cubic-bezier(.22,1,.36,1)';

  function reveal() {
    if (reduce || !pill.animate) return;
    var dur = 2000;
    var vertical = phone.matches;
    var cs = getComputedStyle(pill);
    var W = cs.width, H = cs.height;
    var size = vertical
      ? [{ height: '2px', offset: 0 }, { height: '2px', offset: .14 }, { height: '10%', offset: .3 }, { height: (parseFloat(W) * .5) + 'px', offset: .58 }, { height: H, offset: 1 }]
      : [{ width: '.02em', offset: 0 }, { width: '.02em', offset: .14 }, { width: '.16em', offset: .3 }, { width: H, offset: .58 }, { width: W, offset: 1 }];
    if (vertical) size[3].height = Math.min(parseFloat(H), parseFloat(W) * .35) + 'px';
    pill.animate(size, { duration: dur, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'backwards' });
    pill.animate(
      [{ clipPath: vertical ? 'inset(0 50% round 999px)' : 'inset(50% 0 round 999px)' }, { clipPath: 'inset(0 0 round 999px)', offset: .14 }, { clipPath: 'inset(0 0 round 999px)' }],
      { duration: dur, fill: 'backwards' });
    line.animate([{ opacity: 1 }, { opacity: 1, offset: .16 }, { opacity: 0, offset: .34 }, { opacity: 0 }], { duration: dur, fill: 'backwards' });
    tag.animate([{ opacity: 0, transform: 'translate(-50%,8px)' }, { opacity: 0, offset: .78 }, { opacity: 1, transform: 'translate(-50%,0)' }], { duration: dur, easing: ease, fill: 'backwards' });
    halves.forEach(function (h, i) {
      var d = (i === 0 ? 1 : -1) * (vertical ? 0 : .04);
      h.animate([{ transform: 'translateX(' + d + 'em)' }, { transform: 'translateX(' + d + 'em)', offset: .3 }, { transform: 'none' }], { duration: dur, easing: ease, fill: 'backwards' });
    });
    foot.forEach(function (t, i) { t.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 0, offset: .45 + i * .06 }, { opacity: 1, transform: 'none' }], { duration: dur + 200, easing: ease, fill: 'backwards' }); });
    if (rule) rule.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(0)', offset: .45 }, { transform: 'scaleX(1)' }], { duration: dur, easing: ease, fill: 'backwards' });
    return dur;
  }

  /* фото внутри пилюли сменяют друг друга (а надпись подсказывает кружок) */
  var imgs = pill.querySelectorAll('img');
  var cur = 0;
  function cycle() {
    imgs[cur].classList.remove('is-on');
    cur = (cur + 1) % imgs.length;
    imgs[cur].classList.add('is-on');
    tag.textContent = imgs[cur].dataset.name;
  }

  function start() {
    var d = reveal() || 0;
    if (!reduce) setTimeout(function () { setInterval(cycle, 2600); }, d + 600);
  }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(start);

  /* ---------- шапка ---------- */
  var hdr = document.querySelector('.hdr');
  function onScroll() { hdr.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var burger = document.querySelector('.burger');
  var mnav = document.getElementById('mnav');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    mnav.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  mnav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1080) setMenu(false); });

  /* ---------- цены: на ребёнка / на семью ---------- */
  var PRICES = { kids: { 1: 24990, 3: 64990, 6: 119990, 12: 199990 }, family: { 1: 39990, 3: 104990, 6: 194990, 12: 329990 } };
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  var seg = document.querySelectorAll('.seg button');
  seg.forEach(function (b) {
    b.addEventListener('click', function () {
      seg.forEach(function (x) { x.setAttribute('aria-checked', x === b); });
      var p = PRICES[b.dataset.plan];
      document.querySelectorAll('[data-p]').forEach(function (el) { el.textContent = fmt(p[el.dataset.p]); });
      document.querySelectorAll('[data-m]').forEach(function (el) {
        var m = +el.dataset.m; el.textContent = fmt(Math.round(p[m] / m / 10) * 10);
      });
      document.querySelectorAll('[data-p3]').forEach(function (el) { el.textContent = fmt(p[3]); });
      document.querySelectorAll('[data-v]').forEach(function (el) { el.textContent = b.dataset.plan === 'kids' ? '12 посещений в месяц' : 'Общий лимит на всех детей'; });
      document.querySelectorAll('[data-s]').forEach(function (el) { el.textContent = Math.round((1 - p[12] / (p[1] * 12)) * 100); });
    });
  });

  /* ---------- формы: письмо с заполненными полями ---------- */
  document.querySelectorAll('form[data-mail]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var lines = [];
      new FormData(f).forEach(function (v, k) { lines.push(k + ': ' + v); });
      location.href = 'mailto:hello@okuland.kz?subject=' + encodeURIComponent(f.dataset.mail) + '&body=' + encodeURIComponent(lines.join('\n'));
      var ok = f.querySelector('.form__ok'); if (ok) ok.hidden = false;
    });
  });
})();
