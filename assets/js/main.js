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

  var track = document.getElementById('clients-track');
  if (track) {
    // dwa przebiegi = płynna pętla marquee
    for (var r = 0; r < 2; r++) {
      CLIENT_LOGOS.forEach(function (c) {
        var tile = document.createElement('div');
        tile.className = 'logo-tile';
        if (r === 1) tile.setAttribute('aria-hidden', 'true');
        if (c.src) {
          var img = document.createElement('img');
          img.src = c.src; img.alt = r === 1 ? '' : (c.alt || ''); img.loading = 'lazy';
          tile.appendChild(img);
        } else {
          tile.textContent = c.label;
        }
        track.appendChild(tile);
      });
    }
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
    '.fact', '.card', '.step', '.shot-wrap', '.clients .label', '.clients .viewport',
    '.about .copy > *', '.tile', '.shop-in > *',
    '.faq-list details', '.motto .wrap > *',
    '.contact .info > *', '.form', '.footer .wrap > *', '.footer .col'
  ].join(',');

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

  if (!reduce && 'IntersectionObserver' in window) {
    var targets = [].slice.call(document.querySelectorAll(REVEAL_SELECTORS))
      .filter(function (el) { return !el.closest('.hero') && !el.closest('.marquee'); });

    // kolejność wjazdu w obrębie wspólnego rodzica (kaskada)
    var groups = new Map();
    targets.forEach(function (el) {
      var p = el.parentElement;
      var i = groups.get(p) || 0;
      groups.set(p, i + 1);
      el.style.setProperty('--rd', Math.min(i, 6) * 110 + 'ms');
      el.setAttribute('data-reveal', direction(el));
    });

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
