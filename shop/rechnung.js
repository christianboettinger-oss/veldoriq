// VELDORIQ Shop – Warenkorb rechnen (gleiche Logik im Browser und auf dem Server)
// Versand: 4,90 € unter 40,00 € Warenkorbwert, ab 40,00 € versandkostenfrei (GF 20.10.2026).
(function (global) {
  function berechne(eintraege, katalog) {
    if (!Array.isArray(eintraege) || eintraege.length === 0) return { fehler: "Der Warenkorb ist leer." };
    const zusammen = new Map();
    for (const e of eintraege) {
      const sku = e && e.sku;
      const menge = Number(e && e.menge);
      if (!katalog.artikel[sku]) return { fehler: "Unbekannter Artikel: " + sku };
      if (!Number.isInteger(menge) || menge < 1) return { fehler: "Ungültige Menge." };
      zusammen.set(sku, (zusammen.get(sku) || 0) + menge);
    }
    const positionen = [];
    let zwischensumme = 0;
    for (const [sku, menge] of zusammen) {
      if (menge > katalog.max_menge) return { fehler: `Höchstens ${katalog.max_menge} Stück je Artikel.` };
      const a = katalog.artikel[sku];
      const summe = a.preis_cent * menge;
      zwischensumme += summe;
      positionen.push({ sku, name: a.name, menge, preis_cent: a.preis_cent, summe_cent: summe });
    }
    const v = katalog.versand;
    const versand = zwischensumme >= v.frei_ab_cent ? 0 : v.kosten_cent;
    return {
      positionen,
      zwischensumme_cent: zwischensumme,
      versand_cent: versand,
      gesamt_cent: zwischensumme + versand,
      bis_frei_cent: Math.max(0, v.frei_ab_cent - zwischensumme),
    };
  }
  if (typeof module !== "undefined" && module.exports) module.exports = { berechne };
  else global.VeldoriqRechnung = { berechne };
})(typeof window !== "undefined" ? window : globalThis);
