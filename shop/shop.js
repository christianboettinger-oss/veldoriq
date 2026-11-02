// VELDORIQ Shop (06) – Galerie, Menge, Warenkorb-Zähler
// Schritt 1: Artikel werden im Browser gemerkt (localStorage). Warenkorbseite, Versandlogik und Stripe folgen in Schritt 2.
// Preise im Browser sind nur Anzeige – der Server rechnet später selbst (Schutz vor Manipulation).
(function () {
  const SPEICHER = "veldoriq-warenkorb";

  function lesen() {
    try { return JSON.parse(localStorage.getItem(SPEICHER)) || []; } catch (_) { return []; }
  }
  function schreiben(korb) {
    try { localStorage.setItem(SPEICHER, JSON.stringify(korb)); } catch (_) { /* privater Modus: ohne Speicher weiter */ }
  }
  function zaehlerAktualisieren() {
    const anzahl = lesen().reduce((s, p) => s + p.menge, 0);
    document.querySelectorAll(".korb-zahl").forEach((el) => { el.textContent = anzahl; });
  }
  zaehlerAktualisieren();

  // Galerie
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

  // Menge + In den Warenkorb
  document.querySelectorAll(".js-in-korb").forEach((form) => {
    const feld = form.querySelector("input[name=menge]");
    const begrenzen = (n) => Math.min(10, Math.max(1, Number.isFinite(n) ? Math.round(n) : 1));
    form.querySelectorAll(".menge__knopf").forEach((k) => k.addEventListener("click", () => {
      feld.value = begrenzen(Number(feld.value) + Number(k.dataset.schritt));
    }));
    feld.addEventListener("change", () => { feld.value = begrenzen(Number(feld.value)); });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const menge = begrenzen(Number(feld.value));
      const korb = lesen();
      const vorhanden = korb.find((p) => p.sku === form.dataset.sku);
      if (vorhanden) vorhanden.menge = Math.min(10, vorhanden.menge + menge);
      else korb.push({ sku: form.dataset.sku, menge });
      schreiben(korb);
      zaehlerAktualisieren();
      const meldung = document.querySelector(".kauf__meldung");
      if (meldung) {
        meldung.textContent = `${menge} × ${form.dataset.name} liegt im Warenkorb.`;
        meldung.hidden = false;
      }
    });
  });
})();
