// VELDORIQ Shop (06) – lokaler Test-Server für den Stripe-Checkout (nur Testmodus)
// Start:  npm start   →  http://localhost:4242/shop/
// Schlüssel: nur in der lokalen Datei .env (STRIPE_SECRET_KEY=sk_test_…), nie im Repo.
// Schulungsprojekt: wird nie veröffentlicht. Es gibt keine echten Zahlungen.

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { berechne } = require("./shop/rechnung.js");

const PORT = Number(process.env.PORT) || 4242;
const BASIS = `http://localhost:${PORT}`;
const WURZEL = __dirname;
const KATALOG = JSON.parse(fs.readFileSync(path.join(WURZEL, "shop", "produkte.json"), "utf8"));

// Zahlungsarten: Stripe steuert sie jetzt nur noch über das Dashboard (Einstellungen → Zahlungen → Zahlungsmethoden).
// Dort nur die Zahlungsarten laut AGB aktiv lassen (06_Shop/Rechtstexte.md § 5): Karten, Apple Pay, Google Pay, PayPal, Klarna, SEPA.
// Optional: eigene Zahlungsmethoden-Konfiguration (pmc_…) in .env als STRIPE_PAYMENT_METHOD_CONFIG.
const PMC = process.env.STRIPE_PAYMENT_METHOD_CONFIG || "";

// ---------- Stripe nur mit Testschlüssel ----------
const schluessel = process.env.STRIPE_SECRET_KEY || "";
let stripe = null;
if (!schluessel || schluessel.includes("HIER_EINTRAGEN")) {
  console.warn("⚠️  Kein Testschlüssel in .env (noch Platzhalter?) – Seiten laufen, der Checkout ist gesperrt.");
} else if (!schluessel.startsWith("sk_test_") && !schluessel.startsWith("rk_test_")) {
  console.error("⛔ Nur Testschlüssel (sk_test_…) erlaubt. Server wird beendet.");
  process.exit(1);
} else {
  const Stripe = require("stripe");
  stripe = new Stripe(schluessel);
}

// ---------- Hilfen ----------
const TYPEN = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png",
  ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8", ".ico": "image/x-icon",
};
// Nur diese Bereiche werden ausgeliefert (kein .env, kein server.js, kein node_modules)
const ERLAUBT = [/^\/[a-z0-9-]+\.html$/, /^\/assets\//, /^\/shop\/[a-z0-9-]+\.(html|css|js|json)$/];

function json(res, status, daten) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(daten));
}

function datei(req, res, pfad) {
  if (pfad === "/") pfad = "/shop/index.html";
  if (pfad === "/shop" || pfad === "/shop/") pfad = "/shop/index.html";
  if (!ERLAUBT.some((r) => r.test(pfad)) || pfad.includes("..")) return json(res, 404, { fehler: "Nicht gefunden" });
  const ziel = path.join(WURZEL, pfad);
  if (!ziel.startsWith(WURZEL + path.sep)) return json(res, 404, { fehler: "Nicht gefunden" });
  fs.readFile(ziel, (err, inhalt) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); return res.end("Seite nicht gefunden"); }
    res.writeHead(200, { "Content-Type": TYPEN[path.extname(ziel)] || "application/octet-stream", "Cache-Control": "no-cache" });
    res.end(inhalt);
  });
}

function lesen(req, max = 10_000) {
  return new Promise((ok, fehler) => {
    let daten = "";
    req.on("data", (s) => { daten += s; if (daten.length > max) { fehler(new Error("zu groß")); req.destroy(); } });
    req.on("end", () => { try { ok(JSON.parse(daten || "{}")); } catch (e) { fehler(e); } });
  });
}

function bestellnummer() {
  const d = new Date();
  const tag = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `VQ-${tag}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
}

// ---------- Checkout-Session ----------
async function checkout(req, res) {
  if (!stripe) return json(res, 503, { fehler: "Stripe-Testschlüssel fehlt (.env)." });
  let eingabe;
  try { eingabe = await lesen(req); } catch { return json(res, 400, { fehler: "Ungültige Anfrage." }); }

  const r = berechne(eingabe.artikel, KATALOG);
  if (r.fehler) return json(res, 400, { fehler: r.fehler });

  const nr = bestellnummer();
  const [min, max] = KATALOG.versand.lieferzeit_werktage;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "de",
      ...(PMC ? { payment_method_configuration: PMC } : {}),
      client_reference_id: nr,
      metadata: { bestellnummer: nr, schulungsprojekt: "ja" },
      line_items: r.positionen.map((p) => ({
        quantity: p.menge,
        price_data: {
          currency: KATALOG.waehrung,
          unit_amount: p.preis_cent,
          tax_behavior: "inclusive",
          product_data: { name: p.name, metadata: { artikelnummer: p.sku } },
        },
      })),
      shipping_address_collection: { allowed_countries: ["DE"] },
      shipping_options: [{
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: r.versand_cent === 0 ? "DHL – versandkostenfrei ab 40,00 €" : "DHL Standard",
          fixed_amount: { amount: r.versand_cent, currency: KATALOG.waehrung },
          tax_behavior: "inclusive",
          delivery_estimate: { minimum: { unit: "business_day", value: min }, maximum: { unit: "business_day", value: max } },
        },
      }],
      custom_text: {
        submit: { message: "Schulungsprojekt VELDORIQ – nur Stripe-Testmodus, es wird kein echtes Geld bewegt." },
      },
      success_url: `${BASIS}/shop/danke.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASIS}/shop/abbruch.html`,
    });
    console.log(`Checkout gestartet: ${nr} · ${(r.gesamt_cent / 100).toFixed(2)} € (Test)`);
    console.log(`  Zahlungsarten laut Stripe: ${(session.payment_method_types || []).join(", ") || "–"}`);
    if (session.payment_method_configuration_details) console.log(`  Konfiguration: ${session.payment_method_configuration_details.id}`);
    json(res, 200, { url: session.url, bestellnummer: nr });
  } catch (e) {
    console.error("Stripe-Fehler:", e.message);
    json(res, 502, { fehler: "Stripe hat die Anfrage abgelehnt: " + e.message });
  }
}

// ---------- Bestellung nach Rückkehr (Danke-Seite) ----------
async function bestellung(res, sessionId) {
  if (!stripe) return json(res, 503, { fehler: "Stripe-Testschlüssel fehlt (.env)." });
  if (!/^cs_test_[A-Za-z0-9]+$/.test(sessionId || "")) return json(res, 400, { fehler: "Ungültige Bestellung." });
  try {
    const s = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items"] });
    json(res, 200, {
      bestellnummer: s.client_reference_id,
      bezahlt: s.payment_status === "paid",
      status: s.payment_status,
      summe_cent: s.amount_total,
      versand_cent: s.shipping_cost ? s.shipping_cost.amount_total : 0,
      positionen: (s.line_items?.data || []).map((l) => ({ name: l.description, menge: l.quantity, summe_cent: l.amount_total })),
      zeit: new Date(s.created * 1000).toISOString(),
    });
  } catch (e) {
    json(res, 404, { fehler: "Bestellung nicht gefunden." });
  }
}

// ---------- Widerrufsfunktion (§ 356a BGB) – Schulungsprojekt: simuliert, keine E-Mail ----------
// Eingänge werden nur lokal in widerrufe.jsonl gespeichert (nicht im Repo, .gitignore).
async function widerruf(req, res) {
  let d;
  try { d = await lesen(req, 4000); } catch { return json(res, 400, { fehler: "Ungültige Anfrage." }); }
  const t = (v, max) => String(v || "").trim().slice(0, max);
  const name = t(d.name, 100), nr = t(d.bestellnummer, 20).toUpperCase(), email = t(d.email, 120);
  const umfang = d.umfang === "teil" ? "teil" : "ganz", artikel = t(d.artikel, 200);
  if (!name) return json(res, 400, { fehler: "Bitte gib deinen Namen an." });
  if (!/^VQ-\d{8}-[0-9A-F]{4}$/.test(nr)) return json(res, 400, { fehler: "Bitte gib deine Bestellnummer im Format VQ-JJJJMMTT-XXXX an." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(res, 400, { fehler: "Bitte gib eine gültige E-Mail-Adresse an." });
  if (umfang === "teil" && !artikel) return json(res, 400, { fehler: "Bitte nenne die Artikel, die du widerrufst." });
  const eingang = new Date();
  const zeit = eingang.toLocaleString("de-DE", { timeZone: "Europe/Berlin", dateStyle: "long", timeStyle: "medium" }) + " Uhr";
  const erklaerung = `Hiermit widerrufe ich, ${name}, den Vertrag über ${umfang === "ganz" ? "die gesamte Bestellung" : "folgende Artikel: " + artikel} (Bestellnummer ${nr}).`;
  const eintrag = { eingang: eingang.toISOString(), zeit, name, bestellnummer: nr, umfang, artikel, email, erklaerung, simuliert: true };
  fs.appendFile(path.join(WURZEL, "widerrufe.jsonl"), JSON.stringify(eintrag) + "\n", () => {});
  console.log(`Widerruf eingegangen: ${nr} · ${zeit} (simuliert, keine E-Mail)`);
  json(res, 200, eintrag);
}

// ---------- Server ----------
http.createServer((req, res) => {
  const url = new URL(req.url, BASIS);
  if (req.method === "POST" && url.pathname === "/api/checkout") return checkout(req, res);
  if (req.method === "POST" && url.pathname === "/api/widerruf") return widerruf(req, res);
  if (req.method === "GET" && url.pathname === "/api/bestellung") return bestellung(res, url.searchParams.get("session_id"));
  if (req.method === "GET") return datei(req, res, decodeURIComponent(url.pathname));
  json(res, 405, { fehler: "Methode nicht erlaubt" });
}).listen(PORT, "127.0.0.1", () => {
  console.log(`VELDORIQ Shop (Schulungsprojekt) läuft: ${BASIS}/shop/`);
  console.log(stripe ? "Stripe: Testmodus ✅" : "Stripe: kein Schlüssel – Checkout gesperrt");
});
