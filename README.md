# PROMAX – strona WWW

Nowa strona główna PROMAX Agencja Reklamy (promaxreklama.pl), zbudowana na podstawie projektu „PROMAX – nowa strona WWW”.
Czysty HTML + CSS + JS – bez frameworków i bez budowania. Działa na każdym hostingu (także GitHub Pages).

## Struktura

```
index.html                 strona główna (one-page)
polityka-prywatnosci.html  szablon polityki prywatności (do uzupełnienia)
assets/css/style.css       style
assets/js/main.js          menu mobilne, logotypy klientów, formularz, animacje przy przewijaniu
assets/img/                logo PROMAX (SVG z księgi CI), motyw „P”, og-image
assets/img/klienci/        logotypy „Zaufali nam” (WebP)
assets/img/realizacje/     zdjęcia realizacji
robots.txt, sitemap.xml    SEO
```

## Podgląd lokalny

Otwórz `index.html` w przeglądarce albo uruchom `python3 -m http.server` w tym katalogu.

## Co zawiera

- Hero z rotującym hasłem, pasek usług, liczby, 6 usług, proces w 4 krokach, realizacje, klienci, „Dlaczego PROMAX”, baner sklepu, FAQ, formularz wyceny, stopka.
- SEO: meta title/description, Open Graph, dane strukturalne schema.org (LocalBusiness + FAQPage), jeden H1, robots.txt, sitemap.xml.
- Identyfikacja z księgi CI: krój Gantari, zieleń #00FF00 i morski #085A58, wektorowe logo, motyw „P”, hasło „Nie ma rzeczy niemożliwych”.
- Animacje: sekcje wyłaniają się przy przewijaniu, a elementy wjeżdżają z bliższego boku ekranu (wyśrodkowane – od dołu). Wyłączone dla osób z ustawieniem „ogranicz ruch”.
- Responsywność (menu mobilne), dostępność (etykiety, skip-link, `prefers-reduced-motion`).

## Formularz

Domyślnie formularz otwiera program pocztowy z gotową wiadomością na biuro@promaxreklama.pl.
Żeby zgłoszenia trafiały bezpośrednio do skrzynki, wpisz adres usługi formularzy (np. Formspree) w `assets/js/main.js` → `FORM_ENDPOINT`.

## Do uzupełnienia przez PROMAX

- [ ] Miasto i adres siedziby (stopka, kontakt, schema.org `address`, title: „Agencja reklamowa [Miasto] …”)
- [ ] Godziny otwarcia
- [ ] Liczba zrealizowanych projektów (sekcja liczb)
- [ ] Zdjęcia realizacji – min. 3 na usługę (sekcja Realizacje; wstawione: wizualizacja koszulek z CI). Zdjęcie busa z CI pominięte – ma znak wodny OTOMOTO.
- [ ] Minimalne nakłady i czasy realizacji (FAQ)
- [ ] 2–3 opinie klientów z Google
- [ ] Polityka prywatności – dane administratora, weryfikacja prawna

## Kolejny etap (wg audytu SEO)

Podstrony usług: `/uslugi/oklejanie-samochodow`, `/uslugi/znakowanie-odziezy`, `/uslugi/kasetony-szyldy-litery-3d`,
`/uslugi/kalendarze-firmowe-druk`, `/uslugi/gadzety-reklamowe`, `/uslugi/projekty-niestandardowe`, a także `/realizacje`, `/o-nas`, `/blog`, `/kontakt`.
