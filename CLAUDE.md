# CLAUDE.md – VELDORIQ Website (Repo `veldoriq`)

Regeln für jede Claude-Code-Sitzung in diesem Repo. Schulungsprojekt „Virtuelles Unternehmen“ – VELDORIQ Projektbedarf GmbH ist **fiktiv**.
Quelle der Regeln: Projektordner `03_Marke/Styleguide.md`, `03_Marke/Tonalitaet.md`, `00_Master/Spielregeln.md` (Abschnitt 4).

## Marke
- Name: **VELDORIQ – Outdoor & DIY** · Leitgedanke: **„Dein Projekt. Draußen gemacht.“**
- Werte: praxistaugliche Qualität · ehrliche Transparenz · verlässliches Miteinander
- Formulierung Herkunft: „von uns entwickelt, gefertigt bei Partnern“ (nie „Made in Germany“, nie „von uns hergestellt“)

## Farben (nur diese)
| Name | HEX | Einsatz |
|---|---|---|
| Waldgrün | `#2E4A3B` | Überschriften, Logo, Fußzeile, große Flächen |
| Seeblau | `#24557A` | Links, Maße/Zahlen, kleine Elemente |
| Rost | `#B4521E` | **nur** Handlungsknöpfe, max. 1 je Ansicht (weitere Knöpfe als `knopf--zweit` in Waldgrün) |
| Leinen | `#F6F2EA` | Seitenhintergrund |
| Anthrazit | `#22272A` | Fließtext |
| Holz | `#D8C3A0` | Hinweisflächen, nie Textfarbe |

## Schriften (selbst gehostet, `assets/fonts/`, SIL OFL)
- Überschriften: **Bitter** 500/700, Waldgrün · Text, Daten, Knöpfe: **Source Sans 3** 400/600, Anthrazit, min. 16 px, Zeilenabstand 1,5–1,6
- Alle Texte min. 1rem (16 px) – auch Preiszusätze, Kaufleiste, Fußzeile
- Fallback Georgia / Arial · **Nie** Google Fonts oder andere externe Dienste einbinden
- Keine Zeilen nur in Großbuchstaben; Maße und Gewichte immer in Source Sans 3

## Logo (`assets/logo/`)
- `Logo_VELDORIQ.svg` auf hellem Grund, `Logo_VELDORIQ_dunkel.svg` auf Waldgrün, `Bildmarke_VELDORIQ.svg` als Browser-Tab-Symbol
- Wortmarke min. 120 px breit; nicht verzerren, umfärben, keine Effekte

## Sprache & Ton
- Deutsch, **du** (klein), begeistert · klar · zugewandt
- Zahlen statt Adjektive; Maße „71 × 51 × 91 cm“ (mit Leerzeichen, ×), Preise „26,97 €“
- **Nie:** Superlative („der beste“, „perfekt“, „Premium“), Kaufdruck („nur heute“), Streichpreise, Fake-Rabatte, pauschal „nachhaltig“, „wasserdicht“ wenn nur wasserabweisend
- Grenzen nennen; erfundene Bewertungen/Tests nie ohne „(fiktiv)“

## Daten
- Texte nur aus freigegebenen Dateien: `02_E-Commerce_Vertrieb/Produkttexte.md`, `Produktdaten.md`, `Preise.md`. Nichts erfinden – fehlt etwas: „folgt“ bzw. ⚠️ und Rückfrage.
- Bilder nur freigegebene Varianten laut `02_E-Commerce_Vertrieb/Produktbilder/Bildliste.md`, und zwar die **KI-gekennzeichneten Kopien** aus dem Unterordner „AI-Tag“ (geteiltes Drive „02 Produktbilder“), als WebP (1024 / 640 / 320 px) in `assets/bilder/<kompakt|komfort>/`.
- Pflichttexte beim Preis (`06_Shop/Rechtstexte.md`, Abschnitt 5): „inkl. MwSt., zzgl. Versandkosten“ (Link auf `versand-zahlung.html`) + „Lieferzeit: 1–3 Werktage“.
- Versand: „4,90 € bei einem Warenwert unter 40,00 € · ab 40,00 € versandkostenfrei“ (GF 02.11.2026).
- Rechtstexte 1:1 aus `04_Website_Landingpage/Rechtstexte.md` und `06_Shop/Rechtstexte.md` (Abschnitte 2–4).

## Aufbau
```
index.html                  Firmenwebsite: Start
ueber-uns.html              Firmenwebsite: Über uns
sortiment.html              Firmenwebsite: Sortiment
diy-projekte.html           Firmenwebsite: DIY-Projekte (Ratgeber folgen)
fuer-unternehmen.html       Firmenwebsite: Für Unternehmen (Sie-Form, Angebot per E-Mail)
kontakt.html                Firmenwebsite: Kontakt (kein Formular)
campingstuhl-kompakt.html   Landingpage 01 Campingstuhl Kompakt
campingstuhl-komfort.html   Landingpage 02 Campingstuhl Komfort
versand-zahlung.html        Versand & Zahlung (06_Shop/Rechtstexte.md, Abschnitt 4)
widerruf.html               Widerrufsbelehrung + Muster-Formular (06_Shop/Rechtstexte.md, Abschnitte 2 + 3, Sie-Form)
impressum.html              Impressum (Rechtstexte.md, fiktive Firmendaten)
datenschutz.html            Datenschutz (Rechtstexte.md)
assets/style.css    alle Styles, Farben als CSS-Variablen
assets/seite.js     Menü Handy, Knopf „Zum Shop“ (SHOP_URL), Galerie, Knopf „Zum Produkt“, Kaufleiste Handy
assets/fonts/       woff2 + Lizenzen
assets/logo/        SVG-Logos
assets/bilder/      WebP-Bilder je Artikel (kompakt/, komfort/) und Firmenbilder (firma/, F1–F5 aus „02 Produktbilder/F_Firmenwebsite/AI-Tag“)
```
- Reines HTML/CSS, wenig JavaScript, kein Build-Schritt, keine Frameworks
- Texte Firmenwebsite 1:1 aus `04_Website_Landingpage/Texte_Firmenwebsite.md`; Seitenplan `Sitemap.md`
- Kopfzeile auf allen Seiten: Navigation (6 Seiten) + Knopf „Zum Shop“ (Waldgrün, `knopf--zweit`); am Handy Menü-Knopf
- Beide Produktseiten haben denselben Aufbau (Kopfbereich, Vorteile + Knopf, Galerie, In der Praxis, Maße & Daten, Unterwegs & Lieferumfang, Alternative im Sortiment, Werte, Abschluss, Kaufleiste Handy); Änderungen immer an beiden Seiten
- Knopf „Zum Produkt“: Ziel im `<body data-produkt-url="">` der jeweiligen Seite (leer, bis 06 die Produkt-URLs liefert)
- Schulungsprojekt wird nie veröffentlicht: GitHub Pages aus, Repo privat, `noindex` bleibt (GF 02.11.2026)

## Arbeitsweise
- Handy: Kopfbereich in der Reihenfolge Überschrift + Produktname → Bild (4:3) → Text, Fakten, Preis, Knopf
- Erst planen, dann bauen; eine Seite/Funktion nach der anderen; nach jedem Schritt im Browser testen (PC + Handy 390 px)
- Keine Passwörter, API-Schlüssel, echten Kunden- oder Bankdaten im Code
- Neue Seiten, Funktionen, Rechtstexte nur mit Freigabe der GF; Änderungen ins Protokoll `99_Protokolle/JJJJ-MM-TT.md`

## Shop (06) – Ordner `shop/`
- Lokal starten: `npm start` → `http://localhost:4242/shop/` (Stripe nur Testmodus, Schlüssel nur in `.env`, siehe README)
- Kunde bleibt im Shop (Variante A, GF 04.11.2026): Logo und erster Menüpunkt „Shop“ führen auf `shop/index.html`; Menü im Shop nur Shopseiten (Shop · Über uns · DIY-Projekte · Für Unternehmen · Kontakt); Firmenwebsite nur über Fußzeile „Über das Unternehmen“
- **Inhaltsseiten doppelt:** `ueber-uns.html`, `diy-projekte.html`, `fuer-unternehmen.html`, `kontakt.html` werden aus den Seiten von 04 in `shop/` übernommen (Shop-Kopfzeile, Bildpfade `../assets/`). Ändert 04 diese Seiten, Shop-Fassung neu erzeugen
- **Rechtstexte doppelt (Firma + Shop, GF 04.11.2026):** `versand-zahlung.html`, `impressum.html`, `datenschutz.html`, `widerruf.html`, `barrierefreiheit.html` gibt es im Hauptordner (04) und in `shop/` (06). Ändert sich ein Rechtstext, **immer beide Fassungen** anpassen. Shop-Datenschutz = Grundfassung 04 ohne Nr. 2/3 + Ergänzung `06_Shop/Rechtstexte.md` Abschnitt 6
- Shop-Ziele für 04: „Zum Shop“ → `shop/index.html` · „Zum Produkt“ 01 → `shop/campingstuhl-kompakt.html` · 02 → `shop/campingstuhl-komfort.html`
- Formulare im Shop: jedes Feld mit `<label>`, Pflichtfelder „(Pflichtfeld)“, Fehler direkt am Feld (`aria-invalid` + `aria-describedby`, Text „Fehler: … z. B. …“), Fokus auf erstes fehlerhaftes Feld
