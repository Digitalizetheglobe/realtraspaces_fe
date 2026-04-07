"use client";
import { useState, useEffect, useCallback } from "react";

// ── Raw shape from B2BBricks API (PascalCase) ──────────────────────────────────
interface RawProperty {
  Id: string;
  RefNumber: string;
  Title: string;
  Description: string;
  CreateDate: string;
  LastUpdated: string;
  PropertyType: string;
  PropertyTypeText: string;
  WantTo: string;
  WantToText: string;
  PropertyName: string;
  BuildingName: string;
  Price: string;
  PriceText: string;
  Rate: string;
  IsNegotiable: boolean;
  Transaction: string;
  Ownership: string;
  Possession: string;
  SaleArea: string;
  SaleAreaText: string;
  CarpetArea: string;
  CarpetAreaText: string;
  BuiltArea: string;
  FloorNumber: string;
  TotalFloor: string;
  TotalLift: string;
  NoOfParking: string;
  Furnishing: string;
  Flooring: string;
  Location: string;
  City: string;
  Landmark: string;
  Latitude: number;
  Longitude: number;
  ImageUrl: string;
  Url: string;
  Suitable: string;
  Unique: string;
  WebsiteKeyword: string;
  TotalRecords: number;
  IsFeatured: boolean;
  EmployeeName: string;
  EmployeeMobile: string;
  EmployeeEmail: string;
  [key: string]: unknown;
}

// ── Fallback data (shown when CORS blocks the live API) ───────────────────────
const FALLBACK_DATA: RawProperty[] = [
  { Id: "05a753a8-66d7-4a69-ac45-0341564e8fc3", RefNumber: "JP040426-151256-1550", Title: "Commercial Office/Space for Rent in Andheri (East), Mumbai Bandra - Dahisar", Description: "", CreateDate: "2:54 PM", LastUpdated: "07-Apr-2026 2:54 PM", PropertyType: "11", PropertyTypeText: "Commercial Office/Space", WantTo: "3", WantToText: "Rent", PropertyName: "Arena House", BuildingName: "Arena House", Price: "1762500", PriceText: "17.63 Lac", Rate: "74.05", IsNegotiable: true, Transaction: "Resale", Ownership: "Lease Hold", Possession: "Immediately", SaleArea: "23800.00", SaleAreaText: "23800 Sq.Ft.", CarpetArea: "14100.00", CarpetAreaText: "14100 Sq.Ft.", BuiltArea: "", FloorNumber: "3", TotalFloor: "5", TotalLift: "1", NoOfParking: "12", Furnishing: "Fully Furnished", Flooring: "Tiles", Location: "Andheri (East)", City: "Mumbai Bandra - Dahisar", Landmark: "Marol MIDC Industrial Estate", Latitude: 19.1195, Longitude: 72.8712, ImageUrl: "", Url: "", Suitable: "Corporate Office", Unique: "Easy Public transport, 24/7 Water Supply", WebsiteKeyword: "Furnished office for Lease at Andheri East", TotalRecords: 3, IsFeatured: false, EmployeeName: "Administrator", EmployeeMobile: "9769971110", EmployeeEmail: "rahulsonar@credefine.com" },
  { Id: "7869e6af-fd4e-4b39-bbab-885fd8cb841b", RefNumber: "JP060426-163733-2467", Title: "Commercial Office/Space for Rent in Andheri (East), Mumbai Bandra - Dahisar", Description: "", CreateDate: "2:53 PM", LastUpdated: "07-Apr-2026 2:53 PM", PropertyType: "11", PropertyTypeText: "Commercial Office/Space", WantTo: "3", WantToText: "Rent", PropertyName: "Ackruti Star", BuildingName: "Ackruti Star", Price: "2200000", PriceText: "22.00 Lac", Rate: "92.05", IsNegotiable: true, Transaction: "Resale", Ownership: "Free Hold", Possession: "Immediately", SaleArea: "23900.00", SaleAreaText: "23900 Sq.Ft.", CarpetArea: "13800.00", CarpetAreaText: "13800 Sq.Ft.", BuiltArea: "", FloorNumber: "7", TotalFloor: "", TotalLift: "", NoOfParking: "23", Furnishing: "Fully Furnished", Flooring: "", Location: "Andheri (East)", City: "Mumbai Bandra - Dahisar", Landmark: "MIDC Central Road", Latitude: 19.1185, Longitude: 72.8703, ImageUrl: "", Url: "", Suitable: "Corporate Office", Unique: "Good No. of Reserved Parking, Easy Public transport, 24/7 Water Supply", WebsiteKeyword: "Furnished office for Lease at Andheri East", TotalRecords: 3, IsFeatured: false, EmployeeName: "Administrator", EmployeeMobile: "9769971110", EmployeeEmail: "rahulsonar@credefine.com" },
  { Id: "dda2f29d-6a83-42ce-a3e2-c03d72f53b19", RefNumber: "JP070426-140527-1285", Title: "Commercial Office/Space for Rent in Andheri (East), Mumbai Bandra - Dahisar", Description: "", CreateDate: "2:52 PM", LastUpdated: "07-Apr-2026 2:52 PM", PropertyType: "11", PropertyTypeText: "Commercial Office/Space", WantTo: "3", WantToText: "Rent", PropertyName: "Nand Ghanshyam", BuildingName: "Nand Ghanshyam", Price: "200000", PriceText: "2.00 Lac", Rate: "100.00", IsNegotiable: true, Transaction: "Resale", Ownership: "Free Hold", Possession: "", SaleArea: "2000.00", SaleAreaText: "2000 Sq.Ft.", CarpetArea: "", CarpetAreaText: "", BuiltArea: "", FloorNumber: "1", TotalFloor: "", TotalLift: "", NoOfParking: "", Furnishing: "Fully Furnished", Flooring: "", Location: "Andheri (East)", City: "Mumbai Bandra - Dahisar", Landmark: "Opp Sun pharma building", Latitude: 19.1234, Longitude: 72.862, ImageUrl: "", Url: "", Suitable: "Corporate Office", Unique: "Easy Public transport, Earthquake resistance, 24/7 Water Supply", WebsiteKeyword: "Furnished office for Lease at Andheri East", TotalRecords: 3, IsFeatured: false, EmployeeName: "Administrator", EmployeeMobile: "9769971110", EmployeeEmail: "rahulsonar@credefine.com" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const API_URL = 'https://connector.b2bbricks.com/api/Property/getrecentproperties';
const TOKEN   = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InJhaHVsc29uYXJAY3JlZGVmaW5lLmNvbSIsIm5iZiI6MTc3NTEyMTM0MSwiZXhwIjoxOTMyODg3NzQxLCJpYXQiOjE3NzUxMjEzNDEsImlzcyI6Imh0dHBzOi8vY29ubmVjdG9yLmIyYmJyaWNrcy5jb20iLCJhdWQiOiJodHRwczovL2Nvbm5lY3Rvci5iMmJicmlja3MuY29tIn0.sgFhfl2X3DhaDckUkVqLQ1pAkSsRFUuRJT8eTwekVZs';

function getPrice(p: RawProperty): number {
  return parseFloat(String(p.Price || 0).replace(/[^0-9.]/g, "")) || 0;
}

function formatPrice(p: RawProperty): string {
  if (p.PriceText) return `₹${p.PriceText}`;
  const val = getPrice(p);
  if (!val) return "Price on Request";
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
  return `₹${val.toLocaleString("en-IN")}`;
}

function getFullLocation(p: RawProperty): string {
  return [p.Location?.trim(), p.City?.trim()].filter(Boolean).join(", ") || p.Landmark || "Location N/A";
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function PropertyListing() {
  const [allProperties, setAllProperties] = useState<RawProperty[]>([]);
  const [filtered, setFiltered] = useState<RawProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeOptions, setTypeOptions] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sort, setSort] = useState("");
  const [modal, setModal] = useState<RawProperty | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const PAGE_SIZE = 12;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const items: RawProperty[] = Array.isArray(data)
          ? data
          : data.data || data.properties || data.result || data.items || [];
        if (!items.length) throw new Error("empty");
        load(items);
      } catch {
        console.warn("[B2BBricks] Live API unreachable — using local snapshot.");
        load(FALLBACK_DATA);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function load(items: RawProperty[]) {
    setAllProperties(items);
    const types = [...new Set(items.map((p) => p.PropertyTypeText).filter(Boolean))];
    setTypeOptions(types);
    setLoading(false);
  }

  // ── Filter + Sort ──────────────────────────────────────────────────────────
  const applyFilters = useCallback(() => {
    const q = search.toLowerCase();
    let list = allProperties.filter((p) => {
      const hay = [p.PropertyName, p.BuildingName, p.City, p.Location, p.Landmark]
        .join(" ").toLowerCase();
      const matchQ = !q || hay.includes(q);
      const matchType = !typeFilter || p.PropertyTypeText === typeFilter;
      return matchQ && matchType;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => getPrice(a) - getPrice(b));
    if (sort === "price-desc") list = [...list].sort((a, b) => getPrice(b) - getPrice(a));
    if (sort === "name-asc") list = [...list].sort((a, b) => (a.PropertyName || "").localeCompare(b.PropertyName || ""));
    setFiltered(list);
    setPageIndex(0);
  }, [allProperties, search, typeFilter, sort]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  // ── Close modal on Escape ──────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setModal(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(pageIndex * PAGE_SIZE, pageIndex * PAGE_SIZE + PAGE_SIZE);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root {
          --cream: #f8f4ee; --warm-white: #fdfaf6; --sand: #e8dfd0;
          --terracotta: #c4622d; --terracotta-dark: #a14f22;
          --forest: #2c4a3e; --charcoal: #1e2523; --mid: #5a6660;
          --light-mid: #8a9490; --gold: #b8923a; --shadow: rgba(30,37,35,0.1);
        }
        .pl-body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--charcoal); min-height: 100vh; }
        .pl-hero { background: linear-gradient(135deg, var(--forest) 0%, #1a3028 60%, var(--charcoal) 100%); padding: 56px 40px 44px; text-align: center; position: relative; overflow: hidden; }
        .pl-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 70% 40%, rgba(184,146,58,0.15) 0%, transparent 60%); }
        .pl-hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(26px,5vw,46px); color: var(--cream); position: relative; margin-bottom: 10px; }
        .pl-hero p { color: var(--light-mid); font-size: 15px; font-weight: 300; position: relative; }

        .pl-controls { background: var(--warm-white); border-bottom: 1px solid var(--sand); padding: 14px 40px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .pl-search-wrap { position: relative; flex: 1; min-width: 200px; }
        .pl-search-wrap input { width: 100%; padding: 10px 16px 10px 40px; border: 1.5px solid var(--sand); border-radius: 8px; font-family: 'DM Sans',sans-serif; font-size: 14px; background: var(--cream); color: var(--charcoal); outline: none; transition: border-color .2s; }
        .pl-search-wrap input:focus { border-color: var(--terracotta); }
        .pl-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--light-mid); font-size: 15px; pointer-events: none; }
        .pl-select { padding: 10px 14px; border: 1.5px solid var(--sand); border-radius: 8px; font-family: 'DM Sans',sans-serif; font-size: 13px; background: var(--cream); color: var(--charcoal); cursor: pointer; outline: none; }
        .pl-select:focus { border-color: var(--terracotta); }
        .pl-count { margin-left: auto; font-size: 13px; color: var(--mid); white-space: nowrap; }

        .pl-main { padding: 28px 40px 60px; }
        .pl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 22px; }

        /* Cards */
        .pl-card { background: var(--warm-white); border-radius: 16px; overflow: hidden; box-shadow: 0 2px 16px var(--shadow); transition: transform .25s ease, box-shadow .25s ease; animation: plFadeUp .4s ease both; display: flex; flex-direction: column; cursor: pointer; }
        .pl-card:hover { transform: translateY(-5px); box-shadow: 0 10px 40px rgba(30,37,35,0.15); }
        @keyframes plFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .pl-img-wrap { position: relative; }
        .pl-img-placeholder { width: 100%; height: 190px; background: linear-gradient(135deg, var(--sand) 0%, #d5c9b8 100%); display: flex; align-items: center; justify-content: center; font-size: 48px; color: var(--light-mid); }
        .pl-img { width: 100%; height: 190px; object-fit: cover; display: block; }
        .pl-badge { position: absolute; top: 12px; left: 12px; background: var(--terracotta); color: #fff; font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; }
        .pl-neg-badge { position: absolute; top: 12px; right: 12px; background: var(--gold); color: #fff; font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 4px; }

        .pl-card-body { padding: 18px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .pl-card-name { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 600; color: var(--charcoal); line-height: 1.3; }
        .pl-card-loc { display: flex; align-items: flex-start; gap: 5px; font-size: 12px; color: var(--mid); }
        .pl-card-landmark { font-size: 11px; color: var(--light-mid); font-style: italic; }
        .pl-card-price { font-family: 'Playfair Display', serif; font-size: 21px; color: var(--terracotta); font-weight: 700; }
        .pl-price-note { font-family: 'DM Sans',sans-serif; font-size: 11px; color: var(--light-mid); font-weight: 400; margin-left: 4px; }
        .pl-rate { font-size: 11px; color: var(--light-mid); }

        .pl-specs { display: flex; flex-wrap: wrap; gap: 10px; padding-top: 8px; border-top: 1px solid var(--sand); }
        .pl-spec { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--mid); font-weight: 500; }

        .pl-card-footer { padding: 12px 18px; border-top: 1px solid var(--sand); display: flex; align-items: center; justify-content: space-between; }
        .pl-type-pill { font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--forest); background: rgba(44,74,62,0.08); padding: 4px 10px; border-radius: 20px; }
        .pl-btn { background: var(--terracotta); color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-family: 'DM Sans',sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: background .2s; }
        .pl-btn:hover { background: var(--terracotta-dark); }

        /* States */
        .pl-state { grid-column: 1/-1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; text-align: center; gap: 14px; }
        .pl-state-icon { font-size: 52px; }
        .pl-state-title { font-family: 'Playfair Display', serif; font-size: 24px; color: var(--charcoal); }
        .pl-state-sub { font-size: 14px; color: var(--mid); max-width: 340px; }
        .pl-spinner { width: 44px; height: 44px; border: 3px solid var(--sand); border-top-color: var(--terracotta); border-radius: 50%; animation: plSpin .8s linear infinite; }
        @keyframes plSpin { to { transform: rotate(360deg); } }

        /* Pagination */
        .pl-pagination { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 36px; }
        .pl-pg-btn { padding: 8px 18px; border: 1.5px solid var(--sand); border-radius: 8px; background: var(--warm-white); color: var(--charcoal); font-family: 'DM Sans',sans-serif; font-size: 13px; cursor: pointer; transition: border-color .2s, background .2s; }
        .pl-pg-btn:hover:not(:disabled) { border-color: var(--terracotta); background: var(--cream); }
        .pl-pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .pl-pg-info { font-size: 13px; color: var(--mid); }

        /* Modal */
        .pl-overlay { display: none; position: fixed; inset: 0; background: rgba(30,37,35,0.55); z-index: 500; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
        .pl-overlay.open { display: flex; }
        .pl-modal { background: var(--warm-white); border-radius: 20px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.28); animation: plModalIn .3s ease; }
        @keyframes plModalIn { from{opacity:0;transform:scale(.95) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .pl-modal-header { padding: 24px 24px 0; display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
        .pl-modal-title { font-family: 'Playfair Display', serif; font-size: 22px; line-height: 1.3; color: var(--charcoal); }
        .pl-modal-close { background: var(--sand); border: none; width: 34px; height: 34px; border-radius: 50%; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background .2s; }
        .pl-modal-close:hover { background: var(--terracotta); color: #fff; }
        .pl-modal-body { padding: 20px 24px 28px; display: flex; flex-direction: column; gap: 12px; }
        .pl-modal-price { font-family: 'Playfair Display', serif; font-size: 26px; color: var(--terracotta); font-weight: 700; }
        .pl-modal-loc { font-size: 13px; color: var(--mid); }
        .pl-modal-desc { font-size: 13px; color: var(--mid); line-height: 1.7; }
        .pl-modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: var(--cream); border-radius: 12px; padding: 14px; }
        .pl-modal-spec { display: flex; flex-direction: column; gap: 2px; }
        .pl-modal-label { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--light-mid); }
        .pl-modal-val { font-size: 14px; font-weight: 600; color: var(--charcoal); }
        .pl-modal-usp { font-size: 12px; color: var(--mid); background: rgba(44,74,62,0.06); border-radius: 8px; padding: 10px 12px; line-height: 1.6; }

        @media(max-width:600px){
          .pl-hero,.pl-controls,.pl-main{padding-left:16px;padding-right:16px;}
          .pl-grid{grid-template-columns:1fr;}
          .pl-modal-grid{grid-template-columns:1fr;}
        }
      `}</style>

      <div className="pl-body">
        {/* Hero */}
        <section className="pl-hero">
          <h1>Discover Premium Properties</h1>
          <p>Curated listings from across India — find your perfect investment</p>
        </section>

        {/* Controls */}
        <div className="pl-controls">
          <div className="pl-search-wrap">
            <span className="pl-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, city, location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="pl-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="pl-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A–Z</option>
          </select>
          {!loading && (
            <span className="pl-count">
              {filtered.length} propert{filtered.length === 1 ? "y" : "ies"} found
            </span>
          )}
        </div>

        {/* Grid */}
        <main className="pl-main">
          <div className="pl-grid">
            {loading ? (
              <div className="pl-state">
                <div className="pl-spinner" />
                <div className="pl-state-title">Fetching Properties…</div>
                <div className="pl-state-sub">Connecting to B2BBricks API</div>
              </div>
            ) : paged.length === 0 ? (
              <div className="pl-state">
                <div className="pl-state-icon">🏚️</div>
                <div className="pl-state-title">No Properties Found</div>
                <div className="pl-state-sub">Try adjusting your search or filter criteria.</div>
              </div>
            ) : (
              paged.map((p, i) => <PropertyCard key={p.Id} p={p} idx={i} onOpen={setModal} />)
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pl-pagination">
              <button className="pl-pg-btn" disabled={pageIndex === 0} onClick={() => setPageIndex((n) => n - 1)}>← Prev</button>
              <span className="pl-pg-info">Page {pageIndex + 1} of {totalPages}</span>
              <button className="pl-pg-btn" disabled={pageIndex >= totalPages - 1} onClick={() => setPageIndex((n) => n + 1)}>Next →</button>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      <div
        className={`pl-overlay${modal ? " open" : ""}`}
        onClick={(e) => { if (e.target === e.currentTarget) setModal(null); }}
      >
        {modal && <PropertyModal p={modal} onClose={() => setModal(null)} />}
      </div>
    </>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
function PropertyCard({ p, idx, onOpen }: { p: RawProperty; idx: number; onOpen: (p: RawProperty) => void }) {
  const name = p.BuildingName || p.PropertyName || "Unnamed Property";
  const loc = getFullLocation(p);
  const price = formatPrice(p);
  const saleAreaText = p.SaleAreaText || (p.SaleArea ? p.SaleArea + " Sq.Ft." : "");
  const carpetAreaText = p.CarpetAreaText || (p.CarpetArea ? p.CarpetArea + " Sq.Ft." : "");
  const areaDisplay = carpetAreaText || saleAreaText;
  const img = p.ImageUrl || p.Url || "";

  return (
    <div
      className="pl-card"
      style={{ animationDelay: `${idx * 0.06}s` }}
      onClick={() => onOpen(p)}
    >
      <div className="pl-img-wrap">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="pl-img" src={img} alt={name} loading="lazy"
            onError={(e) => { (e.currentTarget.parentElement!).innerHTML = '<div class="pl-img-placeholder">🏢</div>'; }} />
        ) : (
          <div className="pl-img-placeholder">🏢</div>
        )}
        {p.WantToText && <div className="pl-badge">{p.WantToText}</div>}
        {p.IsNegotiable && <div className="pl-neg-badge">Negotiable</div>}
      </div>

      <div className="pl-card-body">
        <div className="pl-card-name">{name}</div>
        <div className="pl-card-loc">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0,marginTop:1}}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {loc}
        </div>
        {p.Landmark && <div className="pl-card-landmark">{p.Landmark}</div>}

        <div className="pl-card-price">
          {price}
          {p.WantToText === "Rent" && <span className="pl-price-note">/ month</span>}
        </div>
        {p.Rate && <div className="pl-rate">@ ₹{p.Rate} / Sq.Ft.</div>}

        {(areaDisplay || p.FloorNumber || p.Furnishing) && (
          <div className="pl-specs">
            {areaDisplay && (
              <span className="pl-spec">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b8923a" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                {areaDisplay}
              </span>
            )}
            {p.FloorNumber && (
              <span className="pl-spec">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b8923a" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                Floor {p.FloorNumber}{p.TotalFloor ? `/${p.TotalFloor}` : ""}
              </span>
            )}
            {p.Furnishing && (
              <span className="pl-spec">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b8923a" strokeWidth="2"><path d="M20 9V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z"/></svg>
                {p.Furnishing}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="pl-card-footer">
        {p.PropertyTypeText ? <span className="pl-type-pill">{p.PropertyTypeText}</span> : <span />}
        <button
          className="pl-btn"
          onClick={(e) => { e.stopPropagation(); onOpen(p); }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function PropertyModal({ p, onClose }: { p: RawProperty; onClose: () => void }) {
  const name = p.BuildingName || p.PropertyName || "Property";
  const loc = getFullLocation(p);
  const price = formatPrice(p);
  const saleAreaText = p.SaleAreaText || (p.SaleArea ? p.SaleArea + " Sq.Ft." : "");
  const carpetAreaText = p.CarpetAreaText || (p.CarpetArea ? p.CarpetArea + " Sq.Ft." : "");
  const img = p.ImageUrl || p.Url || "";
  const desc = p.Description || p.WebsiteKeyword || "";

  const specs: [string, string][] = [
    p.PropertyTypeText && ["Property Type", p.PropertyTypeText],
    p.WantToText && ["Listed For", p.WantToText],
    saleAreaText && ["Sale Area", saleAreaText],
    carpetAreaText && ["Carpet Area", carpetAreaText],
    p.FloorNumber && ["Floor", p.FloorNumber + (p.TotalFloor ? ` of ${p.TotalFloor}` : "")],
    p.Furnishing && ["Furnishing", p.Furnishing],
    p.Ownership && ["Ownership", p.Ownership],
    p.NoOfParking && ["Parking", p.NoOfParking + " spots"],
    p.Possession && ["Possession", p.Possession],
    p.Transaction && ["Transaction", p.Transaction],
    p.Suitable && ["Suitable For", p.Suitable],
    p.Rate && ["Rate", `₹${p.Rate} / Sq.Ft.`],
  ].filter(Boolean) as [string, string][];

  return (
    <div className="pl-modal">
      <div className="pl-modal-header">
        <div className="pl-modal-title">{name}</div>
        <button className="pl-modal-close" onClick={onClose}>✕</button>
      </div>
      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img} alt={name}
          style={{ width: "100%", height: 240, objectFit: "cover", marginTop: 16 }}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      )}
      <div className="pl-modal-body">
        <div className="pl-modal-price">
          {price}{p.WantToText === "Rent" ? " / month" : ""}
        </div>
        <div className="pl-modal-loc">
          📍 {loc}{p.Landmark ? ` — ${p.Landmark}` : ""}
        </div>
        {desc && <div className="pl-modal-desc">{desc}</div>}

        {specs.length > 0 && (
          <div className="pl-modal-grid">
            {specs.map(([label, val]) => (
              <div key={label} className="pl-modal-spec">
                <span className="pl-modal-label">{label}</span>
                <span className="pl-modal-val">{val}</span>
              </div>
            ))}
          </div>
        )}

        {p.Unique && (
          <div className="pl-modal-usp">
            ✦ {p.Unique}
          </div>
        )}

        {p.RefNumber && (
          <div style={{ fontSize: 11, color: "var(--light-mid)", textAlign: "right" }}>
            Ref: {p.RefNumber} · Updated: {p.LastUpdated}
          </div>
        )}
      </div>
    </div>
  );
}