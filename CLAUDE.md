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
| Rost | `#B4521E` | **nur** Handlungsknöpfe, max. 1 je Ansicht |
| Leinen | `#F6F2EA` | Seitenhintergrund |
| Anthrazit | `#22272A` | Fließtext |
| Holz | `#D8C3A0` | Hinweisflächen, nie Textfarbe |

## Schriften (selbst gehostet, `assets/fonts/`, SIL OFL)
- Überschriften: **Bitter** 500/700, Waldgrün · Text, Daten, Knöpfe: **Source Sans 3** 400/600, Anthrazit, min. 16 px, Zeilenabstand 1,5–1,6
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
- Bilder nur freigegebene Varianten laut `02_E-Commerce_Vertrieb/Produktbilder/Bildliste.md`, als WebP (1024 / 640 / 320 px) in `assets/bilder/`.
- Versand: 4,90 €, ab 40,00 € Warenkorbwert versandkostenfrei.

## Aufbau
```
index.html          Landingpage 01 Campingstuhl Kompakt
impressum.html      Platzhalter (Klärung GF)
datenschutz.html    Platzhalter (Klärung GF)
assets/style.css    alle Styles, Farben als CSS-Variablen
assets/fonts/       woff2 + Lizenzen
assets/logo/        SVG-Logos
assets/bilder/      WebP-Bilder
```
- Reines HTML/CSS, wenig JavaScript, kein Build-Schritt, keine Frameworks
- Knopf „Zum Produkt“: Ziel in `index.html` → `PRODUKT_URL` (leer, bis Shop 06 steht)
- `noindex`, bis GF die Rechtstexte freigibt

## Arbeitsweise
- Erst planen, dann bauen; eine Seite/Funktion nach der anderen; nach jedem Schritt im Browser testen (PC + Handy 390 px)
- Keine Passwörter, API-Schlüssel, echten Kunden- oder Bankdaten im Code
- Neue Seiten, Funktionen, Rechtstexte nur mit Freigabe der GF; Änderungen ins Protokoll `99_Protokolle/JJJJ-MM-TT.md`
