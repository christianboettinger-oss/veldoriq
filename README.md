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

### Sicherheit im Schulungsbetrieb (01, 04.11.2026)
- **`.env` nie weitergeben:** nicht in Vorschau-Kopien, ZIPs, Drive oder geteilten Ordnern. Die `.env` liegt nur im lokalen Arbeitsordner, aus dem der Server gestartet wird.
- **Testdaten Widerruf löschen:** nach jedem Testlauf, spätestens zum Projektende: `npm run aufraeumen` (löscht `widerrufe.jsonl`).
- **Aktuell halten:** `npm audit` regelmäßig ausführen; Node.js (LTS) und das Paket `stripe` aktuell halten (`npm update stripe`).
- Der Server setzt für alle Antworten Sicherheits-Header (Content-Security-Policy, nosniff, Referrer-Policy, frame-ancestors 'none').

### Nur bei echter Nutzung (nicht umgesetzt – Schulungsprojekt)
- **Webhook `checkout.session.completed`** mit Prüfung der Stripe-Signatur (`stripe.webhooks.constructEvent`, Webhook-Secret in `.env`): Bestellung erst nach bestätigter Zahlung als bezahlt führen – nicht über die Danke-Seite.
- **HTTPS + HSTS** (`Strict-Transport-Security`), Live-Schlüssel nur auf dem Server, nie im Code oder Repo.
- Widerrufe in einer geschützten Datenbank statt `widerrufe.jsonl`, echte Eingangsbestätigung per E-Mail, Löschung nach 3 Jahren ab Jahresende.
