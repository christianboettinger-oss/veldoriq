// Prüft die Versandlogik: node shop/rechnung.test.js
const assert = require("node:assert");
const { berechne } = require("./rechnung.js");
const K = require("./produkte.json");
const f = (a) => berechne(a, K);
assert.equal(f([{ sku: "VEL-0001", menge: 1 }]).gesamt_cent, 2697 + 490);           // 26,97 + 4,90
assert.equal(f([{ sku: "VEL-0002", menge: 1 }]).versand_cent, 490);                 // 37,97 < 40
assert.equal(f([{ sku: "VEL-0002", menge: 1 }]).bis_frei_cent, 203);                // noch 2,03 €
assert.equal(f([{ sku: "VEL-0001", menge: 1 }, { sku: "VEL-0002", menge: 1 }]).gesamt_cent, 6494); // frei
assert.equal(f([{ sku: "VEL-0001", menge: 2 }]).versand_cent, 0);                   // 53,94 ≥ 40
assert.equal(berechne([{ sku: "X", menge: 1 }], { ...K, versand: K.versand }).fehler.startsWith("Unbekannt"), true);
assert.equal(berechne([{ sku: "VEL-0001", menge: 1 }], { ...K, artikel: { "VEL-0001": { ...K.artikel["VEL-0001"], preis_cent: 4000 } } }).versand_cent, 0); // genau 40,00 → frei
assert.ok(f([]).fehler); assert.ok(f([{ sku: "VEL-0001", menge: 0 }]).fehler); assert.ok(f([{ sku: "VEL-0001", menge: 11 }]).fehler);
console.log("Versandlogik ✅ alle Prüfungen bestanden");
