# VELDORIQ – Outdoor & DIY (Schulungsprojekt)

Firmenwebsite und Landingpages (**Campingstuhl Kompakt**, **Campingstuhl Komfort**) von VELDORIQ – Outdoor & DIY – Schulungsprojekt „Virtuelles Unternehmen“ der Weiterbildung KI Marketing Manager.
Die VELDORIQ Projektbedarf GmbH ist ein **fiktives Unternehmen**; es findet kein Verkauf statt.

Wird nicht veröffentlicht (GitHub Pages aus). Ansehen: Repo herunterladen und `index.html` im Browser öffnen.

Regeln für Änderungen: siehe `CLAUDE.md`.

## Shop (06) – lokal starten (nur Stripe-Testmodus)
Voraussetzung: Node.js (LTS) und ein Stripe-Testkonto (Sandbox).
1. Im Repo-Ordner eine Eingabeaufforderung öffnen und `npm install` ausführen (einmalig).
2. `.env.example` kopieren, Kopie in `.env` umbenennen, den Testschlüssel (`sk_test_…`) eintragen. Die `.env` kommt nie ins Repo.
3. `npm start` → im Browser `http://localhost:4242/shop/` öffnen.
4. Testbestellung mit Testkarte `4242 4242 4242 4242`, beliebiges Ablaufdatum in der Zukunft, beliebige Prüfziffer.

- Preise und Versand rechnet nur der Server (`shop/produkte.json`, `shop/rechnung.js`): 4,90 € unter 40,00 €, ab 40,00 € versandkostenfrei. Prüfung: `npm test`.
- Der Server startet nicht mit einem Live-Schlüssel und liefert `.env`, `server.js` und `node_modules` nicht aus.
