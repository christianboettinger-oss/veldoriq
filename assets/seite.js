// VELDORIQ – Skript für die Produkt-Landingpages (Galerie, Knopf „Zum Produkt“, Kaufleiste Handy)
(function () {
  const body = document.body;

  // Ziel für den Knopf „Zum Produkt“: Attribut data-produkt-url am <body> der jeweiligen Seite.
  // Leer = noch kein Shop (GF 23.10. / 02.11.2026). Später dort die Produkt-URL aus 06 eintragen.
  const produktUrl = body.dataset.produktUrl || "";
  document.querySelectorAll(".js-produkt-link").forEach((a) => {
    if (produktUrl) { a.href = produktUrl; }
    else { a.addEventListener("click", (e) => e.preventDefault()); }
  });

  // Knopf „Zum Shop“: Shop-Adresse folgt von 06 (GF 02.11.2026) – dann hier eintragen
  const SHOP_URL = "";
  document.querySelectorAll(".js-shop-link").forEach((a) => {
    if (SHOP_URL) { a.href = SHOP_URL; }
    else { a.addEventListener("click", (e) => e.preventDefault()); }
  });

  // Menü am Handy auf- und zuklappen
  const menueKnopf = document.querySelector(".menue-knopf");
  const nav = document.getElementById("hauptmenue");
  if (menueKnopf && nav) {
    menueKnopf.addEventListener("click", () => {
      const offen = nav.classList.toggle("offen");
      menueKnopf.setAttribute("aria-expanded", String(offen));
    });
  }

  // Galerie: Ansicht wechseln
  const ordner = body.dataset.bilder || "assets/bilder/";
  const gross = document.getElementById("galerie-bild");
  const titel = document.getElementById("galerie-titel");
  const knoepfe = document.querySelectorAll(".galerie__leiste button");
  knoepfe.forEach((btn) => {
    btn.addEventListener("click", () => {
      gross.src = ordner + btn.dataset.bild + ".webp";
      gross.alt = btn.dataset.alt;
      titel.textContent = btn.dataset.titel;
      knoepfe.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    });
  });

  // Kaufleiste (nur Handy): ausblenden, sobald ein anderer Knopf „Zum Produkt“ sichtbar ist
  const leiste = document.getElementById("kaufleiste");
  if (!leiste) return;
  const handy = window.matchMedia("(max-width: 860px)");
  const sichtbar = new Set();
  const aktualisieren = () => { leiste.hidden = !handy.matches || sichtbar.size > 0; };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((eintraege) => {
      eintraege.forEach((e) => (e.isIntersecting ? sichtbar.add(e.target) : sichtbar.delete(e.target)));
      aktualisieren();
    });
    document.querySelectorAll(".js-cta").forEach((k) => io.observe(k));
    handy.addEventListener("change", aktualisieren);
  }
})();
