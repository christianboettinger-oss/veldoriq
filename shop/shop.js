// VELDORIQ Shop (06) – Galerie, Menge, Warenkorb, Kasse, Danke-Seite
// Warenkorb liegt nur im Browser (localStorage). Preise im Browser sind Anzeige –
// der Server (server.js) rechnet mit shop/produkte.json selbst (Schutz vor Manipulation).
(function () {
  const SPEICHER = "veldoriq-warenkorb";
  const euro = (cent) => (cent / 100).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  const $ = (sel, wurzel = document) => wurzel.querySelector(sel);

  function lesen() {
    try {
      const k = JSON.parse(localStorage.getItem(SPEICHER));
      return Array.isArray(k) ? k.filter((p) => p && typeof p.sku === "string" && Number.isInteger(p.menge) && p.menge > 0) : [];
    } catch (_) { return []; }
  }
  function schreiben(korb) {
    try { localStorage.setItem(SPEICHER, JSON.stringify(korb)); } catch (_) { /* privater Modus: ohne Speicher weiter */ }
    zaehler();
  }
  function zaehler() {
    const n = lesen().reduce((s, p) => s + p.menge, 0);
    document.querySelectorAll(".korb-zahl").forEach((el) => { el.textContent = n; });
  }
  zaehler();

  // Menü am Handy auf- und zuklappen (gleiches Verhalten wie assets/seite.js der Firmenwebsite)
  const menueKnopf = document.querySelector(".menue-knopf");
  const nav = document.getElementById("hauptmenue");
  if (menueKnopf && nav) {
    menueKnopf.addEventListener("click", () => {
      const offen = nav.classList.toggle("offen");
      menueKnopf.setAttribute("aria-expanded", String(offen));
    });
  }

  let katalogPromise = null;
  const katalog = () => (katalogPromise ||= fetch("produkte.json", { cache: "no-cache" }).then((r) => {
    if (!r.ok) throw new Error("Katalog");
    return r.json();
  }));

  // ---------- Galerie (Produktseite) ----------
  const main = document.querySelector("main[data-bilder]");
  const gross = document.getElementById("galerie-bild");
  if (main && gross) {
    const ordner = main.dataset.bilder;
    const titel = document.getElementById("galerie-titel");
    const knoepfe = document.querySelectorAll(".galerie__leiste button");
    knoepfe.forEach((btn) => btn.addEventListener("click", () => {
      gross.src = ordner + btn.dataset.bild + ".webp";
      gross.alt = btn.dataset.alt;
      titel.textContent = btn.dataset.titel;
      knoepfe.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    }));
  }

  // ---------- Menge + In den Warenkorb (Produktseite) ----------
  const begrenzen = (n) => Math.min(10, Math.max(1, Number.isFinite(n) ? Math.round(n) : 1));
  document.querySelectorAll(".js-in-korb").forEach((form) => {
    const feld = form.querySelector("input[name=menge]");
    form.querySelectorAll(".menge__knopf").forEach((k) => k.addEventListener("click", () => {
      feld.value = begrenzen(Number(feld.value) + Number(k.dataset.schritt));
    }));
    feld.addEventListener("change", () => { feld.value = begrenzen(Number(feld.value)); });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const menge = begrenzen(Number(feld.value));
      const korb = lesen();
      const da = korb.find((p) => p.sku === form.dataset.sku);
      if (da) da.menge = Math.min(10, da.menge + menge);
      else korb.push({ sku: form.dataset.sku, menge });
      schreiben(korb);
      const meldung = $(".kauf__meldung");
      if (meldung) {
        meldung.innerHTML = "";
        meldung.append(`${menge} × ${form.dataset.name} liegt im Warenkorb. `);
        const a = document.createElement("a");
        a.href = "warenkorb.html"; a.textContent = "Zum Warenkorb →";
        meldung.append(a);
        meldung.hidden = false;
      }
    });
  });

  const seite = document.querySelector("main[data-seite]")?.dataset.seite;
  if (!seite) return;

  function serverHinweis() {
    const h = $(".js-hinweis-server"); if (h) h.hidden = false;
  }

  // Ansage für Screenreader nach Änderungen im Warenkorb
  function ansage(r, text) {
    const el = $(".js-ansage"); if (!el) return;
    el.textContent = r ? `${text} Gesamtsumme ${euro(r.gesamt_cent)}, Versand ${r.versand_cent === 0 ? "kostenfrei" : euro(r.versand_cent)}.` : `${text} Dein Warenkorb ist leer.`;
  }

  // ---------- Positionen zeichnen (Warenkorb / Kasse) ----------
  function zeichnen(kat, bearbeitbar) {
    const korb = lesen().filter((p) => kat.artikel[p.sku]);
    const leer = $(".js-leer"), voll = $(".js-voll");
    if (korb.length === 0) { leer.hidden = false; voll.hidden = true; return null; }
    leer.hidden = true; voll.hidden = false;
    const r = window.VeldoriqRechnung.berechne(korb, kat);
    const liste = $(".js-liste");
    liste.innerHTML = "";
    r.positionen.forEach((p) => {
      const a = kat.artikel[p.sku];
      const li = document.createElement("li");
      li.className = "posten"; li.dataset.sku = p.sku;
      li.innerHTML = `
        <a class="posten__bild" href="${a.url}" tabindex="-1" aria-hidden="true"><img src="${a.bild}" width="96" height="96" alt=""></a>
        <div class="posten__text">
          <a class="posten__name" href="${a.url}"></a>
          <span class="posten__info">Farbe: Schwarz · Art.-Nr. ${p.sku} · Einzelpreis ${euro(p.preis_cent)}</span>
        </div>
        <div class="posten__menge"></div>
        <div class="posten__summe">${euro(p.summe_cent)}</div>`;
      li.querySelector(".posten__name").textContent = p.name;
      const mengeZelle = li.querySelector(".posten__menge");
      if (bearbeitbar) {
        mengeZelle.innerHTML = `
          <span class="menge__feld menge__feld--klein">
            <button type="button" class="menge__knopf" data-schritt="-1" aria-label="Menge verringern">−</button>
            <input type="number" min="1" max="${kat.max_menge}" value="${p.menge}" aria-label="Menge ${p.name}">
            <button type="button" class="menge__knopf" data-schritt="1" aria-label="Menge erhöhen">+</button>
          </span>
          <button type="button" class="posten__entfernen">Entfernen</button>`;
        const feld = mengeZelle.querySelector("input");
        const setzen = (n) => {
          const k = lesen();
          const e = k.find((x) => x.sku === p.sku);
          if (e) e.menge = Math.min(kat.max_menge, Math.max(1, n));
          schreiben(k); ansage(zeichnen(kat, true), `${p.name}: Menge ${Math.min(kat.max_menge, Math.max(1, n))}.`);
          // Fokus nach dem Neuzeichnen auf dasselbe Bedienelement zurücksetzen (Tastatur, WCAG 2.4.3)
          const ziel = document.querySelector(`.posten[data-sku="${p.sku}"] ${quelle}`);
          if (ziel) ziel.focus();
        };
        let quelle = "input";
        mengeZelle.querySelectorAll(".menge__knopf").forEach((b) => b.addEventListener("click", () => {
          quelle = `.menge__knopf[data-schritt="${b.dataset.schritt}"]`; setzen(p.menge + Number(b.dataset.schritt));
        }));
        feld.addEventListener("change", () => { quelle = "input"; setzen(Math.round(Number(feld.value)) || 1); });
        mengeZelle.querySelector(".posten__entfernen").addEventListener("click", () => {
          schreiben(lesen().filter((x) => x.sku !== p.sku)); ansage(zeichnen(kat, true), `${p.name} entfernt.`);
          const naechster = document.querySelector(".posten__entfernen, .js-leer a"); if (naechster) naechster.focus();
        });
      } else {
        mengeZelle.textContent = `${p.menge} ×`;
      }
      liste.append(li);
    });
    $(".js-zwischensumme").textContent = euro(r.zwischensumme_cent);
    $(".js-versand").textContent = r.versand_cent === 0 ? "kostenfrei" : euro(r.versand_cent);
    $(".js-gesamt").textContent = euro(r.gesamt_cent);
    $(".js-mwst").textContent = "(" + euro(Math.round(r.gesamt_cent - r.gesamt_cent / 1.19)) + ")";
    const frei = $(".js-frei");
    if (frei) {
      frei.textContent = r.bis_frei_cent > 0
        ? `Noch ${euro(r.bis_frei_cent)} bis zum kostenlosen Versand.`
        : "Dein Versand ist kostenlos (ab 40,00 € Warenkorbwert).";
      frei.classList.toggle("summe__frei--ok", r.bis_frei_cent === 0);
    }
    return r;
  }

  if (seite === "warenkorb" || seite === "kasse") {
    katalog().then((kat) => {
      zeichnen(kat, seite === "warenkorb");
      const knopf = $(".js-bestellen");
      if (!knopf) return;
      knopf.addEventListener("click", async () => {
        const fehler = $(".js-fehler");
        fehler.hidden = true;
        knopf.disabled = true; knopf.textContent = "Weiter zu Stripe …";
        try {
          const antwort = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ artikel: lesen() }),
          });
          const daten = await antwort.json();
          if (!antwort.ok || !daten.url) throw new Error(daten.fehler || "Unbekannter Fehler");
          window.location.href = daten.url;
        } catch (e) {
          fehler.textContent = "Die Bestellung konnte nicht gestartet werden: " + e.message;
          fehler.hidden = false;
          knopf.disabled = false; knopf.textContent = "Zahlungspflichtig bestellen";
        }
      });
    }).catch(serverHinweis);
  }

  // ---------- Danke-Seite ----------
  if (seite === "danke") {
    const id = new URLSearchParams(location.search).get("session_id");
    const zeigeFehler = (text) => {
      $(".js-laden").hidden = true; $(".js-fehler").hidden = false;
      if (text) $(".js-fehlertext").textContent = text;
    };
    if (!id) { zeigeFehler("Es wurde keine Bestellung übergeben."); return; }
    fetch("/api/bestellung?session_id=" + encodeURIComponent(id))
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!ok) throw new Error(d.fehler);
        $(".js-laden").hidden = true; $(".js-ok").hidden = false;
        $(".js-nr").textContent = d.bestellnummer;
        const liste = $(".js-liste");
        d.positionen.forEach((p) => {
          const li = document.createElement("li");
          li.className = "posten posten--einfach";
          const t = document.createElement("span"); t.className = "posten__name"; t.textContent = `${p.menge} × ${p.name}`;
          const s = document.createElement("span"); s.className = "posten__summe"; s.textContent = euro(p.summe_cent);
          li.append(t, s); liste.append(li);
        });
        $(".js-versand").textContent = d.versand_cent === 0 ? "kostenfrei" : euro(d.versand_cent);
        $(".js-gesamt").textContent = euro(d.summe_cent) + " inkl. MwSt.";
        $(".js-status").textContent = d.bezahlt
          ? "Zahlung erfolgreich (Testmodus)."
          : "Zahlung in Bearbeitung (z. B. SEPA-Lastschrift) – Testmodus.";
        try { sessionStorage.setItem("veldoriq-letzte-bestellung", d.bestellnummer); } catch (_) {}
        schreiben([]); // Warenkorb leeren
      })
      .catch((e) => zeigeFehler(e.message && e.message !== "Failed to fetch" ? e.message : null));
  }
  // ---------- Widerrufsfunktion (§ 356a BGB) ----------
  if (seite === "widerruf") {
    const form = $(".js-widerruf");
    const umfang = form.elements.umfang, artikelFeld = $(".js-artikel");
    umfang.addEventListener("change", () => { artikelFeld.hidden = umfang.value !== "teil"; });
    try {
      const letzte = sessionStorage.getItem("veldoriq-letzte-bestellung");
      if (letzte && !form.elements.bestellnummer.value) form.elements.bestellnummer.value = letzte;
    } catch (_) {}
    // Prüfregeln (gleich wie server.js); Meldung sagt, was falsch ist und wie es richtig geht
    const REGELN = {
      name: (v) => v.trim() ? "" : "Bitte gib deinen Namen ein, z. B. Erika Muster.",
      bestellnummer: (v) => /^VQ-\d{8}-[0-9A-F]{4}$/i.test(v.trim()) ? "" : "Die Bestellnummer hat das Format VQ-JJJJMMTT-XXXX, z. B. VQ-20261103-CAC4. Bitte prüfe deine Eingabe.",
      artikel: (v) => (umfang.value !== "teil" || v.trim()) ? "" : "Bitte nenne die Artikel, die du widerrufst, z. B. 1 × Campingstuhl Kompakt.",
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Bitte gib eine gültige E-Mail-Adresse ein, z. B. name@beispiel.de.",
    };
    const fehlerSetzen = (name, text) => {
      const feld = form.elements[name], hinweis = document.getElementById(feld.id + "-fehler");
      if (text) { feld.setAttribute("aria-invalid", "true"); hinweis.textContent = "Fehler: " + text; hinweis.hidden = false; }
      else { feld.removeAttribute("aria-invalid"); hinweis.textContent = ""; hinweis.hidden = true; }
    };
    const pruefen = () => {
      let erstes = null;
      for (const [name, regel] of Object.entries(REGELN)) {
        const text = regel(form.elements[name].value);
        fehlerSetzen(name, text);
        if (text && !erstes) erstes = form.elements[name];
      }
      return erstes;
    };
    form.noValidate = true;
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const fehler = $(".js-fehler"), knopf = form.querySelector("button[type=submit]");
      fehler.hidden = true;
      const erstes = pruefen();
      if (erstes) { erstes.focus(); return; }
      knopf.setAttribute("aria-disabled", "true");
      const daten = Object.fromEntries(new FormData(form).entries());
      try {
        const r = await fetch("/api/widerruf", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(daten) });
        const d = await r.json();
        if (!r.ok) {
          if (d.feld && form.elements[d.feld]) { fehlerSetzen(d.feld, d.fehler); form.elements[d.feld].focus(); knopf.removeAttribute("aria-disabled"); return; }
          throw new Error(d.fehler || "Unbekannter Fehler");
        }
        $(".js-zeit").textContent = d.zeit;
        $(".js-b-name").textContent = d.name;
        $(".js-b-nr").textContent = d.bestellnummer;
        $(".js-b-umfang").textContent = d.umfang === "ganz" ? "ganze Bestellung" : d.artikel;
        $(".js-b-email").textContent = d.email;
        $(".js-b-text").textContent = d.erklaerung;
        form.hidden = true;
        const best = $(".js-bestaetigung"); best.hidden = false;
        const ueberschrift = best.querySelector("h2"); ueberschrift.tabIndex = -1; ueberschrift.focus();
      } catch (e) {
        if (e instanceof TypeError) { serverHinweis(); fehler.textContent = "Fehler: Der Shop-Server ist nicht erreichbar. Bitte starte ihn mit npm start und versuch es noch einmal."; }
        else fehler.textContent = "Fehler: " + e.message;
        fehler.hidden = false; knopf.removeAttribute("aria-disabled"); knopf.focus();
      }
    });
  }
})();
