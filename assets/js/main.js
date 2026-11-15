/* PROMAX – skrypty strony */
(function () {
  'use strict';

  /* ---- Logotypy klientów ----
     Podmień placeholdery na pliki, np.:
     { src: 'assets/img/klienci/firma.svg', alt: 'Nazwa firmy' }            */
  var CLIENT_LOGOS = [];
  for (var i = 1; i <= 12; i++) CLIENT_LOGOS.push({ label: '[Logo klienta ' + i + ']' });

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

  /* ---- Animacja pojawiania się ---- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
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
