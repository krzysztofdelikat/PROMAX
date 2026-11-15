/* PROMAX – skrypty strony */
(function () {
  'use strict';
  window.__promaxReady = true;

  /* ---- Logotypy klientów („Zaufali nam”) ----
     Nowe logo: dodaj plik do assets/img/klienci/ i dopisz linię poniżej. */
  var CLIENT_LOGOS = [
    { src: 'assets/img/klienci/ostoya.webp', alt: 'Ostoya' },
    { src: 'assets/img/klienci/lift-rzeszow-orona.webp', alt: 'Lift Rzeszów Orona' },
    { src: 'assets/img/klienci/synektik.webp', alt: 'Synektik' },
    { src: 'assets/img/klienci/poeton-polska.webp', alt: 'Poeton Polska' },
    { src: 'assets/img/klienci/overra.webp', alt: 'Overra – świat łazienek' },
    { src: 'assets/img/klienci/centrum-medyczne-medyk.webp', alt: 'Centrum Medyczne Medyk' },
    { src: 'assets/img/klienci/hansen.webp', alt: 'Hansen' },
    { src: 'assets/img/klienci/fundacja-quality-qlture.webp', alt: 'Fundacja Quality Qlture' },
    { src: 'assets/img/klienci/akademia-aktywnosci.webp', alt: 'Akademia Aktywności Delfina & Bartek' },
    { src: 'assets/img/klienci/evestetic.webp', alt: 'Evestetic – cosmetology & spa' },
    { src: 'assets/img/klienci/reformacka-nieruchomosci.webp', alt: 'Reformacka Nieruchomości' },
    { src: 'assets/img/klienci/alston.webp', alt: 'Alston – jakość & elegancja' }
  ];

  /* ---- Karuzela logotypów: losowa kolejność przy każdym wejściu ---- */
  var track = document.getElementById('clients-track');
  if (track) {
    var logos = CLIENT_LOGOS.slice();
    for (var k = logos.length - 1; k > 0; k--) {           // tasowanie Fisher-Yates
      var j = Math.floor(Math.random() * (k + 1));
      var tmp = logos[k]; logos[k] = logos[j]; logos[j] = tmp;
    }
    logos.forEach(function (c) {
      var tile = document.createElement('div');
      tile.className = 'logo-tile';
      var img = document.createElement('img');
      img.src = c.src; img.alt = c.alt || ''; img.width = 480; img.height = 480;
      tile.appendChild(img);
      track.appendChild(tile);
    });

    var carousel = track.closest('.carousel');
    var viewport = track.parentElement;
    var busy = false, timer = null;
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var SPEED = still ? 0 : 600;     // ms przesunięcia
    var EVERY = 2600;                // ms między krokami

    function stepSize() {
      var t = track.children[0];
      return t.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0);
    }
    function slide(px, ms, done) {
      track.style.transition = ms ? 'transform ' + ms + 'ms cubic-bezier(.65,0,.35,1)' : 'none';
      track.style.transform = 'translate3d(' + px + 'px,0,0)';
      if (!ms) { done && done(); return; }
      var fin = function (e) { if (e && e.target !== track) return; track.removeEventListener('transitionend', fin); clearTimeout(safety); done && done(); };
      var safety = setTimeout(fin, ms + 80);
      track.addEventListener('transitionend', fin);
    }
    function next() {
      if (busy) return; busy = true;
      slide(-stepSize(), SPEED, function () {
        track.appendChild(track.firstElementChild);       // pierwsze logo na koniec
        slide(0, 0); busy = false;
      });
    }
    function prev() {
      if (busy) return; busy = true;
      var s = stepSize();
      track.insertBefore(track.lastElementChild, track.firstElementChild);  // ostatnie na początek
      slide(-s, 0);
      void track.offsetWidth;
      slide(0, SPEED, function () { busy = false; });
    }
    function play() { if (!timer && !still) timer = setInterval(next, EVERY); }
    function stop() { clearInterval(timer); timer = null; }

    carousel.querySelector('.car-next').addEventListener('click', function () { stop(); next(); play(); });
    carousel.querySelector('.car-prev').addEventListener('click', function () { stop(); prev(); play(); });
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', play);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', play);

    // przesuwanie palcem / myszą
    var startX = null;
    viewport.addEventListener('pointerdown', function (e) { startX = e.clientX; stop(); });
    window.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX; startX = null;
      if (dx < -40) next(); else if (dx > 40) prev();
      if (!carousel.matches(':hover')) play();
    });
    viewport.addEventListener('dragstart', function (e) { e.preventDefault(); });

    // nie kręć, gdy karta przeglądarki jest w tle
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : play(); });

    // ruszaj dopiero, gdy karuzela jest na ekranie
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { en[0].isIntersecting ? play() : stop(); }, { threshold: 0.3 }).observe(carousel);
    } else { play(); }
  }

  /* ---- Menu mobilne ---- */
  var header = document.querySelector('.site-header');
  var menuBtn = document.querySelector('.menu-btn');
  if (menuBtn && header) {
    menuBtn.addEventListener('click', function () {
      var open = header.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
    });
    document.querySelectorAll('#menu a').forEach(function (a) {
      a.addEventListener('click', function () {
        header.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Karta usługi → preselekcja w formularzu ---- */
  var select = document.getElementById('service');
  document.querySelectorAll('[data-service]').forEach(function (card) {
    card.addEventListener('click', function () {
      if (select) select.value = card.getAttribute('data-service');
    });
  });

  /* ---- Pojawianie się sekcji i „wjeżdżające” elementy ----
     Każdy element wjeżdża z tej krawędzi ekranu, do której ma bliżej.
     Elementy wyśrodkowane (np. pełna szerokość na telefonie) wysuwają się od dołu. */
  var REVEAL_SELECTORS = [
    '.sec-head > *', 'section > .wrap > .eyebrow', 'section > .wrap > .h2',
    '.fact', '.card', '.step', '.shot-wrap', '.clients .label', '.clients .carousel',
    '.about .copy > *', '.tile', '.shop-in > *',
    '.faq-list details', '.motto .wrap > *',
    '.contact .info > *', '.form', '.footer .wrap > *', '.footer .col'
  ].join(',');

  var root = document.documentElement;

  function direction(el) {
    if (el.dataset.revealFrom) return el.dataset.revealFrom;   // wymuszony kierunek
    var r = el.getBoundingClientRect();
    var vw = window.innerWidth || root.clientWidth;
    var center = r.left + r.width / 2;
    var off = (center - vw / 2) / vw;
    if (Math.abs(off) < 0.06) return 'up';
    return off < 0 ? 'left' : 'right';
  }

  function finish(el) {
    // po animacji zdejmujemy znaczniki – wracają zwykłe efekty hover
    el.removeAttribute('data-reveal');
    el.classList.remove('is-in');
    el.style.removeProperty('--rd');
  }

  if ('IntersectionObserver' in window) {
    var targets = [].slice.call(document.querySelectorAll(REVEAL_SELECTORS))
      .filter(function (el) { return !el.closest('.hero') && !el.closest('.marquee'); });

    // kolejność wjazdu w obrębie wspólnego rodzica (kaskada)
    var groups = new Map();
    targets.forEach(function (el) {
      var p = el.parentElement;
      var i = groups.get(p) || 0;
      groups.set(p, i + 1);
      el.style.setProperty('--rd', Math.min(i, 6) * 110 + 'ms');
      el.style.transition = 'none';                    // ukryj od razu, bez wygaszania
      el.setAttribute('data-reveal', direction(el));
    });
    void document.body.offsetHeight;                   // zatwierdź stan początkowy
    targets.forEach(function (el) { el.style.transition = ''; });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);
        if (el.classList.contains('sec-fade')) { el.classList.add('is-in'); return; }
        el.classList.add('is-in');
        var done = function (ev) {
          if (ev && ev.target !== el) return;
          el.removeEventListener('transitionend', done);
          finish(el);
        };
        el.addEventListener('transitionend', done);
        setTimeout(done, 2200);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

    targets.forEach(function (el) { io.observe(el); });

    // całe sekcje delikatnie się wyłaniają
    document.querySelectorAll('main > section:not(.hero), .clients, .footer').forEach(function (sec) {
      sec.classList.add('sec-fade');
      io.observe(sec);
    });

    // zmiana szerokości okna (np. obrót telefonu) – przelicz strony wjazdu
    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        document.querySelectorAll('[data-reveal]:not(.is-in)').forEach(function (el) {
          el.style.transition = 'none';
          el.removeAttribute('data-reveal');          // pomiar bez przesunięcia
          el.setAttribute('data-reveal', direction(el));
          void el.offsetWidth;
          el.style.transition = '';
        });
      }, 200);
    });
  } else {
    root.classList.remove('js');
  }

  /* ---- Formularz wyceny ----
     Bez backendu: otwiera program pocztowy z uzupełnioną wiadomością.
     Aby zbierać zgłoszenia bez poczty, ustaw FORM_ENDPOINT (np. Formspree,
     Netlify Forms, własny skrypt PHP) – wtedy dane idą metodą POST.          */
  var FORM_ENDPOINT = '';
  var form = document.getElementById('quote-form');
  var status = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!form.reportValidity()) return;
      var d = new FormData(form);

      if (FORM_ENDPOINT) {
        status.textContent = 'Wysyłanie…';
        fetch(FORM_ENDPOINT, { method: 'POST', body: d, headers: { Accept: 'application/json' } })
          .then(function (res) {
            if (!res.ok) throw new Error();
            form.reset();
            status.textContent = 'Dziękujemy! Odezwiemy się z wyceną najszybciej, jak to możliwe.';
          })
          .catch(function () {
            status.textContent = 'Nie udało się wysłać. Zadzwoń: 537 300 960 lub napisz: biuro@promaxreklama.pl';
          });
        return;
      }

      var subject = 'Zapytanie o wycenę – ' + d.get('service');
      var body =
        'Imię i nazwisko: ' + d.get('name') + '\n' +
        'Telefon: ' + d.get('phone') + '\n' +
        'E-mail: ' + (d.get('email') || '-') + '\n' +
        'Usługa: ' + d.get('service') + '\n\n' +
        (d.get('msg') || '');
      window.location.href = 'mailto:biuro@promaxreklama.pl?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      status.textContent = 'Otwieramy Twój program pocztowy – wystarczy kliknąć „Wyślij”.';
    });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
