import { useState, useEffect, useRef, useCallback } from "react";

// ══════════════════════════════════════════════════════════════════════
// ÉTAT GLOBAL INITIAL
// ══════════════════════════════════════════════════════════════════════

const SEUILS = { boutique: 2, bar_unite: 3, bar_volume_ml: 3000 };

const CATALOGUE_INIT = {
  bar: {
    id:"bar", label:"Bar / Afterwork", emoji:"🍺",
    color:"#FF8C69", gradient:"linear-gradient(135deg,#FF8C69,#E8704A)",
    marques: {
      heineken: {
        id:"heineken", label:"Heineken", emoji:"🟢", couleur:"#00A550",
        articles: [
          { id:"h1", nom:"Bière 25cl pression",  prixHt:5.83,  prixTtc:7.00,  coutHt:1.34, stockMl:22000, seuil:3000, servingMl:250,  unite:"verre",      type:"bar_volume" },
          { id:"h2", nom:"Bière 50cl pression",  prixHt:8.33,  prixTtc:10.00, coutHt:2.15, stockMl:22000, seuil:3000, servingMl:500,  unite:"verre",      type:"bar_volume" },
          { id:"h3", nom:"Bouteille 33cl",       prixHt:3.33,  prixTtc:4.00,  coutHt:0.95, stock:24,      seuil:3,    servingMl:null, unite:"bouteille",  type:"bar_unite" },
        ],
      },
      guinness: {
        id:"guinness", label:"Guinness", emoji:"⚫", couleur:"#1A1612",
        articles: [
          { id:"g1", nom:"Pint 50cl",  prixHt:6.67, prixTtc:8.00, coutHt:1.62, stockMl:8500, seuil:3000, servingMl:500, unite:"verre",  type:"bar_volume" },
          { id:"g2", nom:"Demi 25cl",  prixHt:4.17, prixTtc:5.00, coutHt:0.90, stockMl:8500, seuil:3000, servingMl:250, unite:"verre",  type:"bar_volume" },
        ],
      },
      cocktails: {
        id:"cocktails", label:"Cocktails", emoji:"🍹", couleur:"#E8704A",
        articles: [
          { id:"c1", nom:"Mojito",    prixHt:9.17,  prixTtc:11.00, coutHt:2.80, stock:99, seuil:3, servingMl:null, unite:"verre", type:"bar_unite" },
          { id:"c2", nom:"Spritz",    prixHt:8.33,  prixTtc:10.00, coutHt:2.20, stock:99, seuil:3, servingMl:null, unite:"verre", type:"bar_unite" },
          { id:"c3", nom:"Cuba Libre",prixHt:8.33,  prixTtc:10.00, coutHt:2.50, stock:99, seuil:3, servingMl:null, unite:"verre", type:"bar_unite" },
        ],
      },
      softs: {
        id:"softs", label:"Softs & Cafés", emoji:"☕", couleur:"#9E8E82",
        articles: [
          { id:"s1", nom:"Espresso",      prixHt:2.08, prixTtc:2.50, coutHt:0.28, stock:99, seuil:5, servingMl:null, unite:"tasse",    type:"bar_unite" },
          { id:"s2", nom:"Jus d'orange",  prixHt:2.92, prixTtc:3.50, coutHt:0.60, stock:14, seuil:3, servingMl:null, unite:"verre",    type:"bar_unite" },
          { id:"s3", nom:"Coca-Cola",     prixHt:2.50, prixTtc:3.00, coutHt:0.55, stock:30, seuil:5, servingMl:null, unite:"bouteille",type:"bar_unite" },
        ],
      },
      vins: {
        id:"vins", label:"Vins & Bulles", emoji:"🍷", couleur:"#9B2335",
        articles: [
          { id:"v1", nom:"Bordeaux Rouge",   prixHt:5.00,  prixTtc:6.00,  coutHt:1.40, stockMl:4500, seuil:1000, servingMl:150, unite:"verre", type:"bar_volume" },
          { id:"v2", nom:"Blanc Sec",        prixHt:4.17,  prixTtc:5.00,  coutHt:1.10, stockMl:4500, seuil:1000, servingMl:150, unite:"verre", type:"bar_volume" },
          { id:"v3", nom:"Coupe Champagne",  prixHt:10.00, prixTtc:12.00, coutHt:3.20, stockMl:3000, seuil:750,  servingMl:150, unite:"verre", type:"bar_volume" },
        ],
      },
    },
  },
  boutique: {
    id:"boutique", label:"Boutique", emoji:"🛍️",
    color:"#5B9EF5", gradient:"linear-gradient(135deg,#5B9EF5,#2979D9)",
    marques: {
      secrid: {
        id:"secrid", label:"SECRID", emoji:"💳", couleur:"#C8A882",
        articles: [
          { id:"sc1", nom:"Slimwallet Noir",   prixHt:58.33, prixTtc:70.00,  coutHt:32.00, stock:5, seuil:2, servingMl:null, unite:"pc", type:"boutique" },
          { id:"sc2", nom:"Slimwallet Cognac", prixHt:58.33, prixTtc:70.00,  coutHt:32.00, stock:3, seuil:2, servingMl:null, unite:"pc", type:"boutique" },
          { id:"sc3", nom:"Miniwallet Noir",   prixHt:74.17, prixTtc:89.00,  coutHt:42.00, stock:2, seuil:2, servingMl:null, unite:"pc", type:"boutique" },
          { id:"sc4", nom:"Twinwallet Taupe",  prixHt:83.33, prixTtc:100.00, coutHt:48.00, stock:1, seuil:1, servingMl:null, unite:"pc", type:"boutique" },
        ],
      },
      mysense: {
        id:"mysense", label:"MY SENSE", emoji:"🌸", couleur:"#D4A8C7",
        articles: [
          { id:"ms1", nom:"Parfum N°1 — 50ml", prixHt:49.17, prixTtc:59.00, coutHt:22.00, stock:8, seuil:2, servingMl:null, unite:"pc", type:"boutique" },
          { id:"ms2", nom:"Parfum N°3 — 50ml", prixHt:49.17, prixTtc:59.00, coutHt:22.00, stock:6, seuil:2, servingMl:null, unite:"pc", type:"boutique" },
          { id:"ms3", nom:"Diffuseur Maison",   prixHt:33.33, prixTtc:40.00, coutHt:14.00, stock:4, seuil:2, servingMl:null, unite:"pc", type:"boutique" },
        ],
      },
      satechi: {
        id:"satechi", label:"SATECHI", emoji:"🔌", couleur:"#6B7280",
        articles: [
          { id:"sa1", nom:"Hub USB-C 7-en-1",   prixHt:70.83, prixTtc:85.00, coutHt:38.00, stock:4, seuil:2, servingMl:null, unite:"pc", type:"boutique" },
          { id:"sa2", nom:"Chargeur 65W USB-C",  prixHt:36.67, prixTtc:44.00, coutHt:18.00, stock:7, seuil:2, servingMl:null, unite:"pc", type:"boutique" },
          { id:"sa3", nom:"Stand Alu MacBook",   prixHt:54.17, prixTtc:65.00, coutHt:26.00, stock:3, seuil:2, servingMl:null, unite:"pc", type:"boutique" },
          { id:"sa4", nom:"Câble Tressé 1m",     prixHt:20.83, prixTtc:25.00, coutHt:8.00,  stock:2, seuil:2, servingMl:null, unite:"pc", type:"boutique" },
        ],
      },
      leo: {
        id:"leo", label:"LEO", emoji:"🖋️", couleur:"#2C2C2C",
        articles: [
          { id:"l1", nom:"Stylo Bille Premium",   prixHt:29.17, prixTtc:35.00, coutHt:12.00, stock:10, seuil:2, servingMl:null, unite:"pc", type:"boutique" },
          { id:"l2", nom:"Carnet A5 Cuir",        prixHt:20.83, prixTtc:25.00, coutHt:8.00,  stock:7,  seuil:2, servingMl:null, unite:"pc", type:"boutique" },
          { id:"l3", nom:"Coffret Stylo+Carnet",  prixHt:45.83, prixTtc:55.00, coutHt:19.00, stock:3,  seuil:2, servingMl:null, unite:"pc", type:"boutique" },
        ],
      },
      bose: {
        id:"bose", label:"BOSE", emoji:"🎧", couleur:"#1A1612",
        articles: [
          { id:"bo1", nom:"QC45 Noir",       prixHt:280.00, prixTtc:336.00, coutHt:180.00, stock:4, seuil:1, servingMl:null, unite:"pc", type:"boutique" },
          { id:"bo2", nom:"QC45 Blanc Fumé", prixHt:280.00, prixTtc:336.00, coutHt:180.00, stock:2, seuil:1, servingMl:null, unite:"pc", type:"boutique" },
          { id:"bo3", nom:"SoundLink Flex",  prixHt:119.17, prixTtc:143.00, coutHt:72.00,  stock:3, seuil:1, servingMl:null, unite:"pc", type:"boutique" },
        ],
      },
    },
  },
};

const CHARGES_MENSUELLES = { loyer:1200, edf:200, internet:50, assurance:80, urssaf: 2000 };

// ══════════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════════
const fmt   = (n, d=2) => Number(n).toLocaleString("fr-FR",{minimumFractionDigits:d,maximumFractionDigits:d});
const fmtMl = (ml) => ml >= 1000 ? `${fmt(ml/1000,2)} L` : `${ml} ml`;
const uid   = () => `${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
const now   = () => new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});

function getStock(art) {
  if (art.type === "bar_volume") return art.stockMl;
  return art.stock ?? 0;
}
function isEnAlerte(art) {
  if (art.type === "bar_volume") return art.stockMl <= art.seuil;
  return (art.stock ?? 0) <= art.seuil;
}
function isRupture(art) {
  if (art.type === "bar_volume") return art.stockMl < (art.servingMl ?? 0);
  return (art.stock ?? 0) <= 0;
}
function stockLabel(art) {
  if (art.type === "bar_volume") return fmtMl(art.stockMl);
  return `${art.stock} ${art.unite}`;
}
function healthColor(prixHt, coutHt) {
  const pct = prixHt > 0 ? ((prixHt-coutHt)/prixHt)*100 : 0;
  if (pct >= 55) return { color:"#4CAF87", label:`${Math.round(pct)}%` };
  if (pct >= 35) return { color:"#FF8C69", label:`${Math.round(pct)}%` };
  return            { color:"#E05252",  label:`${Math.round(pct)}%` };
}

// ══════════════════════════════════════════════════════════════════════
// DÉDUCTION DE STOCK — moteur central
// ══════════════════════════════════════════════════════════════════════
function deduireStock(catalogue, universId, marqueId, articleId, qty=1) {
  return JSON.parse(JSON.stringify(catalogue), function(key, val) {
    // On reconstruit proprement pour garder les références
    return val;
  }), (() => {
    const next = structuredClone(catalogue);
    const art  = next[universId].marques[marqueId].articles
                   .find(a => a.id === articleId);
    if (!art) return next;
    if (art.type === "bar_volume") {
      art.stockMl = Math.max(0, art.stockMl - (art.servingMl * qty));
    } else {
      art.stock = Math.max(0, (art.stock ?? 0) - qty);
    }
    return next;
  })();
}

// ══════════════════════════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════════
// SUPER-ADMIN — Interface God Mode
// ══════════════════════════════════════════════════════════════════════


// ══════════════════════════════════════════════════════════════════════
// NOVACAISSE — Super Admin Interface
// Route protégée : /super-admin
// Accès : SUPER_ADMIN uniquement
// ══════════════════════════════════════════════════════════════════════

const MODULES = [
  { id: "pos",        label: "Caisse POS",      icon: "🧾", cat: "core" },
  { id: "stock",      label: "Stocks",           icon: "📦", cat: "core" },
  { id: "finance",    label: "Finances",         icon: "💰", cat: "core" },
  { id: "flux_masse", label: "Flux Masse",       icon: "⚖️",  cat: "flux", desc: "Poids / Volume / Vrac" },
  { id: "flux_id",    label: "Flux Identité",    icon: "🔖", cat: "flux", desc: "IMEI / Série / Garantie" },
  { id: "flux_dispo", label: "Flux Disponibilité",icon:"📅", cat: "flux", desc: "Location / Réservation" },
  { id: "flux_seg",   label: "Flux Segmentation",icon: "🎨", cat: "flux", desc: "Variantes / Tailles / Couleurs" },
  { id: "loyalty",    label: "Fidélité",         icon: "⭐", cat: "premium" },
  { id: "booking",    label: "Réservations",     icon: "🗓️",  cat: "premium" },
  { id: "multi_store",label: "Multi-boutiques",  icon: "🏪", cat: "premium" },
];

const PLANS = [
  { id: "starter",    label: "Starter",    price: 29,  color: "#6B7280" },
  { id: "pro",        label: "Pro",        price: 79,  color: "#FF8C69" },
  { id: "enterprise", label: "Enterprise", price: 199, color: "#A78BFA" },
];

const BUSINESS_TYPES = [
  { id: "retail",   label: "Boutique Retail",   icon: "🛍️" },
  { id: "cafe",     label: "Café / Bar",         icon: "☕" },
  { id: "fashion",  label: "Mode / Vêtements",  icon: "👗" },
  { id: "luxury",   label: "Luxe / Bijouterie",  icon: "💎" },
  { id: "services", label: "Services",           icon: "⚙️" },
  { id: "custom",   label: "Personnalisé",       icon: "🔧" },
];

const DEMO_TENANTS = [
  {
    id: "t1", name: "Shop In Café", slug: "shop-in-cafe", status: "active",
    plan: "pro", business_type: "cafe", primary_color: "#FF8C69",
    modules: ["pos","stock","finance","flux_masse"],
    users: 3, products: 42, revenue: 12450,
  },
  {
    id: "t2", name: "Boutique Élite", slug: "boutique-elite", status: "trial",
    plan: "starter", business_type: "fashion", primary_color: "#A78BFA",
    modules: ["pos","stock"],
    users: 1, products: 8, revenue: 0,
  },
  {
    id: "t3", name: "TechRepair Pro", slug: "techrepair", status: "active",
    plan: "enterprise", business_type: "retail", primary_color: "#5B9EF5",
    modules: ["pos","stock","finance","flux_id","flux_seg"],
    users: 7, products: 234, revenue: 38900,
  },
];

// ──────────────────────────────────────────────────────────────────────
// Composant Principal
// ──────────────────────────────────────────────────────────────────────
function SuperAdmin() {
  const [view,         setView]        = useState("dashboard"); // dashboard | tenants | create | tenant-detail | audit
  const [tenants,      setTenants]     = useState(DEMO_TENANTS);
  const [selected,     setSelected]    = useState(null);
  const [createForm,   setCreateForm]  = useState(defaultForm());
  const [searchTenant, setSearchTenant]= useState("");
  const [filterStatus, setFilterStatus]= useState("all");
  const [auditLogs,    setAuditLogs]   = useState(demoAuditLogs());
  const [toasts,       setToasts]      = useState([]);

  function toast(msg, type="success") {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }

  function defaultForm() {
    return {
      name: "", slug: "", business_type: "retail", plan: "pro",
      primary_color: "#FF8C69", secondary_color: "#1A1612",
      accent_color: "#4CAF87", logo_url: "",
      modules: ["pos","stock","finance"],
      flux_masse: false, flux_identite: false, flux_dispo: false, flux_segment: false,
      quota_users: 5, quota_products: 500,
      status: "trial",
    };
  }

  function createTenant() {
    if (!createForm.name || !createForm.slug) { toast("Nom et slug requis", "error"); return; }
    const newT = {
      id: Date.now().toString(),
      ...createForm,
      users: 0, products: 0, revenue: 0,
    };
    setTenants(p => [...p, newT]);
    setCreateForm(defaultForm());
    setView("tenants");
    toast(`✓ ${newT.name} créé avec succès`);
  }

  function toggleModule(mod) {
    setCreateForm(p => ({
      ...p,
      modules: p.modules.includes(mod)
        ? p.modules.filter(m => m !== mod)
        : [...p.modules, mod]
    }));
  }

  function toggleTenantModule(tenantId, mod) {
    setTenants(p => p.map(t => t.id !== tenantId ? t : {
      ...t,
      modules: t.modules.includes(mod) ? t.modules.filter(m => m !== mod) : [...t.modules, mod]
    }));
    toast(`Module mis à jour`);
  }

  function suspendTenant(id) {
    setTenants(p => p.map(t => t.id !== id ? t :
      { ...t, status: t.status === "suspended" ? "active" : "suspended" }));
    const t = tenants.find(t => t.id === id);
    toast(t?.status === "suspended" ? `${t.name} réactivé` : `${t?.name} suspendu`, "warning");
  }

  function injectDemo(id) {
    setTenants(p => p.map(t => t.id !== id ? t :
      { ...t, products: 42, users: 3, revenue: 5200 }));
    toast("✓ Données démo injectées");
  }

  const filtered = tenants.filter(t => {
    const q = searchTenant.toLowerCase();
    const matchQ = !q || t.name.toLowerCase().includes(q) || t.slug.includes(q);
    const matchS = filterStatus === "all" || t.status === filterStatus;
    return matchQ && matchS;
  });

  const stats = {
    total: tenants.length,
    active: tenants.filter(t => t.status === "active").length,
    trial: tenants.filter(t => t.status === "trial").length,
    suspended: tenants.filter(t => t.status === "suspended").length,
    revenue: tenants.reduce((s, t) => s + (t.revenue || 0), 0),
  };

  return (
    <>
      <style>{CSS_SA}</style>
      <div className="sa-root">

        {/* ── Sidebar ── */}
        <aside className="sa-sidebar">
          <div className="sa-logo">
            <span className="sa-logo__icon">N</span>
            <div>
              <div className="sa-logo__title">NovaCaisse</div>
              <div className="sa-logo__sub">God Mode</div>
            </div>
          </div>

          <nav className="sa-nav">
            {[
              { id: "dashboard", icon: "◉", label: "Dashboard" },
              { id: "tenants",   icon: "⬡", label: "Tenants" },
              { id: "create",    icon: "+", label: "Nouveau Tenant" },
              { id: "audit",     icon: "⊙", label: "Audit Log" },
            ].map(item => (
              <button key={item.id}
                className={`sa-nav__item${view === item.id ? " sa-nav__item--active" : ""}`}
                onClick={() => setView(item.id)}>
                <span className="sa-nav__icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sa-sidebar__footer">
            <div className="sa-user">
              <div className="sa-user__avatar">G</div>
              <div>
                <div className="sa-user__name">Gilliane Robin</div>
                <div className="sa-user__role">Super Admin</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Contenu principal ── */}
        <main className="sa-main">

          {/* DASHBOARD */}
          {view === "dashboard" && (
            <div className="sa-page fadein">
              <header className="sa-page__header">
                <div>
                  <h1 className="sa-page__title">Tableau de bord</h1>
                  <p className="sa-page__sub">Vue globale de la plateforme NovaCaisse</p>
                </div>
                <div className="sa-header__date">{new Date().toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long" })}</div>
              </header>

              {/* KPIs */}
              <div className="sa-kpis">
                <div className="sa-kpi">
                  <div className="sa-kpi__val">{stats.total}</div>
                  <div className="sa-kpi__label">Tenants total</div>
                </div>
                <div className="sa-kpi sa-kpi--green">
                  <div className="sa-kpi__val">{stats.active}</div>
                  <div className="sa-kpi__label">Actifs</div>
                </div>
                <div className="sa-kpi sa-kpi--amber">
                  <div className="sa-kpi__val">{stats.trial}</div>
                  <div className="sa-kpi__label">En essai</div>
                </div>
                <div className="sa-kpi sa-kpi--red">
                  <div className="sa-kpi__val">{stats.suspended}</div>
                  <div className="sa-kpi__label">Suspendus</div>
                </div>
                <div className="sa-kpi sa-kpi--accent">
                  <div className="sa-kpi__val">{stats.revenue.toLocaleString("fr-FR")} €</div>
                  <div className="sa-kpi__label">MRR estimé</div>
                </div>
              </div>

              {/* Liste rapide tenants */}
              <div className="sa-card">
                <div className="sa-card__head">
                  <h2 className="sa-card__title">Tenants récents</h2>
                  <button className="sa-btn sa-btn--ghost" onClick={() => setView("tenants")}>Voir tout →</button>
                </div>
                {tenants.slice(0, 5).map(t => (
                  <TenantRow key={t.id} tenant={t}
                    onSelect={() => { setSelected(t); setView("tenant-detail"); }}
                    onSuspend={() => suspendTenant(t.id)}
                    onDemo={() => injectDemo(t.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* LISTE TENANTS */}
          {view === "tenants" && (
            <div className="sa-page fadein">
              <header className="sa-page__header">
                <div>
                  <h1 className="sa-page__title">Tenants</h1>
                  <p className="sa-page__sub">{filtered.length} entreprise{filtered.length > 1 ? "s" : ""}</p>
                </div>
                <button className="sa-btn sa-btn--primary" onClick={() => setView("create")}>+ Nouveau Tenant</button>
              </header>

              <div className="sa-filters">
                <input className="sa-search" placeholder="Rechercher…"
                  value={searchTenant} onChange={e => setSearchTenant(e.target.value)}/>
                <div className="sa-filter-btns">
                  {["all","active","trial","suspended"].map(s => (
                    <button key={s}
                      className={`sa-filter-btn${filterStatus === s ? " active" : ""}`}
                      onClick={() => setFilterStatus(s)}>
                      {s === "all" ? "Tous" : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sa-card">
                {filtered.map(t => (
                  <TenantRow key={t.id} tenant={t}
                    onSelect={() => { setSelected(t); setView("tenant-detail"); }}
                    onSuspend={() => suspendTenant(t.id)}
                    onDemo={() => injectDemo(t.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* CRÉATION TENANT */}
          {view === "create" && (
            <div className="sa-page fadein">
              <header className="sa-page__header">
                <div>
                  <h1 className="sa-page__title">Nouveau Tenant</h1>
                  <p className="sa-page__sub">Déployer une nouvelle instance NovaCaisse</p>
                </div>
                <button className="sa-btn sa-btn--ghost" onClick={() => setView("tenants")}>← Retour</button>
              </header>

              <div className="sa-create-grid">

                {/* Colonne gauche : infos de base */}
                <div className="sa-col">
                  <div className="sa-card">
                    <h3 className="sa-section-title">Informations</h3>
                    <div className="sa-field">
                      <label className="sa-label">Nom de l'entreprise</label>
                      <input className="sa-input" placeholder="ex: Ma Boutique Paris"
                        value={createForm.name}
                        onChange={e => setCreateForm(p => ({...p, name: e.target.value,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-")}))}/>
                    </div>
                    <div className="sa-field">
                      <label className="sa-label">Slug URL</label>
                      <div className="sa-input-prefix">
                        <span className="sa-prefix">/b/</span>
                        <input className="sa-input sa-input--slug" placeholder="ma-boutique-paris"
                          value={createForm.slug}
                          onChange={e => setCreateForm(p => ({...p, slug: e.target.value}))}/>
                      </div>
                    </div>
                    <div className="sa-field">
                      <label className="sa-label">Type d'activité</label>
                      <div className="sa-biz-grid">
                        {BUSINESS_TYPES.map(bt => (
                          <button key={bt.id}
                            className={`sa-biz-btn${createForm.business_type === bt.id ? " active" : ""}`}
                            onClick={() => setCreateForm(p => ({...p, business_type: bt.id}))}>
                            <span>{bt.icon}</span>
                            <span>{bt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="sa-field">
                      <label className="sa-label">Plan de facturation</label>
                      <div className="sa-plans-grid">
                        {PLANS.map(pl => (
                          <button key={pl.id}
                            className={`sa-plan-btn${createForm.plan === pl.id ? " active" : ""}`}
                            style={{ "--pc": pl.color }}
                            onClick={() => setCreateForm(p => ({...p, plan: pl.id}))}>
                            <span className="sa-plan-name">{pl.label}</span>
                            <span className="sa-plan-price">{pl.price} €/mois</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quotas */}
                  <div className="sa-card">
                    <h3 className="sa-section-title">Quotas</h3>
                    <div className="sa-field-row">
                      <div className="sa-field">
                        <label className="sa-label">Max utilisateurs</label>
                        <input className="sa-input" type="number" min="1"
                          value={createForm.quota_users}
                          onChange={e => setCreateForm(p => ({...p, quota_users: +e.target.value}))}/>
                      </div>
                      <div className="sa-field">
                        <label className="sa-label">Max produits</label>
                        <input className="sa-input" type="number" min="1"
                          value={createForm.quota_products}
                          onChange={e => setCreateForm(p => ({...p, quota_products: +e.target.value}))}/>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Colonne droite : branding + modules */}
                <div className="sa-col">

                  {/* Branding */}
                  <div className="sa-card">
                    <h3 className="sa-section-title">Branding</h3>
                    <div className="sa-brand-preview" style={{
                      background: `linear-gradient(135deg, ${createForm.primary_color}22, ${createForm.accent_color}11)`,
                      borderColor: createForm.primary_color + "44"
                    }}>
                      <div className="sa-brand-dot" style={{ background: createForm.primary_color }}/>
                      <div>
                        <div className="sa-brand-name" style={{ color: createForm.primary_color }}>
                          {createForm.name || "Nom de l'entreprise"}
                        </div>
                        <div className="sa-brand-slug">/{createForm.slug || "slug"}</div>
                      </div>
                    </div>
                    <div className="sa-field-row">
                      <div className="sa-field">
                        <label className="sa-label">Couleur principale</label>
                        <div className="sa-color-wrap">
                          <input type="color" className="sa-color-input"
                            value={createForm.primary_color}
                            onChange={e => setCreateForm(p => ({...p, primary_color: e.target.value}))}/>
                          <input className="sa-input sa-input--hex"
                            value={createForm.primary_color}
                            onChange={e => setCreateForm(p => ({...p, primary_color: e.target.value}))}/>
                        </div>
                      </div>
                      <div className="sa-field">
                        <label className="sa-label">Couleur accent</label>
                        <div className="sa-color-wrap">
                          <input type="color" className="sa-color-input"
                            value={createForm.accent_color}
                            onChange={e => setCreateForm(p => ({...p, accent_color: e.target.value}))}/>
                          <input className="sa-input sa-input--hex"
                            value={createForm.accent_color}
                            onChange={e => setCreateForm(p => ({...p, accent_color: e.target.value}))}/>
                        </div>
                      </div>
                    </div>
                    <div className="sa-field">
                      <label className="sa-label">URL du logo</label>
                      <input className="sa-input" placeholder="https://..."
                        value={createForm.logo_url}
                        onChange={e => setCreateForm(p => ({...p, logo_url: e.target.value}))}/>
                    </div>
                  </div>

                  {/* Modules */}
                  <div className="sa-card">
                    <h3 className="sa-section-title">Modules & Flux Logiques</h3>

                    {["core","flux","premium"].map(cat => (
                      <div key={cat} className="sa-mod-group">
                        <div className="sa-mod-cat">
                          {cat === "core" ? "CORE" : cat === "flux" ? "FLUX LOGIQUES" : "PREMIUM"}
                        </div>
                        {MODULES.filter(m => m.cat === cat).map(mod => (
                          <label key={mod.id} className="sa-mod-row">
                            <span className="sa-mod-icon">{mod.icon}</span>
                            <div className="sa-mod-info">
                              <span className="sa-mod-label">{mod.label}</span>
                              {mod.desc && <span className="sa-mod-desc">{mod.desc}</span>}
                            </div>
                            <div
                              className={`sa-switch${createForm.modules.includes(mod.id) ? " sa-switch--on" : ""}`}
                              onClick={() => toggleModule(mod.id)}>
                              <div className="sa-switch__thumb"/>
                            </div>
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Action */}
                  <button className="sa-btn sa-btn--primary sa-btn--full" onClick={createTenant}>
                    Déployer le tenant →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DÉTAIL TENANT */}
          {view === "tenant-detail" && selected && (
            <TenantDetail
              tenant={tenants.find(t => t.id === selected.id) || selected}
              onBack={() => setView("tenants")}
              onToggleModule={(mod) => toggleTenantModule(selected.id, mod)}
              onSuspend={() => suspendTenant(selected.id)}
              onDemo={() => injectDemo(selected.id)}
              onUpdate={(updates) => {
                setTenants(p => p.map(t => t.id === selected.id ? {...t, ...updates} : t));
                toast("Tenant mis à jour");
              }}
            />
          )}

          {/* AUDIT LOG */}
          {view === "audit" && (
            <div className="sa-page fadein">
              <header className="sa-page__header">
                <div>
                  <h1 className="sa-page__title">Audit Log</h1>
                  <p className="sa-page__sub">Journal de toutes les actions sensibles</p>
                </div>
              </header>
              <div className="sa-card">
                <div className="sa-audit-head">
                  <span>Action</span><span>Utilisateur</span><span>Tenant</span><span>Date</span>
                </div>
                {auditLogs.map((log, i) => (
                  <div key={i} className="sa-audit-row">
                    <div className="sa-audit-action">
                      <span className={`sa-audit-badge sa-audit-badge--${log.type}`}>{log.action}</span>
                    </div>
                    <div className="sa-audit-user">{log.user}</div>
                    <div className="sa-audit-tenant">{log.tenant}</div>
                    <div className="sa-audit-date">{log.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Toasts */}
        <div className="sa-toasts">
          {toasts.map(t => (
            <div key={t.id} className={`sa-toast sa-toast--${t.type || "success"}`}>{t.msg}</div>
          ))}
        </div>
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────
// TenantRow
// ──────────────────────────────────────────────────────────────────────
function TenantRow({ tenant, onSelect, onSuspend, onDemo }) {
  return (
    <div className="sa-tenant-row">
      <div className="sa-tenant-color" style={{ background: tenant.primary_color }}/>
      <div className="sa-tenant-info" onClick={onSelect}>
        <div className="sa-tenant-name">{tenant.name}</div>
        <div className="sa-tenant-slug">/{tenant.slug} · {tenant.plan}</div>
      </div>
      <div className="sa-tenant-stats">
        <span>{tenant.users} users</span>
        <span>{tenant.products} produits</span>
        <span>{(tenant.revenue || 0).toLocaleString("fr-FR")} €</span>
      </div>
      <StatusBadge status={tenant.status}/>
      <div className="sa-tenant-actions">
        <button className="sa-action-btn" onClick={onSelect} title="Voir le détail">⚙</button>
        <button className="sa-action-btn" onClick={onDemo} title="Injecter démo">🎲</button>
        <button className={`sa-action-btn${tenant.status === "suspended" ? " sa-action-btn--green" : " sa-action-btn--red"}`}
          onClick={onSuspend} title={tenant.status === "suspended" ? "Réactiver" : "Suspendre"}>
          {tenant.status === "suspended" ? "▶" : "⏸"}
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// TenantDetail
// ──────────────────────────────────────────────────────────────────────
function TenantDetail({ tenant, onBack, onToggleModule, onSuspend, onDemo, onUpdate }) {
  const [tab, setTab] = useState("overview");
  const [color, setColor] = useState(tenant.primary_color);

  const quotaUserPct    = Math.round((tenant.users    / (tenant.quota_users    || 5)) * 100);
  const quotaProductPct = Math.round((tenant.products / (tenant.quota_products || 500)) * 100);

  return (
    <div className="sa-page fadein">
      <header className="sa-page__header">
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <button className="sa-btn sa-btn--ghost" onClick={onBack}>←</button>
          <div className="sa-tenant-color sa-tenant-color--lg" style={{ background: tenant.primary_color }}/>
          <div>
            <h1 className="sa-page__title">{tenant.name}</h1>
            <p className="sa-page__sub">/b/{tenant.slug} · {tenant.plan}</p>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="sa-btn sa-btn--ghost" onClick={onDemo}>🎲 Démo</button>
          <button className={`sa-btn${tenant.status === "suspended" ? " sa-btn--green" : " sa-btn--red"}`}
            onClick={onSuspend}>
            {tenant.status === "suspended" ? "▶ Réactiver" : "⏸ Suspendre"}
          </button>
        </div>
      </header>

      <div className="sa-tabs">
        {["overview","modules","branding","quotas","audit"].map(t => (
          <button key={t} className={`sa-tab${tab === t ? " sa-tab--active" : ""}`}
            onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="sa-card">
          <div className="sa-detail-kpis">
            <div className="sa-detail-kpi">
              <div className="sa-detail-kpi__val">{tenant.users}</div>
              <div className="sa-detail-kpi__label">Utilisateurs</div>
            </div>
            <div className="sa-detail-kpi">
              <div className="sa-detail-kpi__val">{tenant.products}</div>
              <div className="sa-detail-kpi__label">Produits</div>
            </div>
            <div className="sa-detail-kpi">
              <div className="sa-detail-kpi__val">{(tenant.revenue||0).toLocaleString("fr-FR")} €</div>
              <div className="sa-detail-kpi__label">CA</div>
            </div>
            <div className="sa-detail-kpi">
              <StatusBadge status={tenant.status}/>
              <div className="sa-detail-kpi__label">Statut</div>
            </div>
          </div>
          <div className="sa-info-rows">
            <div className="sa-info-row"><span>Plan</span><strong>{tenant.plan}</strong></div>
            <div className="sa-info-row"><span>Type</span><strong>{tenant.business_type}</strong></div>
            <div className="sa-info-row"><span>Lien public</span>
              <strong style={{fontFamily:"monospace"}}>/b/{tenant.slug}</strong></div>
            <div className="sa-info-row"><span>Modules actifs</span>
              <strong>{tenant.modules?.length || 0}</strong></div>
          </div>
        </div>
      )}

      {tab === "modules" && (
        <div className="sa-card">
          <h3 className="sa-section-title">Modules & Flux actifs</h3>
          {["core","flux","premium"].map(cat => (
            <div key={cat} className="sa-mod-group">
              <div className="sa-mod-cat">
                {cat === "core" ? "CORE" : cat === "flux" ? "FLUX LOGIQUES" : "PREMIUM"}
              </div>
              {MODULES.filter(m => m.cat === cat).map(mod => (
                <label key={mod.id} className="sa-mod-row">
                  <span className="sa-mod-icon">{mod.icon}</span>
                  <div className="sa-mod-info">
                    <span className="sa-mod-label">{mod.label}</span>
                    {mod.desc && <span className="sa-mod-desc">{mod.desc}</span>}
                  </div>
                  <div
                    className={`sa-switch${tenant.modules?.includes(mod.id) ? " sa-switch--on" : ""}`}
                    style={{ "--sc": tenant.primary_color }}
                    onClick={() => onToggleModule(mod.id)}>
                    <div className="sa-switch__thumb"/>
                  </div>
                </label>
              ))}
            </div>
          ))}
        </div>
      )}

      {tab === "branding" && (
        <div className="sa-card">
          <h3 className="sa-section-title">Branding dynamique</h3>
          <p style={{ fontSize:13, color:"#9E8E82", marginBottom:16 }}>
            Les modifications s'appliquent instantanément dans l'interface du client.
          </p>
          <div className="sa-brand-preview" style={{
            background: `linear-gradient(135deg, ${tenant.primary_color}22, #4CAF8711)`,
            borderColor: tenant.primary_color + "44", marginBottom: 20
          }}>
            <div className="sa-brand-dot" style={{ background: tenant.primary_color }}/>
            <div>
              <div className="sa-brand-name" style={{ color: tenant.primary_color }}>{tenant.name}</div>
              <div className="sa-brand-slug" style={{ fontSize:12, color:"#9E8E82" }}>/{tenant.slug}</div>
            </div>
          </div>
          <div className="sa-field">
            <label className="sa-label">Couleur principale</label>
            <div className="sa-color-wrap">
              <input type="color" className="sa-color-input" value={color}
                onChange={e => setColor(e.target.value)}/>
              <input className="sa-input sa-input--hex" value={color}
                onChange={e => setColor(e.target.value)}/>
            </div>
          </div>
          <button className="sa-btn sa-btn--primary"
            onClick={() => onUpdate({ primary_color: color })}>
            Appliquer le branding →
          </button>
        </div>
      )}

      {tab === "quotas" && (
        <div className="sa-card">
          <h3 className="sa-section-title">Quotas & Limites</h3>
          <div className="sa-quota-row">
            <div className="sa-quota-label">
              <span>Utilisateurs</span>
              <span>{tenant.users} / {tenant.quota_users || 5}</span>
            </div>
            <div className="sa-quota-bar">
              <div className="sa-quota-fill"
                style={{ width: `${Math.min(100, quotaUserPct)}%`,
                  background: quotaUserPct > 80 ? "#E05252" : "#4CAF87" }}/>
            </div>
            {quotaUserPct > 80 && <div className="sa-quota-alert">⚠ Limite proche</div>}
          </div>
          <div className="sa-quota-row">
            <div className="sa-quota-label">
              <span>Produits</span>
              <span>{tenant.products} / {tenant.quota_products || 500}</span>
            </div>
            <div className="sa-quota-bar">
              <div className="sa-quota-fill"
                style={{ width: `${Math.min(100, quotaProductPct)}%`,
                  background: quotaProductPct > 80 ? "#E05252" : "#4CAF87" }}/>
            </div>
            {quotaProductPct > 80 && <div className="sa-quota-alert">⚠ Limite proche</div>}
          </div>
        </div>
      )}

      {tab === "audit" && (
        <div className="sa-card">
          <div className="sa-audit-head">
            <span>Action</span><span>Utilisateur</span><span>Date</span>
          </div>
          {demoAuditLogs().filter(l => l.tenant === tenant.name).map((log, i) => (
            <div key={i} className="sa-audit-row">
              <span className={`sa-audit-badge sa-audit-badge--${log.type}`}>{log.action}</span>
              <span className="sa-audit-user">{log.user}</span>
              <span className="sa-audit-date">{log.date}</span>
            </div>
          ))}
          {demoAuditLogs().filter(l => l.tenant === tenant.name).length === 0 && (
            <div style={{ padding:"24px", textAlign:"center", color:"#9E8E82", fontSize:13 }}>
              Aucune action enregistrée pour ce tenant.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// StatusBadge
// ──────────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    active:    { label: "Actif",     color: "#2D9B6F", bg: "rgba(76,175,135,.12)" },
    trial:     { label: "Essai",     color: "#F59E0B", bg: "rgba(245,158,11,.12)" },
    suspended: { label: "Suspendu",  color: "#E05252", bg: "rgba(224,82,82,.12)"  },
    cancelled: { label: "Annulé",    color: "#9E8E82", bg: "rgba(158,142,130,.12)"},
  };
  const s = map[status] || map.active;
  return (
    <span className="sa-status-badge" style={{ color: s.color, background: s.bg }}>
      {s.label}
    </span>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Données démo
// ──────────────────────────────────────────────────────────────────────
function demoAuditLogs() {
  return [
    { action:"product.delete",  type:"danger",  user:"owner@shopincafe.fr",  tenant:"Shop In Café",  date:"03/05 14:32" },
    { action:"price.update",    type:"warning", user:"owner@shopincafe.fr",  tenant:"Shop In Café",  date:"03/05 12:18" },
    { action:"user.create",     type:"info",    user:"admin@novacaisse.io",   tenant:"Shop In Café",  date:"02/05 09:45" },
    { action:"product.delete",  type:"danger",  user:"owner@techrepair.fr",   tenant:"TechRepair Pro",date:"01/05 16:20" },
    { action:"transaction.void",type:"warning", user:"staff@shopincafe.fr",   tenant:"Shop In Café",  date:"30/04 11:05" },
  ];
}

// ──────────────────────────────────────────────────────────────────────
// CSS
// ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg: #0E0D0C;
  --bg2: #161513;
  --bg3: #1E1C1A;
  --line: rgba(255,255,255,.07);
  --text: #F5F0EB;
  --t2: #A89F96;
  --t3: #6B635C;
  --salmon: #FF8C69;
  --salmon-d: #E8704A;
  --green: #4CAF87;
  --red: #E05252;
  --amber: #F59E0B;
  --blue: #5B9EF5;
  --purple: #A78BFA;
  --r: 12px;
  --rsm: 8px;
}

body{background:var(--bg);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;-webkit-font-smoothing:antialiased}

.sa-root{display:grid;grid-template-columns:240px 1fr;min-height:100vh}

/* Sidebar */
.sa-sidebar{
  background:var(--bg2);border-right:1px solid var(--line);
  display:flex;flex-direction:column;padding:0;
  position:sticky;top:0;height:100vh;overflow-y:auto;
}
.sa-logo{
  display:flex;align-items:center;gap:12px;
  padding:24px 20px;border-bottom:1px solid var(--line);
}
.sa-logo__icon{
  width:38px;height:38px;border-radius:10px;
  background:linear-gradient(135deg,var(--salmon),var(--salmon-d));
  color:#fff;font-weight:900;font-size:18px;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
}
.sa-logo__title{font-size:15px;font-weight:800;color:var(--text)}
.sa-logo__sub{font-size:11px;color:var(--salmon);font-weight:600;letter-spacing:.06em;text-transform:uppercase}
.sa-nav{padding:12px 12px;display:flex;flex-direction:column;gap:2px;flex:1}
.sa-nav__item{
  display:flex;align-items:center;gap:10px;
  padding:10px 12px;border-radius:var(--rsm);
  border:none;background:transparent;
  color:var(--t2);font-family:inherit;font-size:13px;font-weight:500;
  cursor:pointer;text-align:left;
  transition:all .15s;
}
.sa-nav__item:hover{background:rgba(255,255,255,.04);color:var(--text)}
.sa-nav__item--active{background:rgba(255,140,105,.1);color:var(--salmon) !important}
.sa-nav__icon{font-size:15px;width:18px;text-align:center;flex-shrink:0}
.sa-sidebar__footer{border-top:1px solid var(--line);padding:16px 20px}
.sa-user{display:flex;align-items:center;gap:10px}
.sa-user__avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--salmon),var(--salmon-d));color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sa-user__name{font-size:13px;font-weight:600;color:var(--text)}
.sa-user__role{font-size:11px;color:var(--salmon);font-weight:600}

/* Main */
.sa-main{background:var(--bg);overflow-y:auto;padding:0}
.sa-page{max-width:1100px;margin:0 auto;padding:32px 28px 64px;display:flex;flex-direction:column;gap:20px}
.fadein{animation:fadeUp .3s ease both}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}

/* Header */
.sa-page__header{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
.sa-page__title{font-family:'DM Serif Display',serif;font-size:28px;letter-spacing:-.02em;color:var(--text);margin-bottom:4px}
.sa-page__sub{font-size:13px;color:var(--t3)}
.sa-header__date{font-size:13px;color:var(--t3);padding-top:8px;text-transform:capitalize}

/* KPIs */
.sa-kpis{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
.sa-kpi{background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);padding:16px 20px}
.sa-kpi__val{font-family:'DM Serif Display',serif;font-size:28px;color:var(--text);margin-bottom:4px}
.sa-kpi__label{font-size:12px;color:var(--t3)}
.sa-kpi--green .sa-kpi__val{color:var(--green)}
.sa-kpi--amber .sa-kpi__val{color:var(--amber)}
.sa-kpi--red .sa-kpi__val{color:var(--red)}
.sa-kpi--accent .sa-kpi__val{color:var(--salmon)}

/* Cards */
.sa-card{background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);padding:20px;display:flex;flex-direction:column;gap:14px}
.sa-card__head{display:flex;justify-content:space-between;align-items:center}
.sa-card__title{font-size:16px;font-weight:700;color:var(--text)}

/* Tenant row */
.sa-tenant-row{display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--line)}
.sa-tenant-row:last-child{border-bottom:none}
.sa-tenant-color{width:6px;height:40px;border-radius:3px;flex-shrink:0}
.sa-tenant-color--lg{width:10px;height:52px;border-radius:5px;flex-shrink:0}
.sa-tenant-info{flex:1;cursor:pointer}
.sa-tenant-name{font-size:14px;font-weight:700;color:var(--text);margin-bottom:2px}
.sa-tenant-slug{font-size:11px;color:var(--t3)}
.sa-tenant-stats{display:flex;gap:16px;font-size:12px;color:var(--t2)}
.sa-tenant-actions{display:flex;gap:6px;flex-shrink:0}
.sa-action-btn{width:30px;height:30px;border-radius:var(--rsm);border:1px solid var(--line);background:transparent;color:var(--t2);cursor:pointer;font-size:13px;transition:all .15s;display:flex;align-items:center;justify-content:center}
.sa-action-btn:hover{background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.15);color:var(--text)}
.sa-action-btn--red:hover{border-color:var(--red);color:var(--red);background:rgba(224,82,82,.08)}
.sa-action-btn--green:hover{border-color:var(--green);color:var(--green);background:rgba(76,175,135,.08)}

/* Status badge */
.sa-status-badge{padding:4px 10px;border-radius:100px;font-size:11px;font-weight:700;white-space:nowrap}

/* Filters */
.sa-filters{display:flex;gap:10px;align-items:center}
.sa-search{flex:1;background:var(--bg2);border:1px solid var(--line);border-radius:var(--rsm);padding:10px 14px;color:var(--text);font-family:inherit;font-size:14px;outline:none;transition:border-color .15s}
.sa-search:focus{border-color:rgba(255,140,105,.4)}
.sa-search::placeholder{color:var(--t3)}
.sa-filter-btns{display:flex;gap:4px}
.sa-filter-btn{padding:8px 12px;border-radius:var(--rsm);border:1px solid var(--line);background:transparent;color:var(--t2);font-family:inherit;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s}
.sa-filter-btn.active,.sa-filter-btn:hover{border-color:var(--salmon);color:var(--salmon);background:rgba(255,140,105,.08)}

/* Create form */
.sa-create-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
.sa-col{display:flex;flex-direction:column;gap:16px}
.sa-section-title{font-size:13px;font-weight:700;color:var(--t2);text-transform:uppercase;letter-spacing:.08em;padding-bottom:12px;border-bottom:1px solid var(--line)}
.sa-field{display:flex;flex-direction:column;gap:6px}
.sa-field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.sa-label{font-size:11px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.08em}
.sa-input{background:rgba(255,255,255,.04);border:1px solid var(--line);border-radius:var(--rsm);padding:11px 14px;color:var(--text);font-family:inherit;font-size:14px;width:100%;outline:none;transition:all .18s}
.sa-input:focus{border-color:rgba(255,140,105,.5);background:rgba(255,140,105,.03)}
.sa-input--hex{width:110px}
.sa-input--slug{border-left:none;border-radius:0 var(--rsm) var(--rsm) 0}
.sa-input-prefix{display:flex;align-items:center}
.sa-prefix{background:rgba(255,255,255,.06);border:1px solid var(--line);border-right:none;border-radius:var(--rsm) 0 0 var(--rsm);padding:11px 12px;font-size:13px;color:var(--t3);white-space:nowrap}

/* Business type grid */
.sa-biz-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.sa-biz-btn{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:var(--rsm);border:1px solid var(--line);background:transparent;color:var(--t2);font-family:inherit;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;text-align:left}
.sa-biz-btn.active,.sa-biz-btn:hover{border-color:var(--salmon);color:var(--salmon);background:rgba(255,140,105,.08)}

/* Plans */
.sa-plans-grid{display:flex;gap:8px}
.sa-plan-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:12px 8px;border-radius:var(--rsm);border:1.5px solid var(--line);background:transparent;cursor:pointer;transition:all .15s}
.sa-plan-btn.active,.sa-plan-btn:hover{border-color:var(--pc);background:color-mix(in srgb,var(--pc) 8%,transparent)}
.sa-plan-name{font-size:13px;font-weight:700;color:var(--text)}
.sa-plan-price{font-size:11px;color:var(--t3)}
.sa-plan-btn.active .sa-plan-name{color:var(--pc)}

/* Color picker */
.sa-color-wrap{display:flex;align-items:center;gap:8px}
.sa-color-input{width:42px;height:38px;border:1px solid var(--line);border-radius:var(--rsm);background:transparent;cursor:pointer;padding:2px}

/* Brand preview */
.sa-brand-preview{display:flex;align-items:center;gap:14px;padding:16px;border-radius:var(--rsm);border:1px solid;margin-bottom:8px;transition:all .3s}
.sa-brand-dot{width:40px;height:40px;border-radius:50%;flex-shrink:0;transition:background .3s}
.sa-brand-name{font-size:16px;font-weight:700;margin-bottom:2px;transition:color .3s}
.sa-brand-slug{font-size:12px;color:var(--t3)}

/* Modules */
.sa-mod-group{display:flex;flex-direction:column;gap:4px;margin-bottom:12px}
.sa-mod-cat{font-size:10px;font-weight:800;color:var(--t3);letter-spacing:.1em;text-transform:uppercase;padding:8px 0 4px}
.sa-mod-row{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:var(--rsm);cursor:pointer;transition:background .15s;user-select:none}
.sa-mod-row:hover{background:rgba(255,255,255,.03)}
.sa-mod-icon{font-size:18px;width:24px;text-align:center;flex-shrink:0}
.sa-mod-info{flex:1}
.sa-mod-label{display:block;font-size:13px;font-weight:600;color:var(--text)}
.sa-mod-desc{display:block;font-size:11px;color:var(--t3)}

/* Switch */
.sa-switch{width:44px;height:24px;border-radius:12px;background:rgba(255,255,255,.1);padding:2px;display:flex;align-items:center;cursor:pointer;transition:background .22s;flex-shrink:0}
.sa-switch--on{background:var(--sc,var(--salmon))}
.sa-switch__thumb{width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.3);transition:transform .22s cubic-bezier(.2,.8,.2,1)}
.sa-switch--on .sa-switch__thumb{transform:translateX(20px)}

/* Buttons */
.sa-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 18px;border-radius:var(--rsm);border:none;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;transition:all .18s;white-space:nowrap}
.sa-btn--primary{background:linear-gradient(135deg,var(--salmon),var(--salmon-d));color:#fff;box-shadow:0 4px 14px rgba(255,140,105,.3)}
.sa-btn--primary:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(255,140,105,.45)}
.sa-btn--ghost{background:rgba(255,255,255,.05);border:1px solid var(--line);color:var(--t2)}
.sa-btn--ghost:hover{background:rgba(255,255,255,.08);color:var(--text)}
.sa-btn--red{background:rgba(224,82,82,.12);border:1px solid rgba(224,82,82,.3);color:var(--red)}
.sa-btn--green{background:rgba(76,175,135,.12);border:1px solid rgba(76,175,135,.3);color:var(--green)}
.sa-btn--full{width:100%;margin-top:4px}

/* Tabs */
.sa-tabs{display:flex;gap:4px;border-bottom:1px solid var(--line);padding-bottom:0}
.sa-tab{padding:10px 16px;border:none;background:transparent;color:var(--t2);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .15s}
.sa-tab:hover{color:var(--text)}
.sa-tab--active{color:var(--salmon);border-bottom-color:var(--salmon)}

/* Detail KPIs */
.sa-detail-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding-bottom:12px;border-bottom:1px solid var(--line)}
.sa-detail-kpi{text-align:center}
.sa-detail-kpi__val{font-family:'DM Serif Display',serif;font-size:24px;color:var(--text);margin-bottom:4px}
.sa-detail-kpi__label{font-size:11px;color:var(--t3)}
.sa-info-rows{display:flex;flex-direction:column;gap:8px}
.sa-info-row{display:flex;justify-content:space-between;align-items:center;font-size:13px;padding:8px 0;border-bottom:1px solid var(--line)}
.sa-info-row:last-child{border-bottom:none}
.sa-info-row span{color:var(--t2)}
.sa-info-row strong{color:var(--text)}

/* Quotas */
.sa-quota-row{display:flex;flex-direction:column;gap:6px;padding-bottom:14px;border-bottom:1px solid var(--line)}
.sa-quota-row:last-child{border-bottom:none}
.sa-quota-label{display:flex;justify-content:space-between;font-size:13px;color:var(--t2)}
.sa-quota-bar{height:6px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden}
.sa-quota-fill{height:100%;border-radius:3px;transition:width .5s}
.sa-quota-alert{font-size:11px;color:var(--red);font-weight:600}

/* Audit log */
.sa-audit-head{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:12px;padding:8px 0;border-bottom:1px solid var(--line);font-size:10px;font-weight:800;color:var(--t3);text-transform:uppercase;letter-spacing:.08em}
.sa-audit-row{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:12px;padding:10px 0;border-bottom:1px solid var(--line);align-items:center;font-size:12px}
.sa-audit-row:last-child{border-bottom:none}
.sa-audit-badge{padding:3px 9px;border-radius:4px;font-size:11px;font-weight:700;font-family:monospace}
.sa-audit-badge--danger{background:rgba(224,82,82,.12);color:var(--red)}
.sa-audit-badge--warning{background:rgba(245,158,11,.12);color:var(--amber)}
.sa-audit-badge--info{background:rgba(91,158,245,.12);color:var(--blue)}
.sa-audit-user,.sa-audit-tenant{color:var(--t2)}
.sa-audit-date{color:var(--t3)}

/* Toasts */
.sa-toasts{position:fixed;bottom:24px;right:24px;display:flex;flex-direction:column;gap:8px;z-index:999}
.sa-toast{padding:12px 18px;border-radius:var(--rsm);font-size:13px;font-weight:600;animation:fadeUp .25s ease;box-shadow:0 8px 24px rgba(0,0,0,.4)}
.sa-toast--success{background:#2D9B6F;color:#fff}
.sa-toast--error{background:var(--red);color:#fff}
.sa-toast--warning{background:var(--amber);color:#fff}
`;


// ══════════════════════════════════════════════════════════════════════
// BOTTOM NAVIGATION — Mobile
// ══════════════════════════════════════════════════════════════════════
function BottomNav({ screen, setScreen }) {
  const items = [
    { id: "home",     icon: "⌂",  label: "Accueil" },
    { id: "caisse",   icon: "🧾", label: "Caisse"  },
    { id: "stocks",   icon: "📦", label: "Stocks"  },
    { id: "finances", icon: "💰", label: "Finances"},
    { id: "donnees",  icon: "⚙️",  label: "Données" },
  ];
  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <button key={item.id}
          className={`bnav-item${screen === item.id ? " bnav-item--active" : ""}`}
          onClick={() => setScreen(item.id)}>
          <span className="bnav-item__icon">{item.icon}</span>
          <span>{item.label}</span>
          <div className="bnav-item__dot"/>
        </button>
      ))}
    </nav>
  );
}

export default function App() {
  const [catalogue,    setCatalogue]    = useState(CATALOGUE_INIT);
  const [screen,       setScreen]       = useState(window.location.pathname === "/super-admin" ? "super-admin" : "home");
  const [panier,       setPanier]       = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [toasts,       setToasts]       = useState([]);
  const [mounted,      setMounted]      = useState(false);
  const [clients,      setClients]      = useState([]); // base clients
  // Modes de paiement activés — par défaut tous ON
  const [enabledModes, setEnabledModes] = useState(
    () => Object.fromEntries(MODES_PAIEMENT.map(m => [m.id, true]))
  );

  useEffect(() => { setTimeout(()=>setMounted(true), 60); }, []);

  // ── Toast manager ──
  const pushToast = useCallback((toast) => {
    const id = uid();
    setToasts(t => [...t, { ...toast, id }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4500);
  }, []);

  // ── Validation d'une vente ──
  const validerVente = useCallback((lignes) => {
    // 1. Déduire le stock pour chaque ligne
    let nextCat = catalogue;
    const alertes = [];

    lignes.forEach(({ article, universId, marqueId, qty }) => {
      nextCat = deduireStock(nextCat, universId, marqueId, article.id, qty);
      // Vérifier si le nouveau stock déclenche une alerte
      const artApres = nextCat[universId].marques[marqueId].articles
                         .find(a => a.id === article.id);
      if (artApres && isEnAlerte(artApres)) {
        alertes.push({ nom: article.nom, stock: stockLabel(artApres) });
      }
    });

    setCatalogue(nextCat);

    // 2. Créer la transaction financière
    const totalHt   = lignes.reduce((s,l) => s + l.article.prixHt  * l.qty, 0);
    const totalTtc  = lignes.reduce((s,l) => s + l.article.prixTtc * l.qty, 0);
    const totalCout = lignes.reduce((s,l) => s + l.article.coutHt  * l.qty, 0);
    const margeHt   = totalHt - totalCout;
    const chargesJour = Object.values(CHARGES_MENSUELLES).reduce((s,v)=>s+v,0) / 30;
    const benefNet  = margeHt - chargesJour * (totalHt / Math.max(1, totalHt)); // prorata simplifié

    const tx = {
      id: uid(),
      heure: now(),
      date: new Date().toLocaleDateString("fr-FR"),
      lignes: lignes.map(l => ({ nom:l.article.nom, qty:l.qty, prixTtc:l.article.prixTtc, prixHt:l.article.prixHt, coutHt:l.article.coutHt })),
      totalHt, totalTtc, totalCout, margeHt,
      margePct: totalHt > 0 ? (margeHt/totalHt)*100 : 0,
      benefNet,
      nbArticles: lignes.reduce((s,l)=>s+l.qty,0),
    };
    setTransactions(t => [tx, ...t]);

    // 3. Toasts d'alerte stock
    alertes.forEach((a, i) => {
      setTimeout(() => pushToast({
        type: "warning",
        title: "⚠ Stock critique",
        msg: `${a.nom} — ${a.stock} restant`,
      }), i * 600);
    });

    // 4. Toast succès
    pushToast({ type:"success", title:"✓ Vente enregistrée", msg:`${fmt(totalTtc)} € — marge ${Math.round(tx.margePct)}%` });

    setPanier([]);
  }, [catalogue, pushToast]);

  // ── KPIs agrégés ──
  const kpis = (() => {
    const caTtc    = transactions.reduce((s,t)=>s+t.totalTtc,0);
    const caHt     = transactions.reduce((s,t)=>s+t.totalHt,0);
    const marge    = transactions.reduce((s,t)=>s+t.margeHt,0);
    const charges  = Object.values(CHARGES_MENSUELLES).reduce((s,v)=>s+v,0)/30;
    const benefNet = marge - charges;
    const margePct = caHt > 0 ? (marge/caHt)*100 : 0;
    return { caTtc, caHt, marge, benefNet, margePct, charges, nbTx:transactions.length };
  })();

  return (
    <>
      <style>{CSS_SA}</style>
      <div className={`root ${mounted?"mounted":""}`}>
        <Ambient />
        <ToastStack toasts={toasts} />

        {screen==="home"      && <Home      setScreen={setScreen} panier={panier} kpis={kpis} enabledModes={enabledModes} />}
        {screen==="caisse"    && <Caisse    setScreen={setScreen} catalogue={catalogue} panier={panier} setPanier={setPanier} validerVente={validerVente} clients={clients} setClients={setClients} enabledModes={enabledModes} />}
        {screen==="stocks"    && <Stocks    setScreen={setScreen} catalogue={catalogue} setCatalogue={setCatalogue} />}
        {screen==="finances"  && <Finances  setScreen={setScreen} transactions={transactions} kpis={kpis} />}
        {screen==="donnees"   && <MesDonnees setScreen={setScreen} catalogue={catalogue} setCatalogue={setCatalogue} enabledModes={enabledModes} setEnabledModes={setEnabledModes} />}
        {screen==="super-admin" && <SuperAdmin />}
        {screen !== "super-admin" && <BottomNav screen={screen} setScreen={setScreen} />}
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════
// TOAST STACK
// ══════════════════════════════════════════════════════════════════════
function ToastStack({ toasts }) {
  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <div className="toast__title">{t.title}</div>
          <div className="toast__msg">{t.msg}</div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// HOME
// ══════════════════════════════════════════════════════════════════════
function Home({ setScreen, panier, kpis, enabledModes }) {
  const nbPanier = panier.reduce((s,l)=>s+l.qty,0);
  return (
    <div className="page fadein">
      <header className="home-header glass">
        <div className="logo-row">
          <span className="logo-glyph">◐</span>
          <div>
            <div className="logo-name">Shop In Café</div>
            <div className="logo-date">{new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}</div>
          </div>
        </div>
        <div className="home-kpis">
          <KpiChip label="CA du jour" val={`${fmt(kpis.caTtc)} €`} sub="TTC" />
          <KpiChip label="Ventes" val={`${kpis.nbTx}`} />
          <KpiChip label="Bénéf. net est." val={`${kpis.benefNet>=0?"+":""}${fmt(kpis.benefNet)} €`} green={kpis.benefNet>=0} />
        </div>
      </header>

      {/* Jauge profitabilité */}
      {kpis.nbTx > 0 && (
        <div className="glass profita-bar-wrap">
          <div className="profita-bar-header">
            <span className="profita-bar-label">Profitabilité du jour</span>
            <span className="profita-bar-pct" style={{color: kpis.margePct>=15?"#4CAF87":kpis.margePct>=5?"#FF8C69":"#E05252"}}>
              {fmt(kpis.margePct,1) + '% marge brute'}
            </span>
          </div>
          <div className="profita-track">
            <div className="profita-fill" style={{width:`${Math.min(100,kpis.margePct*3)}%`, background: kpis.margePct>=15?"linear-gradient(90deg,#4CAF87,#2d9b6f)":"linear-gradient(90deg,#FF8C69,#E8704A)"}} />
          </div>
          <div className="profita-detail">
            <span>Marge brute : {fmt(kpis.marge)} €</span>
            <span>Charges proratisées : {fmt(kpis.charges)} €/j</span>
            <span style={{fontWeight:700,color:kpis.benefNet>=0?"#4CAF87":"#E05252"}}>Net réel : {fmt(kpis.benefNet)} €</span>
          </div>
        </div>
      )}

      <div className="home-tiles home-tiles--5">
        <HomeTile icon="🧾" label="CAISSE"      sub="Encaisser rapidement"   accent="#FF8C69" badge={nbPanier||null} onClick={()=>setScreen("caisse")} />
        <HomeTile icon="📦" label="STOCKS"      sub="Gérer les rayons"       accent="#5B9EF5" onClick={()=>setScreen("stocks")} />
        <HomeTile icon="💰" label="FINANCES"    sub="Historique & Charges"   accent="#4CAF87" badge={kpis.nbTx||null} onClick={()=>setScreen("finances")} />
        <HomeTile icon="⚙️" label="PARAMÈTRES"  sub="Statut & Frais fixes"   accent="#A78BFA" />
        <HomeTile icon="🗂️" label="MES DONNÉES" sub="Produits · Rubriques · Règlements" accent="#E8704A" onClick={()=>setScreen("donnees")} highlight />
      </div>
    </div>
  );
}
function KpiChip({label,val,sub,green}) {
  return (
    <div className="kpi-chip glass">
      <span className="kpi-chip__label">{label}</span>
      <span className={`kpi-chip__val${green?" kpi-chip__val--green":""}`}>{val}{sub&&<small> {sub}</small>}</span>
    </div>
  );
}
function HomeTile({icon,label,sub,accent,onClick,badge,highlight}) {
  return (
    <button className={`home-tile glass${highlight?" home-tile--highlight":""}`} style={{"--accent":accent}} onClick={onClick}>
      <div className="home-tile__top">
        <div className="home-tile__icon-wrap">
          <span style={{fontSize:28}}>{icon}</span>
          {badge&&<span className="badge-pill">{badge}</span>}
        </div>
        <span className="home-tile__arrow" style={{color:accent}}>→</span>
      </div>
      <div className="home-tile__label">{label}</div>
      <div className="home-tile__sub">{sub}</div>
      <div className="home-tile__bar" style={{background:accent}}/>
    </button>
  );
}


// ══════════════════════════════════════════════════════════════════════
// HIGHLIGHT — surligne les caractères qui matchent la recherche
// ══════════════════════════════════════════════════════════════════════
function Highlight({ text, query }) {
  if (!query.trim()) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex   = new RegExp(`(${escaped})`, "gi");
  const parts   = text.split(regex);
  return (
    <>
      {parts.map((p, i) =>
        regex.test(p)
          ? <mark key={i} className="search-mark">{p}</mark>
          : <span key={i}>{p}</span>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════
// CAISSE — synchro stock + barre de recherche Boutique intelligente
// ══════════════════════════════════════════════════════════════════════
function Caisse({ setScreen, catalogue, panier, setPanier, validerVente, clients, setClients, enabledModes }) {
  const [univers,     setUnivers]     = useState(null);
  const [marque,      setMarque]      = useState(null);
  const [phase,       setPhase]       = useState("browse"); // browse | paiement | echelonne | succes
  const [modePay,     setModePay]     = useState("cb");
  const [especes,     setEspeces]     = useState("");
  const [flashId,     setFlashId]     = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // ── Paiement échelonné ──
  const [nbEcheances, setNbEcheances] = useState(3);
  // ── États fin de vente ──
  const [lastTx,      setLastTx]      = useState(null); // snapshot de la vente
  const [emailInput,  setEmailInput]  = useState("");
  const [saveClient,  setSaveClient]  = useState(false);
  const [clientName,  setClientName]  = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [emailSent,   setEmailSent]   = useState(false);
  const [clientSuggestions, setClientSuggestions] = useState([]);
  const searchRef = useRef(null);
  const emailRef  = useRef(null);

  const totalTtc  = panier.reduce((s,l)=>s+l.article.prixTtc*l.qty,0);
  const totalHt   = panier.reduce((s,l)=>s+l.article.prixHt*l.qty,0);
  const totalCout = panier.reduce((s,l)=>s+l.article.coutHt*l.qty,0);
  const margeHt   = totalHt - totalCout;
  const margePct  = totalHt>0?(margeHt/totalHt)*100:0;
  const nbItems   = panier.reduce((s,l)=>s+l.qty,0);
  const commission= calcCommission(totalTtc, modePay);
  const netApresComm = totalTtc - commission;
  const rendu     = modePay==="cash" && especes
    ? Math.round((parseFloat(especes.replace(",","."))-totalTtc)*100)/100 : null;

  const level       = marque?3:univers?2:1;
  const universData = univers?catalogue[univers]:null;
  const marqueData  = (univers&&marque)?catalogue[univers].marques[marque]:null;

  // Focus automatique sur la search bar quand on entre dans Boutique niveau 2
  useEffect(() => {
    if (univers==="boutique" && !marque) {
      setTimeout(() => searchRef.current?.focus(), 150);
    }
  }, [univers, marque]);

  // Vider la recherche quand on quitte la Boutique
  useEffect(() => {
    if (univers !== "boutique") setSearchQuery("");
  }, [univers]);

  // ── Résultats de recherche cross-marques ──
  const searchResults = (() => {
    if (univers !== "boutique" || !searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    const out = [];
    Object.values(catalogue.boutique.marques).forEach(m => {
      m.articles.forEach(a => {
        if (a.nom.toLowerCase().includes(q) || m.label.toLowerCase().includes(q)) {
          out.push({ article: a, marque: m });
        }
      });
    });
    return out;
  })();

  const isSearching = univers==="boutique" && searchQuery.trim().length > 0;

  const addFlash = (id) => { setFlashId(id); setTimeout(()=>setFlashId(null), 420); };

  const addToPanier = (article, marqueIdOverride) => {
    if (isRupture(article)) return;
    const mId = marqueIdOverride || marque;
    setPanier(prev => {
      const ex = prev.find(l=>l.article.id===article.id);
      if (ex) return prev.map(l=>l.article.id===article.id?{...l,qty:l.qty+1}:l);
      return [...prev, { article, universId: univers||"boutique", marqueId: mId, qty:1 }];
    });
    addFlash(article.id);
  };

  const changeQty = (id, d) => setPanier(prev=>prev.flatMap(l=>{
    if(l.article.id!==id) return [l];
    const q=l.qty+d; return q<=0?[]:[{...l,qty:q}];
  }));

  const goBack = () => {
    if (searchQuery) { setSearchQuery(""); return; }
    if (marque)  { setMarque(null);  return; }
    if (univers) { setUnivers(null); return; }
  };

  const handleValider = () => {
    const snap = {
      lignes: panier.map(l => ({ ...l })),
      totalTtc, totalHt, margeHt, margePct,
      modePay,
      modeLabel: MODES_PAIEMENT.find(m=>m.id===modePay)?.label ?? modePay,
      commission,
      netApresComm,
      nbEcheances: modePay==="echelon" ? nbEcheances : null,
      heure: now(),
      date: new Date().toLocaleDateString("fr-FR"),
    };
    validerVente(panier);
    setLastTx(snap);
    setEmailInput("");
    setEmailSent(false);
    setSaveClient(false);
    setClientName("");
    setClientPhone("");
    setPhase("succes");
  };

  const handleSendEmail = () => {
    if (!emailInput.trim()) return;
    // ── Simulation envoi PDF par mail ──
    // En prod : POST /api/send-receipt { email, transactionId, pdfBase64 }
    console.log(`[REÇU DIGITAL] Envoi à ${emailInput}`, lastTx);
    // Enregistrer le client si demandé
    if (saveClient && emailInput.trim()) {
      const existing = clients.find(c => c.email.toLowerCase() === emailInput.toLowerCase());
      if (!existing) {
        setClients(prev => [...prev, {
          id: `c-${Date.now()}`,
          email:  emailInput.trim(),
          nom:    clientName.trim()  || emailInput.split("@")[0],
          phone:  clientPhone.trim() || "",
          createdAt: new Date().toLocaleDateString("fr-FR"),
          nbAchats: 1,
          totalDepense: lastTx?.totalTtc ?? 0,
        }]);
      } else {
        setClients(prev => prev.map(c => c.email.toLowerCase() === emailInput.toLowerCase()
          ? { ...c, nbAchats: c.nbAchats + 1, totalDepense: c.totalDepense + (lastTx?.totalTtc ?? 0) }
          : c));
      }
    }
    setEmailSent(true);
  };

  const handleTerminer = () => {
    setPhase("browse");
    setModePay("card");
    setEspeces("");
    setEmailInput("");
    setEmailSent(false);
    setSaveClient(false);
    setClientName("");
    setClientPhone("");
    setLastTx(null);
  };

  // Autocomplétion clients connus
  const onEmailChange = (val) => {
    setEmailInput(val);
    if (val.length >= 2) {
      const q = val.toLowerCase();
      setClientSuggestions(
        clients.filter(c =>
          c.email.toLowerCase().includes(q) ||
          c.nom.toLowerCase().includes(q)
        ).slice(0, 4)
      );
    } else {
      setClientSuggestions([]);
    }
  };

  return (
    <div className="caisse-root">
      <header className="module-header glass" style={{margin:"14px 14px 0"}}>
        <button className="back-btn" onClick={level>1||searchQuery ? goBack : ()=>setScreen("home")}>←</button>
        <Breadcrumb items={[
          {label:"Caisse",   onClick:()=>{ setUnivers(null); setMarque(null); setSearchQuery(""); }},
          universData && {label:universData.label, onClick:()=>{ setMarque(null); setSearchQuery(""); }},
          marqueData  && {label:marqueData.label,  onClick:null},
        ].filter(Boolean)}/>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
          {nbItems>0 && <span className="badge-pill">{nbItems}</span>}
        </div>
      </header>

      <div className="caisse-layout">
        {/* ════ GAUCHE : catalogue ════ */}
        <div className="caisse-browse">

          {/* ── Niveau 1 : Univers ── */}
          {level===1 && (
            <div className="univers-caisse fadein">
              {Object.values(catalogue).map(u=>(
                <button key={u.id} className="univers-caisse-btn glass" style={{"--grad":u.gradient}}
                  onClick={()=>setUnivers(u.id)}>
                  <span style={{fontSize:42}}>{u.emoji}</span>
                  <div style={{flex:1}}>
                    <div className="ucb-label">{u.label}</div>
                    <div className="ucb-meta">{Object.keys(u.marques).length} marques</div>
                  </div>
                  <span className="ucb-arrow">→</span>
                </button>
              ))}
            </div>
          )}

          {/* ── Niveau 2 : Marques (+ search bar pour Boutique) ── */}
          {level===2 && (
            <div className="fadein" style={{display:"flex",flexDirection:"column",gap:12}}>

              {/* BARRE DE RECHERCHE — uniquement pour l'univers Boutique */}
              {univers==="boutique" && (
                <div className={`search-bar glass${isSearching?" search-bar--active":""}`}>
                  <span className="search-bar__icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L22 22"/>
                    </svg>
                  </span>
                  <input
                    ref={searchRef}
                    className="search-bar__input"
                    type="text"
                    placeholder="Rechercher un article ou une marque…"
                    value={searchQuery}
                    onChange={e=>setSearchQuery(e.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {searchQuery && (
                    <button className="search-bar__clear"
                      onClick={()=>{ setSearchQuery(""); searchRef.current?.focus(); }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* ── MODE RECHERCHE : liste de résultats ── */}
              {isSearching ? (
                <div className="search-results">
                  {searchResults.length===0 ? (
                    <div className="search-empty glass">
                      <span className="search-empty__icon">🔍</span>
                      <p>Aucun résultat pour <strong>« {searchQuery} »</strong></p>
                      <span className="search-empty__hint">Essayez un autre nom ou une marque</span>
                    </div>
                  ) : (
                    <>
                      <div className="search-count">
                        {searchResults.length} résultat{searchResults.length>1?"s":""}{" "}
                        pour <em>« {searchQuery} »</em>
                      </div>
                      {searchResults.map((r,i)=>{
                        const { article:a, marque:m } = r;
                        const inCart  = panier.find(l=>l.article.id===a.id);
                        const rupture = isRupture(a);
                        const alerte  = isEnAlerte(a);
                        const h       = healthColor(a.prixHt, a.coutHt);
                        return (
                          <button key={a.id}
                            className={`srr glass${rupture?" srr--rupture":""}${flashId===a.id?" flashing":""}`}
                            style={{"--delay":`${i*0.03}s`}}
                            disabled={rupture}
                            onClick={()=>addToPanier(a, m.id)}>

                            {/* Badge panier */}
                            {inCart && <span className="srr__cart-badge">{inCart.qty}</span>}

                            {/* Pill marque */}
                            <div className="srr__pill" style={{background:`${m.couleur}16`,color:m.couleur}}>
                              <span>{m.emoji}</span>
                              <Highlight text={m.label} query={searchQuery}/>
                            </div>

                            {/* Corps */}
                            <div className="srr__body">
                              <div className="srr__name">
                                <Highlight text={a.nom} query={searchQuery}/>
                              </div>
                              <div className="srr__meta">
                                <span style={{color: rupture?"#E05252":alerte?"#F59E0B":"#9E8E82",fontWeight:600,fontSize:11}}>
                                  {rupture ? "Rupture de stock"
                                   : alerte ? `⚠ ${a.stock} restant${a.stock>1?"s":""}`
                                   : `${a.stock} en stock`}
                                </span>
                                <span className="srr__health" style={{color:h.color}}>● {h.label}</span>
                              </div>
                            </div>

                            {/* Prix */}
                            <div className="srr__right">
                              <span className="srr__price">{fmt(a.prixTtc)} <small>€</small></span>
                              <span className="srr__ht">{fmt(a.prixHt)} € HT</span>
                            </div>

                            {rupture && <div className="rupture-overlay">Rupture</div>}
                          </button>
                        );
                      })}
                    </>
                  )}
                </div>
              ) : (
                /* ── MODE NORMAL : tuiles des marques ── */
                <div className="marques-caisse">
                  {Object.values(universData.marques).map((m,i)=>{
                    const alertCount = m.articles.filter(a=>isEnAlerte(a)).length;
                    return (
                      <button key={m.id} className="marque-caisse-btn glass"
                        style={{"--delay":`${i*.04}s`,"--col":m.couleur}}
                        onClick={()=>setMarque(m.id)}>
                        <div className="mcb-icon">{m.emoji}</div>
                        <div className="mcb-info">
                          <div className="mcb-label">{m.label}</div>
                          <div className="mcb-meta">{m.articles.length} articles</div>
                        </div>
                        {alertCount>0 && <span className="mcb-alert">⚠ {alertCount}</span>}
                        <div className="mcb-arrow">→</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Niveau 3 : Articles d'une marque ── */}
          {level===3 && (
            <div className="articles-caisse fadein">
              {marqueData.articles.map((a,i)=>{
                const h      = healthColor(a.prixHt, a.coutHt);
                const inCart = panier.find(l=>l.article.id===a.id);
                const rupture= isRupture(a);
                const alerte = isEnAlerte(a);
                return (
                  <button key={a.id}
                    className={`article-caisse-btn glass${rupture?" disabled":""}${alerte&&!rupture?" alerte":""}${flashId===a.id?" flashing":""}`}
                    style={{"--delay":`${i*.04}s`}}
                    disabled={rupture}
                    onClick={()=>addToPanier(a)}>
                    {inCart  && <span className="acb-badge">{inCart.qty}</span>}
                    {alerte&&!rupture && <span className="acb-alert-dot" title="Stock critique"/>}
                    <div className="acb-name">{a.nom}</div>
                    <div className="acb-price">{fmt(a.prixTtc)} <span>€</span></div>
                    <div className="acb-footer">
                      <span className="acb-stock" style={{color:rupture?"#E05252":alerte?"#F59E0B":"#9E8E82"}}>
                        {rupture?"Rupture":stockLabel(a)}
                      </span>
                      <span className="acb-health" style={{color:h.color}}>● {h.label}</span>
                    </div>
                    {rupture && <div className="rupture-overlay">Rupture</div>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ════ DROITE : ticket ════ */}
        <div className="caisse-ticket-col">
          <div className="ticket glass">
            <div className="ticket-head">
              <span className="ticket-shop">Shop In Café</span>
              <span className="ticket-time">{now()}</span>
            </div>
            <div className="dashed-line"/>

            {phase==="browse" && (
              <>
                <div className="ticket-lines">
                  {panier.length===0
                    ? <div className="ticket-empty"><span style={{fontSize:32}}>🛒</span><span>Sélectionnez un univers</span></div>
                    : panier.map(l=>(
                      <div key={l.article.id} className="ticket-line">
                        <div className="tl-info">
                          <div className="tl-name">{l.article.nom}</div>
                          <div className="tl-brand">{l.marqueId}</div>
                        </div>
                        <div className="tl-qty-ctrl">
                          <button className="tq-btn" onClick={()=>changeQty(l.article.id,-1)}>−</button>
                          <span>{l.qty}</span>
                          <button className="tq-btn" onClick={()=>changeQty(l.article.id,+1)}>+</button>
                        </div>
                        <div className="tl-total">{fmt(l.article.prixTtc*l.qty)} €</div>
                      </div>
                    ))
                  }
                </div>
                {panier.length>0 && (
                  <>
                    <div className="dashed-line"/>
                    <div className="ticket-totaux">
                      <div className="tot-row"><span>Sous-total HT</span><span>{fmt(totalHt)} €</span></div>
                      <div className="tot-row"><span>TVA</span><span>{fmt(totalTtc-totalHt)} €</span></div>
                      <div className="tot-row tot-row--main"><span>TOTAL TTC</span><span>{fmt(totalTtc)} €</span></div>
                      <div className="tot-marge" style={{color:margePct>=50?"#4CAF87":"#FF8C69"}}>
                        <span>Marge brute</span>
                        <span>{fmt(margeHt)} € · {Math.round(margePct)}{"% "}</span>
                      </div>
                    </div>
                    <button className="btn-encaisser" onClick={()=>setPhase("paiement")}>
                      Encaisser {fmt(totalTtc)} €
                    </button>
                  </>
                )}
              </>
            )}

            {phase==="paiement" && (
              <PaiementSheet
                totalTtc={totalTtc}
                totalHt={totalHt}
                modePay={modePay}
                setModePay={setModePay}
                especes={especes}
                setEspeces={setEspeces}
                rendu={rendu}
                commission={commission}
                netApresComm={netApresComm}
                nbEcheances={nbEcheances}
                setNbEcheances={setNbEcheances}
                onRetour={()=>setPhase("browse")}
                onValider={handleValider}
                enabledModes={enabledModes}
              />
            )}

            {phase==="succes" && lastTx && (
              <SuccesEco
                tx={lastTx}
                emailInput={emailInput}
                onEmailChange={onEmailChange}
                clientSuggestions={clientSuggestions}
                onSelectSuggestion={(c) => { setEmailInput(c.email); setClientSuggestions([]); }}
                saveClient={saveClient}
                setSaveClient={setSaveClient}
                clientName={clientName}
                setClientName={setClientName}
                clientPhone={clientPhone}
                setClientPhone={setClientPhone}
                emailSent={emailSent}
                onSendEmail={handleSendEmail}
                onTerminer={handleTerminer}
                emailRef={emailRef}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════
// MODES DE PAIEMENT — 10 options avec commissions réelles
// ══════════════════════════════════════════════════════════════════════
const MODES_PAIEMENT = [
  { id:"cash",      label:"Espèces",         icon:"💶", commission:0,    color:"#4CAF87", hint:"Aucune commission" },
  { id:"cb",        label:"Carte Bancaire",  icon:"💳", commission:0.7,  color:"#5B9EF5", hint:"~0,7% + 0,10 €" },
  { id:"cheque",    label:"Chèque",          icon:"📝", commission:0,    color:"#9E8E82", hint:"Aucune commission" },
  { id:"avoir",     label:"Avoir",           icon:"🎫", commission:0,    color:"#A78BFA", hint:"Bon d'achat retour" },
  { id:"amex",      label:"American Express",icon:"🔵", commission:1.75, color:"#1B6FC8", hint:"~1,75% commission" },
  { id:"virement",  label:"Virement",        icon:"🏦", commission:0,    color:"#6B7280", hint:"Aucune commission" },
  { id:"cadeau",    label:"Carte Cadeau",    icon:"🎁", commission:0,    color:"#E8704A", hint:"Marge déjà captée" },
  { id:"echelon",   label:"Paiement ×",      icon:"📅", commission:1.5,  color:"#F59E0B", hint:"~1,5% (Alma/Stripe)" },
  { id:"tr_papier", label:"Ticket Restaurant",icon:"🧾",commission:5,    color:"#D97757", hint:"~5% (Edenred…)" },
  { id:"tr_carte",  label:"TR Carte",        icon:"💚", commission:3.5,  color:"#059669", hint:"~3,5% commission" },
];

function calcCommission(totalTtc, modeId) {
  const mode = MODES_PAIEMENT.find(m => m.id === modeId);
  if (!mode) return 0;
  const pct = (mode.commission / 100) * totalTtc;
  const fixed = modeId === "cb" ? 0.10 : 0;
  return Math.round((pct + fixed) * 100) / 100;
}

// ══════════════════════════════════════════════════════════════════════
// PAIEMENT SHEET — grille 10 modes tactile, commissions, calculateur
// ══════════════════════════════════════════════════════════════════════
function PaiementSheet({
  totalTtc, totalHt, modePay, setModePay,
  especes, setEspeces, rendu,
  commission, netApresComm,
  nbEcheances, setNbEcheances,
  onRetour, onValider, enabledModes,
}) {
  // Modes filtrés selon la config Mes Données
  const modesActifs = MODES_PAIEMENT.filter(m => !enabledModes || enabledModes[m.id] !== false);
  // Si le mode actif a été désactivé, revenir au premier dispo
  const modeActif = modesActifs.find(m => m.id === modePay) ?? modesActifs[0];
  const echeanceMontant = totalTtc / nbEcheances;

  const canValidate = modePay === "cash"
    ? rendu !== null && rendu >= 0
    : true;

  return (
    <div className="ps-root fadein">

      {/* ── En-tête montant + commission ── */}
      <div className="ps-header">
        <div className="ps-header__amounts">
          <div className="ps-total">{fmt(totalTtc)} <span>€ TTC</span></div>
          <div className="ps-ht">{fmt(totalHt)} € HT</div>
        </div>
        {commission > 0 && (
          <div className="ps-comm" style={{"--mc": modeActif?.color}}>
            <div className="ps-comm__label">{modeActif?.label}</div>
            <div className="ps-comm__val">−{fmt(commission)} €</div>
            <div className="ps-comm__net">Net réel : <strong>{fmt(netApresComm)} €</strong></div>
          </div>
        )}
      </div>

      {/* ── Grille 2×5 des modes de paiement ── */}
      <div className="ps-grid">
        {modesActifs.map((m, i) => {
          const isActive = modePay === m.id;
          const comm = calcCommission(totalTtc, m.id);
          return (
            <button key={m.id}
              className={`ps-tile${isActive ? " ps-tile--active" : ""}`}
              style={{"--mc": m.color, "--delay": `${i * 0.025}s`,
                borderColor: isActive ? m.color : undefined,
                background: isActive ? `${m.color}14` : undefined,
              }}
              onClick={() => setModePay(m.id)}
            >
              {isActive && <div className="ps-tile__glow" style={{background: m.color}}/>}
              <span className="ps-tile__icon">{m.icon}</span>
              <span className="ps-tile__label">{m.label}</span>
              <span className="ps-tile__hint">
                {comm > 0 ? `−${fmt(comm)} €` : m.hint}
              </span>
              {isActive && <span className="ps-tile__check" style={{background: m.color}}>✓</span>}
            </button>
          );
        })}
      </div>

      {/* ── Zone contextuelle selon le mode ── */}

      {modePay === "cash" && (
        <div className="ps-ctx fadein">
          <div className="ps-ctx__title">💶 Calculateur de rendu</div>
          <div className="cash-disp">
            <input className="cash-disp__input" type="number" step="0.01"
              placeholder="Montant remis…" value={especes}
              onChange={e => setEspeces(e.target.value)} autoFocus/>
            <span>€</span>
          </div>
          {rendu !== null && (
            <div className={`cash-disp__rendu${rendu < 0 ? " is-neg" : " is-pos"}`}>
              {rendu < 0
                ? <>⚠ Manque <strong>{fmt(-rendu)} €</strong></>
                : <>Rendu : <strong>{fmt(rendu)} €</strong></>}
            </div>
          )}
          <div className="cash-bills">
            {[5, 10, 20, 50, 100].map(v => (
              <button key={v} className={`cash-bill${parseFloat(especes)===v?" is-active":""}`}
                onClick={() => setEspeces(String(v))}>{v} €</button>
            ))}
          </div>
          <button className="cash-exact" onClick={() => setEspeces(fmt(totalTtc).replace(",",""))}>
            Montant exact — {fmt(totalTtc)} €
          </button>
        </div>
      )}

      {modePay === "cheque" && (
        <div className="ps-ctx fadein">
          <div className="ps-ctx__title">📝 Paiement par Chèque</div>
          <div className="ps-info-rows">
            <div className="ps-info-row"><span>À l'ordre de</span><strong>Shop In Café</strong></div>
            <div className="ps-info-row"><span>Montant</span><strong>{fmt(totalTtc)} €</strong></div>
          </div>
          <div className="ps-ctx__note">Vérifiez date, signature et montant en lettres.</div>
        </div>
      )}

      {modePay === "avoir" && (
        <div className="ps-ctx fadein">
          <div className="ps-ctx__title">🎫 Utilisation d'un Avoir</div>
          <div className="ps-info-rows">
            <div className="ps-info-row"><span>Montant débité</span><strong style={{color:"#A78BFA"}}>{fmt(totalTtc)} €</strong></div>
          </div>
          <div className="ps-ctx__note">Le solde restant sera disponible pour la prochaine visite.</div>
        </div>
      )}

      {modePay === "virement" && (
        <div className="ps-ctx fadein">
          <div className="ps-ctx__title">🏦 Coordonnées Bancaires</div>
          <div className="ps-info-rows">
            <div className="ps-info-row"><span>IBAN</span><strong>FR76 XXXX XXXX XXXX XXXX XX</strong></div>
            <div className="ps-info-row"><span>BIC</span><strong>XXXXXXXX</strong></div>
            <div className="ps-info-row"><span>Référence</span><strong>SIC-{Date.now().toString().slice(-6)}</strong></div>
          </div>
        </div>
      )}

      {modePay === "echelon" && (
        <div className="ps-ctx fadein">
          <div className="ps-ctx__title">📅 Paiement en plusieurs fois</div>
          <div className="echelon-btns">
            {[2, 3, 4, 6, 10].map(n => (
              <button key={n} className={`echelon-btn${nbEcheances===n?" is-active":""}`}
                onClick={() => setNbEcheances(n)}>
                <span className="echelon-btn__n">×{n}</span>
                <span className="echelon-btn__amt">{fmt(totalTtc / n)} €</span>
              </button>
            ))}
          </div>
          <div className="ps-info-rows">
            <div className="ps-info-row"><span>{nbEcheances} × {fmt(echeanceMontant)} €</span><strong>= {fmt(totalTtc)} €</strong></div>
            <div className="ps-info-row"><span>Commission ~1,5%</span><strong style={{color:"#E05252"}}>−{fmt(commission)} €</strong></div>
            <div className="ps-info-row"><span>Net encaissé</span><strong style={{color:"#2D9B6F"}}>{fmt(netApresComm)} €</strong></div>
          </div>
        </div>
      )}

      {modePay === "cadeau" && (
        <div className="ps-ctx fadein">
          <div className="ps-ctx__title">🎁 Carte Cadeau</div>
          <div className="ps-info-rows">
            <div className="ps-info-row"><span>Montant à débiter</span><strong>{fmt(totalTtc)} €</strong></div>
          </div>
          <div className="ps-ctx__note">Passez la carte ou saisissez le code à 16 chiffres.</div>
        </div>
      )}

      {(modePay === "tr_papier" || modePay === "tr_carte") && (
        <div className="ps-ctx fadein">
          <div className="ps-ctx__title">
            {modePay === "tr_papier" ? "🧾 Tickets Restaurant Papier" : "💚 Carte Titre-Restaurant"}
          </div>
          <div className="ps-info-rows">
            <div className="ps-info-row"><span>Total TTC</span><strong>{fmt(totalTtc)} €</strong></div>
            <div className="ps-info-row"><span>Commission ({modePay === "tr_papier" ? "~5%" : "~3,5%"})</span><strong style={{color:"#E05252"}}>−{fmt(commission)} €</strong></div>
            <div className="ps-info-row"><span>Encaissé réel</span><strong style={{color:"#2D9B6F"}}>{fmt(netApresComm)} €</strong></div>
          </div>
          {modePay === "tr_papier" && (
            <div className="ps-ctx__note">Vérifiez validité, date et plafond journalier légal.</div>
          )}
        </div>
      )}

      {/* ── Footer fixe ── */}
      <div className="ps-footer">
        <button className="ps-btn-retour" onClick={onRetour}>← Retour</button>
        <button className="ps-btn-valider" disabled={!canValidate}
          style={{"--mc": modeActif?.color ?? "#FF8C69"}} onClick={onValider}>
          <span>{modeActif?.icon}</span>
          Valider — {fmt(totalTtc)} €
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════
function generateReceiptPdf(tx) {
  // En production : utiliser jsPDF ou Puppeteer côté serveur
  // Structure du reçu numérique Shop In Café
  return {
    meta: {
      shop: "Shop In Café",
      address: "Paris, France",
      siret: "XXX XXX XXX XXXXX",
      date: tx.date,
      heure: tx.heure,
      modePay: tx.modePay,
    },
    lignes: tx.lignes.map(l => ({
      nom:      l.article.nom,
      qty:      l.qty,
      prixUnit: l.article.prixTtc,
      total:    l.article.prixTtc * l.qty,
    })),
    totaux: {
      ht:      tx.totalHt,
      tva:     tx.totalTtc - tx.totalHt,
      ttc:     tx.totalTtc,
      marge:   tx.margeHt,
    },
    footer: "Merci pour votre visite 🌿 — Reçu 100% numérique",
  };
}

// ══════════════════════════════════════════════════════════════════════
// SUCCES ÉCO — écran de fin de vente sans ticket papier
// ══════════════════════════════════════════════════════════════════════
function SuccesEco({
  tx, emailInput, onEmailChange, clientSuggestions, onSelectSuggestion,
  saveClient, setSaveClient, clientName, setClientName,
  clientPhone, setClientPhone, emailSent, onSendEmail, onTerminer, emailRef,
}) {
  const [showSaveForm, setShowSaveForm] = useState(false);

  const handleSend = () => {
    if (saveClient) setShowSaveForm(false);
    onSendEmail();
  };

  return (
    <div className="succes-eco fadein">
      {/* ── Icône éco animée ── */}
      <div className="eco-icon-wrap">
        <svg className="eco-leaf" viewBox="0 0 80 80" fill="none">
          <defs>
            <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6DD5A0"/>
              <stop offset="100%" stopColor="#2D9B6F"/>
            </linearGradient>
          </defs>
          {/* Feuille */}
          <path className="leaf-path"
            d="M40 70 C20 65 8 48 10 28 C10 28 30 12 55 18 C70 22 74 40 68 55 C62 68 48 74 40 70Z"
            fill="url(#leafGrad)" opacity="0.95"/>
          {/* Nervure centrale */}
          <path d="M40 68 C38 55 36 40 38 24" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Nervures secondaires */}
          <path d="M38 50 C32 46 28 42 26 36" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinecap="round"/>
          <path d="M39 40 C33 36 30 30 30 24" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinecap="round"/>
          {/* Check */}
          <path className="leaf-check"
            d="M28 40 L36 48 L54 30" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <div className="eco-ring eco-ring--1"/>
        <div className="eco-ring eco-ring--2"/>
      </div>

      {!emailSent ? (
        <>
          <div className="eco-title">Vente enregistrée !</div>
          <div className="eco-amount">{fmt(tx.totalTtc)} <span>€</span></div>
          <div className="eco-marge">
            Marge brute : <strong>{fmt(tx.margeHt)} €</strong>
            <span className="eco-pct">({Math.round(tx.margePct)}{"%)"})</span>
          </div>
          <div className="eco-badge">
            <span>🌿</span> Zéro papier · Reçu 100% numérique
          </div>

          {/* ── Bloc email ── */}
          <div className="eco-email-block">
            <div className="eco-email-label">Envoyer le reçu par e-mail</div>

            <div className="eco-email-wrap">
              <span className="eco-email-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input
                ref={emailRef}
                className="eco-email-input"
                type="email"
                placeholder="client@exemple.com"
                value={emailInput}
                onChange={e => onEmailChange(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
              {emailInput && (
                <button className="eco-email-clear" onClick={() => onEmailChange("")}>✕</button>
              )}
            </div>

            {/* Suggestions clients connus */}
            {clientSuggestions.length > 0 && (
              <div className="eco-suggestions">
                {clientSuggestions.map(c => (
                  <button key={c.id} className="eco-suggestion" onClick={() => onSelectSuggestion(c)}>
                    <span className="eco-suggestion__avatar">{c.nom[0].toUpperCase()}</span>
                    <div className="eco-suggestion__info">
                      <span className="eco-suggestion__name">{c.nom}</span>
                      <span className="eco-suggestion__email">{c.email}</span>
                    </div>
                    <span className="eco-suggestion__achats">{c.nbAchats} achat{c.nbAchats>1?"s":""}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Option enregistrer le client */}
            <label className="eco-save-toggle">
              <div
                className={`eco-toggle ${saveClient ? "is-on" : ""}`}
                onClick={() => { setSaveClient(!saveClient); setShowSaveForm(!saveClient); }}
              >
                <div className="eco-toggle__thumb"/>
              </div>
              <span>Enregistrer ce client dans la base</span>
            </label>

            {/* Formulaire client (visible si toggle activé) */}
            {saveClient && (
              <div className="eco-client-form fadein">
                <input className="eco-client-input" placeholder="Prénom Nom du client"
                  value={clientName} onChange={e => setClientName(e.target.value)} />
                <input className="eco-client-input" placeholder="Téléphone (optionnel)"
                  value={clientPhone} onChange={e => setClientPhone(e.target.value)} type="tel"/>
              </div>
            )}
          </div>

          {/* ── Actions ── */}
          <div className="eco-actions">
            <button className="eco-btn-terminer" onClick={onTerminer}>
              Terminer
            </button>
            <button
              className="eco-btn-mail"
              disabled={!emailInput.trim()}
              onClick={handleSend}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              Envoyer par mail
            </button>
          </div>
        </>
      ) : (
        /* ── Confirmation envoi ── */
        <div className="eco-sent fadein">
          <div className="eco-sent__icon">✉️</div>
          <div className="eco-sent__title">Reçu envoyé !</div>
          <div className="eco-sent__email">{emailInput}</div>
          {saveClient && (
            <div className="eco-sent__saved">
              <span>✓</span> Client enregistré dans la base
            </div>
          )}
          <button className="eco-btn-terminer" style={{marginTop:16}} onClick={onTerminer}>
            Nouvelle vente →
          </button>
        </div>
      )}
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════
// STOCKS — navigation 3 niveaux avec états de stock en direct
// ══════════════════════════════════════════════════════════════════════
function Stocks({ setScreen, catalogue, setCatalogue }) {
  // Niveaux de navigation : null=univers, string=marqueId
  const [univers,       setUnivers]      = useState(null);
  const [marqueId,      setMarqueId]     = useState(null);
  // Mise à jour stock : { articleIdx → quantité saisie }
  const [quantities,    setQuantities]   = useState({});
  // Index de l'article dont le pavé numérique est ouvert
  const [numpadOpen,    setNumpadOpen]   = useState(null);
  // Résultats confirmés (animation flash)
  const [confirmed,     setConfirmed]    = useState({});
  // Modals création
  const [showNewMarque, setShowNewMarque]= useState(false);
  const [showNewArt,    setShowNewArt]   = useState(false);
  const [newMarqueForm, setNMF]          = useState({ label:"", emoji:"🏷️", couleur:"#FF8C69" });
  const [newArtForm,    setNAF2]         = useState({ nom:"", prixHt:"", prixTtc:"", coutHt:"", stock:"0", unite:"pc" });

  // Données courantes
  const universData = univers ? catalogue[univers] : null;
  const marqueData  = (univers && marqueId) ? catalogue[univers]?.marques[marqueId] : null;
  const level       = marqueId ? 2 : univers ? 1 : 0;

  // ── Mutations stock ──────────────────────────────────────────────
  const applyStock = (idx) => {
    const qty = parseInt(quantities[idx] ?? "0", 10);
    if (!qty || qty <= 0) return;
    setCatalogue(c => {
      const arts = [...c[univers].marques[marqueId].articles];
      const a = arts[idx];
      if (a.type === "bar_volume") arts[idx] = { ...a, stockMl: (a.stockMl ?? 0) + qty * 1000 };
      else arts[idx] = { ...a, stock: (a.stock ?? 0) + qty };
      return { ...c, [univers]:{ ...c[univers], marques:{ ...c[univers].marques,
        [marqueId]:{ ...c[univers].marques[marqueId], articles: arts }}}};
    });
    setConfirmed(p => ({ ...p, [idx]: true }));
    setQuantities(p => { const n={...p}; delete n[idx]; return n; });
    setNumpadOpen(null);
    setTimeout(() => setConfirmed(p => { const n={...p}; delete n[idx]; return n; }), 1800);
  };

  const applyAll = () => {
    Object.keys(quantities).forEach(idx => applyStock(parseInt(idx)));
  };

  // ── Création marque ──────────────────────────────────────────────
  const createMarque = () => {
    if (!newMarqueForm.label.trim()) return;
    const id = uid();
    setCatalogue(c => ({
      ...c, [univers]:{ ...c[univers], marques:{ ...c[univers].marques,
        [id]:{ id, label:newMarqueForm.label.trim(), emoji:newMarqueForm.emoji, couleur:newMarqueForm.couleur, articles:[] }}}
    }));
    setNMF({ label:"", emoji:"🏷️", couleur:"#FF8C69" });
    setShowNewMarque(false);
    setMarqueId(id);
  };

  // ── Création article ─────────────────────────────────────────────
  const createArticle = () => {
    if (!newArtForm.nom.trim()) return;
    const id = uid();
    const newA = {
      id, nom: newArtForm.nom.trim(),
      prixHt: +newArtForm.prixHt || 0,
      prixTtc: +newArtForm.prixTtc || Math.round((+newArtForm.prixHt)*1.2*100)/100,
      coutHt: +newArtForm.coutHt || 0,
      stock: +newArtForm.stock || 0,
      seuil: 2, unite: newArtForm.unite, type: "boutique", servingMl: null,
    };
    setCatalogue(c => {
      const arts = [...c[univers].marques[marqueId].articles, newA];
      return { ...c, [univers]:{ ...c[univers], marques:{ ...c[univers].marques,
        [marqueId]:{ ...c[univers].marques[marqueId], articles: arts }}}};
    });
    setNAF2({ nom:"", prixHt:"", prixTtc:"", coutHt:"", stock:"0", unite:"pc" });
    setShowNewArt(false);
  };

  const pendingCount = Object.keys(quantities).filter(k => parseInt(quantities[k]||"0") > 0).length;

  return (
    <div className="stk-root">

      {/* ══════════════════ NIVEAU 0 — Sélection Univers ══════════════════ */}
      {level === 0 && (
        <div className="stk-page fadein">
          <header className="stk-header">
            <button className="stk-back" onClick={() => setScreen("home")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Dashboard
            </button>
            <div className="stk-header__center">
              <h1 className="stk-title">Stocks</h1>
              <p className="stk-subtitle">Sélectionnez un univers pour gérer vos réapprovisionnements</p>
            </div>
            <div style={{width:120}}/>
          </header>
          <div className="stk-univers-grid">
            {Object.values(catalogue).map((u, i) => {
              const totalAlerts = Object.values(u.marques).reduce((s,m) =>
                s + m.articles.filter(a => a.type==="bar_volume" ? a.stockMl<=a.seuil : (a.stock??0)<=a.seuil).length, 0);
              const totalArticles = Object.values(u.marques).reduce((s,m) => s+m.articles.length, 0);
              return (
                <button key={u.id} className="stk-univers-card"
                  style={{"--ug":u.gradient,"--uc":u.color,"--delay":`${i*0.07}s`}}
                  onClick={() => { setUnivers(u.id); setMarqueId(null); setQuantities({}); }}>
                  <div className="stk-univers-card__stripe"/>
                  <span className="stk-univers-card__emoji">{u.emoji}</span>
                  <h2 className="stk-univers-card__name">{u.label}</h2>
                  <p className="stk-univers-card__meta">
                    {Object.keys(u.marques).length} marques · {totalArticles} articles
                  </p>
                  {totalAlerts > 0 && (
                    <span className="stk-univers-card__alert">⚠ {totalAlerts} en rupture</span>
                  )}
                  <span className="stk-univers-card__cta">Gérer les stocks →</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════ NIVEAU 1 — Grille des marques ══════════════════ */}
      {level === 1 && universData && (
        <div className="stk-page fadein">
          <header className="stk-header">
            <button className="stk-back" onClick={() => setUnivers(null)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Stocks
            </button>
            <div className="stk-header__center">
              <h1 className="stk-title">{universData.emoji} {universData.label}</h1>
              <p className="stk-subtitle">{Object.keys(universData.marques).length} marques disponibles</p>
            </div>
            <button className="stk-btn-new" onClick={() => setShowNewMarque(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Nouvelle Marque
            </button>
          </header>

          <div className="stk-marques-grid">
            {Object.values(universData.marques).map((m, i) => {
              const totalStock = m.articles.reduce((s,a) => s+(a.type==="bar_volume"?Math.floor((a.stockMl??0)/1000):(a.stock??0)), 0);
              const alerts     = m.articles.filter(a => a.type==="bar_volume" ? a.stockMl<=a.seuil : (a.stock??0)<=a.seuil).length;
              return (
                <button key={m.id} className={`stk-marque-card${alerts>0?" stk-marque-card--alert":""}`}
                  style={{"--mc":m.couleur,"--delay":`${i*0.05}s`}}
                  onClick={() => { setMarqueId(m.id); setQuantities({}); setNumpadOpen(null); }}>
                  <div className="stk-marque-card__color-band"/>
                  <div className="stk-marque-card__top">
                    <span className="stk-marque-card__emoji">{m.emoji}</span>
                    {alerts > 0 && <span className="stk-marque-card__alert-badge">⚠ {alerts}</span>}
                  </div>
                  <div className="stk-marque-card__name">{m.label}</div>
                  <div className="stk-marque-card__stats">
                    <span>{m.articles.length} article{m.articles.length>1?"s":""}</span>
                    <span className="stk-marque-card__stock" style={{color:alerts>0?"#E05252":m.couleur}}>
                      {totalStock} en stock
                    </span>
                  </div>
                  <div className="stk-marque-card__cta">Réapprovisionner →</div>
                </button>
              );
            })}

            {/* Carte + Nouvelle marque */}
            <button className="stk-marque-card stk-marque-card--ghost" onClick={() => setShowNewMarque(true)}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(26,22,18,.2)" strokeWidth="1.4" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span className="stk-marque-card__ghost-lbl">Nouvelle marque</span>
            </button>
          </div>

          {/* Sheet nouvelle marque */}
          {showNewMarque && (
            <div className="stk-overlay" onClick={() => setShowNewMarque(false)}>
              <div className="stk-sheet" onClick={e=>e.stopPropagation()}>
                <div className="stk-sheet__handle"/>
                <div className="stk-sheet__hd">
                  <h3 className="stk-sheet__title">Nouvelle marque</h3>
                  <button className="stk-sheet__close" onClick={()=>setShowNewMarque(false)}>✕</button>
                </div>
                <div className="stk-sheet__body">
                  <div className="stk-field">
                    <label className="stk-field__label">Nom de la marque</label>
                    <input className="stk-field__input" placeholder="ex: TUMI, Corona, Moleskine…" autoFocus
                      value={newMarqueForm.label} onChange={e=>setNMF(p=>({...p,label:e.target.value}))}
                      onKeyDown={e=>e.key==="Enter"&&createMarque()}/>
                  </div>
                  <div className="stk-field-row">
                    <div className="stk-field">
                      <label className="stk-field__label">Emoji</label>
                      <input className="stk-field__input stk-field__input--emoji"
                        value={newMarqueForm.emoji} onChange={e=>setNMF(p=>({...p,emoji:e.target.value}))}/>
                    </div>
                    <div className="stk-field">
                      <label className="stk-field__label">Couleur</label>
                      <input type="color" className="stk-field__color"
                        value={newMarqueForm.couleur} onChange={e=>setNMF(p=>({...p,couleur:e.target.value}))}/>
                    </div>
                  </div>
                </div>
                <div className="stk-sheet__ft">
                  <button className="stk-btn-cancel" onClick={()=>setShowNewMarque(false)}>Annuler</button>
                  <button className="stk-btn-save" disabled={!newMarqueForm.label.trim()} onClick={createMarque}>Créer la marque</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════ NIVEAU 2 — Articles + saisie quantité ══════════════════ */}
      {level === 2 && marqueData && (
        <div className="stk-page fadein">
          <header className="stk-header">
            <button className="stk-back" onClick={() => { setMarqueId(null); setQuantities({}); setNumpadOpen(null); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              {universData.label}
            </button>
            <div className="stk-header__center">
              <h1 className="stk-title">{marqueData.emoji} {marqueData.label}</h1>
              <p className="stk-subtitle">{marqueData.articles.length} articles · tapez les quantités reçues</p>
            </div>
            <div className="stk-header__actions">
              {pendingCount > 0 && (
                <button className="stk-btn-apply-all" onClick={applyAll}>
                  ✓ Tout valider ({pendingCount})
                </button>
              )}
              <button className="stk-btn-new" onClick={() => setShowNewArt(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Ajouter un article
              </button>
            </div>
          </header>

          {/* Liste des articles */}
          <div className="stk-articles-list">
            {marqueData.articles.length === 0 ? (
              <div className="stk-empty">
                <span style={{fontSize:48,opacity:.3}}>📦</span>
                <p className="stk-empty__title">Aucun article dans {marqueData.label}</p>
                <button className="stk-btn-new" onClick={() => setShowNewArt(true)}>＋ Ajouter le premier article</button>
              </div>
            ) : (
              marqueData.articles.map((a, idx) => {
                const isVol    = a.type === "bar_volume";
                const stockVal = isVol ? `${(a.stockMl/1000).toFixed(1)} L` : `${a.stock ?? 0}`;
                const seuilVal = isVol ? `${(a.seuil/1000).toFixed(1)} L` : `${a.seuil}`;
                const isLow    = isVol ? a.stockMl <= a.seuil : (a.stock??0) <= a.seuil;
                const qty      = quantities[idx] ?? "";
                const qtyInt   = parseInt(qty||"0",10);
                const newStock = isVol
                  ? `${((a.stockMl??0)/1000 + qtyInt).toFixed(1)} L`
                  : `${(a.stock??0) + qtyInt}`;
                const isConfirmed = !!confirmed[idx];
                const isOpen   = numpadOpen === idx;
                const marge    = a.prixHt>0 ? ((a.prixHt-a.coutHt)/a.prixHt*100) : 0;
                const hc       = marge>=55?"#2D9B6F":marge>=35?"#FF8C69":"#E05252";

                return (
                  <div key={a.id}
                    className={`stk-art${isLow?" stk-art--low":""}${isConfirmed?" stk-art--confirmed":""}${isOpen?" stk-art--open":""}`}>

                    {/* ── Colonne info article ── */}
                    <div className="stk-art__info">
                      <div className="stk-art__name">{a.nom}</div>
                      <div className="stk-art__tags">
                        <span className="stk-art__tag stk-art__tag--ttc">{fmt(a.prixTtc)} € TTC</span>
                        <span className="stk-art__tag stk-art__tag--marge" style={{color:hc}}>{Math.round(marge) + "% marge"}</span>
                        {isLow && <span className="stk-art__tag stk-art__tag--alert">⚠ seuil {seuilVal}</span>}
                      </div>
                    </div>

                    {/* ── Colonne stock actuel ── */}
                    <div className="stk-art__stock-current">
                      <span className="stk-art__stock-lbl">Stock actuel</span>
                      <span className={`stk-art__stock-val${isLow?" stk-art__stock-val--low":""}`}>
                        {stockVal}
                      </span>
                      <span className="stk-art__stock-unite">{a.unite}</span>
                    </div>

                    {/* ── Colonne saisie quantité ── */}
                    <div className="stk-art__input-zone" onClick={() => setNumpadOpen(isOpen ? null : idx)}>
                      {qtyInt > 0 ? (
                        <div className="stk-art__qty-filled">
                          <span className="stk-art__qty-plus">+{qtyInt}</span>
                          <span className="stk-art__qty-arrow">→</span>
                          <span className="stk-art__qty-new">{newStock}</span>
                        </div>
                      ) : (
                        <div className="stk-art__qty-placeholder">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          <span>Saisir</span>
                        </div>
                      )}
                    </div>

                    {/* ── Bouton valider ── */}
                    <button
                      className={`stk-art__validate${qtyInt>0?" stk-art__validate--active":""}${isConfirmed?" stk-art__validate--done":""}`}
                      disabled={qtyInt <= 0 && !isConfirmed}
                      onClick={() => applyStock(idx)}>
                      {isConfirmed ? "✓ Mis à jour" : qtyInt > 0 ? `Valider +${qtyInt}` : "Valider"}
                    </button>

                    {/* ── Pavé numérique inline ── */}
                    {isOpen && (
                      <div className="stk-numpad fadein" onClick={e=>e.stopPropagation()}>
                        <div className="stk-numpad__display">
                          <span className="stk-numpad__before">{stockVal}</span>
                          <span className="stk-numpad__arrow">→</span>
                          <span className={`stk-numpad__after${qtyInt>0?" stk-numpad__after--active":""}`}>
                            {qtyInt > 0 ? newStock : "?"}
                          </span>
                        </div>
                        <div className="stk-numpad__grid">
                          {[7,8,9,4,5,6,1,2,3].map(n => (
                            <button key={n} className="stk-numpad__key"
                              onClick={() => setQuantities(p => ({ ...p, [idx]: (p[idx]||"") + String(n) }))}>
                              {n}
                            </button>
                          ))}
                          <button className="stk-numpad__key stk-numpad__key--del"
                            onClick={() => setQuantities(p => {
                              const v = (p[idx]||"").slice(0,-1);
                              return v ? {...p,[idx]:v} : (k=>{delete k[idx];return k})({...p});
                            })}>
                            ⌫
                          </button>
                          <button className="stk-numpad__key"
                            onClick={() => setQuantities(p => ({ ...p, [idx]: (p[idx]||"") + "0" }))}>
                            0
                          </button>
                          <button className="stk-numpad__key stk-numpad__key--ok"
                            disabled={qtyInt <= 0}
                            onClick={() => applyStock(idx)}>
                            OK
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Sheet nouvel article */}
          {showNewArt && (
            <div className="stk-overlay" onClick={()=>setShowNewArt(false)}>
              <div className="stk-sheet" onClick={e=>e.stopPropagation()}>
                <div className="stk-sheet__handle"/>
                <div className="stk-sheet__hd">
                  <h3 className="stk-sheet__title">Nouvel article dans <em>{marqueData.label}</em></h3>
                  <button className="stk-sheet__close" onClick={()=>setShowNewArt(false)}>✕</button>
                </div>
                <div className="stk-sheet__body">
                  <div className="stk-field">
                    <label className="stk-field__label">Nom de l'article</label>
                    <input className="stk-field__input" placeholder="ex: Slimwallet Bordeaux" autoFocus
                      value={newArtForm.nom} onChange={e=>setNAF2(p=>({...p,nom:e.target.value}))}/>
                  </div>
                  <div className="stk-field-row">
                    <div className="stk-field">
                      <label className="stk-field__label">Achat HT (€)</label>
                      <input className="stk-field__input" type="number" step="0.01" placeholder="0,00"
                        value={newArtForm.coutHt} onChange={e=>setNAF2(p=>({...p,coutHt:e.target.value}))}/>
                    </div>
                    <div className="stk-field">
                      <label className="stk-field__label">Vente HT (€)</label>
                      <input className="stk-field__input" type="number" step="0.01" placeholder="0,00"
                        value={newArtForm.prixHt}
                        onChange={e=>setNAF2(p=>({...p,prixHt:e.target.value,prixTtc:String(Math.round(+e.target.value*1.2*100)/100)||""}))}/>
                    </div>
                    <div className="stk-field">
                      <label className="stk-field__label">Stock initial</label>
                      <input className="stk-field__input" type="number" min="0"
                        value={newArtForm.stock} onChange={e=>setNAF2(p=>({...p,stock:e.target.value}))}/>
                    </div>
                  </div>
                  <div className="stk-field">
                    <label className="stk-field__label">Unité</label>
                    <select className="stk-field__input" value={newArtForm.unite} onChange={e=>setNAF2(p=>({...p,unite:e.target.value}))}>
                      {["pc","verre","bouteille","tasse","kg","litre"].map(u=><option key={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div className="stk-sheet__ft">
                  <button className="stk-btn-cancel" onClick={()=>setShowNewArt(false)}>Annuler</button>
                  <button className="stk-btn-save" disabled={!newArtForm.nom.trim()} onClick={createArticle}>Ajouter l'article</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════
// MES DONNÉES — Hub de navigation avec tuiles (Produits, Rubriques,
// ══════════════════════════════════════════════════════════════════════
// PRODUITS SECTIONS — Vue accordéon par marques avec recherche
// ══════════════════════════════════════════════════════════════════════
function ProdHL({ text, query }) {
  if (!query.trim()) return <>{text}</>;
  const esc   = query.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  const regex = new RegExp(`(${esc})`, "gi");
  const parts = text.split(regex);
  return (
    <>{parts.map((p,i) => regex.test(p) ? <mark key={i} className="prod-hl">{p}</mark> : <span key={i}>{p}</span>)}</>
  );
}

function ProduitsSections({
  catalogue, setCatalogue,
  search, setSearch,
  editing, setEditing, editVal, setEditVal,
  startEdit, commitEdit, isEditing, deleteArticle,
}) {
  const [collapsed, setCollapsed] = useState({});
  const searchRef = useRef(null);

  useEffect(() => { searchRef.current?.focus(); }, []);

  const toggleSection = key => setCollapsed(p => ({ ...p, [key]: !p[key] }));

  // ── Construire sections par marque ──────────────────────────────
  const sections = [];
  Object.values(catalogue).forEach(u => {
    Object.values(u.marques).forEach(m => {
      const all = m.articles.map((a, idx) => ({
        ...a,
        universId: u.id, universLabel: u.label, universColor: u.color,
        marqueId: m.id, marqueLabel: m.label, marqueEmoji: m.emoji, marqueColor: m.couleur || "#FF8C69",
        idx,
      }));
      const q = search.trim().toLowerCase();
      const filtered = q
        ? all.filter(a => a.nom.toLowerCase().includes(q) || m.label.toLowerCase().includes(q) || u.label.toLowerCase().includes(q))
        : all;
      if (!q || filtered.length > 0) {
        sections.push({
          key: `${u.id}--${m.id}`,
          universId: u.id, universLabel: u.label, universColor: u.color,
          marqueId: m.id, marqueLabel: m.label, marqueEmoji: m.emoji,
          marqueColor: m.couleur || "#FF8C69",
          articles: filtered,
          totalArticles: all.length,
        });
      }
    });
  });

  const displayed = search.trim() ? sections.filter(s => s.articles.length > 0) : sections;
  const totalCatalogue = sections.reduce((s, sec) => s + sec.totalArticles, 0);
  const totalVisible   = displayed.reduce((s, sec) => s + sec.articles.length, 0);

  return (
    <div className="ps-root">

      {/* ── Barre de recherche + actions globales ── */}
      <div className="ps-toolbar">
        <div className="ps-searchbar glass">
          <span className="ps-searchbar__icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L22 22"/>
            </svg>
          </span>
          <input
            ref={searchRef}
            className="ps-searchbar__input"
            type="text"
            placeholder="Filtrer par produit, marque ou univers…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            spellCheck={false} autoComplete="off"
          />
          {search && (
            <button className="ps-searchbar__clear"
              onClick={() => { setSearch(""); searchRef.current?.focus(); }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        <span className="ps-toolbar__count">
          {search.trim()
            ? <>{totalVisible} résultat{totalVisible !== 1 ? "s" : ""} <span>sur {totalCatalogue}</span></>
            : <>{totalCatalogue} article{totalCatalogue !== 1 ? "s" : ""}</>}
        </span>

        <button className="ps-btn-toggle" onClick={() => setCollapsed({})}>
          Tout développer
        </button>
        <button className="ps-btn-toggle ps-btn-toggle--col"
          onClick={() => setCollapsed(Object.fromEntries(sections.map(s => [s.key, true])))}>
          Tout réduire
        </button>
      </div>

      {/* ── Zéro résultat ── */}
      {search.trim() && displayed.length === 0 && (
        <div className="ps-zero">
          <span>🔍</span>
          <p>Aucun produit pour <strong>« {search} »</strong></p>
          <button onClick={() => setSearch("")}>Effacer</button>
        </div>
      )}

      {/* ── Sections accordéon ── */}
      <div className="ps-sections">
        {displayed.map((sec, si) => {
          const isOpen   = collapsed[sec.key] !== true;
          const nbAlerts = sec.articles.filter(a =>
            a.type === "bar_volume" ? a.stockMl <= a.seuil : (a.stock ?? 0) <= a.seuil).length;
          const minPrix  = Math.min(...sec.articles.map(a => a.prixTtc));
          const maxPrix  = Math.max(...sec.articles.map(a => a.prixTtc));

          return (
            <section
              key={sec.key}
              className={`ps-sec${isOpen ? " ps-sec--open" : ""}`}
              style={{ "--sc": sec.marqueColor, "--delay": `${si * 0.04}s` }}
            >
              {/* ── Header de section (accordéon) ── */}
              <button className="ps-sec__head" onClick={() => toggleSection(sec.key)}>

                {/* Bande de couleur saumon/marque */}
                <div className="ps-sec__stripe" />

                <div className="ps-sec__identity">
                  <span className="ps-sec__emoji">{sec.marqueEmoji}</span>
                  <div className="ps-sec__labels">
                    <span className="ps-sec__name">
                      {search.trim()
                        ? <PsHL text={sec.marqueLabel} q={search}/>
                        : sec.marqueLabel}
                    </span>
                    <span className="ps-sec__univ">{sec.universLabel}</span>
                  </div>
                </div>

                {/* Infos résumé (toujours visibles) */}
                <div className="ps-sec__meta">
                  {nbAlerts > 0 && (
                    <span className="ps-sec__alert-badge">⚠ {nbAlerts}</span>
                  )}
                  <span className="ps-sec__art-count">
                    {sec.articles.length} article{sec.articles.length !== 1 ? "s" : ""}
                    {!isOpen && sec.articles.length > 0 && (
                      <span className="ps-sec__price-range">
                        {" "}· {fmt(minPrix)}{minPrix !== maxPrix ? ` – ${fmt(maxPrix)}` : ""} €
                      </span>
                    )}
                  </span>
                </div>

                {/* Chevron animé */}
                <svg
                  className="ps-sec__chevron"
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
                  style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)", transition:"transform .25s" }}
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {/* ── Liste des articles (visible si ouvert) ── */}
              {isOpen && (
                <div className="ps-articles">

                  {/* Colonne header */}
                  <div className="ps-col-head">
                    <span className="ps-col-head__name">Article</span>
                    <span className="ps-col-head__stock">Stock</span>
                    <span className="ps-col-head__price">Prix TTC</span>
                    <span className="ps-col-head__actions"/>
                  </div>

                  {sec.articles.map((a, ri) => {
                    const isLow  = a.type === "bar_volume" ? a.stockMl <= a.seuil : (a.stock ?? 0) <= a.seuil;
                    const stockLabel = a.type === "bar_volume"
                      ? `${(a.stockMl / 1000).toFixed(1)} L`
                      : `${a.stock ?? 0} ${a.unite}`;

                    return (
                      <div
                        key={a.id}
                        className={`ps-row${ri % 2 === 1 ? " ps-row--alt" : ""}${isLow ? " ps-row--low" : ""}`}
                      >
                        {/* ── Nom (double-clic pour éditer) ── */}
                        <div className="ps-row__name">
                          {isEditing(a, "nom")
                            ? <input
                                className="ps-inline"
                                autoFocus value={editVal}
                                onChange={e => setEditVal(e.target.value)}
                                onBlur={commitEdit}
                                onKeyDown={e => { if (e.key==="Enter") commitEdit(); if (e.key==="Escape") setEditing(null); }}
                              />
                            : <>
                                <span
                                  className="ps-row__name-text"
                                  onDoubleClick={() => startEdit(a, "nom")}
                                  title="Double-clic pour éditer"
                                >
                                  {search.trim()
                                    ? <PsHL text={a.nom} q={search}/>
                                    : a.nom}
                                </span>
                                {isLow && <span className="ps-row__low-dot" title="Stock critique"/>}
                              </>}
                        </div>

                        {/* ── Stock ── */}
                        <div className="ps-row__stock">
                          <span className={`ps-row__stock-val${isLow?" ps-row__stock-val--low":""}`}>
                            {stockLabel}
                          </span>
                          {isLow && <span className="ps-row__low-lbl">critique</span>}
                        </div>

                        {/* ── Prix TTC (double-clic pour éditer) ── */}
                        <div className="ps-row__price">
                          {isEditing(a, "prixTtc")
                            ? <input
                                className="ps-inline ps-inline--num"
                                autoFocus type="number" step="0.01" value={editVal}
                                onChange={e => setEditVal(e.target.value)}
                                onBlur={commitEdit}
                                onKeyDown={e => { if (e.key==="Enter") commitEdit(); if (e.key==="Escape") setEditing(null); }}
                              />
                            : <span
                                className="ps-row__price-val"
                                onDoubleClick={() => startEdit(a, "prixTtc")}
                                title="Double-clic pour éditer"
                              >
                                {fmt(a.prixTtc)} €
                              </span>}
                        </div>

                        {/* ── Supprimer ── */}
                        <div className="ps-row__actions">
                          <button
                            className="ps-row__del"
                            onClick={() => deleteArticle(a.universId, a.marqueId, a.idx)}
                            title="Supprimer"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Ligne "article vide" si section filtrée avec 0 résultat mais section visible */}
                  {sec.articles.length === 0 && (
                    <div className="ps-row ps-row--empty">
                      <span>Aucun article dans cette rubrique.</span>
                    </div>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <p className="ps-hint">💡 Double-cliquez sur un nom ou un prix pour l'éditer directement.</p>
    </div>
  );
}

// Surlignage des résultats de recherche dans ProduitsSections
function PsHL({ text, q }) {
  if (!q) return <>{text}</>;
  const esc   = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${esc})`, "gi"));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === q.toLowerCase()
          ? <mark key={i} className="ps-mark">{p}</mark>
          : <span key={i}>{p}</span>
      )}
    </>
  );
}


const TVA_RATES = [
  { id:"tva1", label:"Standard",    rate:20,  tag:"Boutique · Bar",    color:"#FF8C69" },
  { id:"tva2", label:"Réduit",      rate:10,  tag:"Restauration",      color:"#5B9EF5" },
  { id:"tva3", label:"Super réduit",rate:5.5, tag:"Alimentaire",       color:"#4CAF87" },
  { id:"tva4", label:"Exonéré",     rate:0,   tag:"Associations…",     color:"#9E8E82" },
];

// ══════════════════════════════════════════════════════════════════════
// MES DONNÉES — 4 grandes tuiles iPad-first
// ══════════════════════════════════════════════════════════════════════
function MesDonnees({ setScreen, catalogue, setCatalogue, enabledModes, setEnabledModes }) {
  const [subView, setSubView] = useState(null);

  if (subView) {
    return (
      <MesDonneesDetail
        view={subView} onBack={() => setSubView(null)}
        catalogue={catalogue} setCatalogue={setCatalogue}
        enabledModes={enabledModes} setEnabledModes={setEnabledModes}
      />
    );
  }

  // Métriques pour les aperçus
  const allProducts = [];
  Object.values(catalogue).forEach(u =>
    Object.values(u.marques).forEach(m =>
      m.articles.forEach(a => allProducts.push({ ...a, marqueLabel: m.label }))
    )
  );
  const enabledCount = Object.values(enabledModes).filter(Boolean).length;
  const modesActifs  = MODES_PAIEMENT.filter(m => enabledModes[m.id] !== false);
  const allMarques   = Object.values(catalogue).flatMap(u => Object.values(u.marques));

  return (
    <div className="gd-page">

      {/* Bouton retour discret */}
      <button className="gd-back-btn" onClick={() => setScreen("home")}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Retour au Dashboard
      </button>

      {/* Titre */}
      <div className="gd-hero">
        <h1 className="gd-hero__title">Mes Données</h1>
        <p className="gd-hero__sub">Configuration de NovaCaisse · {allProducts.length} articles · {allMarques.length} marques</p>
      </div>

      {/* Grille 2×2 */}
      <div className="gd-grid">

        {/* 1. PRODUITS */}
        <button className="gd-card" style={{"--c":"#FF8C69","--cb":"rgba(255,140,105,.08)","--delay":"0s"}}
          onClick={() => setSubView("produits")}>
          <div className="gd-card__icon-row">
            <div className="gd-card__icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF8C69"
                strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <circle cx="3" cy="6" r="1.2" fill="#FF8C69" stroke="none"/>
                <circle cx="3" cy="12" r="1.2" fill="#FF8C69" stroke="none"/>
                <circle cx="3" cy="18" r="1.2" fill="#FF8C69" stroke="none"/>
              </svg>
            </div>
            <span className="gd-card__badge">{allProducts.length}</span>
          </div>
          <div className="gd-card__title">Produits</div>
          <div className="gd-card__sub">Nom · Prix · Marque · Stock</div>
          {/* Aperçu mini-table */}
          <div className="gd-card__preview">
            {allProducts.slice(0, 4).map((p, i) => {
              const pct = p.prixHt > 0 ? Math.round((p.prixHt - p.coutHt) / p.prixHt * 100) : 0;
              return (
                <div key={i} className="gd-prev-produit">
                  <span className="gd-prev-produit__name">{p.nom}</span>
                  <div className="gd-prev-produit__bar">
                    <div style={{ width: `${pct}%`, height: "100%", background: "#FF8C69", borderRadius: 3 }} />
                  </div>
                  <span className="gd-prev-produit__price">{fmt(p.prixTtc)} €</span>
                </div>
              );
            })}
            {allProducts.length > 4 && (
              <span className="gd-prev-more">+{allProducts.length - 4} autres</span>
            )}
          </div>
          <div className="gd-card__arrow">Gérer →</div>
        </button>

        {/* 2. RUBRIQUES */}
        <button className="gd-card" style={{"--c":"#5B9EF5","--cb":"rgba(91,158,245,.08)","--delay":"0.08s"}}
          onClick={() => setSubView("rubriques")}>
          <div className="gd-card__icon-row">
            <div className="gd-card__icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B9EF5"
                strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              </svg>
            </div>
            <span className="gd-card__badge gd-card__badge--blue">
              {allMarques.length}
            </span>
          </div>
          <div className="gd-card__title">Rubriques</div>
          <div className="gd-card__sub">Organisation du catalogue</div>
          <div className="gd-card__preview">
            <div className="gd-prev-tags">
              {["Boissons","High-Tech","Accessoires","Cadeaux","Parfums"].map((r,i)=>(
                <span key={i} className="gd-prev-tag" style={{
                  background:["rgba(255,140,105,.1)","rgba(91,158,245,.1)","rgba(167,139,250,.1)","rgba(76,175,135,.1)","rgba(232,184,111,.1)"][i],
                  color:["#E8704A","#2979D9","#7C3AED","#2D9B6F","#D97706"][i],
                }}>{r}</span>
              ))}
              <span className="gd-prev-tag-add">＋</span>
            </div>
            {/* Marques par univers */}
            {Object.values(catalogue).map(u => (
              <div key={u.id} className="gd-prev-univers">
                <span className="gd-prev-univers__emoji">{u.emoji}</span>
                <span className="gd-prev-univers__label">{u.label}</span>
                <span className="gd-prev-univers__count">{Object.keys(u.marques).length}</span>
              </div>
            ))}
          </div>
          <div className="gd-card__arrow">Organiser →</div>
        </button>

        {/* 3. MODES DE PAIEMENT */}
        <button className="gd-card" style={{"--c":"#4CAF87","--cb":"rgba(76,175,135,.08)","--delay":"0.16s"}}
          onClick={() => setSubView("modes")}>
          <div className="gd-card__icon-row">
            <div className="gd-card__icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4CAF87"
                strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="5" width="22" height="14" rx="2.5"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
                <circle cx="7" cy="15" r="1.5" fill="#4CAF87" stroke="none"/>
              </svg>
            </div>
            <span className="gd-card__badge gd-card__badge--green">{enabledCount}/10</span>
          </div>
          <div className="gd-card__title">Modes de Paiement</div>
          <div className="gd-card__sub">{enabledCount} mode{enabledCount>1?"s":""} actif{enabledCount>1?"s":""} en Caisse</div>
          {/* Vrais mini-switches interactifs */}
          <div className="gd-card__preview gd-card__preview--switches">
            {MODES_PAIEMENT.slice(0, 7).map(m => (
              <div key={m.id} className="gd-sw-row" onClick={e => { e.stopPropagation(); setEnabledModes(p => ({...p,[m.id]:!p[m.id]})); }}>
                <span className="gd-sw-icon">{m.icon}</span>
                <span className="gd-sw-label">{m.label}</span>
                {m.commission > 0 && <span className="gd-sw-comm">−{m.commission + '%'}</span>}
                <div className={`gd-msw${enabledModes[m.id]!==false?" gd-msw--on":""}`}
                  style={{"--sc": m.color}}>
                  <div className="gd-msw__thumb"/>
                </div>
              </div>
            ))}
            {MODES_PAIEMENT.length > 7 && (
              <span className="gd-prev-more">+{MODES_PAIEMENT.length-7} autres…</span>
            )}
          </div>
          <div className="gd-card__arrow">Configurer →</div>
        </button>

        {/* 4. TVA & FISCALITÉ */}
        <button className="gd-card" style={{"--c":"#E8704A","--cb":"rgba(232,112,74,.08)","--delay":"0.24s"}}
          onClick={() => setSubView("tva")}>
          <div className="gd-card__icon-row">
            <div className="gd-card__icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8704A"
                strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="5" x2="5" y2="19"/>
                <circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
              </svg>
            </div>
            <span className="gd-card__badge gd-card__badge--orange">{TVA_RATES.length} taux</span>
          </div>
          <div className="gd-card__title">TVA &amp; Fiscalité</div>
          <div className="gd-card__sub">Taux · Informations légales</div>
          <div className="gd-card__preview">
            {TVA_RATES.map((t, i) => (
              <div key={i} className="gd-prev-tva">
                <div className="gd-prev-tva__dot" style={{background:t.color}}/>
                <span className="gd-prev-tva__tag">{t.tag}</span>
                <span className="gd-prev-tva__rate" style={{color:t.color}}>{t.rate + "%"}</span>
              </div>
            ))}
            <div className="gd-prev-legal">
              <span>🏛️</span> SASU · SIRET : XXX XXX XXX
            </div>
          </div>
          <div className="gd-card__arrow">Paramétrer →</div>
        </button>

      </div>
    </div>
  );
}

// ─── Vue détail de chaque sous-module ────────────────────────────────────
function MesDonneesDetail({ view, onBack, catalogue, setCatalogue, enabledModes, setEnabledModes }) {
  const TITLES = {
    produits:  { label:"Produits",           sub:"Gestion de la base articles — double-clic pour éditer" },
    rubriques: { label:"Rubriques",          sub:"Catégories et marques du catalogue" },
    modes:     { label:"Modes de Paiement",  sub:"Activez ou désactivez les modes disponibles en Caisse" },
    tva:       { label:"TVA & Fiscalité",    sub:"Taux applicables et informations légales" },
  };
  const t = TITLES[view] ?? { label: view, sub: "" };

  // États locaux édition
  const [search,        setSearch]        = useState("");
  const [editing,       setEditing]       = useState(null);
  const [editVal,       setEditVal]       = useState("");
  const [editMarque,    setEditMarque]    = useState(null);
  const [editMarqueVal, setEditMarqueVal] = useState("");
  // ── Navigation rubriques : null | { universId, marqueId }
  const [rubriqueOpen,  setRubriqueOpen]  = useState(null);
  // ── Modals création
  const [showNewRubrique, setShowNewRubrique] = useState(false);
  const [showNewArticle,  setShowNewArticle]  = useState(false);
  // Formulaire nouvelle rubrique
  const [newRubLabel,   setNewRubLabel]   = useState("");
  const [newRubEmoji,   setNewRubEmoji]   = useState("🏷️");
  const [newRubUnivers, setNewRubUnivers] = useState("boutique");
  // Formulaire nouvel article
  const [newArtForm, setNewArtForm] = useState({ nom:"", prixHt:"", prixTtc:"", coutHt:"", stock:"1", unite:"pc" });
  const setNAF = (k,v) => setNewArtForm(p=>({...p,[k]:v}));

  // Mutations catalogue
  const updateArticleField = (universId, marqueId, idx, field, val) => {
    setCatalogue(c => {
      const arts = [...c[universId].marques[marqueId].articles];
      arts[idx] = { ...arts[idx], [field]: field === "nom" ? val : parseFloat(val)||0 };
      if (field === "prixHt") arts[idx].prixTtc = Math.round(parseFloat(val)*1.2*100)/100;
      return { ...c, [universId]:{ ...c[universId], marques:{ ...c[universId].marques,
        [marqueId]:{ ...c[universId].marques[marqueId], articles: arts }}}};
    });
    setEditing(null);
  };
  const deleteArticle = (universId, marqueId, idx) => {
    if (!window.confirm("Supprimer cet article ?")) return;
    setCatalogue(c => {
      const arts = c[universId].marques[marqueId].articles.filter((_,i)=>i!==idx);
      return { ...c, [universId]:{ ...c[universId], marques:{ ...c[universId].marques,
        [marqueId]:{ ...c[universId].marques[marqueId], articles: arts }}}};
    });
  };
  const updateMarqueLabel = (universId, marqueId, label) => {
    setCatalogue(c => ({
      ...c,[universId]:{ ...c[universId], marques:{ ...c[universId].marques,
        [marqueId]:{ ...c[universId].marques[marqueId], label }}}}));
    setEditMarque(null);
  };
  const deleteMarque = (universId, marqueId) => {
    const m = catalogue[universId].marques[marqueId];
    if (!window.confirm(`Supprimer "${m.label}" et ses ${m.articles.length} article(s) ?`)) return;
    setCatalogue(c => {
      const { [marqueId]:_, ...rest } = c[universId].marques;
      return { ...c, [universId]:{ ...c[universId], marques: rest }};
    });
  };

  const createRubrique = () => {
    if (!newRubLabel.trim()) return;
    const id = `rubr-${Date.now()}`;
    setCatalogue(c => ({
      ...c, [newRubUnivers]:{ ...c[newRubUnivers], marques:{
        ...c[newRubUnivers].marques,
        [id]:{ id, label:newRubLabel.trim(), emoji:newRubEmoji, couleur:"#FF8C69", articles:[] }
      }}
    }));
    setNewRubLabel(""); setNewRubEmoji("🏷️");
    setShowNewRubrique(false);
  };

  const createArticle = (universId, marqueId) => {
    const { nom, prixHt, prixTtc, coutHt, stock, unite } = newArtForm;
    if (!nom.trim() || !prixHt) return;
    const id = `art-${Date.now()}`;
    const newA = {
      id, nom:nom.trim(),
      prixHt: parseFloat(prixHt)||0,
      prixTtc: parseFloat(prixTtc)||Math.round(parseFloat(prixHt)*1.2*100)/100,
      coutHt: parseFloat(coutHt)||0,
      stock: parseInt(stock)||0, seuil:2,
      unite, type:"boutique", servingMl:null,
    };
    setCatalogue(c => {
      const arts = [...c[universId].marques[marqueId].articles, newA];
      return {...c,[universId]:{...c[universId],marques:{...c[universId].marques,[marqueId]:{...c[universId].marques[marqueId],articles:arts}}}};
    });
    setNewArtForm({ nom:"", prixHt:"", prixTtc:"", coutHt:"", stock:"1", unite:"pc" });
    setShowNewArticle(false);
  };

  const deleteArticleFromMarque = (universId, marqueId, idx) => {
    if (!window.confirm("Supprimer cet article ?")) return;
    setCatalogue(c => {
      const arts = c[universId].marques[marqueId].articles.filter((_,i)=>i!==idx);
      return {...c,[universId]:{...c[universId],marques:{...c[universId].marques,[marqueId]:{...c[universId].marques[marqueId],articles:arts}}}};
    });
  };
  const toggleMode = id => setEnabledModes(p => ({...p,[id]:!p[id]}));

  // Données produits
  const allProducts = [];
  Object.values(catalogue).forEach(u =>
    Object.values(u.marques).forEach(m =>
      m.articles.forEach((a,idx) => allProducts.push({...a,universId:u.id,universLabel:u.label,marqueId:m.id,marqueLabel:m.label,marqueEmoji:m.emoji,idx}))
    )
  );
  const filtered = allProducts.filter(p =>
    !search ||
    p.nom.toLowerCase().includes(search.toLowerCase()) ||
    p.marqueLabel.toLowerCase().includes(search.toLowerCase())
  );

  const enabledCount = Object.values(enabledModes).filter(Boolean).length;

  const startEdit = (p,field) => { setEditing({universId:p.universId,marqueId:p.marqueId,idx:p.idx,field}); setEditVal(field==="nom"?p.nom:String(p[field]??"")); };
  const commitEdit = () => { if(!editing)return; updateArticleField(editing.universId,editing.marqueId,editing.idx,editing.field,editVal); };
  const isEditing = (p,f) => editing && editing.universId===p.universId && editing.marqueId===p.marqueId && editing.idx===p.idx && editing.field===f;

  return (
    <div className="page fadein">
      <header className="module-header glass">
        <button className="back-btn" onClick={onBack}>←</button>
        <Breadcrumb items={[{label:"Mes Données",onClick:onBack},{label:t.label,onClick:null}]}/>
        <div style={{width:120}}/>
      </header>

      {/* ── PRODUITS ── */}
      {view === "produits" && (
        <ProduitsSections
          catalogue={catalogue}
          setCatalogue={setCatalogue}
          search={search}
          setSearch={setSearch}
          editing={editing}
          setEditing={setEditing}
          editVal={editVal}
          setEditVal={setEditVal}
          startEdit={startEdit}
          commitEdit={commitEdit}
          isEditing={isEditing}
          deleteArticle={deleteArticle}
        />
      )}

      {/* ── RUBRIQUES — interface entonnoir ── */}
      {/* ════════════════════════════════════════════════
            RUBRIQUES — interface entonnoir iPad-first
      ════════════════════════════════════════════════ */}
      {view === "rubriques" && (() => {
        const TILE_COLORS = ["#FF8C69","#5B9EF5","#A78BFA","#4CAF87","#E8704A","#F59E0B","#059669","#9B2335","#1B6FC8","#6B7280","#D97757","#2D9B6F"];

        // ═══ NIVEAU 2 : Articles d'une rubrique ═══
        if (rubriqueOpen) {
          const { universId, marqueId } = rubriqueOpen;
          const univ   = catalogue[universId];
          const marque = catalogue[universId]?.marques[marqueId];
          if (!marque) { setRubriqueOpen(null); return null; }

          const articles   = marque.articles;
          const totalStock = articles.reduce((s,a) => s + (a.type==="bar_volume" ? Math.floor((a.stockMl??0)/1000) : (a.stock??0)), 0);
          const hasAlert   = articles.some(a => a.type==="bar_volume" ? a.stockMl<=a.seuil : (a.stock??0)<=a.seuil);

          return (
            <div className="rub2-root">

              {/* ── Header niveau 2 ── */}
              <header className="rub2-header">
                <button className="rub2-back" onClick={() => { setRubriqueOpen(null); setShowNewArticle(false); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
                    <path d="M19 12H5M12 5l-7 7 7 7"/>
                  </svg>
                  Retour aux rubriques
                </button>

                <div className="rub2-identity">
                  <span className="rub2-emoji">{marque.emoji}</span>
                  <div>
                    <h2 className="rub2-name">{marque.label}</h2>
                    <p className="rub2-meta">
                      {univ.emoji} {univ.label}
                      <span className="rub2-meta__sep">·</span>
                      <span className="rub2-meta__count">{articles.length} article{articles.length>1?"s":""}</span>
                      <span className="rub2-meta__sep">·</span>
                      <span className={`rub2-meta__stock${hasAlert?" rub2-meta__stock--alert":""}`}>
                        {totalStock} en stock{hasAlert?" ⚠":""}
                      </span>
                    </p>
                  </div>
                </div>

                <button className="rub2-btn-add" onClick={() => setShowNewArticle(true)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Ajouter un article dans {marque.label}
                </button>
              </header>

              {/* ── Contenu ── */}
              <div className="rub2-body">
                {articles.length === 0 ? (
                  <div className="rub2-empty">
                    <span className="rub2-empty__icon">📭</span>
                    <p className="rub2-empty__title">Aucun article dans {marque.label}</p>
                    <p className="rub2-empty__sub">Créez votre premier article avec le bouton ci-dessus.</p>
                    <button className="rub2-btn-add" style={{marginTop:8}} onClick={() => setShowNewArticle(true)}>
                      ＋ Ajouter le premier article
                    </button>
                  </div>
                ) : (
                  <div className="rub2-articles">

                    {/* ── Fiches articles ── */}
                    {articles.map((a, idx) => {
                      const marge   = a.prixHt > 0 ? ((a.prixHt - a.coutHt) / a.prixHt * 100) : 0;
                      const hc      = marge >= 55 ? "#2D9B6F" : marge >= 35 ? "#FF8C69" : "#E05252";
                      const isLow   = a.type === "bar_volume" ? a.stockMl <= a.seuil : (a.stock??0) <= a.seuil;
                      const stockVal= a.type === "bar_volume" ? `${(a.stockMl/1000).toFixed(1)} L` : `${a.stock} ${a.unite}`;

                      return (
                        <article key={a.id} className={`rub2-card${isLow?" rub2-card--low":""}`}>
                          {/* Trait de marge en haut */}
                          <div className="rub2-card__marge-stripe"
                            style={{ width:`${Math.min(100,marge)}%`, background: hc }}/>

                          <div className="rub2-card__body">
                            {/* Nom */}
                            <h3 className="rub2-card__name">{a.nom}</h3>

                            {/* Prix */}
                            <div className="rub2-card__prices">
                              <span className="rub2-card__ttc">{fmt(a.prixTtc)} €</span>
                              <span className="rub2-card__ttc-lbl">TTC</span>
                              <span className="rub2-card__ht">{fmt(a.prixHt)} € HT</span>
                            </div>

                            {/* Stock */}
                            <div className={`rub2-card__stock${isLow?" rub2-card__stock--low":""}`}>
                              <div className="rub2-card__stock-dot" style={{ background: isLow ? "#E05252" : "#4CAF87" }}/>
                              <span className="rub2-card__stock-val">{stockVal}</span>
                              <span className="rub2-card__stock-lbl">{isLow ? "⚠ stock critique" : "en stock"}</span>
                            </div>

                            {/* Footer marge + actions */}
                            <div className="rub2-card__footer">
                              <span className="rub2-card__cout">Achat {fmt(a.coutHt)} €</span>
                              <span className="rub2-card__marge-lbl" style={{ color: hc }}>
                                {Math.round(marge) + '% marge'}
                              </span>
                              <button className="rub2-card__del"
                                onClick={() => deleteArticleFromMarque(universId, marqueId, idx)}
                                title="Supprimer">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                  <polyline points="3 6 5 6 21 6"/>
                                  <path d="M19 6l-1 14H6L5 6"/>
                                  <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}

                    {/* ── Carte + Ajouter ── */}
                    <button className="rub2-card-add" onClick={() => setShowNewArticle(true)}>
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
                        stroke="#FF8C69" strokeWidth="1.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      <span>Ajouter un article</span>
                    </button>

                  </div>
                )}
              </div>

              {/* ── Slide-over "Nouvel article" ── */}
              {showNewArticle && (
                <div className="rub-sheet-overlay" onClick={() => setShowNewArticle(false)}>
                  <div className="rub-sheet" onClick={e => e.stopPropagation()}>
                    <div className="rub-sheet__handle"/>
                    <div className="rub-sheet__header">
                      <h3 className="rub-sheet__title">
                        Nouvel article dans <em>{marque.label}</em>
                      </h3>
                      <button className="rub-sheet__close" onClick={() => setShowNewArticle(false)}>✕</button>
                    </div>
                    <div className="rub-sheet__body">
                      <div className="rub-field">
                        <label className="rub-field__label">Nom de l'article</label>
                        <input className="rub-field__input" placeholder="ex: Slimwallet Bordeaux" autoFocus
                          value={newArtForm.nom} onChange={e=>setNAF("nom",e.target.value)}/>
                      </div>
                      <div className="rub-field-row">
                        <div className="rub-field">
                          <label className="rub-field__label">Prix d'achat HT (€)</label>
                          <input className="rub-field__input" type="number" step="0.01" placeholder="0,00"
                            value={newArtForm.coutHt} onChange={e=>setNAF("coutHt",e.target.value)}/>
                        </div>
                        <div className="rub-field">
                          <label className="rub-field__label">Prix de vente HT (€)</label>
                          <input className="rub-field__input" type="number" step="0.01" placeholder="0,00"
                            value={newArtForm.prixHt}
                            onChange={e=>{ setNAF("prixHt",e.target.value); setNAF("prixTtc",(Math.round(parseFloat(e.target.value)*1.2*100)/100)||""); }}/>
                        </div>
                        <div className="rub-field">
                          <label className="rub-field__label">Prix TTC (€)</label>
                          <input className="rub-field__input" type="number" step="0.01" placeholder="auto +20%"
                            value={newArtForm.prixTtc} onChange={e=>setNAF("prixTtc",e.target.value)}/>
                        </div>
                      </div>
                      <div className="rub-field-row">
                        <div className="rub-field">
                          <label className="rub-field__label">Stock initial</label>
                          <input className="rub-field__input" type="number" min="0"
                            value={newArtForm.stock} onChange={e=>setNAF("stock",e.target.value)}/>
                        </div>
                        <div className="rub-field">
                          <label className="rub-field__label">Unité</label>
                          <select className="rub-field__input" value={newArtForm.unite} onChange={e=>setNAF("unite",e.target.value)}>
                            {["pc","verre","bouteille","tasse","kg","litre"].map(u=><option key={u}>{u}</option>)}
                          </select>
                        </div>
                      </div>
                      {newArtForm.prixHt && newArtForm.coutHt && (() => {
                        const m = ((parseFloat(newArtForm.prixHt)-parseFloat(newArtForm.coutHt))/parseFloat(newArtForm.prixHt)*100);
                        const c = m>=55?"#2D9B6F":m>=35?"#FF8C69":"#E05252";
                        return (
                          <div className="rub-sheet__marge-preview" style={{borderColor:`${c}30`}}>
                            <span>Marge brute estimée</span>
                            <strong style={{color:c}}>{fmt(parseFloat(newArtForm.prixHt)-parseFloat(newArtForm.coutHt))} € · {Math.round(m) + "%"}</strong>
                          </div>
                        );
                      })()}
                    </div>
                    <div className="rub-sheet__footer">
                      <button className="rub-btn-cancel" onClick={() => setShowNewArticle(false)}>Annuler</button>
                      <button className="rub-btn-save"
                        disabled={!newArtForm.nom.trim() || !newArtForm.prixHt}
                        onClick={() => createArticle(universId, marqueId)}>
                        Ajouter l'article
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }

        // ═══ NIVEAU 1 : Grille des rubriques ═══
        const allMarques = [];
        Object.values(catalogue).forEach(u =>
          Object.values(u.marques).forEach(m =>
            allMarques.push({ ...m, universId: u.id, universLabel: u.label, universEmoji: u.emoji })
          )
        );

        return (
          <div className="rub1-root">

            {/* ── Toolbar ── */}
            <div className="rub1-toolbar">
              <div className="rub1-toolbar__meta">
                <p className="rub1-toolbar__count">
                  {allMarques.length} rubrique{allMarques.length>1?"s":""}
                  <span className="rub1-toolbar__sep">·</span>
                  {allMarques.reduce((s,m)=>s+m.articles.length,0)} articles au total
                </p>
              </div>
              <button className="rub1-btn-add" onClick={() => setShowNewRubrique(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Créer une nouvelle rubrique
              </button>
            </div>

            {/* ── Grille par univers ── */}
            {Object.values(catalogue).map(u => (
              <div key={u.id} className="rub1-univers">
                <div className="rub1-univers__label">
                  <span className="rub1-univers__emoji">{u.emoji}</span>
                  <span className="rub1-univers__name">{u.label}</span>
                  <span className="rub1-univers__ct">{Object.keys(u.marques).length} rubrique{Object.keys(u.marques).length>1?"s":""}</span>
                </div>

                <div className="rub1-tiles">
                  {Object.values(u.marques).map((m, i) => {
                    const color      = TILE_COLORS[i % TILE_COLORS.length];
                    const totalStock = m.articles.reduce((s,a) => s+(a.type==="bar_volume"?Math.floor((a.stockMl??0)/1000):(a.stock??0)), 0);
                    const hasAlert   = m.articles.some(a => a.type==="bar_volume"?a.stockMl<=a.seuil:(a.stock??0)<=a.seuil);

                    return (
                      <button key={m.id} className="rub1-tile"
                        style={{ "--tc": color, "--delay": `${i*0.05}s` }}
                        onClick={() => setRubriqueOpen({ universId: u.id, marqueId: m.id })}>

                        {/* Fond teinté */}
                        <div className="rub1-tile__bg"/>

                        {/* Top : emoji + alerte */}
                        <div className="rub1-tile__top">
                          <span className="rub1-tile__emoji">{m.emoji}</span>
                          {hasAlert && (
                            <span className="rub1-tile__alert" title="Stock critique">⚠</span>
                          )}
                        </div>

                        {/* Nom */}
                        <div className="rub1-tile__name">{m.label}</div>

                        {/* Compteurs */}
                        <div className="rub1-tile__stats">
                          <span className="rub1-tile__art-count">
                            {m.articles.length} article{m.articles.length>1?"s":""}
                          </span>
                          <span className="rub1-tile__stock-count"
                            style={{ color: hasAlert ? "#E05252" : color }}>
                            {totalStock} en stock
                          </span>
                        </div>

                        {/* Mini barres de stock */}
                        <div className="rub1-tile__bars">
                          {m.articles.slice(0,5).map((a,ai) => {
                            const ratio = a.type==="bar_volume"
                              ? a.stockMl / (a.seuil * 3)
                              : (a.stock??0) / (a.seuil * 4);
                            const low = a.type==="bar_volume" ? a.stockMl<=a.seuil : (a.stock??0)<=a.seuil;
                            return <div key={ai} className="rub1-tile__bar-seg"
                              style={{ background: low ? "#E05252" : color, opacity: Math.min(1, Math.max(0.15, ratio)) }}/>;
                          })}
                        </div>

                        <div className="rub1-tile__cta">Voir les articles →</div>
                      </button>
                    );
                  })}

                  {/* Tuile fantôme "+ Nouvelle rubrique" */}
                  <button className="rub1-tile rub1-tile--ghost"
                    onClick={() => { setNewRubUnivers(u.id); setShowNewRubrique(true); }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                      stroke="rgba(26,22,18,.18)" strokeWidth="1.4" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    <span className="rub1-tile__ghost-lbl">Nouvelle rubrique</span>
                  </button>
                </div>
              </div>
            ))}

            {/* ── Sheet : Nouvelle rubrique ── */}
            {showNewRubrique && (
              <div className="rub-sheet-overlay" onClick={() => setShowNewRubrique(false)}>
                <div className="rub-sheet rub-sheet--sm" onClick={e => e.stopPropagation()}>
                  <div className="rub-sheet__handle"/>
                  <div className="rub-sheet__header">
                    <h3 className="rub-sheet__title">Nouvelle rubrique</h3>
                    <button className="rub-sheet__close" onClick={() => setShowNewRubrique(false)}>✕</button>
                  </div>
                  <div className="rub-sheet__body">
                    <div className="rub-field">
                      <label className="rub-field__label">Nom de la rubrique</label>
                      <input className="rub-field__input" placeholder="ex: SECRID, Vins, Accessoires…" autoFocus
                        value={newRubLabel} onChange={e=>setNewRubLabel(e.target.value)}
                        onKeyDown={e=>e.key==="Enter"&&createRubrique()}/>
                    </div>
                    <div className="rub-field-row">
                      <div className="rub-field">
                        <label className="rub-field__label">Emoji / Icône</label>
                        <input className="rub-field__input rub-field__input--emoji"
                          value={newRubEmoji} onChange={e=>setNewRubEmoji(e.target.value)}/>
                      </div>
                      <div className="rub-field">
                        <label className="rub-field__label">Univers</label>
                        <select className="rub-field__input" value={newRubUnivers} onChange={e=>setNewRubUnivers(e.target.value)}>
                          {Object.values(catalogue).map(u=>(
                            <option key={u.id} value={u.id}>{u.emoji} {u.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="rub-sheet__footer">
                    <button className="rub-btn-cancel" onClick={() => setShowNewRubrique(false)}>Annuler</button>
                    <button className="rub-btn-save" disabled={!newRubLabel.trim()} onClick={createRubrique}>
                      Créer la rubrique
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ── TVA & FISCALITÉ ── */}
      {view === "tva" && (
        <div className="md-section">
          {TVA_RATES.map((t,i) => (
            <div key={t.id} className="gd-tva-row glass" style={{"--delay":`${i*0.06}s`,"--tc":t.color}}>
              <div className="gd-tva-stripe"/>
              <div className="gd-tva-info">
                <span className="gd-tva-label">{t.label}</span>
                <span className="gd-tva-tag">{t.tag}</span>
              </div>
              <div className="gd-tva-rate" style={{color:t.color}}>
                {t.rate}<small>%</small>
              </div>
              <button className="gd-edit-btn">Modifier</button>
            </div>
          ))}
          <button className="gd-add-btn">＋ Ajouter un taux</button>
          {/* Infos légales */}
          <div className="gd-legal glass">
            <div className="gd-legal__title">Informations légales</div>
            {[
              ["Raison sociale","Shop In Café SAS"],
              ["SIRET","XXX XXX XXX XXXXX"],
              ["Statut juridique","SASU"],
              ["N° TVA Intra.","FR XX XXXXXXXXX"],
              ["Exercice fiscal","Janvier – Décembre"],
            ].map(([k,v],i) => (
              <div key={i} className="gd-legal-row">
                <span className="gd-legal-key">{k}</span>
                <span className="gd-legal-val">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



// ══════════════════════════════════════════════════════════════════════
// FINANCES — historique des transactions + KPIs en temps réel
// ══════════════════════════════════════════════════════════════════════
function Finances({ setScreen, transactions, kpis }) {
  const totalCharges = Object.values(CHARGES_MENSUELLES).reduce((s,v)=>s+v,0);
  return (
    <div className="page fadein">
      <header className="module-header glass">
        <button className="back-btn" onClick={()=>setScreen("home")}>←</button>
        <Breadcrumb items={[{label:"Finances",onClick:null}]}/>
        <div style={{width:120}}/>
      </header>

      {/* KPIs */}
      <div className="fin-kpis glass">
        <div className="fin-kpi">
          <span className="fin-kpi__label">CA HT</span>
          <span className="fin-kpi__val">{fmt(kpis.caHt)} €</span>
        </div>
        <div className="fin-kpi fin-kpi--sep"/>
        <div className="fin-kpi">
          <span className="fin-kpi__label">Marge brute</span>
          <span className="fin-kpi__val" style={{color:"#FF8C69"}}>{fmt(kpis.marge)} €</span>
          <span className="fin-kpi__rate">{fmt(kpis.margePct,1) + '%'}</span>
        </div>
        <div className="fin-kpi fin-kpi--sep"/>
        <div className="fin-kpi">
          <span className="fin-kpi__label">Charges /jour</span>
          <span className="fin-kpi__val" style={{color:"#E05252"}}>−{fmt(kpis.charges)} €</span>
        </div>
        <div className="fin-kpi fin-kpi--sep"/>
        <div className="fin-kpi">
          <span className="fin-kpi__label">Bénéf. net réel</span>
          <span className="fin-kpi__val" style={{color:kpis.benefNet>=0?"#4CAF87":"#E05252"}}>
            {kpis.benefNet>=0?"+":""}{fmt(kpis.benefNet)} €
          </span>
        </div>
      </div>

      {/* Charges fixes */}
      <div className="glass charges-detail">
        <div className="charges-title">Charges fixes mensuelles — SASU</div>
        <div className="charges-rows">
          {Object.entries(CHARGES_MENSUELLES).map(([k,v])=>(
            <div key={k} className="charge-row">
              <span className="charge-row__label">{k.charAt(0).toUpperCase()+k.slice(1)}</span>
              <span className="charge-row__val">{fmt(v)} €/mois</span>
              <span className="charge-row__day">≈ {fmt(v/30,2)} €/j</span>
            </div>
          ))}
          <div className="charge-row charge-row--total">
            <span>Total mensuel</span>
            <span className="charge-row__val">{fmt(totalCharges)} €</span>
            <span className="charge-row__day">{fmt(totalCharges/30,2)} €/j</span>
          </div>
        </div>
      </div>

      {/* Historique transactions */}
      <div className="tx-section">
        <div className="tx-section__title">
          Historique des ventes
          {transactions.length>0&&<span className="tx-badge">{transactions.length}</span>}
        </div>
        {transactions.length===0
          ? <div className="tx-empty glass">Aucune vente enregistrée · Encaissez depuis la Caisse</div>
          : transactions.map((tx,i)=>(
            <div key={tx.id} className="tx-card glass" style={{"--delay":`${i*.03}s`}}>
              <div className="tx-card__head">
                <div>
                  <span className="tx-card__time">{tx.heure}</span>
                  <span className="tx-card__count">{tx.nbArticles} article{tx.nbArticles>1?"s":""}</span>
                </div>
                <div className="tx-card__amounts">
                  <span className="tx-card__ttc">{fmt(tx.totalTtc)} €</span>
                  <span className="tx-card__marge" style={{color:tx.margePct>=50?"#4CAF87":"#FF8C69"}}>
                    +{fmt(tx.margeHt)} € ({Math.round(tx.margePct)}{"%)"}
                  </span>
                </div>
              </div>
              <div className="tx-card__lines">
                {tx.lignes.map((l,j)=>(
                  <div key={j} className="tx-line">
                    <span>{l.qty}× {l.nom}</span>
                    <span>{fmt(l.prixTtc*l.qty)} €</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// MODALS
// ══════════════════════════════════════════════════════════════════════
function ModalNewMarque({onSave,onClose}) {
  const [label,setLabel]=useState(""); const [emoji,setEmoji]=useState("🏷️"); const [couleur,setCouleur]=useState("#FF8C69");
  return (
    <Modal title="Nouvelle marque" onClose={onClose}>
      <label className="modal-field"><span>Nom</span><input className="modal-input" value={label} onChange={e=>setLabel(e.target.value)} placeholder="ex: Corona, TUMI…"/></label>
      <div className="modal-row">
        <label className="modal-field" style={{flex:1}}><span>Emoji</span><input className="modal-input" style={{textAlign:"center",fontSize:22}} value={emoji} onChange={e=>setEmoji(e.target.value)}/></label>
        <label className="modal-field" style={{flex:1}}><span>Couleur</span><input type="color" className="modal-color" value={couleur} onChange={e=>setCouleur(e.target.value)}/></label>
      </div>
      <button className="btn-modal-save" disabled={!label.trim()} onClick={()=>onSave({label:label.trim(),emoji,couleur})}>Créer la marque</button>
    </Modal>
  );
}

function ModalNewArticle({onSave,onClose,universId}) {
  const isBar = universId==="bar";
  const [form,setForm]=useState({nom:"",prixHt:"",prixTtc:"",coutHt:"",stock:"1",seuil:isBar?"3":"2",unite:isBar?"verre":"pc",type:isBar?"bar_unite":"boutique",servingMl:"250"});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const autoTtc=()=>{ if(form.prixHt&&!form.prixTtc) set("prixTtc",(+form.prixHt*1.2).toFixed(2)); };
  const valid=form.nom&&form.prixHt&&form.prixTtc&&form.coutHt&&form.stock;
  const h=form.prixHt&&form.coutHt?healthColor(+form.prixHt,+form.coutHt):null;
  return (
    <Modal title="Nouvel article" onClose={onClose}>
      <label className="modal-field"><span>Nom de l'article</span><input className="modal-input" value={form.nom} onChange={e=>set("nom",e.target.value)} placeholder="ex: Slimwallet Bordeaux"/></label>
      {isBar&&(
        <label className="modal-field">
          <span>Type de stock</span>
          <select className="modal-input" value={form.type} onChange={e=>set("type",e.target.value)}>
            <option value="bar_unite">Unité (bouteille, tasse…)</option>
            <option value="bar_volume">Volume (fût, carafe…)</option>
          </select>
        </label>
      )}
      <div className="modal-row">
        <label className="modal-field" style={{flex:1}}><span>Achat HT (€)</span><input className="modal-input" type="number" step="0.01" placeholder="0,00" value={form.coutHt} onChange={e=>set("coutHt",e.target.value)}/></label>
        <label className="modal-field" style={{flex:1}}><span>Vente HT (€)</span><input className="modal-input" type="number" step="0.01" placeholder="0,00" value={form.prixHt} onChange={e=>set("prixHt",e.target.value)} onBlur={autoTtc}/></label>
      </div>
      <div className="modal-row">
        <label className="modal-field" style={{flex:1}}><span>Vente TTC (€)</span><input className="modal-input" type="number" step="0.01" placeholder="auto +20%" value={form.prixTtc} onChange={e=>set("prixTtc",e.target.value)}/></label>
        <label className="modal-field" style={{flex:1}}>
          <span>{form.type==="bar_volume"?"Stock initial (L)":"Stock initial"}</span>
          <input className="modal-input" type="number" min="0" value={form.stock} onChange={e=>set("stock",e.target.value)}/>
        </label>
      </div>
      {form.type==="bar_volume"&&(
        <div className="modal-row">
          <label className="modal-field" style={{flex:1}}><span>Volume / service (ml)</span><input className="modal-input" type="number" value={form.servingMl} onChange={e=>set("servingMl",e.target.value)}/></label>
          <label className="modal-field" style={{flex:1}}><span>Seuil alerte (L)</span><input className="modal-input" type="number" value={form.seuil} onChange={e=>set("seuil",e.target.value)}/></label>
        </div>
      )}
      {form.type!=="bar_volume"&&(
        <div className="modal-row">
          <label className="modal-field" style={{flex:1}}><span>Unité</span><select className="modal-input" value={form.unite} onChange={e=>set("unite",e.target.value)}>{["pc","verre","bouteille","tasse","kg"].map(u=><option key={u}>{u}</option>)}</select></label>
          <label className="modal-field" style={{flex:1}}><span>Seuil alerte</span><input className="modal-input" type="number" value={form.seuil} onChange={e=>set("seuil",e.target.value)}/></label>
        </div>
      )}
      {h&&(
        <div className="modal-preview">
          <span>Marge estimée</span>
          <span style={{color:h.color,fontWeight:700}}>{fmt(+form.prixHt-+form.coutHt)} € · {h.label}</span>
        </div>
      )}
      <button className="btn-modal-save" disabled={!valid} onClick={()=>onSave(form)}>Ajouter l'article</button>
    </Modal>
  );
}

function Modal({title,children,onClose}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet glass" onClick={e=>e.stopPropagation()}>
        <div className="modal-handle"/>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Breadcrumb({items}) {
  return (
    <div className="breadcrumb">
      {items.map((item,i)=>(
        <span key={i} className="breadcrumb__item">
          {i>0&&<span className="breadcrumb__sep">›</span>}
          {item.onClick
            ? <button className="breadcrumb__btn" onClick={item.onClick}>{item.label}</button>
            : <span className="breadcrumb__current">{item.label}</span>}
        </span>
      ))}
    </div>
  );
}
function Ambient() {
  return <div className="ambient"><div className="blob b1"/><div className="blob b2"/><div className="blob b3"/></div>;
}

// ══════════════════════════════════════════════════════════════════════
// CSS
// ══════════════════════════════════════════════════════════════════════
const CSS_SA = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#F7F3EF;--white:#FFF;
  --salmon:#FF8C69;--salmon-s:#FFB59A;--salmon-p:#FFF1EC;--salmon-d:#E8704A;
  --grad:linear-gradient(135deg,#FF8C69,#E8704A);
  --text:#1A1612;--t2:#5C5047;--t3:#9E8E82;
  --line:rgba(26,22,18,.09);
  --green:#4CAF87;--blue:#5B9EF5;--red:#E05252;--warn:#F59E0B;
  --glass:rgba(255,255,255,.76);--gbdr:rgba(255,255,255,.92);--blur:22px;
  --sh:0 8px 32px rgba(0,0,0,.08),0 2px 8px rgba(0,0,0,.04);
  --shl:0 20px 60px rgba(0,0,0,.10);
  --r:18px;--rsm:12px;--rxs:8px;
}
html,body{height:100%;background:var(--bg);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;-webkit-font-smoothing:antialiased}
.root{min-height:100vh;position:relative;overflow-x:hidden}

/* Ambient */
.ambient{position:fixed;inset:0;pointer-events:none;z-index:0}
.blob{position:absolute;border-radius:50%;filter:blur(90px);opacity:0;transition:opacity 1.2s}
.mounted .blob{opacity:1}
.b1{width:700px;height:700px;background:radial-gradient(circle,rgba(255,140,105,.16),transparent 70%);top:-200px;right:-100px;animation:bf1 13s ease-in-out infinite}
.b2{width:500px;height:500px;background:radial-gradient(circle,rgba(91,158,245,.10),transparent 70%);bottom:-100px;left:-150px;animation:bf2 16s ease-in-out infinite}
.b3{width:400px;height:400px;background:radial-gradient(circle,rgba(76,175,135,.08),transparent 70%);top:45%;left:38%;animation:bf3 19s ease-in-out infinite}
@keyframes bf1{0%,100%{transform:translate(0,0)}50%{transform:translate(-45px,30px)}}
@keyframes bf2{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,-40px)}}
@keyframes bf3{0%,100%{transform:translate(0,0)}33%{transform:translate(-25px,18px)}66%{transform:translate(18px,-28px)}}

.fadein{animation:fadeUp .38s ease both}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}

.glass{background:var(--glass);backdrop-filter:blur(var(--blur));-webkit-backdrop-filter:blur(var(--blur));border:1px solid var(--gbdr);box-shadow:var(--sh)}

/* ── TOAST ── */
.toast-stack{position:fixed;bottom:24px;right:24px;z-index:999;display:flex;flex-direction:column;gap:10px;align-items:flex-end}
.toast{padding:13px 18px;border-radius:var(--rsm);min-width:240px;max-width:320px;animation:toastIn .4s cubic-bezier(.2,.8,.2,1) both;box-shadow:0 8px 28px rgba(0,0,0,.14);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
@keyframes toastIn{from{opacity:0;transform:translateX(40px) scale(.96)}to{opacity:1;transform:none}}
.toast--success{background:rgba(76,175,135,.92);border:1px solid rgba(76,175,135,.5);color:#fff}
.toast--warning{background:rgba(245,158,11,.92);border:1px solid rgba(245,158,11,.5);color:#fff}
.toast__title{font-size:13px;font-weight:800;margin-bottom:2px}
.toast__msg{font-size:12px;opacity:.9}

/* ── PAGE ── */
.page{position:relative;z-index:1;max-width:980px;margin:0 auto;padding:20px 20px 60px;display:flex;flex-direction:column;gap:16px}

/* ── HOME ── */
.home-header{border-radius:var(--r);padding:20px 24px;display:flex;flex-wrap:wrap;align-items:center;gap:16px}
.logo-row{display:flex;align-items:center;gap:14px}
.logo-glyph{font-size:34px;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.logo-name{font-family:'DM Serif Display',serif;font-size:22px;letter-spacing:-.01em}
.logo-date{font-size:12px;color:var(--t3);margin-top:1px}
.home-kpis{display:flex;gap:10px;flex-wrap:wrap;margin-left:auto}
.kpi-chip{border-radius:var(--rxs);padding:10px 14px;display:flex;flex-direction:column;gap:2px}
.kpi-chip__label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--t3)}
.kpi-chip__val{font-family:'DM Serif Display',serif;font-size:18px;letter-spacing:-.01em}
.kpi-chip__val--green{color:var(--green)}
.kpi-chip__val small{font-family:'Plus Jakarta Sans';font-size:12px;color:var(--t3)}

.profita-bar-wrap{border-radius:var(--r);padding:18px 22px;display:flex;flex-direction:column;gap:8px}
.profita-bar-header{display:flex;justify-content:space-between;align-items:center}
.profita-bar-label{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--t3)}
.profita-bar-pct{font-size:13px;font-weight:700}
.profita-track{height:8px;background:rgba(26,22,18,.07);border-radius:100px;overflow:hidden}
.profita-fill{height:100%;border-radius:100px;transition:width .8s cubic-bezier(.2,.8,.2,1)}
.profita-detail{display:flex;gap:20px;flex-wrap:wrap;font-size:12px;color:var(--t3)}

.home-tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.home-tile{position:relative;border-radius:var(--r);padding:22px 18px 18px;display:flex;flex-direction:column;gap:5px;cursor:pointer;border:none;font-family:inherit;text-align:left;overflow:hidden;transition:transform .22s,box-shadow .22s}
.home-tile:hover{transform:translateY(-4px);box-shadow:var(--shl)}
.home-tile__top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px}
.home-tile__icon-wrap{position:relative}
.home-tile__arrow{font-size:18px;transition:transform .2s}
.home-tile:hover .home-tile__arrow{transform:translateX(4px)}
.home-tile__label{font-size:13px;font-weight:800;letter-spacing:.06em;color:var(--text)}
.home-tile__sub{font-size:11px;color:var(--t3)}
.home-tile__bar{position:absolute;bottom:0;left:0;right:0;height:3px;border-radius:0 0 var(--r) var(--r)}

/* ── MODULE HEADER ── */
.module-header{display:flex;align-items:center;gap:12px;padding:12px 18px;border-radius:var(--r)}
.back-btn{width:38px;height:38px;border-radius:10px;border:1px solid var(--line);background:transparent;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--t2);transition:all .18s;flex-shrink:0}
.back-btn:hover{background:var(--salmon-p);border-color:var(--salmon-s);color:var(--salmon-d)}
.btn-add{margin-left:auto;display:flex;align-items:center;gap:6px;background:var(--grad);color:#fff;border:none;border-radius:50px;padding:9px 18px;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(255,140,105,.35);transition:transform .2s,box-shadow .2s;white-space:nowrap}
.btn-add:hover{transform:translateY(-2px);box-shadow:0 7px 20px rgba(255,140,105,.45)}

.breadcrumb{display:flex;align-items:center;gap:4px;flex-wrap:wrap;min-width:0}
.breadcrumb__item{display:flex;align-items:center;gap:4px}
.breadcrumb__sep{color:var(--t3);font-size:14px}
.breadcrumb__btn{background:none;border:none;font-family:inherit;font-size:14px;color:var(--salmon-d);font-weight:600;cursor:pointer;padding:0;transition:opacity .15s}
.breadcrumb__btn:hover{opacity:.7}
.breadcrumb__current{font-size:14px;font-weight:800;color:var(--text)}

/* ═══════════════════════════════════════════════════════════════
   STOCKS — Réapprovisionnement iPad-first
═══════════════════════════════════════════════════════════════ */

/* Root pleine page */
.stk-root{position:relative;z-index:1;min-height:100vh;background:var(--bg)}
.stk-page{max-width:1080px;margin:0 auto;padding:28px 32px 64px;display:flex;flex-direction:column;gap:24px}

/* ── Header ── */
.stk-header{
  display:grid;grid-template-columns:1fr auto 1fr;
  align-items:center;gap:16px;
  padding:16px 20px;
  background:rgba(255,255,255,.9);
  border:1px solid rgba(0,0,0,.07);border-radius:20px;
  box-shadow:0 2px 8px rgba(0,0,0,.05);
  backdrop-filter:blur(12px);
}
.stk-header__center{text-align:center}
.stk-header__actions{display:flex;gap:10px;justify-content:flex-end;align-items:center}
.stk-back{
  display:inline-flex;align-items:center;gap:7px;
  padding:9px 16px;
  background:rgba(255,255,255,.9);border:1px solid rgba(0,0,0,.08);
  border-radius:100px;font-family:inherit;font-size:13px;font-weight:500;
  color:var(--t2);cursor:pointer;width:fit-content;
  box-shadow:0 1px 4px rgba(0,0,0,.06);transition:all .18s;
}
.stk-back:hover{background:var(--salmon-p);border-color:rgba(255,140,105,.3);color:var(--salmon-d)}
.stk-title{font-family:'DM Serif Display',serif;font-size:26px;letter-spacing:-.02em;color:var(--text);margin-bottom:3px}
.stk-subtitle{font-size:13px;color:var(--t3)}

/* Boutons header */
.stk-btn-new{
  display:inline-flex;align-items:center;gap:8px;
  background:linear-gradient(135deg,#FF8C69,#E8704A);color:#fff;
  border:none;border-radius:50px;padding:11px 20px;
  font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;
  box-shadow:0 4px 14px rgba(255,140,105,.38);white-space:nowrap;
  transition:transform .2s,box-shadow .2s;
}
.stk-btn-new:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(255,140,105,.5)}

.stk-btn-apply-all{
  display:inline-flex;align-items:center;gap:8px;
  background:linear-gradient(135deg,#4CAF87,#2D9B6F);color:#fff;
  border:none;border-radius:50px;padding:11px 20px;
  font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;
  box-shadow:0 4px 14px rgba(76,175,135,.38);white-space:nowrap;
  animation:pulseSalmon 1.8s ease-in-out infinite;
  transition:transform .2s;
}
.stk-btn-apply-all:hover{transform:translateY(-2px)}
@keyframes pulseSalmon{0%,100%{box-shadow:0 4px 14px rgba(76,175,135,.38)}50%{box-shadow:0 4px 22px rgba(76,175,135,.6)}}

/* ── Niveau 0 — Univers ── */
.stk-univers-grid{
  display:grid;grid-template-columns:1fr 1fr;gap:18px;
}
.stk-univers-card{
  position:relative;overflow:hidden;
  background:rgba(255,255,255,.95);
  border:1px solid rgba(0,0,0,.07);border-radius:24px;
  padding:32px 28px;
  display:flex;flex-direction:column;gap:8px;align-items:flex-start;
  cursor:pointer;font-family:inherit;text-align:left;
  box-shadow:0 2px 12px rgba(0,0,0,.06),0 8px 28px rgba(0,0,0,.05);
  opacity:0;animation:fadeUp .4s cubic-bezier(.22,1,.36,1) both;
  animation-delay:var(--delay,0s);
  transition:transform .22s,box-shadow .22s,border-color .22s;
}
.stk-univers-card:hover{
  transform:translateY(-5px);
  box-shadow:0 4px 20px rgba(0,0,0,.08),0 20px 56px rgba(0,0,0,.10);
  border-color:color-mix(in srgb,var(--uc) 30%,transparent);
}
.stk-univers-card__stripe{
  position:absolute;top:0;left:0;right:0;height:4px;
  background:var(--ug);border-radius:24px 24px 0 0;
}
.stk-univers-card__emoji{font-size:48px;line-height:1;margin-bottom:4px}
.stk-univers-card__name{
  font-family:'DM Serif Display',serif;font-size:30px;
  letter-spacing:-.02em;color:var(--text);
}
.stk-univers-card__meta{font-size:13px;color:var(--t3)}
.stk-univers-card__alert{
  background:rgba(224,82,82,.1);color:#E05252;
  font-size:12px;font-weight:700;padding:4px 12px;
  border-radius:100px;border:1px solid rgba(224,82,82,.2);
}
.stk-univers-card__cta{
  margin-top:8px;font-size:13px;font-weight:700;
  color:var(--uc);letter-spacing:.01em;
}

/* ── Niveau 1 — Marques ── */
.stk-marques-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
  gap:14px;
}
.stk-marque-card{
  position:relative;overflow:hidden;
  background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:22px;
  padding:22px 20px 16px;min-height:180px;
  display:flex;flex-direction:column;gap:6px;align-items:flex-start;
  cursor:pointer;font-family:inherit;text-align:left;
  box-shadow:0 2px 8px rgba(0,0,0,.05),0 6px 20px rgba(0,0,0,.05);
  opacity:0;animation:fadeUp .38s cubic-bezier(.22,1,.36,1) both;
  animation-delay:var(--delay,0s);
  transition:transform .22s,box-shadow .22s,border-color .22s;
}
.stk-marque-card:hover{
  transform:translateY(-5px);
  box-shadow:0 4px 16px rgba(0,0,0,.08),0 16px 40px rgba(0,0,0,.09);
  border-color:color-mix(in srgb,var(--mc) 30%,transparent);
}
.stk-marque-card:active{transform:scale(.97)}
.stk-marque-card--alert{border-color:rgba(224,82,82,.2) !important}
.stk-marque-card__color-band{
  position:absolute;top:0;left:0;right:0;height:4px;
  background:var(--mc);border-radius:22px 22px 0 0;
}
.stk-marque-card__top{display:flex;justify-content:space-between;align-items:flex-start;width:100%;margin-bottom:4px}
.stk-marque-card__emoji{font-size:32px;line-height:1}
.stk-marque-card__alert-badge{
  background:rgba(224,82,82,.1);color:#E05252;
  font-size:11px;font-weight:800;
  padding:3px 9px;border-radius:100px;border:1px solid rgba(224,82,82,.2);
}
.stk-marque-card__name{
  font-family:'DM Serif Display',serif;font-size:18px;
  letter-spacing:-.01em;color:var(--text);line-height:1.2;
}
.stk-marque-card__stats{display:flex;flex-direction:column;gap:2px;width:100%;margin-top:auto;padding-top:10px}
.stk-marque-card__stats span{font-size:12px;color:var(--t3)}
.stk-marque-card__stock{font-size:14px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif}
.stk-marque-card__cta{font-size:11px;font-weight:700;color:var(--mc);margin-top:4px}
.stk-marque-card--ghost{
  border-style:dashed !important;border-color:rgba(26,22,18,.13) !important;
  background:rgba(255,255,255,.4) !important;box-shadow:none !important;
  align-items:center;justify-content:center;gap:8px;
}
.stk-marque-card--ghost:hover{border-color:rgba(255,140,105,.4) !important;background:rgba(255,241,236,.5) !important}
.stk-marque-card__ghost-lbl{font-size:13px;font-weight:600;color:var(--t3)}
.stk-marque-card--ghost:hover .stk-marque-card__ghost-lbl{color:var(--salmon-d)}

/* ── Niveau 2 — Articles avec saisie quantité ── */
.stk-articles-list{display:flex;flex-direction:column;gap:10px}
.stk-empty{
  display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:14px;padding:60px 24px;text-align:center;
}
.stk-empty__title{font-family:'DM Serif Display',serif;font-size:24px;color:var(--text)}

/* Ligne article */
.stk-art{
  background:#fff;border:1.5px solid rgba(0,0,0,.07);border-radius:18px;
  overflow:hidden;
  box-shadow:0 2px 8px rgba(0,0,0,.04);
  transition:border-color .2s,box-shadow .2s;
}
.stk-art--low{border-color:rgba(224,82,82,.25)}
.stk-art--confirmed{border-color:rgba(76,175,135,.4);animation:confirmFlash .6s ease}
.stk-art--open{border-color:rgba(255,140,105,.4);box-shadow:0 4px 20px rgba(255,140,105,.12)}
@keyframes confirmFlash{
  0%{background:#fff}
  30%{background:rgba(76,175,135,.06)}
  100%{background:#fff}
}

/* Grille interne : info | stock actuel | saisie | bouton */
.stk-art__info,
.stk-art__stock-current,
.stk-art__input-zone,
.stk-art__validate {
  /* layout inline dans un flex-row */
}
/* Le conteneur principal des 4 colonnes */
.stk-art > .stk-art__info,
.stk-art > .stk-art__stock-current,
.stk-art > .stk-art__input-zone,
.stk-art > .stk-art__validate {
  /* On les met dans une div implicite via JSX */
}

/* Flex row wrapper — on l'obtient avec la grille directe sur stk-art */
.stk-art{
  display:grid;
  grid-template-columns:1fr auto auto auto;
  grid-template-rows:auto;
  align-items:center;
  gap:0;
  /* Le numpad est full-width en 2e ligne */
}

.stk-art__info{
  padding:16px 20px;
  border-right:1px solid rgba(0,0,0,.05);
}
.stk-art__name{
  font-family:'DM Serif Display',serif;font-size:18px;font-weight:400;
  letter-spacing:-.01em;color:var(--text);margin-bottom:6px;line-height:1.2;
}
.stk-art__tags{display:flex;gap:6px;flex-wrap:wrap}
.stk-art__tag{
  font-size:11px;font-weight:600;padding:3px 9px;border-radius:100px;
}
.stk-art__tag--ttc{background:rgba(255,140,105,.1);color:var(--salmon-d)}
.stk-art__tag--marge{background:rgba(26,22,18,.05);font-weight:700}
.stk-art__tag--alert{background:rgba(224,82,82,.1);color:#E05252;border:1px solid rgba(224,82,82,.15)}

.stk-art__stock-current{
  padding:16px 24px;
  display:flex;flex-direction:column;align-items:center;gap:3px;
  border-right:1px solid rgba(0,0,0,.05);
  min-width:110px;
}
.stk-art__stock-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--t3)}
.stk-art__stock-val{
  font-family:'DM Serif Display',serif;font-size:32px;
  letter-spacing:-.02em;color:var(--text);line-height:1;
  transition:all .3s;
}
.stk-art__stock-val--low{color:#E05252}
.stk-art__stock-unite{font-size:11px;color:var(--t3)}

.stk-art__input-zone{
  padding:16px 20px;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;min-width:160px;
  border-right:1px solid rgba(0,0,0,.05);
  transition:background .18s;
}
.stk-art__input-zone:hover{background:rgba(255,140,105,.04)}
.stk-art__qty-placeholder{
  display:flex;align-items:center;gap:8px;
  color:var(--t3);font-size:13px;font-weight:600;
}
.stk-art__qty-filled{
  display:flex;align-items:center;gap:10px;
}
.stk-art__qty-plus{
  font-family:'DM Serif Display',serif;font-size:28px;
  color:#FF8C69;letter-spacing:-.02em;
}
.stk-art__qty-arrow{font-size:16px;color:var(--t3)}
.stk-art__qty-new{
  font-family:'DM Serif Display',serif;font-size:22px;
  color:#2D9B6F;letter-spacing:-.02em;
}

.stk-art__validate{
  margin:12px 16px;
  padding:14px 20px;
  background:rgba(26,22,18,.06);
  border:none;border-radius:12px;
  font-family:inherit;font-size:13px;font-weight:700;
  color:var(--t3);cursor:pointer;
  white-space:nowrap;
  transition:all .22s;min-width:140px;text-align:center;
}
.stk-art__validate--active{
  background:linear-gradient(135deg,#FF8C69,#E8704A);
  color:#fff;
  box-shadow:0 4px 16px rgba(255,140,105,.4);
  animation:pulseOrange 1.5s ease-in-out infinite;
}
@keyframes pulseOrange{
  0%,100%{box-shadow:0 4px 16px rgba(255,140,105,.4)}
  50%{box-shadow:0 6px 24px rgba(255,140,105,.65)}
}
.stk-art__validate--done{
  background:linear-gradient(135deg,#4CAF87,#2D9B6F) !important;
  color:#fff !important;
  animation:none !important;
  box-shadow:0 4px 14px rgba(76,175,135,.4) !important;
}
.stk-art__validate:disabled:not(.stk-art__validate--done){opacity:.4;cursor:not-allowed}

/* ── Pavé numérique ── */
.stk-numpad{
  grid-column:1/-1;
  background:rgba(247,243,239,.8);
  border-top:1px solid rgba(0,0,0,.06);
  padding:20px 24px;
  display:flex;flex-direction:column;gap:16px;
  animation:numpadIn .22s cubic-bezier(.2,.8,.2,1);
  backdrop-filter:blur(8px);
}
@keyframes numpadIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}

.stk-numpad__display{
  display:flex;align-items:center;justify-content:center;
  gap:16px;padding:12px 0 8px;
  border-bottom:1px solid rgba(0,0,0,.07);
}
.stk-numpad__before{
  font-family:'DM Serif Display',serif;font-size:36px;
  color:var(--t3);letter-spacing:-.02em;
}
.stk-numpad__arrow{font-size:20px;color:var(--t3)}
.stk-numpad__after{
  font-family:'DM Serif Display',serif;font-size:36px;
  color:var(--t3);letter-spacing:-.02em;
  transition:color .2s;
}
.stk-numpad__after--active{color:#4CAF87}

.stk-numpad__grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:8px;
  max-width:380px;margin:0 auto;width:100%;
}
.stk-numpad__key{
  background:#fff;border:1px solid rgba(0,0,0,.08);
  border-radius:14px;padding:18px;
  font-family:'DM Serif Display',serif;font-size:28px;font-weight:400;
  color:var(--text);cursor:pointer;
  box-shadow:0 2px 6px rgba(0,0,0,.06);
  transition:all .12s;
  min-height:68px;display:flex;align-items:center;justify-content:center;
}
.stk-numpad__key:hover{background:var(--salmon-p);border-color:rgba(255,140,105,.3);color:var(--salmon-d)}
.stk-numpad__key:active{transform:scale(.93);box-shadow:0 1px 3px rgba(0,0,0,.1)}
.stk-numpad__key--del{
  background:rgba(26,22,18,.04);
  font-size:20px;color:var(--t2);
  font-family:'Plus Jakarta Sans',sans-serif;
}
.stk-numpad__key--del:hover{background:rgba(224,82,82,.08);border-color:rgba(224,82,82,.2);color:#E05252}
.stk-numpad__key--ok{
  background:linear-gradient(135deg,#FF8C69,#E8704A);
  color:#fff;border-color:transparent;
  font-family:'Plus Jakarta Sans',sans-serif;font-size:16px;font-weight:800;
  box-shadow:0 4px 14px rgba(255,140,105,.4);
  letter-spacing:.04em;
}
.stk-numpad__key--ok:hover{box-shadow:0 6px 20px rgba(255,140,105,.55)}
.stk-numpad__key--ok:disabled{opacity:.4;cursor:not-allowed;transform:none !important}

/* ── Sheets modals ── */
.stk-overlay{
  position:fixed;inset:0;background:rgba(0,0,0,.28);
  backdrop-filter:blur(4px);z-index:100;
  display:flex;align-items:flex-end;justify-content:center;
  animation:overlayIn .25s ease;
}
.stk-sheet{
  width:100%;max-width:600px;
  background:rgba(255,255,255,.98);border-radius:24px 24px 0 0;
  padding:20px 28px 40px;
  display:flex;flex-direction:column;gap:18px;
  box-shadow:0 -8px 40px rgba(0,0,0,.12);
  animation:sheetUp .32s cubic-bezier(.2,.8,.2,1);
}
.stk-sheet__handle{width:40px;height:4px;border-radius:2px;background:rgba(0,0,0,.12);margin:0 auto -6px}
.stk-sheet__hd{display:flex;justify-content:space-between;align-items:center}
.stk-sheet__title{font-family:'DM Serif Display',serif;font-size:22px;letter-spacing:-.01em;color:var(--text)}
.stk-sheet__title em{font-style:italic;color:var(--salmon-d)}
.stk-sheet__close{width:32px;height:32px;border-radius:8px;border:1px solid var(--line);background:transparent;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--t2);transition:all .15s}
.stk-sheet__close:hover{background:rgba(224,82,82,.08);border-color:#E05252;color:#E05252}
.stk-sheet__body{display:flex;flex-direction:column;gap:12px}
.stk-sheet__ft{display:flex;gap:10px;justify-content:flex-end;padding-top:6px;border-top:1px solid var(--line)}
.stk-field{display:flex;flex-direction:column;gap:6px;flex:1}
.stk-field__label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--t3)}
.stk-field__input{background:rgba(26,22,18,.04);border:1px solid var(--line);border-radius:10px;padding:12px 14px;font-family:inherit;font-size:15px;color:var(--text);width:100%;transition:all .18s}
.stk-field__input:focus{outline:none;border-color:#FF8C69;background:#fff;box-shadow:0 0 0 3px rgba(255,140,105,.1)}
.stk-field__input--emoji{text-align:center;font-size:22px}
.stk-field__color{border:1px solid var(--line);border-radius:10px;height:46px;width:100%;cursor:pointer;padding:4px}
.stk-field-row{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.stk-btn-cancel{padding:12px 20px;border:1px solid var(--line);border-radius:10px;background:transparent;font-family:inherit;font-size:14px;font-weight:600;color:var(--t2);cursor:pointer;transition:all .18s}
.stk-btn-cancel:hover{background:rgba(26,22,18,.04)}
.stk-btn-save{padding:12px 24px;border:none;border-radius:10px;background:linear-gradient(135deg,#FF8C69,#E8704A);color:#fff;font-family:inherit;font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 4px 14px rgba(255,140,105,.38);transition:transform .2s,box-shadow .2s}
.stk-btn-save:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 22px rgba(255,140,105,.45)}
.stk-btn-save:disabled{opacity:.4;cursor:not-allowed;transform:none !important}

/* ── CAISSE ── */
.caisse-root{position:relative;z-index:1;display:flex;flex-direction:column;height:100vh;overflow:hidden}
.caisse-layout{display:grid;grid-template-columns:1fr 370px;gap:14px;padding:14px;flex:1;min-height:0;overflow:hidden}
.caisse-browse{overflow-y:auto;display:flex;flex-direction:column;gap:12px;padding-right:4px}
.caisse-browse::-webkit-scrollbar{width:4px}
.caisse-browse::-webkit-scrollbar-thumb{background:rgba(26,22,18,.1);border-radius:4px}

.univers-caisse{display:flex;flex-direction:column;gap:14px}
.univers-caisse-btn{display:flex;align-items:center;gap:16px;border-radius:var(--r);padding:26px;cursor:pointer;font-family:inherit;text-align:left;border:1px solid var(--gbdr);background:var(--glass);backdrop-filter:blur(var(--blur));-webkit-backdrop-filter:blur(var(--blur));position:relative;overflow:hidden;transition:transform .22s,box-shadow .22s}
.univers-caisse-btn::before{content:'';position:absolute;inset:0;background:var(--grad);opacity:.07}
.univers-caisse-btn:hover{transform:translateX(6px);box-shadow:var(--shl)}
.ucb-label{font-family:'DM Serif Display',serif;font-size:28px;letter-spacing:-.02em;color:var(--text)}
.ucb-meta{font-size:12px;color:var(--t3)}
.ucb-arrow{font-size:20px;color:var(--salmon);margin-left:auto;transition:transform .2s}
.univers-caisse-btn:hover .ucb-arrow{transform:translateX(5px)}

.marques-caisse{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
.marque-caisse-btn{display:flex;flex-direction:column;gap:5px;align-items:flex-start;border-radius:var(--rsm);padding:18px;cursor:pointer;border:1px solid var(--gbdr);background:var(--glass);backdrop-filter:blur(var(--blur));-webkit-backdrop-filter:blur(var(--blur));font-family:inherit;text-align:left;opacity:0;animation:fadeUp .35s ease both;animation-delay:var(--delay,0s);transition:transform .2s,box-shadow .2s,border-color .2s;min-height:110px}
.marque-caisse-btn:hover{transform:translateY(-4px);border-color:var(--col,var(--salmon));box-shadow:0 12px 32px rgba(0,0,0,.10)}
.mcb-icon{font-size:30px;margin-bottom:4px}
.mcb-label{font-family:'DM Serif Display',serif;font-size:19px;letter-spacing:-.01em;color:var(--text)}
.mcb-meta{font-size:11px;color:var(--t3)}
.mcb-alert{margin-top:auto;font-size:11px;font-weight:700;color:var(--warn);background:rgba(245,158,11,.10);padding:3px 8px;border-radius:6px;border:1px solid rgba(245,158,11,.2)}
.mcb-arrow{font-size:15px;color:var(--salmon);margin-top:auto}

.articles-caisse{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:10px}
.article-caisse-btn{position:relative;display:flex;flex-direction:column;gap:4px;align-items:flex-start;border-radius:var(--rsm);padding:15px 13px 11px;cursor:pointer;border:1px solid var(--gbdr);background:var(--glass);backdrop-filter:blur(var(--blur));-webkit-backdrop-filter:blur(var(--blur));font-family:inherit;text-align:left;opacity:0;animation:fadeUp .32s ease both;animation-delay:var(--delay,0s);transition:transform .2s,box-shadow .2s,border-color .2s;user-select:none}
.article-caisse-btn:hover:not(.disabled){transform:translateY(-3px) scale(1.02);border-color:var(--salmon-s);box-shadow:0 10px 26px rgba(255,140,105,.2)}
.article-caisse-btn.disabled{opacity:.4;cursor:not-allowed;filter:grayscale(.5)}
.article-caisse-btn.alerte{border-color:rgba(245,158,11,.4) !important}
.article-caisse-btn.flashing{animation:btnFlash .42s ease !important}
@keyframes btnFlash{0%{transform:scale(1)}30%{transform:scale(.93);background:rgba(255,140,105,.15)}70%{transform:scale(1.06)}100%{transform:scale(1)}}
.acb-badge{position:absolute;top:-7px;right:-7px;min-width:22px;height:22px;padding:0 5px;background:var(--grad);color:#fff;border-radius:11px;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;border:2px solid var(--bg);box-shadow:0 2px 8px rgba(255,140,105,.4)}
.acb-alert-dot{position:absolute;top:6px;left:6px;width:8px;height:8px;background:var(--warn);border-radius:50%;box-shadow:0 0 0 3px rgba(245,158,11,.2)}
.acb-name{font-size:12px;font-weight:700;color:var(--text);line-height:1.3;margin-bottom:2px}
.acb-price{font-family:'DM Serif Display',serif;font-size:21px;letter-spacing:-.01em;color:var(--text)}
.acb-price span{font-family:'Plus Jakarta Sans';font-size:13px;color:var(--t3)}
.acb-footer{display:flex;justify-content:space-between;align-items:center;width:100%;margin-top:4px}
.acb-stock{font-size:10px;font-weight:700}
.acb-health{font-size:10px;font-weight:700}
.rupture-overlay{position:absolute;inset:0;background:rgba(255,255,255,.55);border-radius:var(--rsm);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:var(--red);letter-spacing:.05em}

/* ── TICKET ── */
.caisse-ticket-col{display:flex;flex-direction:column;min-height:0}
.ticket{flex:1;border-radius:var(--r);padding:18px;display:flex;flex-direction:column;overflow:hidden;background:rgba(255,255,255,.9) !important}
.ticket-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.ticket-shop{font-family:'DM Serif Display',serif;font-size:16px;color:var(--text)}
.ticket-time{font-size:12px;color:var(--t3)}
.dashed-line{border-top:1.5px dashed rgba(26,22,18,.15);margin:10px 0}
.ticket-lines{flex:1;overflow-y:auto;min-height:0;display:flex;flex-direction:column;gap:2px}
.ticket-lines::-webkit-scrollbar{width:3px}
.ticket-lines::-webkit-scrollbar-thumb{background:rgba(26,22,18,.10);border-radius:3px}
.ticket-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:var(--t3);font-size:13px;text-align:center;padding:24px 0}
.ticket-line{display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:center;padding:7px 4px;border-radius:8px;transition:background .15s}
.ticket-line:hover{background:rgba(255,140,105,.05)}
.tl-info{min-width:0}
.tl-name{font-size:12px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tl-brand{font-size:10px;color:var(--t3);text-transform:capitalize}
.tl-qty-ctrl{display:flex;align-items:center;gap:5px;font-size:13px;font-weight:700}
.tq-btn{width:22px;height:22px;border-radius:6px;border:1px solid var(--line);background:rgba(26,22,18,.04);font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--t2);transition:all .15s}
.tq-btn:hover{background:var(--salmon-p);border-color:var(--salmon-s);color:var(--salmon-d)}
.tl-total{font-size:13px;font-weight:700;white-space:nowrap}
.ticket-totaux{display:flex;flex-direction:column;gap:5px}
.tot-row{display:flex;justify-content:space-between;font-size:12px;color:var(--t2)}
.tot-row--main{font-size:15px;font-weight:800;color:var(--text)}
.tot-marge{display:flex;justify-content:space-between;font-size:11px;padding:6px 8px;background:rgba(26,22,18,.03);border-radius:8px;margin-top:2px}
.tot-marge span:last-child{font-weight:700}
.btn-encaisser{width:100%;padding:14px;margin-top:12px;background:var(--grad);color:#fff;border:none;border-radius:var(--rsm);font-family:inherit;font-size:15px;font-weight:800;cursor:pointer;box-shadow:0 6px 20px rgba(255,140,105,.4);transition:transform .2s,box-shadow .2s}
.btn-encaisser:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 28px rgba(255,140,105,.5)}
.btn-encaisser:disabled{opacity:.4;cursor:not-allowed;transform:none !important}

/* ══════════════════════════════════════════════════════════════════
   PAIEMENT SHEET — grille 10 modes
══════════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════
   PRODUITS — Sections accordéon iPad-first
═══════════════════════════════════════════════════════════════ */

.ps-root{display:flex;flex-direction:column;gap:16px;padding-bottom:48px}

/* Toolbar */
.ps-toolbar{
  display:flex;align-items:center;gap:12px;
  flex-wrap:wrap;
}
.ps-searchbar{
  flex:1;min-width:260px;
  display:flex;align-items:center;gap:10px;
  border-radius:50px;padding:0 14px 0 16px;height:46px;
  border-color:rgba(0,0,0,.08) !important;
  transition:border-color .18s,box-shadow .18s;
}
.ps-searchbar:focus-within{
  border-color:rgba(255,140,105,.5) !important;
  box-shadow:0 0 0 3px rgba(255,140,105,.1);
}
.ps-searchbar__icon{flex-shrink:0;color:rgba(26,22,18,.3);display:flex;align-items:center}
.ps-searchbar:focus-within .ps-searchbar__icon{color:#FF8C69}
.ps-searchbar__input{
  flex:1;border:none;background:transparent;
  font-family:inherit;font-size:15px;color:#1A1612;outline:none;
}
.ps-searchbar__input::placeholder{color:rgba(26,22,18,.3)}
.ps-searchbar__clear{
  border:none;background:none;cursor:pointer;
  width:24px;height:24px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  color:rgba(26,22,18,.4);
  transition:all .15s;
}
.ps-searchbar__clear:hover{background:rgba(224,82,82,.1);color:#E05252}

.ps-toolbar__count{
  font-size:13px;color:rgba(26,22,18,.4);font-weight:500;
  white-space:nowrap;
}
.ps-toolbar__count span{color:rgba(26,22,18,.25)}

.ps-btn-toggle{
  padding:9px 16px;
  background:rgba(255,255,255,.8);border:1px solid rgba(0,0,0,.08);
  border-radius:100px;font-family:inherit;font-size:12px;font-weight:600;
  color:rgba(26,22,18,.5);cursor:pointer;white-space:nowrap;
  transition:all .18s;
}
.ps-btn-toggle:hover{border-color:rgba(255,140,105,.4);color:#E8704A;background:rgba(255,241,236,.8)}
.ps-btn-toggle--col:hover{border-color:rgba(26,22,18,.2);color:#1A1612;background:rgba(26,22,18,.04)}

/* Zéro résultat */
.ps-zero{
  display:flex;flex-direction:column;align-items:center;
  gap:10px;padding:48px 24px;text-align:center;
  color:rgba(26,22,18,.4);
}
.ps-zero span{font-size:40px;opacity:.4}
.ps-zero p{font-size:15px}
.ps-zero p strong{color:#1A1612}
.ps-zero button{
  padding:10px 20px;background:none;
  border:1px solid rgba(26,22,18,.15);border-radius:100px;
  font-family:inherit;font-size:13px;font-weight:600;
  color:rgba(26,22,18,.5);cursor:pointer;
  transition:all .15s;margin-top:4px;
}
.ps-zero button:hover{border-color:#FF8C69;color:#E8704A;background:rgba(255,241,236,.6)}

/* Sections */
.ps-sections{display:flex;flex-direction:column;gap:10px}

.ps-sec{
  background:#fff;
  border:1px solid rgba(0,0,0,.07);
  border-radius:16px;
  overflow:hidden;
  box-shadow:0 1px 4px rgba(0,0,0,.04),0 4px 16px rgba(0,0,0,.04);
  opacity:0;animation:fadeUp .38s cubic-bezier(.22,1,.36,1) both;
  animation-delay:var(--delay,0s);
  transition:box-shadow .2s,border-color .2s;
}
.ps-sec:hover{border-color:color-mix(in srgb,var(--sc) 25%,transparent)}
.ps-sec--open{border-color:color-mix(in srgb,var(--sc) 18%,transparent)}

/* Header accordéon */
.ps-sec__head{
  display:flex;align-items:center;gap:14px;
  width:100%;padding:0;
  background:none;border:none;cursor:pointer;
  font-family:inherit;text-align:left;
  position:relative;
  min-height:60px;
  transition:background .15s;
}
.ps-sec__head:hover{background:rgba(26,22,18,.015)}
.ps-sec--open .ps-sec__head{background:rgba(26,22,18,.012)}

/* Bande colorée gauche */
.ps-sec__stripe{
  width:4px;
  align-self:stretch;
  background:var(--sc,#FF8C69);
  flex-shrink:0;
  border-radius:0;
  min-height:60px;
  transition:background .2s;
}

.ps-sec__identity{
  display:flex;align-items:center;gap:12px;flex:1;min-width:0;
  padding:14px 4px;
}
.ps-sec__emoji{font-size:22px;line-height:1;flex-shrink:0}
.ps-sec__labels{display:flex;flex-direction:column;gap:1px;min-width:0}
.ps-sec__name{
  font-family:'DM Serif Display',serif;
  font-size:16px;font-weight:400;letter-spacing:-.01em;
  color:#1A1612;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.ps-sec__univ{font-size:11px;color:rgba(26,22,18,.35);font-weight:500;text-transform:uppercase;letter-spacing:.06em}

.ps-sec__meta{
  display:flex;align-items:center;gap:8px;padding-right:4px;
  flex-shrink:0;
}
.ps-sec__alert-badge{
  background:rgba(224,82,82,.1);color:#E05252;
  font-size:11px;font-weight:800;
  padding:3px 9px;border-radius:100px;
  border:1px solid rgba(224,82,82,.15);
}
.ps-sec__art-count{font-size:12px;color:rgba(26,22,18,.4);font-weight:500;white-space:nowrap}
.ps-sec__price-range{color:rgba(26,22,18,.3)}

.ps-sec__chevron{
  flex-shrink:0;color:rgba(26,22,18,.3);
  margin-right:16px;
}

/* Articles */
.ps-articles{
  border-top:1px solid rgba(0,0,0,.05);
  animation:psArticlesIn .2s ease both;
}
@keyframes psArticlesIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}

/* Header colonnes */
.ps-col-head{
  display:grid;
  grid-template-columns:1fr 120px 110px 36px;
  gap:0;
  padding:8px 16px 8px 20px;
  background:rgba(26,22,18,.025);
  border-bottom:1px solid rgba(0,0,0,.05);
}
.ps-col-head span{
  font-size:10px;font-weight:800;text-transform:uppercase;
  letter-spacing:.1em;color:rgba(26,22,18,.35);
}
.ps-col-head__stock,.ps-col-head__price{text-align:right}

/* Ligne article */
.ps-row{
  display:grid;
  grid-template-columns:1fr 120px 110px 36px;
  gap:0;
  padding:0 16px 0 20px;
  min-height:48px;
  align-items:center;
  border-bottom:1px solid rgba(0,0,0,.04);
  transition:background .12s;
}
.ps-row:last-child{border-bottom:none}
.ps-row:hover{background:rgba(255,140,105,.03)}
.ps-row--alt{background:rgba(26,22,18,.015)}
.ps-row--alt:hover{background:rgba(255,140,105,.04)}
.ps-row--low{
  background:rgba(224,82,82,.025);
  border-left:3px solid rgba(224,82,82,.35);
  padding-left:17px;
}
.ps-row--empty{padding:16px 20px;color:rgba(26,22,18,.3);font-size:13px;font-style:italic;display:block}

/* Colonne Nom */
.ps-row__name{
  display:flex;align-items:center;gap:8px;
  padding:12px 12px 12px 0;min-width:0;
}
.ps-row__name-text{
  font-size:14px;font-weight:500;color:#1A1612;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  cursor:pointer;
  transition:color .15s;
}
.ps-row__name-text:hover{color:#FF8C69;text-decoration:underline dotted}
.ps-row__low-dot{
  width:7px;height:7px;border-radius:50%;
  background:#E05252;flex-shrink:0;
  box-shadow:0 0 0 3px rgba(224,82,82,.15);
}

/* Colonne Stock */
.ps-row__stock{
  display:flex;flex-direction:column;align-items:flex-end;
  padding:10px 8px;gap:1px;
}
.ps-row__stock-val{
  font-family:'DM Serif Display',serif;
  font-size:17px;letter-spacing:-.01em;color:#1A1612;line-height:1;
}
.ps-row__stock-val--low{color:#E05252}
.ps-row__low-lbl{
  font-size:9px;font-weight:700;text-transform:uppercase;
  letter-spacing:.06em;color:#E05252;
}

/* Colonne Prix */
.ps-row__price{
  display:flex;align-items:center;justify-content:flex-end;
  padding:10px 8px;
}
.ps-row__price-val{
  font-family:'DM Serif Display',serif;
  font-size:17px;letter-spacing:-.01em;color:#1A1612;
  cursor:pointer;transition:color .15s;
}
.ps-row__price-val:hover{color:#FF8C69;text-decoration:underline dotted}

/* Colonne Actions */
.ps-row__actions{display:flex;align-items:center;justify-content:center}
.ps-row__del{
  width:28px;height:28px;border-radius:7px;
  border:1px solid transparent;background:transparent;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  color:rgba(26,22,18,.25);
  transition:all .15s;
}
.ps-row__del:hover{background:rgba(224,82,82,.08);border-color:rgba(224,82,82,.2);color:#E05252}

/* Édition inline */
.ps-inline{
  border:1.5px solid #FF8C69;border-radius:6px;
  background:#fff;padding:4px 8px;
  font-family:inherit;font-size:14px;color:#1A1612;
  outline:none;width:100%;
  box-shadow:0 0 0 3px rgba(255,140,105,.1);
}
.ps-inline--num{text-align:right;width:100px}

/* Highlight recherche */
.ps-mark{
  background:rgba(255,140,105,.2);color:#E8704A;
  border-radius:3px;padding:0 1px;
  font-weight:700;font-style:normal;
}

/* Hint bas de page */
.ps-hint{
  font-size:12px;color:rgba(26,22,18,.3);
  font-style:italic;text-align:center;padding:0 4px;margin-top:4px;
}


/* ── HOME TILES 5 colonnes ── */
.home-tiles--5{grid-template-columns:repeat(5,1fr)}
.home-tile--highlight{
  background:linear-gradient(135deg,rgba(232,112,74,.08),rgba(255,140,105,.05)) !important;
  border-color:rgba(232,112,74,.25) !important;
}

/* ══════════════════════════════════════════════════════════════════
   MES DONNÉES — Page hub + 4 tuiles + vues détail
══════════════════════════════════════════════════════════════════ */

/* Page hub */
.gd-page{
  position:relative;z-index:1;
  min-height:100vh;
  background:var(--bg);
  padding:32px 40px 64px;
  display:flex;flex-direction:column;gap:28px;
  max-width:100%;
}

/* Bouton retour discret */
.gd-back-btn{
  display:inline-flex;align-items:center;gap:8px;
  padding:9px 16px;
  background:rgba(255,255,255,.9);
  border:1px solid rgba(0,0,0,.08);border-radius:100px;
  font-family:inherit;font-size:13px;font-weight:500;
  color:var(--t2);cursor:pointer;
  box-shadow:0 1px 4px rgba(0,0,0,.06);
  transition:all .18s;align-self:flex-start;
  backdrop-filter:blur(8px);
}
.gd-back-btn:hover{
  background:var(--salmon-p);
  border-color:rgba(255,140,105,.3);
  color:var(--salmon-d);
}

/* Titre hero */
.gd-hero{text-align:center;padding:8px 0 4px}
.gd-hero__title{
  font-family:'DM Serif Display',serif;
  font-size:clamp(32px,4vw,48px);
  font-weight:400;letter-spacing:-.02em;color:var(--text);
  margin-bottom:8px;
}
.gd-hero__sub{font-size:14px;color:var(--t3);font-weight:400}

/* ── Grille 2×2 ── */
.gd-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:18px;
  max-width:900px;
  margin:0 auto;
  width:100%;
}

/* ── Tuile ── */
.gd-card{
  position:relative;overflow:hidden;
  background:rgba(255,255,255,.95);
  border:1px solid rgba(0,0,0,.07);
  border-radius:30px;
  padding:0;
  cursor:pointer;font-family:inherit;text-align:left;
  display:flex;flex-direction:column;
  box-shadow:0 2px 12px rgba(0,0,0,.06), 0 8px 32px rgba(0,0,0,.05);
  min-height:300px;
  opacity:0;
  animation:gdCardIn .5s cubic-bezier(.22,1,.36,1) both;
  animation-delay:var(--delay,0s);
  transition:transform .22s,box-shadow .22s,border-color .22s;
}
.gd-card:hover{
  transform:translateY(-5px) scale(1.005);
  box-shadow:0 4px 20px rgba(0,0,0,.08), 0 20px 60px rgba(0,0,0,.10);
  border-color:color-mix(in srgb,var(--c) 30%,transparent);
}
.gd-card:active{transform:scale(.98);box-shadow:0 2px 8px rgba(0,0,0,.08)}
@keyframes gdCardIn{
  from{opacity:0;transform:translateY(24px) scale(.97)}
  to{opacity:1;transform:translateY(0) scale(1)}
}

/* Ligne icône + badge */
.gd-card__icon-row{
  display:flex;align-items:center;justify-content:space-between;
  padding:22px 22px 0;
}
.gd-card__icon-wrap{
  width:48px;height:48px;border-radius:14px;
  background:var(--cb);
  display:flex;align-items:center;justify-content:center;
  transition:transform .2s;
}
.gd-card:hover .gd-card__icon-wrap{transform:scale(1.08)}
.gd-card__badge{
  font-size:12px;font-weight:700;
  background:rgba(26,22,18,.07);color:var(--t2);
  padding:4px 11px;border-radius:100px;
  font-family:'Plus Jakarta Sans',sans-serif;
}
.gd-card__badge--blue{background:rgba(91,158,245,.12);color:#2979D9}
.gd-card__badge--green{background:rgba(76,175,135,.12);color:#2D9B6F}
.gd-card__badge--orange{background:rgba(232,112,74,.12);color:#E8704A}

/* Titre */
.gd-card__title{
  font-family:'DM Serif Display',serif;
  font-size:22px;font-weight:400;letter-spacing:-.01em;
  color:var(--text);padding:16px 22px 2px;
}
.gd-card__sub{font-size:12px;color:var(--t3);padding:0 22px 12px;font-weight:500}

/* Preview générique */
.gd-card__preview{
  flex:1;padding:4px 22px 16px;
  display:flex;flex-direction:column;gap:6px;
  overflow:hidden;
}

/* Preview produits */
.gd-prev-produit{
  display:grid;grid-template-columns:1fr 56px 46px;
  align-items:center;gap:8px;
}
.gd-prev-produit__name{font-size:11px;color:var(--t2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gd-prev-produit__bar{height:3px;background:rgba(26,22,18,.07);border-radius:3px;overflow:hidden}
.gd-prev-produit__price{font-size:11px;font-weight:700;color:var(--text);text-align:right}
.gd-prev-more{font-size:10px;color:var(--t3);font-style:italic;padding-top:2px}

/* Preview rubriques */
.gd-prev-tags{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:6px}
.gd-prev-tag{font-size:11px;font-weight:600;padding:3px 10px;border-radius:100px}
.gd-prev-tag-add{
  font-size:11px;font-weight:600;padding:3px 10px;border-radius:100px;
  background:transparent;border:1px dashed rgba(26,22,18,.15);color:var(--t3);
}
.gd-prev-univers{display:flex;align-items:center;gap:7px;padding:5px 0;border-bottom:1px solid rgba(26,22,18,.06)}
.gd-prev-univers:last-child{border-bottom:none}
.gd-prev-univers__emoji{font-size:14px}
.gd-prev-univers__label{flex:1;font-size:12px;font-weight:600;color:var(--text)}
.gd-prev-univers__count{
  font-size:11px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;
  background:rgba(26,22,18,.07);color:var(--t2);
  padding:2px 8px;border-radius:100px;
}

/* Preview switches */
.gd-card__preview--switches{gap:5px}
.gd-sw-row{
  display:flex;align-items:center;gap:8px;
  padding:4px 0;border-radius:8px;
}
.gd-sw-icon{font-size:14px;flex-shrink:0}
.gd-sw-label{flex:1;font-size:11px;color:var(--t2);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gd-sw-comm{font-size:9px;color:rgba(224,82,82,.8);font-weight:700;flex-shrink:0}
/* Mini switch preview */
.gd-msw{
  width:28px;height:16px;border-radius:8px;
  background:rgba(26,22,18,.12);
  padding:2px;display:flex;align-items:center;
  flex-shrink:0;
  transition:background .2s;
  cursor:pointer;
}
.gd-msw--on{background:var(--sc,#4CAF87)}
.gd-msw__thumb{
  width:12px;height:12px;border-radius:50%;background:#fff;
  box-shadow:0 1px 3px rgba(0,0,0,.2);
  transition:transform .2s cubic-bezier(.2,.8,.2,1);
}
.gd-msw--on .gd-msw__thumb{transform:translateX(12px)}

/* Preview TVA */
.gd-prev-tva{display:flex;align-items:center;gap:9px;padding:4px 0;border-bottom:1px solid rgba(26,22,18,.06)}
.gd-prev-tva:last-of-type{border-bottom:none}
.gd-prev-tva__dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.gd-prev-tva__tag{flex:1;font-size:11px;color:var(--t2);font-weight:500}
.gd-prev-tva__rate{font-size:13px;font-weight:800}
.gd-prev-legal{
  margin-top:6px;padding:7px 10px;border-radius:8px;
  background:rgba(26,22,18,.04);font-size:10px;color:var(--t3);
}

/* Flèche du bas */
.gd-card__arrow{
  padding:12px 22px 18px;
  font-size:12px;font-weight:700;
  color:var(--c);
  transition:gap .2s;
}

/* ── Vues détail ── */
.md-section{display:flex;flex-direction:column;gap:12px}

/* Search */
.md-searchbar{display:flex;align-items:center;gap:10px;border-radius:50px;padding:0 14px 0 16px;height:44px;border-color:var(--line) !important;transition:border-color .2s}
.md-searchbar:focus-within{border-color:var(--salmon-s) !important;box-shadow:0 0 0 3px rgba(255,140,105,.1)}
.md-searchbar__icon{flex-shrink:0;color:var(--t3);display:flex;align-items:center}
.md-searchbar__input{flex:1;border:none;background:transparent;font-family:inherit;font-size:14px;color:var(--text);outline:none}
.md-searchbar__input::placeholder{color:var(--t3)}
.md-searchbar__clear{border:none;background:none;font-size:12px;color:var(--t3);cursor:pointer;padding:4px;transition:color .15s}
.md-searchbar__clear:hover{color:var(--red)}

/* Tableau */
.md-table-wrap{border-radius:var(--r);overflow:hidden;border-color:var(--line) !important}
.md-table-head{display:grid;grid-template-columns:2.5fr 1.6fr 1fr 1fr 1fr 0.8fr 1.2fr 36px;gap:0;padding:10px 16px;background:rgba(26,22,18,.04);border-bottom:1px solid var(--line)}
.md-th{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--t3)}
.md-th--r{text-align:right}
.md-table-body{display:flex;flex-direction:column}
.md-empty{padding:28px;text-align:center;color:var(--t3);font-size:13px}
.md-row{display:grid;grid-template-columns:2.5fr 1.6fr 1fr 1fr 1fr 0.8fr 1.2fr 36px;gap:0;padding:9px 16px;align-items:center;border-bottom:1px solid var(--line);transition:background .15s}
.md-row:last-child{border-bottom:none}
.md-row--alt{background:rgba(26,22,18,.018)}
.md-row:hover{background:rgba(255,140,105,.04)}
.md-td{display:flex;align-items:center;padding:0 4px;min-width:0;font-size:13px;color:var(--t2)}
.md-td--r{justify-content:flex-end}
.md-td--marge{flex-direction:column;align-items:flex-end;gap:3px;justify-content:center}
.md-td__text{font-size:13px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.md-td__click{cursor:pointer}
.md-td__click:hover{color:var(--salmon-d);text-decoration:underline dotted}
.md-num{font-size:13px;font-weight:500;color:var(--text);font-variant-numeric:tabular-nums;cursor:pointer}
.md-num:hover{color:var(--salmon-d);text-decoration:underline dotted}
.md-inline-input{border:1.5px solid var(--salmon);border-radius:6px;background:#fff;padding:4px 8px;font-family:inherit;font-size:13px;color:var(--text);outline:none;width:100%}
.md-inline-input--sm{text-align:right;width:80px}
.md-inline-input--marque{width:140px}
.md-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-right:6px}
.md-dot--bar{background:var(--salmon)}
.md-dot--boutique{background:var(--blue)}
.md-stock{font-size:12px;font-weight:700;color:var(--text)}
.md-stock--low{color:var(--red)}
.md-mbar{width:52px;height:4px;background:rgba(26,22,18,.08);border-radius:100px;overflow:hidden}
.md-mbar__fill{height:100%;border-radius:100px;transition:width .4s}
.md-del{width:28px;height:28px;border-radius:7px;border:1px solid var(--line);background:transparent;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}
.md-del:hover{background:rgba(224,82,82,.1);border-color:var(--red)}
.md-hint{font-size:12px;color:var(--t3);font-style:italic;padding:0 2px}

/* ═══════════════════════════════════════════════════════════════
   RUBRIQUES — Niveau 1 (grille) + Niveau 2 (fiches articles)
═══════════════════════════════════════════════════════════════ */

/* ── Niveau 1 : page grille ── */
.rub1-root{display:flex;flex-direction:column;gap:24px;padding:4px 0 32px}

.rub1-toolbar{
  display:flex;justify-content:space-between;align-items:center;
  padding:0 2px;
}
.rub1-toolbar__meta{}
.rub1-toolbar__count{font-size:14px;color:var(--t3);font-weight:500}
.rub1-toolbar__sep{margin:0 8px;color:var(--t3)}
.rub1-btn-add{
  display:inline-flex;align-items:center;gap:8px;
  background:linear-gradient(135deg,#FF8C69,#E8704A);
  color:#fff;border:none;border-radius:50px;
  padding:12px 22px;
  font-family:inherit;font-size:14px;font-weight:700;
  cursor:pointer;
  box-shadow:0 4px 16px rgba(255,140,105,.38);
  transition:transform .2s,box-shadow .2s;
}
.rub1-btn-add:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(255,140,105,.5)}
.rub1-btn-add:active{transform:scale(.97)}

/* Bloc par univers */
.rub1-univers{display:flex;flex-direction:column;gap:14px}
.rub1-univers__label{
  display:flex;align-items:center;gap:10px;
  padding-bottom:8px;border-bottom:1px solid var(--line);
}
.rub1-univers__emoji{font-size:20px}
.rub1-univers__name{font-family:'DM Serif Display',serif;font-size:20px;color:var(--text);letter-spacing:-.01em}
.rub1-univers__ct{margin-left:auto;font-size:12px;color:var(--t3)}

/* Grille de tuiles */
.rub1-tiles{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(200px,1fr));
  gap:14px;
}

/* Tuile */
.rub1-tile{
  position:relative;overflow:hidden;
  background:rgba(255,255,255,.95);
  border:1px solid rgba(0,0,0,.07);
  border-radius:24px;
  padding:22px 20px 16px;
  min-height:180px;
  display:flex;flex-direction:column;gap:6px;align-items:flex-start;
  cursor:pointer;font-family:inherit;text-align:left;
  box-shadow:0 2px 8px rgba(0,0,0,.05),0 8px 24px rgba(0,0,0,.05);
  opacity:0;animation:fadeUp .4s cubic-bezier(.22,1,.36,1) both;
  animation-delay:var(--delay,0s);
  transition:transform .22s,box-shadow .22s,border-color .22s;
}
.rub1-tile:hover{
  transform:translateY(-5px) scale(1.01);
  box-shadow:0 4px 16px rgba(0,0,0,.08),0 20px 48px rgba(0,0,0,.10);
  border-color:color-mix(in srgb,var(--tc) 35%,transparent);
}
.rub1-tile:active{transform:scale(.97)}

/* Fond coloré en overlay */
.rub1-tile__bg{
  position:absolute;inset:0;
  background:var(--tc);
  opacity:.06;
  border-radius:inherit;
  pointer-events:none;
}

/* Top : emoji + badge alerte */
.rub1-tile__top{
  display:flex;justify-content:space-between;align-items:flex-start;
  width:100%;margin-bottom:4px;
}
.rub1-tile__emoji{
  font-size:32px;line-height:1;
  filter:drop-shadow(0 2px 4px rgba(0,0,0,.12));
}
.rub1-tile__alert{
  font-size:15px;
  background:rgba(224,82,82,.1);
  color:#E05252;
  border-radius:100px;
  padding:3px 8px;
  font-weight:700;
}
.rub1-tile__name{
  font-family:'DM Serif Display',serif;
  font-size:17px;font-weight:400;letter-spacing:-.01em;
  color:var(--text);line-height:1.2;
  width:100%;
}
.rub1-tile__stats{
  display:flex;flex-direction:column;gap:2px;
  width:100%;margin-top:2px;
}
.rub1-tile__art-count{font-size:12px;color:var(--t3);font-weight:500}
.rub1-tile__stock-count{font-size:13px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif}

/* Mini barres stock */
.rub1-tile__bars{
  display:flex;gap:3px;width:100%;margin-top:auto;
  padding-top:10px;
}
.rub1-tile__bar-seg{
  flex:1;height:3px;border-radius:100px;
  transition:opacity .3s;
}

.rub1-tile__cta{
  font-size:11px;font-weight:700;
  color:var(--tc);
  margin-top:4px;letter-spacing:.01em;
}

/* Tuile fantôme */
.rub1-tile--ghost{
  border-style:dashed !important;
  border-color:rgba(26,22,18,.13) !important;
  background:rgba(255,255,255,.4) !important;
  box-shadow:none !important;
  align-items:center;justify-content:center;gap:8px;
  min-height:180px;
}
.rub1-tile--ghost:hover{border-color:rgba(255,140,105,.4) !important;background:rgba(255,241,236,.5) !important}
.rub1-tile__ghost-lbl{font-size:13px;font-weight:600;color:var(--t3)}
.rub1-tile--ghost:hover .rub1-tile__ghost-lbl{color:var(--salmon-d)}

/* ── Niveau 2 : articles d'une rubrique ── */
.rub2-root{display:flex;flex-direction:column;gap:20px;padding:4px 0 32px}

.rub2-header{
  display:flex;align-items:center;gap:16px;
  padding:16px 20px;
  background:rgba(255,255,255,.9);
  border:1px solid rgba(0,0,0,.07);
  border-radius:20px;
  box-shadow:0 2px 8px rgba(0,0,0,.05);
  backdrop-filter:blur(12px);
}

.rub2-back{
  display:inline-flex;align-items:center;gap:7px;
  padding:9px 16px;
  background:rgba(255,255,255,.9);
  border:1px solid rgba(0,0,0,.08);
  border-radius:100px;
  font-family:inherit;font-size:13px;font-weight:500;
  color:var(--t2);cursor:pointer;
  box-shadow:0 1px 4px rgba(0,0,0,.06);
  transition:all .18s;white-space:nowrap;flex-shrink:0;
}
.rub2-back:hover{background:rgba(255,241,236,.9);border-color:rgba(255,140,105,.3);color:var(--salmon-d)}

.rub2-identity{display:flex;align-items:center;gap:14px;flex:1;min-width:0}
.rub2-emoji{font-size:36px;flex-shrink:0;filter:drop-shadow(0 2px 4px rgba(0,0,0,.1))}
.rub2-name{
  font-family:'DM Serif Display',serif;
  font-size:26px;font-weight:400;letter-spacing:-.02em;
  color:var(--text);margin-bottom:3px;
}
.rub2-meta{font-size:13px;color:var(--t3)}
.rub2-meta__sep{margin:0 6px;opacity:.5}
.rub2-meta__count{font-weight:600;color:var(--t2)}
.rub2-meta__stock{font-weight:700;color:var(--green)}
.rub2-meta__stock--alert{color:#E05252}

.rub2-btn-add{
  display:inline-flex;align-items:center;gap:8px;
  background:linear-gradient(135deg,#FF8C69,#E8704A);
  color:#fff;border:none;border-radius:50px;
  padding:12px 20px;
  font-family:inherit;font-size:13px;font-weight:700;
  cursor:pointer;white-space:nowrap;flex-shrink:0;
  box-shadow:0 4px 14px rgba(255,140,105,.38);
  transition:transform .2s,box-shadow .2s;
}
.rub2-btn-add:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(255,140,105,.5)}
.rub2-btn-add:active{transform:scale(.97)}

/* Corps des articles */
.rub2-body{flex:1}
.rub2-empty{
  display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:12px;
  padding:60px 24px;text-align:center;
}
.rub2-empty__icon{font-size:52px;opacity:.35}
.rub2-empty__title{font-family:'DM Serif Display',serif;font-size:24px;color:var(--text)}
.rub2-empty__sub{font-size:14px;color:var(--t3);max-width:360px}

/* Grille de fiches */
.rub2-articles{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
  gap:14px;
}

/* Fiche article */
.rub2-card{
  position:relative;overflow:hidden;
  background:#fff;
  border:1px solid rgba(0,0,0,.07);
  border-radius:20px;
  box-shadow:0 2px 8px rgba(0,0,0,.04),0 4px 20px rgba(0,0,0,.05);
  display:flex;flex-direction:column;
  transition:box-shadow .2s,transform .2s,border-color .2s;
  animation:fadeUp .38s ease both;
}
.rub2-card:hover{
  box-shadow:0 4px 16px rgba(0,0,0,.07),0 12px 36px rgba(0,0,0,.09);
  transform:translateY(-3px);
}
.rub2-card--low{border-color:rgba(224,82,82,.25)}

/* Trait de marge en haut */
.rub2-card__marge-stripe{
  height:4px;
  border-radius:20px 20px 0 0;
  transition:width .5s cubic-bezier(.2,.8,.2,1);
  background:#FF8C69;
  min-width:8px;
}

/* Corps de la fiche */
.rub2-card__body{
  padding:18px 20px 16px;
  display:flex;flex-direction:column;gap:10px;
  flex:1;
}
.rub2-card__name{
  font-family:'DM Serif Display',serif;
  font-size:18px;font-weight:400;letter-spacing:-.01em;
  color:var(--text);line-height:1.2;
}

/* Prix */
.rub2-card__prices{
  display:flex;align-items:baseline;gap:8px;
}
.rub2-card__ttc{
  font-family:'DM Serif Display',serif;
  font-size:28px;font-weight:400;letter-spacing:-.02em;
  color:var(--text);line-height:1;
}
.rub2-card__ttc-lbl{
  font-size:11px;font-weight:700;color:var(--t3);
  text-transform:uppercase;letter-spacing:.06em;
}
.rub2-card__ht{font-size:13px;color:var(--t3);margin-left:2px}

/* Stock */
.rub2-card__stock{
  display:flex;align-items:center;gap:8px;
}
.rub2-card__stock-dot{
  width:8px;height:8px;border-radius:50%;
  flex-shrink:0;
}
.rub2-card__stock-val{
  font-size:15px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;
  color:var(--text);
}
.rub2-card__stock-lbl{
  font-size:12px;color:var(--t3);
}
.rub2-card__stock--low .rub2-card__stock-val{color:#E05252}
.rub2-card__stock--low .rub2-card__stock-lbl{color:#E05252}

/* Footer fiche */
.rub2-card__footer{
  display:flex;align-items:center;
  padding-top:10px;
  border-top:1px solid rgba(0,0,0,.06);
  font-size:12px;
}
.rub2-card__cout{color:var(--t3)}
.rub2-card__marge-lbl{
  font-size:12px;font-weight:700;
  margin-left:6px;
}
.rub2-card__del{
  margin-left:auto;
  width:28px;height:28px;
  border-radius:8px;border:1px solid rgba(0,0,0,.07);
  background:transparent;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  color:var(--t3);transition:all .15s;
}
.rub2-card__del:hover{background:rgba(224,82,82,.08);border-color:#E05252;color:#E05252}

/* Carte + ajouter */
.rub2-card-add{
  display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:10px;
  background:transparent;
  border:2px dashed rgba(255,140,105,.3);
  border-radius:20px;padding:28px;
  cursor:pointer;font-family:inherit;
  transition:all .2s;min-height:160px;
}
.rub2-card-add:hover{
  background:rgba(255,241,236,.5);
  border-color:rgba(255,140,105,.6);
}
.rub2-card-add span{font-size:13px;font-weight:700;color:var(--salmon-d)}

/* ── Sheet modals (partagés) ── */
.rub-sheet-overlay{
  position:fixed;inset:0;
  background:rgba(0,0,0,.28);
  backdrop-filter:blur(4px);
  z-index:100;
  display:flex;align-items:flex-end;justify-content:center;
  animation:overlayIn .25s ease;
}
@keyframes overlayIn{from{opacity:0}to{opacity:1}}

.rub-sheet{
  width:100%;max-width:640px;
  background:rgba(255,255,255,.98);
  border-radius:24px 24px 0 0;
  padding:20px 28px 40px;
  display:flex;flex-direction:column;gap:18px;
  box-shadow:0 -8px 40px rgba(0,0,0,.12);
  animation:sheetUp .32s cubic-bezier(.2,.8,.2,1) both;
}
@keyframes sheetUp{from{transform:translateY(100%);opacity:0}to{transform:none;opacity:1}}
.rub-sheet--sm{max-width:480px}

.rub-sheet__handle{
  width:40px;height:4px;border-radius:2px;
  background:rgba(0,0,0,.12);margin:0 auto -6px;
}
.rub-sheet__header{display:flex;justify-content:space-between;align-items:center}
.rub-sheet__title{
  font-family:'DM Serif Display',serif;
  font-size:22px;letter-spacing:-.01em;color:var(--text);
}
.rub-sheet__title em{font-style:italic;color:var(--salmon-d)}
.rub-sheet__close{
  width:32px;height:32px;border-radius:8px;
  border:1px solid var(--line);background:transparent;
  font-size:14px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  color:var(--t2);transition:all .15s;
}
.rub-sheet__close:hover{background:rgba(224,82,82,.08);border-color:#E05252;color:#E05252}
.rub-sheet__body{display:flex;flex-direction:column;gap:12px}

/* Champs */
.rub-field{display:flex;flex-direction:column;gap:6px;flex:1}
.rub-field__label{
  font-size:11px;font-weight:700;
  text-transform:uppercase;letter-spacing:.1em;color:var(--t3);
}
.rub-field__input{
  background:rgba(26,22,18,.04);
  border:1px solid var(--line);
  border-radius:10px;padding:12px 14px;
  font-family:inherit;font-size:15px;color:var(--text);
  width:100%;transition:all .18s;
}
.rub-field__input:focus{
  outline:none;border-color:#FF8C69;
  background:#fff;box-shadow:0 0 0 3px rgba(255,140,105,.1);
}
.rub-field__input--emoji{text-align:center;font-size:22px}
.rub-field-row{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.rub-field-row:has(.rub-field:last-child:nth-child(2)){grid-template-columns:1fr 1fr}

.rub-sheet__marge-preview{
  display:flex;justify-content:space-between;align-items:center;
  padding:10px 14px;border-radius:10px;border:1px solid;
  background:rgba(26,22,18,.02);font-size:13px;color:var(--t2);
}
.rub-sheet__marge-preview strong{font-weight:700;font-family:'Plus Jakarta Sans',sans-serif}

.rub-sheet__footer{
  display:flex;gap:10px;justify-content:flex-end;
  padding-top:6px;border-top:1px solid var(--line);
}
.rub-btn-cancel{
  padding:12px 20px;border:1px solid var(--line);border-radius:10px;
  background:transparent;font-family:inherit;font-size:14px;
  font-weight:600;color:var(--t2);cursor:pointer;transition:all .18s;
}
.rub-btn-cancel:hover{background:rgba(26,22,18,.04)}
.rub-btn-save{
  padding:12px 24px;border:none;border-radius:10px;
  background:linear-gradient(135deg,#FF8C69,#E8704A);
  color:#fff;font-family:inherit;font-size:14px;
  font-weight:800;cursor:pointer;
  box-shadow:0 4px 14px rgba(255,140,105,.38);
  transition:transform .2s,box-shadow .2s;
}
.rub-btn-save:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 22px rgba(255,140,105,.45)}
.rub-btn-save:disabled{opacity:.4;cursor:not-allowed;transform:none !important}

@media(max-width:820px){
  .caisse-layout{grid-template-columns:1fr;grid-template-rows:1fr 280px}
  .home-tiles{grid-template-columns:1fr 1fr}
  .fin-kpis{grid-template-columns:1fr 1fr;gap:12px}
  .fin-kpi--sep{display:none}
  .univers-grid{grid-template-columns:1fr}
  .marques-caisse{grid-template-columns:1fr 1fr}
  .srr{grid-template-columns:auto 1fr}
  .srr__right{display:none}
}
@media(max-width:560px){
  .home-tiles{grid-template-columns:1fr 1fr}
  .marques-caisse{grid-template-columns:1fr}
  .articles-caisse{grid-template-columns:repeat(2,1fr)}
  .modal-row{grid-template-columns:1fr}
  .charge-row{grid-template-columns:1fr auto}
  .charge-row__day{display:none}
  .srr__pill{display:none}
  .srr{grid-template-columns:1fr}
}

/* ══════════════════════════════════════════════════════════════
   MOBILE RESPONSIVE — iPhone / Android (375-430px)
══════════════════════════════════════════════════════════════ */

/* Bottom nav */
.bottom-nav{
  display:none;
  position:fixed;bottom:0;left:0;right:0;
  background:rgba(255,255,255,.92);
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  border-top:1px solid rgba(26,22,18,.08);
  padding:8px 0 max(env(safe-area-inset-bottom),8px);
  z-index:100;
  grid-template-columns:repeat(5,1fr);
}
.bnav-item{
  display:flex;flex-direction:column;align-items:center;gap:2px;
  padding:4px 0;background:none;border:none;cursor:pointer;
  font-family:inherit;font-size:9px;font-weight:700;
  letter-spacing:.04em;text-transform:uppercase;
  color:rgba(26,22,18,.4);transition:color .15s;
}
.bnav-item--active{color:var(--salmon-d)}
.bnav-item__icon{font-size:20px;line-height:1}
.bnav-item__dot{width:4px;height:4px;border-radius:50%;background:var(--salmon);margin-top:1px;opacity:0;transition:opacity .15s}
.bnav-item--active .bnav-item__dot{opacity:1}

@media(max-width:768px){

  /* Base */
  .bottom-nav{display:grid}
  .page{padding:12px 14px max(calc(env(safe-area-inset-bottom) + 80px),90px);gap:12px}

  /* Header home */
  .home-header{padding:14px 16px;gap:10px;border-radius:14px}
  .logo-name{font-size:19px}
  .logo-glyph{font-size:28px}
  .home-kpis{gap:6px;margin-left:0;width:100%}
  .kpi-chip{padding:8px 10px;border-radius:10px}
  .kpi-chip__val{font-size:16px}

  /* Tiles home */
  .home-tiles{grid-template-columns:1fr 1fr;gap:10px}
  .home-tiles--5{grid-template-columns:repeat(2,1fr)}
  .home-tile{padding:16px 14px 14px;border-radius:14px}
  .home-tile__label{font-size:12px}

  /* Module header */
  .module-header{padding:10px 14px;border-radius:12px;gap:8px}
  .back-btn{width:36px;height:36px}
  .btn-add{padding:8px 14px;font-size:12px}

  /* Caisse */
  .caisse-layout{grid-template-columns:1fr;grid-template-rows:1fr auto}
  .caisse-right{max-height:45vh}
  .articles-caisse{grid-template-columns:repeat(2,1fr);gap:8px}
  .article-btn{padding:12px 8px;border-radius:12px}
  .article-btn__nom{font-size:12px}
  .article-btn__prix{font-size:15px}
  .univers-grid{grid-template-columns:repeat(2,1fr);gap:8px}
  .marques-caisse{grid-template-columns:repeat(2,1fr);gap:8px}
  .marque-btn{padding:14px 10px}

  /* Panier mobile */
  .panier-header{padding:10px 14px}
  .panier-lines{max-height:180px}
  .panier-line{padding:8px 12px}
  .panier-total{padding:10px 14px}
  .pmt-grid{grid-template-columns:repeat(3,1fr);gap:6px}
  .pmt-btn{padding:10px 6px;font-size:11px}

  /* Stocks */
  .stk-grid{grid-template-columns:1fr}
  .stk-art{border-radius:12px;padding:14px}
  .stk-controls{gap:8px}
  .stk-numpad{gap:6px}
  .stk-numpad-btn{height:52px;font-size:18px;border-radius:10px}

  /* Finances */
  .fin-kpis{grid-template-columns:1fr 1fr;gap:8px}
  .fin-kpi{padding:14px 12px;border-radius:12px}
  .fin-kpi__val{font-size:20px}
  .fin-tx-list{gap:8px}
  .fin-tx-row{padding:12px;border-radius:10px;gap:8px}

  /* Mes Données */
  .md-tiles{grid-template-columns:1fr 1fr;gap:10px}
  .md-tile{padding:16px 12px;border-radius:14px}

  /* POS Sections (Produits) */
  .ps-toolbar{flex-wrap:wrap;gap:8px}
  .ps-searchbar{min-width:100%;flex:none}
  .ps-col-head{grid-template-columns:1fr 80px 80px 28px;padding:6px 10px}
  .ps-row{grid-template-columns:1fr 80px 80px 28px;padding:0 10px;min-height:44px}
  .ps-row__stock-val{font-size:14px}
  .ps-row__price-val{font-size:14px}

  /* Rubriques */
  .rub-sheet{padding:20px 16px max(calc(env(safe-area-inset-bottom)+24px),24px)}

  /* Modals / Sheets */
  .modal-overlay{align-items:flex-end}
  .modal-box{border-radius:20px 20px 0 0;max-height:85vh;padding:20px 16px max(calc(env(safe-area-inset-bottom)+16px),16px)}
  .modal-row{grid-template-columns:1fr}

  /* Breadcrumb */
  .breadcrumb__btn{font-size:13px}

  /* Toast */
  .toast-stack{bottom:calc(env(safe-area-inset-bottom) + 72px);right:12px;left:12px}
  .toast{min-width:auto;max-width:100%}

  /* Profitabilité */
  .profita-bar-wrap{padding:14px 16px}
  .profita-detail{gap:10px}
}

@media(max-width:390px){
  .home-tiles{grid-template-columns:1fr 1fr}
  .articles-caisse{grid-template-columns:repeat(2,1fr)}
  .pmt-grid{grid-template-columns:repeat(2,1fr)}
  .fin-kpis{grid-template-columns:1fr}
  .md-tiles{grid-template-columns:1fr 1fr}
}

`;
