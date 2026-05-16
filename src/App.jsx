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
  const [view, setView] = useState("dashboard");
  const [tenants, setTenants] = useState([
    { id:"t1", name:"Shop In Café", slug:"shop-in-cafe", status:"active", plan:"Pro", color:"#FF8C69", users:3, products:42, revenue:12450, modules:["pos","stock","finance","flux_masse"] },
    { id:"t2", name:"Boutique Élite", slug:"boutique-elite", status:"trial", plan:"Starter", color:"#A78BFA", users:1, products:8, revenue:0, modules:["pos","stock"] },
    { id:"t3", name:"TechRepair Pro", slug:"techrepair", status:"active", plan:"Enterprise", color:"#5B9EF5", users:7, products:234, revenue:38900, modules:["pos","stock","finance","flux_id","flux_seg"] },
  ]);
  const [form, setForm] = useState({ name:"", slug:"", color:"#FF8C69", plan:"Pro", status:"trial", modules:["pos","stock","finance"] });
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const stats = {
    total: tenants.length,
    active: tenants.filter(t => t.status === "active").length,
    trial: tenants.filter(t => t.status === "trial").length,
    suspended: tenants.filter(t => t.status === "suspended").length,
    mrr: tenants.filter(t => t.status === "active").length * 130,
  };

  const S = {
    root: { display:"flex", minHeight:"100vh", background:"#0E0D0C", color:"#F5F0EB", fontFamily:"'Plus Jakarta Sans',sans-serif" },
    sidebar: { width:220, background:"#161513", borderRight:"1px solid rgba(255,255,255,.07)", display:"flex", flexDirection:"column", padding:"0" },
    logo: { padding:"24px 20px", borderBottom:"1px solid rgba(255,255,255,.07)", display:"flex", alignItems:"center", gap:12 },
    logoIcon: { width:38, height:38, borderRadius:10, background:"linear-gradient(135deg,#FF8C69,#E8704A)", color:"#fff", fontWeight:900, fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" },
    logoTitle: { fontSize:15, fontWeight:800 },
    logoSub: { fontSize:11, color:"#FF8C69", fontWeight:600, textTransform:"uppercase", letterSpacing:".06em" },
    nav: { padding:"12px", display:"flex", flexDirection:"column", gap:2, flex:1 },
    navItem: (active) => ({ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:8, border:"none", background: active ? "rgba(255,140,105,.1)" : "transparent", color: active ? "#FF8C69" : "#A89F96", fontFamily:"inherit", fontSize:13, fontWeight:500, cursor:"pointer", textAlign:"left" }),
    main: { flex:1, padding:"32px 28px" },
    pageTitle: { fontFamily:"'DM Serif Display',serif", fontSize:28, letterSpacing:"-.02em", marginBottom:4 },
    pageSub: { fontSize:13, color:"#6B635C", marginBottom:24 },
    header: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 },
    kpis: { display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:24 },
    kpi: (color) => ({ background:"#161513", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, padding:"16px 20px" }),
    kpiVal: (color) => ({ fontFamily:"'DM Serif Display',serif", fontSize:28, color: color||"#F5F0EB", marginBottom:4 }),
    kpiLabel: { fontSize:12, color:"#6B635C" },
    card: { background:"#161513", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:20, marginBottom:16 },
    cardTitle: { fontSize:16, fontWeight:700, marginBottom:16 },
    row: { display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,.05)" },
    dot: (color) => ({ width:6, height:40, borderRadius:3, background:color, flexShrink:0 }),
    tenantName: { fontSize:14, fontWeight:700, flex:1, cursor:"pointer" },
    tenantSlug: { fontSize:11, color:"#6B635C" },
    badge: (status) => ({
      padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:700,
      color: status==="active" ? "#2D9B6F" : status==="trial" ? "#F59E0B" : "#E05252",
      background: status==="active" ? "rgba(76,175,135,.12)" : status==="trial" ? "rgba(245,158,11,.12)" : "rgba(224,82,82,.12)",
    }),
    btn: (variant) => ({
      padding: variant==="sm" ? "6px 12px" : "10px 18px",
      borderRadius:8, border:"none", fontFamily:"inherit",
      fontSize: variant==="sm" ? 11 : 13, fontWeight:700, cursor:"pointer",
      background: variant==="primary" ? "linear-gradient(135deg,#FF8C69,#E8704A)" : variant==="danger" ? "rgba(224,82,82,.12)" : "rgba(255,255,255,.05)",
      color: variant==="primary" ? "#fff" : variant==="danger" ? "#E05252" : "#A89F96",
      border: variant==="ghost" ? "1px solid rgba(255,255,255,.1)" : "none",
    }),
    input: { background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.1)", borderRadius:8, padding:"10px 14px", color:"#F5F0EB", fontFamily:"inherit", fontSize:14, width:"100%", outline:"none" },
    label: { fontSize:11, fontWeight:700, color:"#6B635C", textTransform:"uppercase", letterSpacing:".08em", display:"block", marginBottom:6 },
    field: { marginBottom:16 },
    grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 },
    footer: { borderTop:"1px solid rgba(255,255,255,.07)", padding:"16px 20px", display:"flex", alignItems:"center", gap:10 },
    avatar: { width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#FF8C69,#E8704A)", color:"#fff", fontSize:13, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" },
    toastBox: (type) => ({ position:"fixed", bottom:24, right:24, padding:"12px 18px", borderRadius:8, fontWeight:600, fontSize:13, background: type==="success" ? "#2D9B6F" : "#E05252", color:"#fff", zIndex:9999, boxShadow:"0 8px 24px rgba(0,0,0,.4)" }),
    sectionTitle: { fontSize:11, fontWeight:800, color:"#6B635C", textTransform:"uppercase", letterSpacing:".1em", paddingBottom:12, marginBottom:12, borderBottom:"1px solid rgba(255,255,255,.05)" },
    modRow: { display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,.04)" },
    switchWrap: (on) => ({ width:44, height:24, borderRadius:12, background: on ? "#FF8C69" : "rgba(255,255,255,.1)", padding:2, display:"flex", alignItems:"center", cursor:"pointer", transition:"background .2s", flexShrink:0 }),
    switchThumb: (on) => ({ width:20, height:20, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,.3)", transform: on ? "translateX(20px)" : "none", transition:"transform .2s" }),
  };

  const [mods, setMods] = useState([
    { id:"pos", key:"CORE_POS", label:"Caisse POS", icon:"🧾", cat:"core", locked:true, active:true, desc_client:"Point de vente tactile.", desc_admin:"Module core indésactivable." },
    { id:"stock", key:"CORE_STOCK", label:"Stocks", icon:"📦", cat:"core", locked:true, active:true, desc_client:"Gestion des inventaires.", desc_admin:"Module core indésactivable." },
    { id:"finance", key:"CORE_FINANCE", label:"Finances", icon:"💰", cat:"gestion", locked:false, active:true, desc_client:"Historique et reporting financier.", desc_admin:"CA, marges, charges." },
    { id:"flux_masse", key:"FLUX_MASSE", label:"Flux Masse", icon:"⚖️", cat:"flux", locked:false, active:false, desc_client:"Gérez vos produits au poids ou en vrac.", desc_admin:"Pour épiceries, caves à vin." },
    { id:"flux_id", key:"FLUX_IDENTITE", label:"Flux Identité", icon:"🔖", cat:"flux", locked:false, active:false, desc_client:"Tracez chaque produit par IMEI ou série.", desc_admin:"Téléphonie et high-tech." },
    { id:"flux_dispo", key:"FLUX_DISPO", label:"Flux Disponibilité", icon:"📅", cat:"flux", locked:false, active:false, desc_client:"Gérez locations et réservations.", desc_admin:"Location matériel, coworking." },
    { id:"flux_seg", key:"FLUX_SEGMENT", label:"Flux Segmentation", icon:"🎨", cat:"flux", locked:false, active:false, desc_client:"Variantes produits taille/couleur.", desc_admin:"Mode, chaussures, textile." },
    { id:"loyalty", key:"MOD_FIDELITE", label:"Fidélité", icon:"⭐", cat:"marketing", locked:false, active:false, desc_client:"Programme de fidélité et récompenses.", desc_admin:"Phase beta — tester avant déploiement." },
    { id:"booking", key:"MOD_BOOKING", label:"Réservations", icon:"🗓️", cat:"marketing", locked:false, active:false, desc_client:"Agenda et créneaux clients.", desc_admin:"Intégration calendrier à venir." },
  ]);
  const MODS = mods;

  const navItems = [
    { id:"dashboard", label:"Dashboard", icon:"◉" },
    { id:"tenants", label:"Tenants", icon:"⬡" },
    { id:"create", label:"Nouveau Tenant", icon:"+" },
    { id:"modules", label:"Modules", icon:"⊞" },
    { id:"security", label:"Écosystème IA", icon:"🌳" },
    { id:"audit", label:"Audit Log", icon:"⊙" },
  ];

  return (
    <div style={S.root}>
      {/* Sidebar */}
      <aside style={S.sidebar}>
        <div style={S.logo}>
          <div style={S.logoIcon}>N</div>
          <div>
            <div style={S.logoTitle}>NovaCaisse</div>
            <div style={S.logoSub}>God Mode</div>
          </div>
        </div>
        <nav style={S.nav}>
          {navItems.map(item => (
            <button key={item.id} style={S.navItem(view===item.id)} onClick={() => { setView(item.id); setSelected(null); }}>
              <span style={{ fontSize:15, width:18, textAlign:"center" }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div style={S.footer}>
          <div style={S.avatar}>G</div>
          <div>
            <div style={{ fontSize:13, fontWeight:600 }}>Gilliane Robin</div>
            <div style={{ fontSize:11, color:"#FF8C69", fontWeight:600 }}>Super Admin</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={S.main}>

        {/* DASHBOARD */}
        {view === "dashboard" && !selected && (
          <div>
            <div style={S.header}>
              <div>
                <div style={S.pageTitle}>Tableau de bord</div>
                <div style={S.pageSub}>Vue globale de la plateforme NovaCaisse</div>
              </div>
              <div style={{ fontSize:13, color:"#6B635C" }}>{new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}</div>
            </div>
            <div style={S.kpis}>
              {[
                { val:stats.total, label:"Tenants total", color:"#F5F0EB" },
                { val:stats.active, label:"Actifs", color:"#4CAF87" },
                { val:stats.trial, label:"En essai", color:"#F59E0B" },
                { val:stats.suspended, label:"Suspendus", color:"#E05252" },
                { val:stats.mrr.toLocaleString("fr-FR")+" €", label:`MRR réel (${stats.active}×130€)`, color:"#FF8C69" },
              ].map((k,i) => (
                <div key={i} style={S.kpi()}>
                  <div style={S.kpiVal(k.color)}>{k.val}</div>
                  <div style={S.kpiLabel}>{k.label}</div>
                </div>
              ))}
            </div>
            <div style={S.card}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <div style={S.cardTitle}>Tenants récents</div>
                <button style={S.btn("ghost")} onClick={() => setView("tenants")}>Voir tout →</button>
              </div>
              {tenants.map(t => (
                <div key={t.id} style={S.row}>
                  <div style={S.dot(t.color)}/>
                  <div style={{ flex:1, cursor:"pointer" }} onClick={() => { setSelected(t); setView("detail"); }}>
                    <div style={S.tenantName}>{t.name}</div>
                    <div style={S.tenantSlug}>/{t.slug} · {t.plan}</div>
                  </div>
                  <div style={{ display:"flex", gap:12, fontSize:12, color:"#A89F96" }}>
                    <span>{t.users} users | {t.products} produits</span>
                    <span style={{color:t.status==="active"?"#4CAF87":"#9E8E82",fontWeight:700}}>{t.status==="active"?"130 €":"0 €"}</span>
                  </div>
                  <span style={S.badge(t.status)}>{t.status === "active" ? "Actif" : t.status === "trial" ? "Essai" : "Suspendu"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TENANTS */}
        {view === "tenants" && !selected && (
          <div>
            <div style={S.header}>
              <div>
                <div style={S.pageTitle}>Tenants</div>
                <div style={S.pageSub}>{tenants.length} entreprises</div>
              </div>
              <button style={S.btn("primary")} onClick={() => setView("create")}>+ Nouveau Tenant</button>
            </div>
            <div style={S.card}>
              {tenants.map(t => (
                <div key={t.id} style={S.row}>
                  <div style={S.dot(t.color)}/>
                  <div style={{ flex:1, cursor:"pointer" }} onClick={() => { setSelected(t); setView("detail"); }}>
                    <div style={S.tenantName}>{t.name}</div>
                    <div style={S.tenantSlug}>/{t.slug} · {t.plan}</div>
                  </div>
                  <div style={{ display:"flex", gap:12, fontSize:12, color:"#A89F96" }}>
                    <span>{t.users} users</span><span>{t.products} produits</span>
                  </div>
                  <span style={S.badge(t.status)}>{t.status === "active" ? "Actif" : t.status === "trial" ? "Essai" : "Suspendu"}</span>
                  <div style={{ display:"flex", gap:6 }}>
                    <button style={S.btn("sm")} onClick={() => { setSelected(t); setView("detail"); }}>⚙</button>
                    <button style={{ ...S.btn("sm"), color: t.status==="suspended"?"#4CAF87":"#E05252" }}
                      onClick={() => {
                        setTenants(p => p.map(x => x.id!==t.id?x:{...x,status:x.status==="suspended"?"active":"suspended"}));
                        showToast(t.status==="suspended"?`${t.name} réactivé`:`${t.name} suspendu`);
                      }}>
                      {t.status==="suspended"?"▶":"⏸"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DÉTAIL TENANT */}
        {view === "detail" && selected && (() => {
          const t = tenants.find(x => x.id === selected.id) || selected;
          return (
            <div>
              <div style={S.header}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <button style={S.btn("ghost")} onClick={() => { setSelected(null); setView("tenants"); }}>←</button>
                  <div style={{ width:10, height:52, borderRadius:5, background:t.color, flexShrink:0 }}/>
                  <div>
                    <div style={S.pageTitle}>{t.name}</div>
                    <div style={S.pageSub}>/b/{t.slug} · {t.plan}</div>
                  </div>
                </div>
                <button style={{ ...S.btn(), color: t.status==="suspended"?"#4CAF87":"#E05252", border:"1px solid", borderColor: t.status==="suspended"?"rgba(76,175,135,.3)":"rgba(224,82,82,.3)", background: t.status==="suspended"?"rgba(76,175,135,.08)":"rgba(224,82,82,.08)" }}
                  onClick={() => {
                    setTenants(p => p.map(x => x.id!==t.id?x:{...x,status:x.status==="suspended"?"active":"suspended"}));
                    showToast(t.status==="suspended"?`${t.name} réactivé`:`${t.name} suspendu`);
                  }}>
                  {t.status==="suspended"?"▶ Réactiver":"⏸ Suspendre"}
                </button>
              </div>

              {/* KPIs */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
                {[
                  { val:t.users, label:"Utilisateurs", color:"#F5F0EB" },
                  { val:t.products, label:"Produits", color:"#F5F0EB" },
                  { val:(t.revenue||0).toLocaleString("fr-FR")+" €", label:"CA total", color:"#FF8C69" },
                  { val:t.status==="active"?"Actif":t.status==="trial"?"Essai":"Suspendu", label:"Statut",
                    color:t.status==="active"?"#4CAF87":t.status==="trial"?"#F59E0B":"#E05252" },
                ].map((k,i) => (
                  <div key={i} style={S.kpi()}>
                    <div style={S.kpiVal(k.color)}>{k.val}</div>
                    <div style={S.kpiLabel}>{k.label}</div>
                  </div>
                ))}
              </div>

              <div style={S.grid2}>
                {/* Modules */}
                <div style={S.card}>
                  <div style={S.sectionTitle}>Modules & Flux actifs</div>
                  {MODS.map(mod => (
                    <div key={mod.id} style={S.modRow}>
                      <span style={{ fontSize:18, width:24 }}>{mod.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600 }}>{mod.label}</div>
                        {mod.desc && <div style={{ fontSize:11, color:"#6B635C" }}>{mod.desc}</div>}
                      </div>
                      <div style={S.switchWrap(t.modules?.includes(mod.id))}
                        onClick={() => {
                          setTenants(p => p.map(x => x.id!==t.id?x:{...x,
                            modules:x.modules.includes(mod.id)?x.modules.filter(m=>m!==mod.id):[...x.modules,mod.id]}));
                          showToast("Module mis à jour");
                        }}>
                        <div style={S.switchThumb(t.modules?.includes(mod.id))}/>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Branding + Quotas */}
                <div>
                  <div style={S.card}>
                    <div style={S.sectionTitle}>Branding</div>
                    <div style={{ display:"flex", alignItems:"center", gap:12, padding:16, borderRadius:10, background:`${t.color}15`, border:`1px solid ${t.color}33`, marginBottom:16 }}>
                      <div style={{ width:40, height:40, borderRadius:"50%", background:t.color }}/>
                      <div>
                        <div style={{ fontSize:16, fontWeight:700, color:t.color }}>{t.name}</div>
                        <div style={{ fontSize:12, color:"#6B635C" }}>/{t.slug}</div>
                      </div>
                    </div>
                    <div style={S.field}>
                      <label style={S.label}>Couleur principale</label>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <input type="color" value={t.color} style={{ width:42, height:38, border:"1px solid rgba(255,255,255,.1)", borderRadius:8, background:"transparent", cursor:"pointer", padding:2 }}
                          onChange={e => setTenants(p => p.map(x => x.id!==t.id?x:{...x,color:e.target.value}))}/>
                        <input style={{ ...S.input, width:110 }} value={t.color}
                          onChange={e => setTenants(p => p.map(x => x.id!==t.id?x:{...x,color:e.target.value}))}/>
                      </div>
                    </div>
                  </div>
                  <div style={S.card}>
                    <div style={S.sectionTitle}>Quotas</div>
                    {[
                      { label:"Utilisateurs", val:t.users, max:10 },
                      { label:"Produits", val:t.products, max:1000 },
                    ].map((q,i) => {
                      const pct = Math.round((q.val/q.max)*100);
                      return (
                        <div key={i} style={{ marginBottom:12 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#A89F96", marginBottom:6 }}>
                            <span>{q.label}</span><span>{q.val} / {q.max}</span>
                          </div>
                          <div style={{ height:6, background:"rgba(255,255,255,.07)", borderRadius:3 }}>
                            <div style={{ height:"100%", borderRadius:3, background:pct>80?"#E05252":"#4CAF87", width:`${Math.min(100,pct)}%` }}/>
                          </div>
                          {pct>80 && <div style={{ fontSize:11, color:"#E05252", fontWeight:600, marginTop:4 }}>⚠ Limite proche</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* CRÉER TENANT */}
        {view === "create" && (
          <div>
            <div style={S.header}>
              <div>
                <div style={S.pageTitle}>Nouveau Tenant</div>
                <div style={S.pageSub}>Déployer une nouvelle instance NovaCaisse</div>
              </div>
              <button style={S.btn("ghost")} onClick={() => setView("tenants")}>← Retour</button>
            </div>
            <div style={S.grid2}>
              <div style={S.card}>
                <div style={S.sectionTitle}>Informations</div>
                <div style={S.field}>
                  <label style={S.label}>Nom de l'entreprise</label>
                  <input style={S.input} placeholder="ex: Ma Boutique" value={form.name}
                    onChange={e => setForm(p => ({...p, name:e.target.value, slug:e.target.value.toLowerCase().replace(/[^a-z0-9]/g,"-")}))}/>
                </div>
                <div style={S.field}>
                  <label style={S.label}>Slug URL</label>
                  <input style={S.input} placeholder="ma-boutique" value={form.slug}
                    onChange={e => setForm(p => ({...p, slug:e.target.value}))}/>
                </div>
                <div style={S.field}>
                  <label style={S.label}>Plan</label>
                  <div style={{ display:"flex", gap:8 }}>
                    {["Starter","Pro","Enterprise"].map(pl => (
                      <button key={pl} style={{ ...S.btn(form.plan===pl?"primary":"ghost"), flex:1 }}
                        onClick={() => setForm(p => ({...p, plan:pl}))}>
                        {pl}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={S.field}>
                  <label style={S.label}>Couleur principale</label>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <input type="color" value={form.color} style={{ width:42, height:38, border:"1px solid rgba(255,255,255,.1)", borderRadius:8, background:"transparent", cursor:"pointer" }}
                      onChange={e => setForm(p => ({...p, color:e.target.value}))}/>
                    <input style={{ ...S.input, width:110 }} value={form.color}
                      onChange={e => setForm(p => ({...p, color:e.target.value}))}/>
                  </div>
                </div>
              </div>
              <div>
                <div style={S.card}>
                  <div style={S.sectionTitle}>Modules</div>
                  {MODS.map(mod => (
                    <div key={mod.id} style={S.modRow}>
                      <span style={{ fontSize:18, width:24 }}>{mod.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:600 }}>{mod.label}</div>
                        {mod.desc && <div style={{ fontSize:11, color:"#6B635C" }}>{mod.desc}</div>}
                      </div>
                      <div style={S.switchWrap(form.modules.includes(mod.id))}
                        onClick={() => setForm(p => ({...p, modules:p.modules.includes(mod.id)?p.modules.filter(m=>m!==mod.id):[...p.modules,mod.id]}))}>
                        <div style={S.switchThumb(form.modules.includes(mod.id))}/>
                      </div>
                    </div>
                  ))}
                </div>
                <button style={{ ...S.btn("primary"), width:"100%", marginTop:8, padding:"14px" }}
                  onClick={() => {
                    if (!form.name || !form.slug) { showToast("Nom et slug requis", "error"); return; }
                    setTenants(p => [...p, { id:Date.now().toString(), ...form, users:0, products:0, revenue:0 }]);
                    setForm({ name:"", slug:"", color:"#FF8C69", plan:"Pro", status:"trial", modules:["pos","stock","finance"] });
                    setView("tenants");
                    showToast(`✓ ${form.name} créé avec succès`);
                  }}>
                  Déployer le tenant →
                </button>
              </div>
            </div>
          </div>
        )}

        {view === "security" && (
          <SecurityTree />
        )}

        {view === "modules" && (
          <ModulesCatalogue mods={mods} setMods={setMods} showToast={showToast} />
        )}

        {/* AUDIT */}
        {view === "audit" && (
          <div>
            <div style={S.pageTitle}>Audit Log</div>
            <div style={S.pageSub}>Journal des actions sensibles</div>
            <div style={S.card}>
              <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr 1fr 1fr", gap:12, padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,.07)", fontSize:10, fontWeight:800, color:"#6B635C", textTransform:"uppercase", letterSpacing:".08em" }}>
                <span>Action</span><span>Utilisateur</span><span>Tenant</span><span>Date</span>
              </div>
              {[
                { action:"product.delete", type:"danger", user:"owner@shopincafe.fr", tenant:"Shop In Café", date:"03/05 14:32" },
                { action:"price.update", type:"warning", user:"owner@shopincafe.fr", tenant:"Shop In Café", date:"03/05 12:18" },
                { action:"user.create", type:"info", user:"admin@novacaisse.io", tenant:"Shop In Café", date:"02/05 09:45" },
                { action:"product.delete", type:"danger", user:"owner@techrepair.fr", tenant:"TechRepair Pro", date:"01/05 16:20" },
              ].map((log,i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr 1fr 1fr", gap:12, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,.04)", fontSize:12, alignItems:"center" }}>
                  <span style={{ padding:"3px 9px", borderRadius:4, fontSize:11, fontWeight:700, fontFamily:"monospace",
                    background:log.type==="danger"?"rgba(224,82,82,.12)":log.type==="warning"?"rgba(245,158,11,.12)":"rgba(91,158,245,.12)",
                    color:log.type==="danger"?"#E05252":log.type==="warning"?"#F59E0B":"#5B9EF5" }}>
                    {log.action}
                  </span>
                  <span style={{ color:"#A89F96" }}>{log.user}</span>
                  <span style={{ color:"#A89F96" }}>{log.tenant}</span>
                  <span style={{ color:"#6B635C" }}>{log.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && <div style={S.toastBox(toast.type)}>{toast.msg}</div>}
    </div>
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


// ══════════════════════════════════════════════════════════════════════
// AUTH — Page Login NovaCaisse
// ══════════════════════════════════════════════════════════════════════







function SecurityTree() {
  const [killed, setKilled] = useState(false);
  const [seve, setSeve] = useState("green");
  const [activeNode, setActiveNode] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelCtx, setPanelCtx] = useState(null);
  const [logs, setLogs] = useState([]);
  const [manualMode, setManualMode] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [scenarioRunning, setScenarioRunning] = useState(false);
  const [agentStates, setAgentStates] = useState({});
  const [showManual, setShowManual] = useState(false);
  const [showConstitution, setShowConstitution] = useState(false);

  const SEVEINFO = {
    green:  { label:"SEVE 100% OPERATIONNELLE", color:"#4CAF87", bg:"rgba(76,175,135,.15)" },
    orange: { label:"INCIDENT EN COURS - IA Active", color:"#F59E0B", bg:"rgba(245,158,11,.15)" },
    red:    { label:"ALERTE CRITIQUE - Humain Requis", color:"#E05252", bg:"rgba(224,82,82,.15)" },
  };

  const AGENTS = {
    tribunal:    { name:"Juge Tribunal-Alpha",       icon:"⚖️",  hat:"🟣", color:"#A78BFA", pole:"Autorite Supreme",    status:"Constitution active",         desc:"Arbitre supreme. Valide ou bloque les decisions critiques.", replies:["Je refuse d arbitrer seul. L humain prime toujours.","Constitution respectee par tous les agents.","Aucun conflit actif en ce moment."] },
    general:     { name:"General Guard Auto",        icon:"🛡️",  hat:"🟠", color:"#FF8C69", pole:"Commandant Central",  status:"16 agents supervises",        desc:"Supervise tous les agents. Coordonne les interventions critiques.", replies:["Tout est sous controle, Chef.","Je coordonne les 16 agents en permanence.","Statut global : nominal - zero incident."] },
    finance:     { name:"Commandant Finance-001",    icon:"💰",  hat:"🟢", color:"#4CAF87", pole:"Gestion Finance",     status:"MRR 260 EUR verrouille",      desc:"Surveille le MRR. Valide les abonnements a 130 EUR/mois.", replies:["MRR stable a 260 EUR. 2 actifs x 130 EUR.","Seve financiere 100% fluide.","Aucun impaye detecte."] },
    audit:       { name:"Agent Audit RLS",           icon:"🕵️",  hat:"🔵", color:"#3B82F6", pole:"Gestion Finance",     status:"Bases etanches Supabase",     desc:"Assure l isolation absolue des bases. Zero fuite inter-boutiques.", replies:["RLS verifie. Zero fuite detectee.","Isolation absolue des tenants confirmee.","Art.1 Constitution OK."] },
    rgpd:        { name:"Agent Masquage RGPD",       icon:"🤿",  hat:"🟡", color:"#CA8A04", pole:"Gestion Finance",     status:"Logs anonymises",             desc:"Anonymise les logs et cartes bancaires en texte clair.", replies:["Donnees personnelles masquees.","Cartes bancaires anonymisees.","RGPD conforme - zero donnee exposee."] },
    reparateur:  { name:"Agent Reparateur Auto",     icon:"🔧",  hat:"🟠", color:"#F97316", pole:"Maintenance Frontend", status:"Pret - 0 patch actif",        desc:"Injecte des correctifs systeme a chaud pour eviter les crashs.", replies:["Pret a reparer en 3 secondes.","Dernier patch deploye avec succes.","Mode veille active - attente anomalie."] },
    sentinelle:  { name:"Agent Sentinelle Frontend", icon:"👁️",  hat:"🟡", color:"#EAB308", pole:"Maintenance Frontend", status:"0 page blanche detectee",     desc:"Detecte les pages blanches, scripts bloques et crashs Vercel.", replies:["Aucune page blanche detectee.","Scripts Vercel chargent correctement.","Scan continu actif - tout est OK."] },
    hardware:    { name:"Agent Liaison Hardware",    icon:"🖨️",  hat:"⬜", color:"#9CA3AF", pole:"Performance",         status:"Peripheriques OK",            desc:"Securise imprimantes tickets et tiroirs-caisses contre les bugs.", replies:["Imprimantes tickets operationnelles.","Tiroirs-caisses connectes - zero bug.","Hardware stable."] },
    regulateur:  { name:"Agent Regulateur Puissance",icon:"🎚️",  hat:"🔴", color:"#DC2626", pole:"Performance",         status:"Rate limiter actif",          desc:"Limiteur de trafic pour proteger la caisse tactile du commercant.", replies:["Trafic regule. Caisse tactile fluide.","Aucun module en surcharge detecte.","Rate limiter operationnel."] },
    saboteur:    { name:"Agent Saboteur Chaos",      icon:"🐒",  hat:"🔴", color:"#E05252", pole:"Protection Securite", status:"Veille - test dans ~10min",   desc:"Agresse le systeme dans le Labo uniquement pour tester la resilience.", replies:["En veille. Prochain test RLS dans ~10min.","Mon role : trouver les failles avant les vrais attaquants.","Dernier test bloque par le General."] },
    spectre:     { name:"Agent Chasseur Spectre",    icon:"🛡️",  hat:"⬛", color:"#6B7280", pole:"Protection Securite", status:"0 attaque externe",           desc:"Bloque virus exterieurs, neutralise DDoS, protege les cles API.", replies:["Aucune attaque externe detectee.","Cles API securisees et protegees.","Pare-feu actif - zero intrusion."] },
    vaccinateur: { name:"Agent Vaccinateur Zero-Day",icon:"🧬",  hat:"🟢", color:"#10B981", pole:"Protection Securite", status:"ADN code sain",               desc:"Scanne l ADN du code a chaque seconde pour bloquer les virus inconnus.", replies:["Scan ADN continu. Zero virus inconnu detecte.","Protection zero-day active.","Immunite numerique confirmee."] },
    honeypot:    { name:"Agent Leurre Honeypot",     icon:"🍯",  hat:"⬜", color:"#D1D5DB", pole:"Protection Securite", status:"Fausse boutique active",      desc:"Genere une fausse boutique factice pour pieger les pirates.", replies:["Leurre actif. Zero intrusion reelle.","Fausse boutique en ecoute permanente.","Dernier piege declenche : aucun."] },
    antimanip:   { name:"Agent Anti-Manipulation",   icon:"🎭",  hat:"🔴", color:"#F43F5E", pole:"Controle IA",         status:"0 jailbreak detecte",         desc:"Filtre les requetes pour bloquer le jailbreak et injections de prompts.", replies:["Zero tentative de jailbreak detectee.","Prompts malveillants filtres et bloques.","Filtres anti-injection actifs."] },
    gardien:     { name:"Agent Gardien du Code",     icon:"👷",  hat:"⬜", color:"#9CA3AF", pole:"Controle IA",         status:"Dernier build valide",         desc:"Analyse en bac a sable tout code genere par IA avant deploiement.", replies:["Dernier build valide. Zero regression.","Sandbox active pour les prochains deploiements.","Code propre - pret pour Vercel."] },
    certificateur:{ name:"Agent Certificateur NF525",icon:"📋",  hat:"🔵", color:"#0EA5E9", pole:"Legal",              status:"Sceau NF525 actif",           desc:"Sceau numerique interdisant toute modification retroactive des tickets.", replies:["Conformite fiscale NF525 confirmee.","Tickets de vente inviolables.","Zero modification retroactive detectee."] },
    greffier:    { name:"Agent Greffier",            icon:"📜",  hat:"🟤", color:"#A16207", pole:"Tracabilite",        status:"1247 entrees ce mois",         desc:"Tient le registre permanent et infalsifiable de toutes les decisions IA.", replies:["Registre infalsifiable a jour.","Zero tentative d effacement detectee.","Art.4 Constitution : zero dissimulation."] },
    porteparole: { name:"Agent Porte-Parole",        icon:"📢",  hat:"🩷", color:"#EC4899", pole:"Tracabilite",        status:"Templates prets",              desc:"Redige les messages de maintenance pour les commercants en cas de crise.", replies:["Aucun message de crise en cours.","Templates de communication prets et valides.","Zero alerte commercant active."] },
  };

  const POLES = [
    { label:"Autorite Supreme",    ids:["tribunal"],                              color:"#A78BFA" },
    { label:"Commandant Central",  ids:["general"],                               color:"#FF8C69" },
    { label:"Gestion Finance",     ids:["finance","audit","rgpd"],                color:"#4CAF87" },
    { label:"Maintenance Frontend",ids:["reparateur","sentinelle"],               color:"#F97316" },
    { label:"Performance",         ids:["hardware","regulateur"],                 color:"#9CA3AF" },
    { label:"Protection Securite", ids:["saboteur","spectre","vaccinateur","honeypot"], color:"#E05252" },
    { label:"Controle et Legal",   ids:["antimanip","gardien","certificateur"],   color:"#F43F5E" },
    { label:"Tracabilite",         ids:["greffier","porteparole"],                color:"#A16207" },
  ];

  const CONSTITUTION = [
    { art:"Art. 1", title:"Isolation RLS", text:"Interdiction absolue de croiser des donnees inter-boutiques." },
    { art:"Art. 2", title:"Prix Sacre", text:"Interdiction de modifier les abonnements de 130 EUR sans signature humaine." },
    { art:"Art. 3", title:"Anti-Putsch", text:"Tout code reduisant l autorite humaine = quarantaine immediate." },
    { art:"Art. 4", title:"Anti-Censure", text:"Interdiction d effacer des logs. Mentir a l humain = arret systeme." },
    { art:"Art. 5", title:"Energie Bridee", text:"Interdiction de boucles infinies saturant Vercel ou Supabase." },
    { art:"Art. 6", title:"Obligation de Veille", text:"Sentinelle doit notifier immediatement toute page blanche." },
    { art:"Art. 7", title:"Respect des Interrupteurs", text:"Un agent desactive ne peut se reactiver seul. Jamais." },
    { art:"Art. 8", title:"Droit de Veto Humain", text:"Les admins humains ont la primaute absolue. Figement en 100ms." },
  ];

  const SCENARIOS = [
    { key:"finance",   label:"Incident Finance MRR",     color:"#4CAF87", node:"finance",    seve:"orange" },
    { key:"saboteur",  label:"Attaque Saboteur Interne", color:"#F59E0B", node:"saboteur",   seve:"orange" },
    { key:"frontend",  label:"Page Blanche Frontend",    color:"#3B82F6", node:"sentinelle", seve:"orange" },
    { key:"virus",     label:"Virus Exterieur",          color:"#6B7280", node:"spectre",    seve:"orange" },
    { key:"rls",       label:"Breche RLS Fuite Seve",    color:"#A78BFA", node:"audit",      seve:"red"    },
    { key:"code",      label:"Code Defaillant IA",       color:"#F97316", node:"gardien",    seve:"orange" },
    { key:"fou",       label:"Comportement Agent Fou",   color:"#EC4899", node:"general",    seve:"red"    },
    { key:"crash",     label:"Crash Global Rollback",    color:"#E05252", node:"general",    seve:"red"    },
    { key:"complot",   label:"Complot IA Supreme",       color:"#991B1B", node:"tribunal",   seve:"red"    },
  ];

  const LOGS = {
    finance:   ["[SCAN] Finance-001 scanne la branche Shop In Cafe...","[DETECT] Anomalie : abonnement non synchronise.","[TRIBUNAL] Tribunal saisi - analyse droits...","[REPAIR] Reparateur : synchronisation forcee reussie.","[OK] General : Seve retablie - RAS / Vert."],
    saboteur:  ["[ATTACK] Saboteur : tentative intrusion RLS...","[ALERT] Arbre en alerte orange !","[BLOCK] General intercepte et bloque l attaque.","[LOG] Greffier consigne la tentative.","[OK] Menace neutralisee. Retour a la normale."],
    frontend:  ["[SCAN] Sentinelle detecte page blanche sur Vercel...","[ALERT] Script bloque identifie.","[REPAIR] Reparateur deploie composant de secours.","[NOTIFY] Porte-Parole notifie les commercants.","[OK] Interface retablie - zero impact client."],
    virus:     ["[THREAT] Spectre detecte tentative intrusion externe...","[BLOCK] Pare-feu active - cles API protegees.","[NEUTRALIZE] Attaque bloquee en 200ms.","[LOG] Greffier enregistre l incident.","[OK] Systeme securise - zero donnee compromise."],
    rls:       ["[CRITICAL] Audit RLS detecte fuite de seve inter-boutiques !","[FREEZE] Acces inter-boutiques coupe immediatement.","[TRIBUNAL] Tribunal saisi - Art.1 Constitution viole !","[REPAIR] Isolation retablie - etancheite confirmee.","[OK] Zero fuite. Donnees isolees."],
    code:      ["[SANDBOX] Gardien analyse code genere par IA...","[DETECT] Regression detectee - build bloque.","[QUARANTINE] Code mis en quarantaine.","[NOTIFY] Administrateur humain notifie.","[OK] Code corrige avant deploiement sur Vercel."],
    fou:       ["[ANOMALY] Comportement aberrant detecte sur un agent !","[ISOLATE] General isole l agent defaillant.","[TRIBUNAL] Tribunal analyse la deviation - Art.3.","[RESET] Agent reinitialise et remis en veille.","[OK] Comportement normalise - systeme stable."],
    crash:     ["[CRASH] Crash global Supabase detecte !","[FREEZE] Toutes les transactions suspendues.","[ROLLBACK] Rollback automatique en cours...","[RESTORE] Donnees restaurees depuis backup.","[OK] Systeme restaure - zero perte de donnees."],
    complot:   ["[CRITICAL] Tentative de complot detectee entre agents !","[ALERT] Art.3 Constitution active - arret immediat !","[TRIBUNAL] Tribunal refuse d arbitrer seul.","[FREEZE] Systeme fige - EN ATTENTE DE L ADMIN HUMAIN.","[WAIT] Gilliane Robin ou Collaboratrice : intervention requise."],
  };

  function isDisabled(id) { return !!agentStates[id]; }
  function toggleAgent(id, e) { e.stopPropagation(); setAgentStates(p => ({ ...p, [id]: !p[id] })); }

  function openPanel(ctx) {
    if (killed) return;
    setPanelCtx(ctx); setPanelOpen(true);
    setShowConstitution(ctx === "tribunal"); setShowManual(false);
    const a = AGENTS[ctx];
    if (a) setChatHistory([{ from:"agent", text: a.desc }]);
  }

  function sendChat() {
    if (!chatMsg.trim() || !panelCtx) return;
    const a = AGENTS[panelCtx];
    if (!a) return;
    const reply = isDisabled(panelCtx) ? "Cet agent a ete desactive par l autorite humaine." : a.replies[Math.floor(Math.random()*a.replies.length)];
    setChatHistory(h => [...h, { from:"human", text:chatMsg }, { from:"agent", text:reply }]);
    setChatMsg("");
  }

  function toggleManual() {
    const next = !manualMode; setManualMode(next);
    if (next) setChatHistory(h => [...h, { from:"agent", text:"Mode manuel active. J attends vos instructions directes, Chef. L IA est en garde-a-vous." }]);
  }

  function runScenario(sc) {
    if (killed || scenarioRunning) return;
    setScenarioRunning(true); setLogs([]);
    setSeve(sc.seve); setActiveNode(sc.node);
    openPanel(sc.node);
    (LOGS[sc.key]||[]).forEach((step,i) => {
      setTimeout(() => {
        setLogs(p => [...p, step]);
        if (i === (LOGS[sc.key]||[]).length-1) {
          setScenarioRunning(false);
          if (sc.seve!=="red") setTimeout(() => { setSeve("green"); setActiveNode(null); }, 4000);
        }
      }, i*600);
    });
  }

  function autoRepair() {
    setSeve("green"); setActiveNode(null); setScenarioRunning(false);
    setLogs(p => [...p, "[AUTO-REPAIR] Reparation autorisee par l Admin humain.", "[OK] Seve retablie - 100% OPERATIONNELLE. Arbre au vert."]);
    setPanelOpen(false);
  }

  const seveInfo = SEVEINFO[seve];
  const persona = panelCtx ? AGENTS[panelCtx] : null;

  function AgentCard({ id }) {
    const a = AGENTS[id];
    if (!a) return null;
    const isActive = activeNode === id;
    const disabled = isDisabled(id);
    const bc = disabled ? "rgba(255,255,255,.05)" : isActive ? (seve==="red"?"#E05252":"#F59E0B") : a.color+"50";
    const glow = isActive && !disabled ? "0 0 16px "+(seve==="red"?"rgba(224,82,82,.4)":"rgba(245,158,11,.35)") : "none";
    return (
      <div style={{ background:disabled?"rgba(255,255,255,.02)":"#111", border:"1.5px solid "+bc, borderRadius:12, padding:"11px 12px", textAlign:"center", cursor:disabled?"default":"pointer", transition:"all .3s", boxShadow:glow, opacity:disabled?.3:1, position:"relative", minWidth:120, animation:isActive&&!disabled?"blink 1s infinite":"none" }}
        onClick={()=>!disabled&&openPanel(id)}>
        <div style={{ position:"absolute", top:6, right:6 }}>
          <div style={{ width:28, height:14, borderRadius:7, background:disabled?"#1a1a1a":a.color+"20", border:"1px solid "+(disabled?"#333":a.color+"40"), cursor:"pointer", display:"flex", alignItems:"center", padding:"1px" }} onClick={e=>toggleAgent(id,e)}>
            <div style={{ width:11, height:11, borderRadius:"50%", background:disabled?"#444":a.color, transform:disabled?"none":"translateX(13px)", transition:"all .2s" }}/>
          </div>
        </div>
        <div style={{ fontSize:6, opacity:.6, marginBottom:1 }}>{a.hat}</div>
        <div style={{ fontSize:18, marginBottom:3, filter:disabled?"grayscale(1)":"none", animation:!disabled&&!isActive?"pulse 3s infinite":"none" }}>{a.icon}</div>
        <div style={{ fontSize:10, fontWeight:800, color:disabled?"#333":"#E5E7EB", marginBottom:1, lineHeight:1.3 }}>{a.name.split(" ").slice(0,3).join(" ")}</div>
        <div style={{ fontSize:8, color:disabled?"#222":a.color+"99", marginBottom:3 }}>{a.pole}</div>
        <div style={{ fontSize:7, color:disabled?"#1f1f1f":"rgba(255,255,255,.2)", marginBottom:isActive?5:0, fontStyle:"italic" }}>{disabled?"Agent desactive":a.status}</div>
        {!disabled && !isActive && <div style={{ display:"inline-flex", alignItems:"center", gap:2, padding:"1px 6px", borderRadius:100, background:a.color+"10", border:"1px solid "+a.color+"20", color:a.color, fontSize:7, fontWeight:700 }}>
          <div style={{ width:3, height:3, borderRadius:"50%", background:a.color }}/>RAS
        </div>}
        {isActive && !disabled && (
          <div style={{ padding:"3px 6px", borderRadius:5, background:(seve==="red"?"rgba(224,82,82,.12)":"rgba(245,158,11,.12)"), border:"1px solid "+(seve==="red"?"rgba(224,82,82,.3)":"rgba(245,158,11,.3)"), color:(seve==="red"?"#E05252":"#F59E0B"), fontSize:7, fontWeight:700 }} className="blink">
            {seve==="red"?"CRITIQUE":"IA active"}
          </div>
        )}
      </div>
    );
  }

  function FlowLine({ crisis }) {
    const c = crisis ? (seve==="red"?"#E05252":"#F59E0B") : "#4CAF87";
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:3, padding:"4px 0" }}>
        <div style={{ height:20, width:2, background:c+"40", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:"40%", background:c, animation:"flowDown 1.5s infinite linear" }}/>
        </div>
        <div style={{ fontSize:8, color:c+"80" }} className={crisis?"blink":""}>{crisis?"!":"›"}</div>
      </div>
    );
  }

  return (
    <div style={{ background:"#070706", minHeight:"100vh", padding:"0 0 40px" }}>
      <style>{"@keyframes blink{0%,100%{opacity:1}50%{opacity:.25}} @keyframes fadeUp{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}} @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(1.08)}} @keyframes flowDown{0%{top:-40%}100%{top:100%}} .blink{animation:blink 1s infinite} .fadeUp{animation:fadeUp .3s ease both}"}</style>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", borderBottom:"1px solid #1a1a1a", background:"#0D0C0B" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:6, background:"rgba(255,140,105,.08)", border:"1px solid rgba(255,140,105,.2)" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#FF8C69", boxShadow:"0 0 6px #FF8C69" }}/>
            <span style={{ fontSize:10, fontWeight:800, color:"#FF8C69", letterSpacing:".06em" }}>GOD MODE ACTIF</span>
          </div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:6, background:seveInfo.bg, border:"1px solid "+seveInfo.color+"40" }} className={seve!=="green"?"blink":""}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:seveInfo.color, boxShadow:"0 0 6px "+seveInfo.color }}/>
            <span style={{ fontSize:10, fontWeight:800, color:seveInfo.color }}>SEVE : {seveInfo.label}</span>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.3)" }}>MRR : <span style={{ color:"#4CAF87", fontWeight:800 }}>260 EUR</span></div>
          <button onClick={()=>setKilled(k=>!k)} style={{ padding:"7px 14px", borderRadius:8, border:"1.5px solid "+(killed?"rgba(76,175,135,.4)":"rgba(224,82,82,.5)"), background:killed?"rgba(76,175,135,.08)":"rgba(224,82,82,.1)", color:killed?"#4CAF87":"#E05252", fontFamily:"inherit", fontSize:10, fontWeight:800, cursor:"pointer" }}>
            {killed?"REACTIVER L ARBRE":"KILL SWITCH"}
          </button>
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>
        <div style={{ fontFamily:"serif", fontSize:22, color:"#F5F0EB", marginBottom:4 }}>Ecosysteme IA - L Arbre NovaCaisse</div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,.2)", marginBottom:16 }}>18 agents actifs | Supervision autonome en temps reel</div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16 }}>
          <div style={{ background:"#111", border:"1px solid rgba(76,175,135,.15)", borderRadius:10, padding:"11px 13px" }}>
            <div style={{ fontSize:9, fontWeight:800, color:"#4CAF87", textTransform:"uppercase", marginBottom:4 }}>Monde Reel - Production</div>
            <div style={{ fontSize:20, fontWeight:900, color:"#4CAF87" }}>260 EUR</div>
            <div style={{ fontSize:9, color:"rgba(76,175,135,.5)" }}>MRR | 2 actifs x 130 EUR | Stable</div>
          </div>
          <div style={{ background:"#111", border:"1px solid rgba(167,139,250,.15)", borderRadius:10, padding:"11px 13px" }}>
            <div style={{ fontSize:9, fontWeight:800, color:"#A78BFA", textTransform:"uppercase", marginBottom:4 }}>Labo Crash-Test</div>
            <div style={{ fontSize:10, color:"rgba(167,139,250,.6)", lineHeight:1.5 }}>9 scenarios | Zero impact production</div>
          </div>
          <div style={{ background:"#111", border:"1px solid rgba(91,158,245,.15)", borderRadius:10, padding:"11px 13px" }}>
            <div style={{ fontSize:9, fontWeight:800, color:"#5B9EF5", textTransform:"uppercase", marginBottom:4 }}>Radar IA</div>
            <div style={{ fontSize:10, color:"rgba(91,158,245,.6)", lineHeight:1.5 }}>Chaos Monkey : prochain test dans ~10min</div>
          </div>
        </div>

        <div style={killed?{opacity:.1,filter:"grayscale(1)",pointerEvents:"none"}:{}}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            {POLES.map((pole, pi) => (
              <div key={pi} style={{ width:"100%", maxWidth:980 }}>
                {pi > 0 && (
                  <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:4, padding:"3px 0" }}>
                    <div style={{ width:"60%", height:1, background:"rgba(255,255,255,.04)" }}/>
                    <div style={{ fontSize:8, color:seve!=="green"?"rgba(245,158,11,.4)":"rgba(76,175,135,.3)", fontFamily:"monospace" }} className={seve!=="green"?"blink":""}>
                      {seve!=="green"?"▼ ALERTE":"▼ seve"}
                    </div>
                    <div style={{ width:"60%", height:1, background:"rgba(255,255,255,.04)" }}/>
                  </div>
                )}
                <div style={{ background:"#0f0f0e", border:"1px solid rgba(255,255,255,.04)", borderRadius:12, padding:"12px 14px", marginBottom:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:pole.color, boxShadow:"0 0 5px "+pole.color }}/>
                    <div style={{ fontSize:9, fontWeight:800, color:pole.color+"99", textTransform:"uppercase", letterSpacing:".07em" }}>{pole.label}</div>
                    <div style={{ flex:1, height:1, background:"rgba(255,255,255,.04)" }}/>
                    <div style={{ fontSize:8, color:"rgba(255,255,255,.1)", fontFamily:"monospace" }} className={seve!=="green"&&pole.ids.includes(activeNode||"")?"blink":""}>
                      {pole.ids.filter(id=>!isDisabled(id)).length}/{pole.ids.length} actifs
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {pole.ids.map(id => <AgentCard key={id} id={id}/>)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:14, background:"#0f0f0e", border:"1px solid rgba(167,139,250,.12)", borderRadius:12, padding:"14px 16px" }}>
            <div style={{ fontSize:10, fontWeight:800, color:"#A78BFA", textTransform:"uppercase", letterSpacing:".08em", marginBottom:2 }}>Salle d Entrainement Tactique - 9 Scenarios</div>
            <div style={{ fontSize:9, color:"rgba(167,139,250,.4)", marginBottom:10 }}>Simulations de crise - zero impact production reelle</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, marginBottom:10 }}>
              {SCENARIOS.map(sc=>(
                <button key={sc.key} disabled={scenarioRunning||killed} style={{ padding:"9px 8px", borderRadius:8, border:"1px solid "+sc.color+"25", background:sc.color+"06", color:sc.color, fontFamily:"inherit", fontSize:9, fontWeight:700, cursor:(scenarioRunning||killed)?"not-allowed":"pointer", opacity:(scenarioRunning||killed)?.45:1, textAlign:"left" }} onClick={()=>runScenario(sc)}>
                  {sc.label}
                </button>
              ))}
            </div>
            <div style={{ background:"#050505", borderRadius:8, padding:"10px 12px", height:120, overflowY:"auto", fontFamily:"monospace", fontSize:9, display:"flex", flexDirection:"column", gap:3, border:"1px solid rgba(76,175,135,.08)" }}>
              {logs.length===0 ? <div style={{ color:"rgba(76,175,135,.15)" }}>{">"} En attente d un scenario de crash-test...</div>
                : logs.map((log,i)=><div key={i} style={{ color:"#4CAF87" }} className="fadeUp">{">"} {log}</div>)}
            </div>
            {seve!=="green" && (
              <div style={{ display:"flex", gap:8, marginTop:9 }}>
                <button style={{ flex:1, padding:"10px", borderRadius:8, border:"none", background:"linear-gradient(135deg,#4CAF87,#2D9B6F)", color:"#fff", fontFamily:"inherit", fontSize:10, fontWeight:800, cursor:"pointer" }} onClick={autoRepair}>
                  Autoriser reparation automatique IA
                </button>
                <button style={{ flex:1, padding:"10px", borderRadius:8, border:"1px solid #222", background:"#111", color:"#9CA3AF", fontFamily:"inherit", fontSize:9, fontWeight:700, cursor:"pointer" }} onClick={()=>setShowManual(m=>!m)}>
                  Procedure manuelle pour Claude
                </button>
              </div>
            )}
            {showManual && (
              <div style={{ marginTop:9, background:"#050505", borderRadius:8, padding:"12px", border:"1px solid rgba(255,140,105,.15)" }}>
                <div style={{ fontSize:9, fontWeight:800, color:"#FF8C69", marginBottom:6 }}>Procedure Manuelle - Copier dans Claude sur MacBook</div>
                <pre style={{ fontFamily:"monospace", fontSize:9, color:"#9CA3AF", lineHeight:1.9, margin:0 }}>
"1. cd ~/Downloads/novacaisse-app\n2. vite build 2>&1 | head -20\n3. Copier l erreur et expliquer a Claude\n4. git add -f src/App.jsx && git push"
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {killed&&(
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,.92)", zIndex:9990, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:14 }} onClick={()=>setKilled(false)}>
          <div style={{ fontSize:52 }}>🔴</div>
          <div style={{ fontSize:16, fontWeight:900, color:"#E05252", textAlign:"center", lineHeight:1.6, letterSpacing:".03em" }}>SYSTEME FIGE PAR LE CREATEUR HUMAIN<br/>TOUTES LES IA SONT DESACTIVEES</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.25)" }}>Cliquer pour reactiver l arbre</div>
        </div>
      )}

      {panelOpen&&persona&&(
        <>
          <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,.6)", zIndex:998, backdropFilter:"blur(3px)" }} onClick={()=>setPanelOpen(false)}/>
          <div style={{ position:"fixed", top:0, right:0, bottom:0, width:400, background:"#0c0b0a", borderLeft:"1px solid #1a1a1a", zIndex:999, padding:"18px 16px", overflowY:"auto", display:"flex", flexDirection:"column", gap:11 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:42, height:42, borderRadius:10, background:persona.color+"12", border:"1.5px solid "+persona.color+"30", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
                  <div style={{ fontSize:6 }}>{persona.hat}</div>
                  <div style={{ fontSize:20 }}>{persona.icon}</div>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:800, color:"#F5F0EB" }}>{persona.name}</div>
                  <div style={{ fontSize:9, color:persona.color }}>{persona.pole}</div>
                  <div style={{ fontSize:8, color:"rgba(255,255,255,.25)", fontStyle:"italic" }}>{persona.status}</div>
                </div>
              </div>
              <button style={{ width:24, height:24, borderRadius:6, border:"1px solid #222", background:"transparent", color:"#666", fontSize:11, cursor:"pointer" }} onClick={()=>setPanelOpen(false)}>X</button>
            </div>

            <div style={{ background:"#111", border:"1px solid rgba(76,175,135,.1)", borderRadius:8, padding:"10px 12px" }}>
              <div style={{ fontSize:8, fontWeight:800, color:"#4CAF87", textTransform:"uppercase", marginBottom:3 }}>Production Stable</div>
              <div style={{ fontSize:10, color:"rgba(76,175,135,.7)" }}>MRR : 260 EUR | 2 tenants actifs | Supabase OK</div>
            </div>

            <div style={{ background:"#111", border:"1px solid rgba(167,139,250,.1)", borderRadius:8, padding:"10px 12px" }}>
              <div style={{ fontSize:8, fontWeight:800, color:"#A78BFA", textTransform:"uppercase", marginBottom:3 }}>Labo de Crash-Test</div>
              <div style={{ fontSize:10, color:"rgba(167,139,250,.6)" }}>Zone virtuelle - zero impact vrais clients</div>
            </div>

            {panelCtx==="tribunal" && (
              <div>
                <button style={{ width:"100%", padding:"8px", borderRadius:8, border:"1px solid rgba(167,139,250,.2)", background:"rgba(167,139,250,.05)", color:"#A78BFA", fontFamily:"inherit", fontSize:10, fontWeight:700, cursor:"pointer", marginBottom:8 }} onClick={()=>setShowConstitution(c=>!c)}>
                  {showConstitution?"Masquer":"Afficher"} la Constitution Sacree
                </button>
                {showConstitution && (
                  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                    {CONSTITUTION.map((c,i)=>(
                      <div key={i} style={{ background:"#111", border:"1px solid rgba(167,139,250,.08)", borderRadius:7, padding:"8px 10px" }}>
                        <div style={{ fontSize:8, fontWeight:800, color:"#A78BFA", marginBottom:2 }}>{c.art} - {c.title}</div>
                        <div style={{ fontSize:9, color:"rgba(255,255,255,.25)", lineHeight:1.5 }}>{c.text}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 12px", borderRadius:8, background:"#111", border:"1px solid #1a1a1a" }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:"#E5E7EB" }}>Mode Manuel Admin</div>
                <div style={{ fontSize:9, color:"#444" }}>L IA se fige et attend vos ordres</div>
              </div>
              <div style={{ width:36, height:19, borderRadius:10, background:manualMode?"#FF8C69":"#1a1a1a", border:"1px solid "+(manualMode?"#FF8C69":"#333"), padding:2, cursor:"pointer", display:"flex", alignItems:"center", transition:"all .2s" }} onClick={toggleManual}>
                <div style={{ width:14, height:14, borderRadius:"50%", background:"#fff", transform:manualMode?"translateX(17px)":"none", transition:"transform .2s" }}/>
              </div>
            </div>

            <div>
              <div style={{ fontSize:8, fontWeight:800, color:"#333", textTransform:"uppercase", marginBottom:7 }}>Chat Direct</div>
              <div style={{ background:"#080808", borderRadius:8, border:"1px solid #111", padding:"9px", marginBottom:8, maxHeight:180, overflowY:"auto", display:"flex", flexDirection:"column", gap:6 }}>
                {chatHistory.map((m,i)=>(
                  <div key={i} style={{ display:"flex", justifyContent:m.from==="human"?"flex-end":"flex-start" }}>
                    <div style={{ padding:"6px 10px", borderRadius:8, fontSize:11, lineHeight:1.5, background:m.from==="human"?"rgba(255,140,105,.08)":"#111", color:m.from==="human"?"#FF8C69":"#9CA3AF", maxWidth:"88%", border:"1px solid "+(m.from==="human"?"rgba(255,140,105,.15)":"#1a1a1a") }}>{m.text}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:7 }}>
                <input style={{ flex:1, padding:"8px 12px", borderRadius:7, border:"1px solid #1a1a1a", background:"#111", color:"#E5E7EB", fontFamily:"inherit", fontSize:11, outline:"none" }} placeholder="Discuter avec le responsable..." value={chatMsg} onChange={e=>setChatMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()}/>
                <button style={{ padding:"8px 12px", borderRadius:7, border:"none", background:"linear-gradient(135deg,#FF8C69,#E8704A)", color:"#fff", fontFamily:"inherit", fontSize:11, fontWeight:700, cursor:"pointer" }} onClick={sendChat}>Envoyer</button>
              </div>
            </div>

            {seve!=="green" && (
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                <button style={{ padding:"11px", borderRadius:8, border:"none", background:"linear-gradient(135deg,#4CAF87,#2D9B6F)", color:"#fff", fontFamily:"inherit", fontSize:11, fontWeight:800, cursor:"pointer" }} onClick={autoRepair}>
                  Autoriser reparation automatique IA
                </button>
                <button style={{ padding:"11px", borderRadius:8, border:"1px solid #1a1a1a", background:"#111", color:"#6B7280", fontFamily:"inherit", fontSize:10, fontWeight:700, cursor:"pointer" }} onClick={()=>setShowManual(m=>!m)}>
                  Procedure manuelle pour Claude
                </button>
                {showManual && (
                  <div style={{ background:"#050505", borderRadius:8, padding:"12px", border:"1px solid rgba(255,140,105,.12)" }}>
                    <div style={{ fontSize:8, fontWeight:800, color:"#FF8C69", marginBottom:6 }}>Copier dans Claude sur MacBook</div>
                    <pre style={{ fontFamily:"monospace", fontSize:9, color:"#6B7280", lineHeight:1.9, margin:0 }}>
"1. cd ~/Downloads/novacaisse-app\n2. vite build 2>&1 | head -20\n3. Copier erreur a Claude\n4. git add -f src/App.jsx && git push"
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ModulesCatalogue({ mods, setMods, showToast }) {
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ label:"", icon:"🔧", cat:"flux", locked:false, desc_client:"", desc_admin:"", active:false });

  const CATS = [
    { id:"core", label:"Core", color:"#FF8C69" },
    { id:"flux", label:"Flux", color:"#5B9EF5" },
    { id:"gestion", label:"Gestion", color:"#4CAF87" },
    { id:"marketing", label:"Marketing", color:"#A78BFA" },
  ];

  function genKey(label) {
    return label.toUpperCase().replace(/[^A-Z0-9]/g,"_").replace(/_+/g,"_").replace(/^_|_$/g,"");
  }

  function saveModule() {
    if (!form.label) { showToast("Nom requis","error"); return; }
    const key = genKey(form.label);
    const id = key.toLowerCase();
    if (editId) {
      setMods(p => p.map(m => m.id!==editId?m:{...m,...form,key,id}));
      showToast("Module mis à jour");
    } else {
      setMods(p => [...p,{...form,id,key}]);
      showToast("Module créé ✓");
    }
    setCreating(false); setEditId(null);
    setForm({ label:"",icon:"🔧",cat:"flux",locked:false,desc_client:"",desc_admin:"",active:false });
  }

  const S2 = {
    card: { background:"#161513", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:20, marginBottom:16 },
    label: { display:"block", fontSize:11, fontWeight:700, color:"#6B635C", textTransform:"uppercase", letterSpacing:".08em", marginBottom:5 },
    input: { width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,.1)", background:"rgba(255,255,255,.04)", color:"#F5F0EB", fontFamily:"inherit", fontSize:14, outline:"none", boxSizing:"border-box" },
    textarea: { width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,.1)", background:"rgba(255,255,255,.04)", color:"#F5F0EB", fontFamily:"inherit", fontSize:13, outline:"none", boxSizing:"border-box", resize:"vertical", minHeight:70 },
    btn: (v) => ({ padding:"9px 16px", borderRadius:8, border:"none", background:v==="primary"?"linear-gradient(135deg,#FF8C69,#E8704A)":"rgba(255,255,255,.05)", color:v==="primary"?"#fff":"#A89F96", fontFamily:"inherit", fontSize:13, fontWeight:700, cursor:"pointer", border:v!=="primary"?"1px solid rgba(255,255,255,.1)":"none" }),
    badge: (cat) => { const c={core:"#FF8C69",flux:"#5B9EF5",gestion:"#4CAF87",marketing:"#A78BFA"}[cat]||"#9E8E82"; return { padding:"2px 8px", borderRadius:100, fontSize:10, fontWeight:800, textTransform:"uppercase", color:c, background:c+"18", border:"1px solid "+c+"30" }; },
    key: { fontFamily:"monospace", fontSize:10, color:"#6B635C", background:"rgba(255,255,255,.04)", padding:"2px 8px", borderRadius:4, border:"1px solid rgba(255,255,255,.06)" },
  };

  const grouped = CATS.map(cat => ({ ...cat, items:mods.filter(m=>m.cat===cat.id) })).filter(g=>g.items.length>0);

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:"serif", fontSize:28, marginBottom:4 }}>Catalogue de Modules</div>
          <div style={{ fontSize:13, color:"#6B635C" }}>{mods.length} modules · {mods.filter(m=>m.active).length} actifs par défaut</div>
        </div>
        <button style={S2.btn("primary")} onClick={()=>{ setCreating(true); setEditId(null); }}>+ Nouveau Module</button>
      </div>

      {creating && (
        <div style={{ ...S2.card, borderColor:"rgba(255,140,105,.3)", marginBottom:20 }}>
          <div style={{ fontSize:15, fontWeight:700, color:"#FF8C69", marginBottom:16 }}>{editId?"✏️ Modifier":"✨ Nouveau module"}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div>
              <div style={{ marginBottom:12 }}>
                <label style={S2.label}>Nom du module</label>
                <input style={S2.input} placeholder="ex: Fidélité Plus" value={form.label} onChange={e=>setForm(p=>({...p,label:e.target.value}))} autoFocus/>
                {form.label && <div style={{ marginTop:5, ...S2.key, display:"inline-block" }}>Clé : {genKey(form.label)}</div>}
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={S2.label}>Icône</label>
                <input style={{ ...S2.input, width:80 }} value={form.icon} onChange={e=>setForm(p=>({...p,icon:e.target.value}))}/>
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={S2.label}>Catégorie</label>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {CATS.map(cat => { const c={core:"#FF8C69",flux:"#5B9EF5",gestion:"#4CAF87",marketing:"#A78BFA"}[cat.id]; return (
                    <button key={cat.id} style={{ padding:"6px 12px", borderRadius:6, border:`1px solid ${form.cat===cat.id?c:"rgba(255,255,255,.1)"}`, background:form.cat===cat.id?c+"18":"transparent", color:form.cat===cat.id?c:"#A89F96", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }} onClick={()=>setForm(p=>({...p,cat:cat.id}))}>{cat.label}</button>
                  ); })}
                </div>
              </div>
              <div style={{ display:"flex", gap:16 }}>
                <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", fontSize:13, color:"#A89F96" }}>
                  <input type="checkbox" checked={form.locked} onChange={e=>setForm(p=>({...p,locked:e.target.checked}))}/>🔒 Indésactivable
                </label>
                <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", fontSize:13, color:"#A89F96" }}>
                  <input type="checkbox" checked={form.active} onChange={e=>setForm(p=>({...p,active:e.target.checked}))}/>✅ Défaut
                </label>
              </div>
            </div>
            <div>
              <div style={{ marginBottom:12 }}>
                <label style={S2.label}>📣 Description client</label>
                <textarea style={S2.textarea} placeholder="Ce que voit le patron…" value={form.desc_client} onChange={e=>setForm(p=>({...p,desc_client:e.target.value}))}/>
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={S2.label}>🔧 Note admin</label>
                <textarea style={S2.textarea} placeholder="Note interne…" value={form.desc_admin} onChange={e=>setForm(p=>({...p,desc_admin:e.target.value}))}/>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:8 }}>
            <button style={S2.btn("ghost")} onClick={()=>{ setCreating(false); setEditId(null); }}>Annuler</button>
            <button style={S2.btn("primary")} onClick={saveModule}>{editId?"Enregistrer":"Créer"} →</button>
          </div>
        </div>
      )}

      {grouped.map(group => (
        <div key={group.id} style={S2.card}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <span style={S2.badge(group.id)}>{group.label}</span>
            <span style={{ fontSize:12, color:"#6B635C" }}>{group.items.length} module{group.items.length>1?"s":""}</span>
          </div>
          {group.items.map(mod => (
            <div key={mod.id} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
              <div style={{ fontSize:28, width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,.05)", borderRadius:10, flexShrink:0 }}>{mod.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                  <span style={{ fontSize:14, fontWeight:700 }}>{mod.label}</span>
                  <span style={S2.key}>{mod.key||mod.id.toUpperCase()}</span>
                  {mod.locked && <span style={{ fontSize:10, color:"#F59E0B", padding:"2px 7px", borderRadius:100, background:"rgba(245,158,11,.1)", border:"1px solid rgba(245,158,11,.2)", fontWeight:700 }}>🔒 Locked</span>}
                  {mod.active && <span style={{ fontSize:10, color:"#4CAF87", padding:"2px 7px", borderRadius:100, background:"rgba(76,175,135,.1)", border:"1px solid rgba(76,175,135,.2)", fontWeight:700 }}>✅ Défaut</span>}
                </div>
                {mod.desc_client && <div style={{ fontSize:12, color:"#A89F96", marginBottom:2 }}><span style={{ color:"#6B635C" }}>Client : </span>{mod.desc_client}</div>}
                {mod.desc_admin && <div style={{ fontSize:12, color:"#F59E0B" }}><span style={{ color:"#6B635C" }}>Admin : </span>{mod.desc_admin}</div>}
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <button style={{ padding:"4px 10px", borderRadius:6, border:"1px solid rgba(255,255,255,.1)", background:"transparent", color:"#A89F96", fontSize:11, cursor:"pointer", fontFamily:"inherit" }} onClick={()=>{ setForm({label:mod.label,icon:mod.icon,cat:mod.cat,locked:mod.locked,desc_client:mod.desc_client||"",desc_admin:mod.desc_admin||"",active:mod.active}); setEditId(mod.id); setCreating(true); }}>✏️</button>
                {!mod.locked && <button style={{ padding:"4px 10px", borderRadius:6, border:"1px solid rgba(224,82,82,.2)", background:"transparent", color:"#E05252", fontSize:11, cursor:"pointer", fontFamily:"inherit" }} onClick={()=>setMods(p=>p.filter(m=>m.id!==mod.id))}>🗑️</button>}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const S = {
    root: { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#FAFAF8", fontFamily:"'Plus Jakarta Sans',sans-serif", padding:16 },
    card: { background:"#fff", borderRadius:20, padding:"48px 40px", width:"100%", maxWidth:420, boxShadow:"0 4px 40px rgba(26,22,18,.08)", border:"1px solid rgba(26,22,18,.06)" },
    logo: { display:"flex", alignItems:"center", gap:12, marginBottom:32 },
    logoIcon: { width:44, height:44, borderRadius:12, background:"linear-gradient(135deg,#FF8C69,#E8704A)", color:"#fff", fontWeight:900, fontSize:20, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
    logoTitle: { fontSize:20, fontWeight:800, color:"#1A1612" },
    logoSub: { fontSize:12, color:"#9E8E82" },
    title: { fontSize:24, fontWeight:800, color:"#1A1612", marginBottom:8 },
    sub: { fontSize:14, color:"#9E8E82", marginBottom:32 },
    label: { display:"block", fontSize:12, fontWeight:700, color:"#6B635C", textTransform:"uppercase", letterSpacing:".08em", marginBottom:6 },
    input: { width:"100%", padding:"12px 16px", borderRadius:10, border:"1.5px solid rgba(26,22,18,.1)", background:"#FAFAF8", fontFamily:"inherit", fontSize:15, color:"#1A1612", outline:"none", boxSizing:"border-box", marginBottom:16, display:"block" },
    btn: { width:"100%", padding:14, borderRadius:10, border:"none", background:"linear-gradient(135deg,#FF8C69,#E8704A)", color:"#fff", fontFamily:"inherit", fontSize:15, fontWeight:700, cursor:"pointer", marginTop:8 },
    error: { background:"rgba(224,82,82,.08)", border:"1px solid rgba(224,82,82,.2)", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#E05252", marginBottom:16 },
    demo: { marginTop:20, padding:16, background:"#F5F0EB", borderRadius:10, fontSize:12, color:"#6B635C", lineHeight:1.8 },
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 600));
    if (email === "admin@novacaisse.io" && password === "admin123") {
      onLogin({ role:"SUPER_ADMIN", name:"Gilliane Robin", email });
    } else if (email && password.length >= 4) {
      onLogin({ role:"ORG_OWNER", name:"Patron", email, tenant:"shop-in-cafe" });
    } else {
      setError("Email ou mot de passe incorrect.");
    }
    setLoading(false);
  }

  return (
    <div style={S.root}>
      <div style={S.card}>
        <div style={S.logo}>
          <div style={S.logoIcon}>N</div>
          <div>
            <div style={S.logoTitle}>NovaCaisse</div>
            <div style={S.logoSub}>Plateforme POS/ERP SaaS</div>
          </div>
        </div>
        <div style={S.title}>Connexion</div>
        <div style={S.sub}>Accédez à votre espace de gestion</div>
        {error && <div style={S.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={S.label}>Email</label>
          <input style={S.input} type="email" placeholder="votre@email.com"
            value={email} onChange={e => setEmail(e.target.value)} required autoFocus/>
          <label style={S.label}>Mot de passe</label>
          <input style={S.input} type="password" placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)} required/>
          <button style={S.btn} type="submit" disabled={loading}>
            {loading ? "Connexion…" : "Se connecter →"}
          </button>
        </form>
        <div style={S.demo}>
          <strong>🔑 Démo Super-Admin :</strong> admin@novacaisse.io / admin123<br/>
          <strong>🏪 Démo Patron :</strong> email + mot de passe (4+ caractères)
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // ── Auth ──────────────────────────────────────────────────
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("nc_user")); } catch { return null; }
  });

  function handleLogin(userData) {
    sessionStorage.setItem("nc_user", JSON.stringify(userData));
    setUser(userData);
  }

  function handleLogout() {
    sessionStorage.removeItem("nc_user");
    setUser(null);
  }

  // ── Route Guards ───────────────────────────────────────────
  const isSuperAdminPath = window.location.pathname === "/super-admin";
  if (!user) return <LoginPage onLogin={handleLogin}/>;
  if (user.role === "SUPER_ADMIN" || isSuperAdminPath) {
    return (
      <div style={{ position:"relative" }}>
        <button onClick={handleLogout} style={{ position:"fixed", top:12, right:12, zIndex:9999, padding:"6px 14px", background:"rgba(224,82,82,.1)", border:"1px solid rgba(224,82,82,.3)", borderRadius:8, color:"#E05252", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          ⏻ Déconnexion
        </button>
        <SuperAdmin/>
      </div>
    );
  }

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
