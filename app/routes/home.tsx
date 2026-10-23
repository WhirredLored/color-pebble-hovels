import React, { useState, useRef, useCallback, useEffect } from "react";
import type { Route } from "./+types/home";
import {
  Paintbrush,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Sparkles,
  Star,
  ChevronRight,
  Sliders,
  X,
  Building2,
  Home as HomeIcon,
  Ruler,
  FileText,
  Check,
  ChevronDown,
  Layers,
  Droplets,
  Pencil,
  Trash2,
  ImagePlus,
  Lock,
  LogOut,
  RotateCcw,
  Save,
  PlusCircle,
  Upload,
  Eye,
  KeyRound,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface GalleryItem {
  id: number;
  title: string;
  category: string;
  location: string;
  image: string;
  badge: string;
  paintColor: string;
  scope: string;
  duration: string;
}

interface SayrePair {
  id: string;
  label: string;
  before: string;
  after: string;
  notes: string;
}

interface EditableContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  phone: string;
  email: string;
  address: string;
  galleryItems: GalleryItem[];
  sayrePairs: SayrePair[];
}

// ─── Default Content ─────────────────────────────────────────────────────────
const DEFAULT_CONTENT: EditableContent = {
  heroTitle: "Huestones Paint Restoration LLC",
  heroSubtitle: "Premier residential & commercial painting contractors. We specialize in high-end exterior restoration, precision interior painting, cabinet spray refinishing, and historic estate preservation.",
  heroImage: "/images/hero.png",
  phone: "(800) 555-HUESTONE",
  email: "estimates@huestonehomes.com",
  address: "100 Restoration Way, Suite 400 • Serving Metropolitan & Surrounding Counties",
  sayrePairs: [
    {
      id: "south",
      label: "South Elevation Siding",
      before: "/images/Sayre-3-001/Sayre Start 1 South.jpg",
      after: "/images/Sayre-3-001/South-East Sided 1.JPG",
      notes: "Complete wood rot tear-out, structural firring, & hand-brushed siding restoration."
    },
    {
      id: "east",
      label: "East Facade & Window Trim",
      before: "/images/Sayre-3-001/Sayre Start 4 East.jpg",
      after: "/images/Sayre-3-001/Window 1 Complete 1.JPG",
      notes: "Restored architectural window sills, head casing, & zero-VOC weather coating."
    },
    {
      id: "bay",
      label: "Bay Window & Sill Craftsman",
      before: "/images/Sayre-3-001/Sayre_1of2/Bay Rot 1.JPG",
      after: "/images/Sayre-3-001/Sayre_2of2/Front Sills Installed.JPG",
      notes: "Full historic millwork reproduction with custom table saw profiles & urethane sealing."
    }
  ],
  galleryItems: [
    {
      id: 1,
      title: "The Sayre Residence Historic Window & Siding Restoration",
      category: "Historic",
      location: "Sayre Project Estate",
      image: "/images/Sayre-3-001/Window 1 Complete 1.JPG",
      badge: "Sayre Album",
      paintColor: "Sherwin-Williams Duration Extra White & Historic Timber",
      scope: "Complete wood rot tear-out, custom sill bit milling, structural firring, & 2-coat weather protection.",
      duration: "8 Days",
    },
    {
      id: 2,
      title: "Sayre Estate South Elevation Siding Reconstruction",
      category: "Exterior",
      location: "Sayre Project Estate",
      image: "/images/Sayre-3-001/South-East Sided 1.JPG",
      badge: "Sayre Album",
      paintColor: "Sherwin-Williams Emerald Exterior & Cedar Primer",
      scope: "Structural wall fir-out, weather wrapping, & precision cedar lap siding installation with urethane seal.",
      duration: "6 Days",
    },
    {
      id: 3,
      title: "Sayre Craftsman Bay Window Sill Milling",
      category: "Historic",
      location: "Sayre Project Estate",
      image: "/images/Sayre-3-001/Sayre_2of2/Front Sills Installed.JPG",
      badge: "Custom Millwork",
      paintColor: "Linseed Oil Primer & Alkyd Topcoat",
      scope: "Custom table saw profile replication for historic bay window sills and rot remediation.",
      duration: "5 Days",
    },
    {
      id: 4,
      title: "Luxury Kitchen Cabinet Spray Refinishing",
      category: "Cabinets",
      location: "Highland Park",
      image: "/images/cabinet.png",
      badge: "Factory Spray",
      paintColor: "Milesi 2K Satin Navy & Brass Hardware Accent",
      scope: "Off-site HVLP spray refinishing of 38 cabinet doors, custom conversion varnish, soft-close hardware install.",
      duration: "5 Days",
    },
    {
      id: 5,
      title: "Craftsman Residence Interior Renewal",
      category: "Interior",
      location: "Pemberton Heights",
      image: "/images/interior.png",
      badge: "Zero-VOC Interior",
      paintColor: "Benjamin Moore Swiss Coffee & Hale Navy Accent Wall",
      scope: "Double-height living room drywall repair, ceiling restoration, dustless sanding, baseboard precision trim.",
      duration: "4 Days",
    },
    {
      id: 6,
      title: "The Oakridge Estate Exterior Restoration",
      category: "Exterior",
      location: "Westlake Heights",
      image: "/images/hero.png",
      badge: "Full Restoration",
      paintColor: "Sherwin-Williams Naval SW 6244 with Extra White Trim",
      scope: "Complete exterior wood repair, power washing, 2 coats elastomeric primer, hand-brushed cedar trim.",
      duration: "6 Days",
    },
  ],
};

const ADMIN_PASSWORD = "huestones2026";
const STORAGE_KEY = "huestones_cms_content";

// ─── Inline Editable Text Component ──────────────────────────────────────────
function EditableText({
  value,
  onSave,
  isAdmin,
  multiline = false,
  className = "",
  placeholder = "Click to edit...",
}: {
  value: string;
  onSave: (v: string) => void;
  isAdmin: boolean;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => { setDraft(value); }, [value]);

  if (!isAdmin) {
    return <span className={className}>{value}</span>;
  }

  if (editing) {
    const common = {
      className: `w-full bg-slate-950 border border-amber-500 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 ${className}`,
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      onBlur: () => { onSave(draft); setEditing(false); },
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Escape") { setDraft(value); setEditing(false); }
        if (e.key === "Enter" && !multiline) { onSave(draft); setEditing(false); }
      },
      autoFocus: true,
    };
    return multiline ? <textarea rows={3} {...common} /> : <input type="text" {...common} />;
  }

  return (
    <span
      className={`relative group/edit cursor-pointer ${className}`}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {value || placeholder}
      <span className="inline-flex items-center gap-1 ml-2 opacity-0 group-hover/edit:opacity-100 transition-opacity align-middle">
        <span className="bg-amber-500 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
          Edit
        </span>
      </span>
    </span>
  );
}

// ─── Image Upload Button ──────────────────────────────────────────────────────
function ImageUploadButton({
  onUpload,
  label = "Replace Photo",
  small = false,
}: {
  onUpload: (dataUrl: string) => void;
  label?: string;
  small?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onUpload(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  return (
    <>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={`flex items-center gap-1.5 font-semibold rounded-lg transition-all ${
          small
            ? "px-2 py-1 text-[10px] bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/40"
            : "px-3 py-2 text-xs bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/40"
        }`}
      >
        <Upload className={small ? "w-3 h-3" : "w-3.5 h-3.5"} />
        {label}
      </button>
    </>
  );
}

export function meta() {
  return [
    { title: "Huestones Paint Restoration LLC | www.huestonehomes.com" },
    {
      name: "description",
      content:
        "Huestones Paint Restoration LLC - Premier painting contractor specializing in residential & commercial exterior restoration, fine interior painting, cabinet refinishing, and historic architectural coatings. Visit www.huestonehomes.com.",
    },
  ];
}

export async function loader() {
  return {
    domain: "www.huestonehomes.com",
    phone: "(800) 555-HUESTONE",
    phoneNumeric: "5553827866",
    email: "estimates@huestonehomes.com",
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  // ── Admin Auth State ──────────────────────────────────────────────────────
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // ── CMS Editable Content ─────────────────────────────────────────────────
  const [content, setContent] = useState<EditableContent>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return { ...DEFAULT_CONTENT, ...JSON.parse(saved) };
      } catch {}
    }
    return DEFAULT_CONTENT;
  });

  const updateContent = useCallback(<K extends keyof EditableContent>(key: K, value: EditableContent[K]) => {
    setContent(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  }, []);

  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    setHasUnsavedChanges(false);
  };

  const resetToDefaults = () => {
    if (confirm("Reset ALL content to factory defaults? This cannot be undone.")) {
      localStorage.removeItem(STORAGE_KEY);
      setContent(DEFAULT_CONTENT);
      setHasUnsavedChanges(false);
    }
  };

  // Destructure content for easy access
  const { heroTitle, heroSubtitle, heroImage, phone, email, address, sayrePairs, galleryItems } = content;

  // ── Gallery CRUD ──────────────────────────────────────────────────────────
  const deleteGalleryItem = (id: number) => {
    updateContent("galleryItems", galleryItems.filter(g => g.id !== id));
  };

  const updateGalleryItem = (id: number, field: keyof GalleryItem, value: string) => {
    updateContent("galleryItems", galleryItems.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const addGalleryItem = () => {
    const newItem: GalleryItem = {
      id: Date.now(),
      title: "New Project — Click to Edit Title",
      category: "Exterior",
      location: "Location — Click to Edit",
      image: "/images/hero.png",
      badge: "New Project",
      paintColor: "Paint Color — Click to Edit",
      scope: "Project description — Click to edit this scope.",
      duration: "— Days",
    };
    updateContent("galleryItems", [...galleryItems, newItem]);
  };

  // ── Sayre Pairs CRUD ──────────────────────────────────────────────────────
  const updateSayrePair = (idx: number, field: keyof SayrePair, value: string) => {
    const updated = sayrePairs.map((p, i) => i === idx ? { ...p, [field]: value } : p);
    updateContent("sayrePairs", updated);
  };



  // ── Admin Login Handler ───────────────────────────────────────────────────
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setShowLoginModal(false);
      setLoginPassword("");
      setLoginError("");
    } else {
      setLoginError("Incorrect passcode. Try again.");
    }
  };

  // ── Standard Page State ───────────────────────────────────────────────────
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const isDragging = useRef(false);
  const [estimatorType, setEstimatorType] = useState<string>("exterior");
  const [estimatorSize, setEstimatorSize] = useState<number>(2500);
  const [estimatorCondition, setEstimatorCondition] = useState<string>("moderate");
  const [estimatorGrade, setEstimatorGrade] = useState<string>("ultra");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "",
    service: "Exterior Paint & Restoration",
    address: "", timeline: "Within 2 Weeks", notes: "",
  });
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const [activeSayreIndex, setActiveSayreIndex] = useState<number>(0);
  const currentSayre = sayrePairs[activeSayreIndex] ?? sayrePairs[0];

  // Service Data
  const services = [
    {
      id: 1,
      title: "Exterior Paint & Restoration",
      shortDesc: "Complete weatherproofing, wood repair, and elastomeric coating systems built to withstand extreme elements.",
      fullDesc: "Our flagship exterior paint restoration service revives weathered facades. We don't just paint—we repair wood rot, replace damaged trim, scrape to sound wood, power wash, apply high-build primers, and finish with dual coats of premium exterior coatings.",
      image: "/images/hero.png",
      features: [
        "High-pressure wash & mildew elimination",
        "Wood rot repair & epoxy filler restoration",
        "Caulking with 50-year urethane sealants",
        "Dual coats of Sherwin-Williams Emerald or Duration",
        "10-Year Weatherproof Guarantee"
      ],
      idealFor: "Single-family estates, historical siding, stucco, and wood trim.",
      turnaround: "4 - 7 Business Days",
      paints: "Sherwin-Williams Emerald Exterior / Benjamin Moore Regal Select",
      icon: HomeIcon,
    },
    {
      id: 2,
      title: "Precision Interior Painting",
      shortDesc: "Flawless wall finishes, dust-free prep, sharp trim lines, and low-VOC eco-friendly paints for healthy living.",
      fullDesc: "Transform your home's interior with surgical precision. We protect floors and furniture with heavy canvas drop cloths, patch drywall imperfections, sand smoothly with HEPA dust extractors, and apply flawless satin or eggshell coatings.",
      image: "/images/interior.png",
      features: [
        "HEPA dustless sanding & full room masking",
        "Drywall patching, texture matching & crack repair",
        "Hand-brushed trim, baseboards, & crown molding",
        "Zero-VOC eco paints (safe for kids & pets)",
        "Color palette design consultation included"
      ],
      idealFor: "Living rooms, master suites, double-height foyers, & open floor plans.",
      turnaround: "2 - 5 Business Days",
      paints: "Benjamin Moore Aura Interior / Sherwin-Williams Emerald Latex",
      icon: Paintbrush,
    },
    {
      id: 3,
      title: "Cabinet Refinishing & Spraying",
      shortDesc: "Factory-smooth lacquer and conversion varnish finishes that save thousands compared to full cabinet replacement.",
      fullDesc: "Upgrade your kitchen or bathroom with our spray finish cabinet restoration. We remove doors and drawer fronts, bring them to our controlled spray facility, degrease, prime with stain-blocking lacquer, and apply dual coats of high-durability polyurethane finish.",
      image: "/images/cabinet.png",
      features: [
        "Off-site HVLP factory spray booth finishing",
        "High-durability conversion varnish coatings",
        "Hardware hole filling & repositioning",
        "Stain-resistant, wipe-clean satin or matte finish",
        "Save up to 70% compared to new cabinet installation"
      ],
      idealFor: "Kitchen cabinets, bathroom vanities, built-in library shelving.",
      turnaround: "5 - 7 Business Days",
      paints: "Milesi 2K Polyurethane / Renner Italian Coatings",
      icon: Sparkles,
    },
    {
      id: 4,
      title: "Historic & Architectural Restoration",
      shortDesc: "Meticulous lead-safe restoration honoring original architectural trim, heritage colors, and historic millwork.",
      fullDesc: "Preserving heritage structures requires specialized expertise. As an EPA Lead-Safe Certified firm, we carefully restore Victorian, Craftsman, and Colonial properties using period-appropriate materials and hand craftsmanship.",
      image: "/images/historic.png",
      features: [
        "EPA Lead-Safe RRP Certified containment & removal",
        "Architectural trim hand stripping & carving repair",
        "Historical color palette research & custom mixing",
        "Breathable linseed oil & oil-alkyd primers",
        "Historical landmark board compliance"
      ],
      idealFor: "Historic landmark homes, Victorian trim, cedar shake shingle estates.",
      turnaround: "7 - 14 Business Days",
      paints: "Fine Paints of Europe / Sherwin-Williams Duration",
      icon: Award,
    },
    {
      id: 5,
      title: "Commercial & HOA Coatings",
      shortDesc: "High-performance protective coatings for office parks, retail fronts, and multi-family HOA communities.",
      fullDesc: "Commercial property painting executed with minimal disruption to tenants and customers. We offer night and weekend scheduling, elastomeric waterproof coatings, parking lot line striping, and anti-graffiti sealants.",
      image: "/images/hero.png",
      features: [
        "Flexible off-hours (nights & weekends) scheduling",
        "Elastomeric masonry & stucco coatings",
        "Metal deck, railing, & fire escape corrosion protection",
        "$2,000,000 commercial general liability coverage",
        "Dedicated project superintendent"
      ],
      idealFor: "Commercial complexes, HOA communities, retail facades, & office buildings.",
      turnaround: "Custom Project Schedule",
      paints: "PPG Pitt-Tech Heavy Commercial / SW ConFlex Elastomeric",
      icon: Building2,
    },
    {
      id: 6,
      title: "Deck, Porch & Exterior Wood Staining",
      shortDesc: "Deep wood cleaning, power stripping, UV protection sealants, and teak oil treatments for outdoor living.",
      fullDesc: "Restore the warm beauty of cedar, redwood, teak, and pressure-treated wood decks. We strip old peeling stains, neutralize wood pH, sand splinters, and saturate the grain with deep-penetrating oil or translucent stains.",
      image: "/images/historic.png",
      features: [
        "Chemical stripping & pH wood neutralization",
        "Splinter removal & surface deck sanding",
        "Penetrating oil & semi-transparent UV stains",
        "Water-repellent mold & mildew barrier",
        "Extends wood lifecycle by 10+ years"
      ],
      idealFor: "Pool decks, outdoor pergolas, cedar fences, & covered porches.",
      turnaround: "2 - 3 Business Days",
      paints: "TWP 1500 Series / Cabot Australian Timber Oil",
      icon: Droplets,
    },
  ];

  const filteredGallery =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  // Estimator Price Calculation
  const calculateEstimate = () => {
    let baseRate = 2.5; // per sq ft or room
    if (estimatorType === "interior") baseRate = 2.2;
    if (estimatorType === "cabinets") baseRate = 85; // per door/drawer unit
    if (estimatorType === "deck") baseRate = 3.5;

    let conditionMultiplier = 1.0;
    if (estimatorCondition === "moderate") conditionMultiplier = 1.25;
    if (estimatorCondition === "heavy") conditionMultiplier = 1.55;

    let gradeMultiplier = 1.0;
    if (estimatorGrade === "ultra") gradeMultiplier = 1.2;
    if (estimatorGrade === "specialty") gradeMultiplier = 1.45;

    const estimatedLow = Math.round(estimatorSize * baseRate * conditionMultiplier * gradeMultiplier * 0.9);
    const estimatedHigh = Math.round(estimatorSize * baseRate * conditionMultiplier * gradeMultiplier * 1.15);

    return { low: estimatedLow, high: estimatedHigh };
  };

  const estimateResult = calculateEstimate();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const faqs = [
    {
      q: "What makes Huestones Paint Restoration LLC different from standard painters?",
      a: "Unlike typical painters who apply quick topcoats over old paint, Huestones focuses on full surface restoration. We repair damaged substrate wood, perform dust-free HEPA sanding, use 50-year urethane caulking, and apply dual coats of industrial-grade paint backed by our 10-Year Guarantee."
    },
    {
      q: "Are you licensed, insured, and lead-safe certified?",
      a: "Yes. Huestones Paint Restoration LLC carries $2,000,000 in Commercial General Liability Insurance and full Workers' Compensation. We are also EPA Lead-Safe RRP Certified, guaranteeing safe containment on pre-1978 properties."
    },
    {
      q: "How long does a typical exterior or cabinet project take?",
      a: "Most exterior home restorations take 4 to 7 business days depending on surface prep needs. Cabinet refinishing takes about 5 to 7 business days, with doors refinished in our off-site spray booth."
    },
    {
      q: "What paint brands and coatings do you use?",
      a: "We only use top-tier professional product lines, including Sherwin-Williams Emerald & Duration, Benjamin Moore Aura & Regal Select, and Milesi Italian 2K Polyurethanes for cabinets."
    },
    {
      q: "How do I get an exact quote for my project?",
      a: "You can use our interactive cost estimator on www.huestonehomes.com or fill out our online request form. We will schedule a free on-site consultation to measure, inspect surfaces, and provide a detailed written proposal."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

      {/* ───── ADMIN LOGIN MODAL ───── */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-amber-500/30 shadow-2xl shadow-amber-500/10 p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white font-serif">Admin Access</h3>
              <p className="text-xs text-slate-400">Enter your Huestones CMS passcode to enable edit mode.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Passcode</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={e => { setLoginPassword(e.target.value); setLoginError(""); }}
                  placeholder="Enter admin passcode"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                {loginError && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <X className="w-3 h-3" /> {loginError}
                  </p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowLoginModal(false); setLoginPassword(""); setLoginError(""); }}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-500 text-slate-950 text-sm font-bold hover:bg-amber-400 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Unlock Edit Mode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───── FLOATING ADMIN BAR ───── */}
      {isAdminLoggedIn && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-wrap items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 shadow-2xl shadow-amber-500/10 text-xs font-semibold">
          <div className="flex items-center gap-2 text-amber-400 border-r border-slate-700 pr-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <Pencil className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest text-[10px]">Edit Mode Active</span>
          </div>
          <div className="text-slate-400 border-r border-slate-700 pr-3">
            <span className="text-white font-bold">{galleryItems.length}</span> Gallery Items
          </div>
          <button
            onClick={saveToStorage}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
              hasUnsavedChanges
                ? "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/30"
                : "bg-slate-800 text-slate-400"
            }`}
            disabled={!hasUnsavedChanges}
          >
            <Save className="w-3.5 h-3.5" />
            {hasUnsavedChanges ? "Save Changes" : "All Saved"}
          </button>
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-slate-800 text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={() => { setIsAdminLoggedIn(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Exit Edit Mode
          </button>
        </div>
      )}

      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-slate-900 border-b border-slate-800 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              EPA Lead-Safe Certified Contractor
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-400">
              10-Year Workmanship Warranty
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-400">
              Official Site: <strong className="text-slate-200">www.huestonehomes.com</strong>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href={`tel:${loaderData.phoneNumeric}`}
              className="flex items-center gap-1.5 font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{loaderData.phone}</span>
            </a>
            <a
              href="#contact"
              className="hidden sm:flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{loaderData.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN STICKY NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Paintbrush className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-xl tracking-tight text-white font-serif">
                  HUESTONES
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                  Restoration
                </span>
              </div>
              <p className="text-[10px] tracking-wider text-slate-400 font-medium uppercase">
                Paint Restoration LLC • www.huestonehomes.com
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#services" className="hover:text-amber-400 transition-colors">
              Services
            </a>
            <a href="#transformations" className="hover:text-amber-400 transition-colors">
              Before & After
            </a>
            <a href="#gallery" className="hover:text-amber-400 transition-colors">
              Gallery
            </a>
            <a href="#estimator" className="hover:text-amber-400 transition-colors">
              Cost Estimator
            </a>
            <a href="#process" className="hover:text-amber-400 transition-colors">
              Our Process
            </a>
            <a href="#contact" className="hover:text-amber-400 transition-colors">
              Contact
            </a>
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40 active:scale-[0.98]"
            >
              Get Free Estimate
            </a>
            {/* Admin Toggle Button */}
            <button
              onClick={() => isAdminLoggedIn ? setIsAdminLoggedIn(false) : setShowLoginModal(true)}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all border ${
                isAdminLoggedIn
                  ? "bg-amber-500/20 border-amber-500 text-amber-300"
                  : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300"
              }`}
              title={isAdminLoggedIn ? "Exit Edit Mode" : "Admin Login"}
            >
              {isAdminLoggedIn ? <Eye className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span className="hidden lg:inline">{isAdminLoggedIn ? "Editing" : "Admin"}</span>
            </button>
            <a
              href={`tel:${loaderData.phoneNumeric}`}
              className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 hover:bg-slate-800"
              aria-label="Call Huestones"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        {/* Hero Background Image & Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Huestones Paint Restoration LLC Restored Home Exterior"
            className="w-full h-full object-cover object-center scale-105 filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
          {isAdminLoggedIn && (
            <div className="absolute bottom-4 right-4 z-30">
              <ImageUploadButton
                onUpload={(dataUrl) => updateContent("heroImage", dataUrl)}
                label="Replace Hero Image"
              />
            </div>
          )}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Website: www.huestonehomes.com</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] font-serif">
              <EditableText
                value={heroTitle}
                onSave={(v) => updateContent("heroTitle", v)}
                isAdmin={isAdminLoggedIn}
              />
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
              <EditableText
                value={heroSubtitle}
                onSave={(v) => updateContent("heroSubtitle", v)}
                isAdmin={isAdminLoggedIn}
                multiline
              />
            </p>

            {/* Badges / Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm text-slate-200 bg-slate-900/60 border border-slate-800 p-2.5 rounded-lg backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>10-Yr Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-200 bg-slate-900/60 border border-slate-800 p-2.5 rounded-lg backdrop-blur-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Lead-Safe Certified</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-200 bg-slate-900/60 border border-slate-800 p-2.5 rounded-lg backdrop-blur-sm col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>5.0★ Rating (500+)</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-xl shadow-amber-500/25 transition-all text-base hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Request Free On-Site Quote</span>
                <ChevronRight className="w-5 h-5 ml-2" />
              </a>
              <a
                href="#transformations"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 backdrop-blur-md transition-all text-base hover:text-white"
              >
                <span>View Before & After</span>
              </a>
            </div>
          </div>

          {/* Right Hero Column: Floating Stats & Card */}
          <div className="lg:col-span-5 hidden lg:block relative">
            <div className="glass-card rounded-2xl p-6 space-y-6 shadow-2xl border-slate-700/50">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">Huestones Craftsmanship</h3>
                  <p className="text-xs text-slate-400">Serving Residential & Commercial Estates</p>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <HomeIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">500+ Fine Homes Restored</h4>
                    <p className="text-xs text-slate-400">Over 15 years of precision surface prep & premium paint application.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">100% Satisfaction Guarantee</h4>
                    <p className="text-xs text-slate-400">No final payment until you complete & sign off on our white-glove walk-through.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">Off-Site Spray Refinishing</h4>
                    <p className="text-xs text-slate-400">Kitchen cabinet doors sprayed in climate-controlled HVLP spray booth.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center border-t border-slate-800/80">
                <a
                  href={`tel:${loaderData.phoneNumeric}`}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Direct: {loaderData.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES OFFERED SECTION */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Paintbrush className="w-3.5 h-3.5" />
            <span>Comprehensive Contractor Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
            Our Painting & Restoration Services
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            From exterior weatherproofing to furniture-grade cabinet spray lacquer, Huestones Paint Restoration LLC delivers uncompromising quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col group"
              >
                {/* Service Image Cover */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute top-3 left-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-amber-400 backdrop-blur-md">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Service Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors font-serif">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      {service.shortDesc}
                    </p>

                    <ul className="space-y-2 text-xs text-slate-300">
                      {service.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      Est: {service.turnaround}
                    </span>
                    <button
                      onClick={() => setSelectedService(service.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <span>Explore Specs</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. INTERACTIVE BEFORE & AFTER SLIDER SHOWCASE (SAYRE ALBUM) */}
      <section id="transformations" className="py-20 bg-slate-900/60 border-y border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5" />
              <span>Sayre Restoration Album</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
              Before & After Restoration
            </h2>
            <p className="text-slate-300 leading-relaxed text-base">
              Drag the slider to examine real transformation shots from our <strong>Sayre Residence Project</strong>—from severely rotted cedar sills & peeling siding to fully restored architectural perfection.
            </p>

            {/* Elevation Preset Selection Tabs */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select Sayre Album View:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {sayrePairs.map((pair, idx) => (
                  <button
                    key={pair.id}
                    type="button"
                    onClick={() => {
                      setActiveSayreIndex(idx);
                      setSliderPosition(50);
                    }}
                    className={`p-3 rounded-xl text-left text-xs font-semibold transition-all border flex items-center justify-between ${
                      activeSayreIndex === idx
                        ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-md shadow-amber-500/10"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <span>
                      <EditableText
                        value={pair.label}
                        onSave={(v) => updateSayrePair(idx, "label", v)}
                        isAdmin={isAdminLoggedIn}
                      />
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeSayreIndex === idx ? "translate-x-1 text-amber-400" : "text-slate-600"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-500/20 text-xs space-y-1.5">
              <span className="font-bold text-amber-400 block uppercase tracking-wider">Sayre Scope Highlight:</span>
              <p className="text-slate-300">
                <EditableText
                  value={currentSayre.notes}
                  onSave={(v) => updateSayrePair(activeSayreIndex, "notes", v)}
                  isAdmin={isAdminLoggedIn}
                  multiline
                />
              </p>
            </div>

            {/* Admin: Before/After Image Upload */}
            {isAdminLoggedIn && (
              <div className="flex gap-2 pt-2">
                <ImageUploadButton
                  onUpload={(dataUrl) => updateSayrePair(activeSayreIndex, "before", dataUrl)}
                  label="Replace Before Photo"
                  small
                />
                <ImageUploadButton
                  onUpload={(dataUrl) => updateSayrePair(activeSayreIndex, "after", dataUrl)}
                  label="Replace After Photo"
                  small
                />
              </div>
            )}
          </div>

          {/* Interactive Drag Comparison Component using Sayre Album */}
          <div className="lg:col-span-7">
            <div className="relative h-[380px] sm:h-[480px] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 select-none group">
              {/* After Image (Full width background) */}
              <img
                src={currentSayre.after}
                alt={`After Restoration - ${currentSayre.label}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider shadow-lg">
                AFTER: Restored Finish
              </div>

              {/* Before Image (Clipped overlay) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={currentSayre.before}
                  alt={`Before Restoration - ${currentSayre.label}`}
                  className="absolute inset-0 w-full h-full object-cover filter contrast-110 saturate-75 brightness-90"
                  style={{ width: "100%", maxWidth: "none" }}
                />
                <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider shadow-lg">
                  BEFORE: Damaged & Rotted
                </div>
              </div>

              {/* Slider Line & Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-amber-400 cursor-ew-resize shadow-[0_0_15px_rgba(217,119,6,0.8)]"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg font-bold">
                  <Sliders className="w-5 h-5 rotate-90" />
                </div>
              </div>

              {/* Range Input Overlay for accessibility and touch dragging */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                aria-label="Sayre Album Before and After Comparison Slider"
              />
            </div>
            <p className="text-center text-xs text-slate-400 mt-3">
              Drag left or right to inspect Huestones restoration craftsmanship on the Sayre Residence.
            </p>
          </div>
        </div>
      </section>

      {/* 6. GALLERY COVER THUMBNAILS & LIGHTBOX MODAL */}
      <section id="gallery" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <FileText className="w-3.5 h-3.5" />
              <span>Contractor Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
              Gallery Cover Thumbnails
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Browse recent residential & commercial restoration projects executed by Huestones Paint Restoration LLC.
            </p>
          </div>

          {/* Filter Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Exterior", "Interior", "Cabinets", "Historic"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold"
                    : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => !isAdminLoggedIn && setSelectedGalleryItem(item.id)}
              className="glass-card glass-card-hover rounded-2xl overflow-hidden cursor-pointer group flex flex-col relative"
            >
              {/* Admin overlay controls */}
              {isAdminLoggedIn && (
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                  <ImageUploadButton
                    onUpload={(dataUrl) => updateGalleryItem(item.id, "image", dataUrl)}
                    label="Photo"
                    small
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); deleteGalleryItem(item.id); }}
                    className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/40 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              )}

              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-amber-400 border border-amber-500/30">
                  <EditableText
                    value={item.badge}
                    onSave={(v) => updateGalleryItem(item.id, "badge", v)}
                    isAdmin={isAdminLoggedIn}
                  />
                </div>

                <div className="absolute bottom-4 left-4 right-4 space-y-1">
                  <p className="text-xs text-amber-400 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <EditableText
                      value={item.location}
                      onSave={(v) => updateGalleryItem(item.id, "location", v)}
                      isAdmin={isAdminLoggedIn}
                    />
                  </p>
                  <h3 className="text-lg font-bold text-white font-serif group-hover:text-amber-400 transition-colors">
                    <EditableText
                      value={item.title}
                      onSave={(v) => updateGalleryItem(item.id, "title", v)}
                      isAdmin={isAdminLoggedIn}
                    />
                  </h3>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-slate-900/50">
                <p className="text-xs text-slate-300 line-clamp-2">
                  <EditableText
                    value={item.scope}
                    onSave={(v) => updateGalleryItem(item.id, "scope", v)}
                    isAdmin={isAdminLoggedIn}
                    multiline
                  />
                </p>
                <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-400">
                  {isAdminLoggedIn ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Category</span>
                        <EditableText
                          value={item.category}
                          onSave={(v) => updateGalleryItem(item.id, "category", v)}
                          isAdmin={isAdminLoggedIn}
                        />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Duration</span>
                        <EditableText
                          value={item.duration}
                          onSave={(v) => updateGalleryItem(item.id, "duration", v)}
                          isAdmin={isAdminLoggedIn}
                        />
                      </div>
                      <div className="col-span-2">
                        <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Paint Color</span>
                        <EditableText
                          value={item.paintColor}
                          onSave={(v) => updateGalleryItem(item.id, "paintColor", v)}
                          isAdmin={isAdminLoggedIn}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>Color: {item.paintColor.split(" ")[0]}</span>
                      <span className="text-amber-400 font-medium flex items-center gap-1">
                        <span>View Project</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add New Gallery Item Card (admin only) */}
          {isAdminLoggedIn && (
            <button
              type="button"
              onClick={addGalleryItem}
              className="glass-card rounded-2xl overflow-hidden flex flex-col items-center justify-center min-h-[380px] cursor-pointer border-2 border-dashed border-amber-500/30 hover:border-amber-500/60 bg-slate-900/30 hover:bg-slate-900/50 transition-all group"
            >
              <div className="space-y-4 text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                  <PlusCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">Add New Project</h3>
                  <p className="text-xs text-slate-400 mt-1">Click to add a new gallery item to the portfolio.</p>
                </div>
              </div>
            </button>
          )}
        </div>
      </section>

      {/* 7. INTERACTIVE INSTANT COST ESTIMATOR TOOL */}
      <section id="estimator" className="py-24 bg-slate-900/80 border-y border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto glass-card rounded-3xl p-6 sm:p-10 border-amber-500/20 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Ruler className="w-3.5 h-3.5" />
              <span>Instant Budget Calculator</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white font-serif">
              Estimate Your Restoration Project Cost
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Get an immediate estimated cost range for your home or business before scheduling your free in-home consultation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Inputs Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Service Type */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  1. Select Service Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "exterior", label: "Exterior House" },
                    { id: "interior", label: "Interior Rooms" },
                    { id: "cabinets", label: "Kitchen Cabinets" },
                    { id: "deck", label: "Deck / Staining" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setEstimatorType(t.id)}
                      className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                        estimatorType === t.id
                          ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    2. Project Size ({estimatorType === "cabinets" ? "Cabinet Doors/Drawers" : "Square Feet"})
                  </label>
                  <span className="text-amber-400 font-bold text-sm">
                    {estimatorSize} {estimatorType === "cabinets" ? "units" : "sq ft"}
                  </span>
                </div>
                <input
                  type="range"
                  min={estimatorType === "cabinets" ? 10 : 500}
                  max={estimatorType === "cabinets" ? 60 : 6000}
                  step={estimatorType === "cabinets" ? 2 : 100}
                  value={estimatorSize}
                  onChange={(e) => setEstimatorSize(Number(e.target.value))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Surface Condition */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  3. Current Surface Condition
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "good", label: "Good (Minor touchup)" },
                    { id: "moderate", label: "Moderate (Some peeling)" },
                    { id: "heavy", label: "Heavy (Wood rot / historic)" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setEstimatorCondition(c.id)}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-center transition-all border ${
                        estimatorCondition === c.id
                          ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Paint Grade */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  4. Paint System Grade
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "standard", label: "Premium Standard" },
                    { id: "ultra", label: "Sherwin Emerald Ultra" },
                    { id: "specialty", label: "Fine European Lacquer" },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setEstimatorGrade(g.id)}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-center transition-all border ${
                        estimatorGrade === g.id
                          ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Output Column */}
            <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Estimated Price Range
              </span>

              <div>
                <div className="text-4xl font-extrabold text-white font-serif amber-gradient-text">
                  ${estimateResult.low.toLocaleString()} – ${estimateResult.high.toLocaleString()}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Includes full surface prep, materials, labor, and 10-year warranty.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300 text-left bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between">
                  <span>Target Service:</span>
                  <strong className="text-amber-400 capitalize">{estimatorType} Restoration</strong>
                </div>
                <div className="flex justify-between">
                  <span>Lead Time:</span>
                  <strong className="text-slate-200">Scheduled within 7-10 Days</strong>
                </div>
                <div className="flex justify-between">
                  <span>Warranty:</span>
                  <strong className="text-slate-200">10 Years Workmanship</strong>
                </div>
              </div>

              <a
                href="#contact"
                className="w-full inline-flex items-center justify-center py-3.5 px-4 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors text-sm shadow-lg shadow-amber-500/20"
              >
                <span>Lock In Estimate & Schedule Inspection</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. RESTORATION PROCESS & WHY HUESTONES */}
      <section id="process" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>The Huestones Craft Standard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
            Our 4-Step Restoration Process
          </h2>
          <p className="text-slate-400 text-base">
            Every project executed by Huestones Paint Restoration LLC follows a strict quality assurance workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "In-Home Inspection & Color Design",
              desc: "Detailed surface evaluation, moisture testing, wood rot assessment, and complimentary color sample matching.",
            },
            {
              step: "02",
              title: "Surface Prep & Wood Repair",
              desc: "Pressure washing, scraping down to sound material, HEPA dustless sanding, caulking, and replacing rotten wood trim.",
            },
            {
              step: "03",
              title: "Precision Dual Coat Application",
              desc: "Application of high-build bonding primer followed by dual coats of Sherwin-Williams Emerald or Benjamin Moore Aura.",
            },
            {
              step: "04",
              title: "White-Glove Walkthrough",
              desc: "Final site cleanup, detailed punch-list inspection, and delivery of your 10-Year Certificate of Guarantee.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-2xl border-slate-800 space-y-4 relative overflow-hidden group"
            >
              <div className="text-4xl font-extrabold text-amber-500/30 group-hover:text-amber-500/60 font-serif transition-colors">
                {item.step}
              </div>
              <h3 className="text-lg font-bold text-white font-serif">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. REVIEWS & TESTIMONIALS */}
      <section className="py-20 bg-slate-900/60 border-y border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
              <Star className="w-5 h-5 fill-amber-400" />
              <Star className="w-5 h-5 fill-amber-400" />
              <Star className="w-5 h-5 fill-amber-400" />
              <Star className="w-5 h-5 fill-amber-400" />
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-white font-serif">
              Trusted by 500+ Homeowners
            </h2>
            <p className="text-sm text-slate-300">
              Read real homeowner experiences with Huestones Paint Restoration LLC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Marcus Vance",
                location: "Westlake Estates",
                project: "Exterior Wood & Siding Restoration",
                text: "Huestones saved our 1920s craftsman exterior. Other painters wanted to just paint over peeling wood, but Huestones scraped, repaired rotten cedar, and applied dual coats of Emerald. It looks brand new!",
              },
              {
                name: "Elena Rostova",
                location: "Highland Park",
                project: "Kitchen Cabinet Spray Refinishing",
                text: "Our dark oak cabinets were completely transformed into factory-smooth satin white. The team sprayed doors off-site, and the finish is indestructible. Truly master craftsmanship.",
              },
              {
                name: "David & Sarah Thorne",
                location: "Old Enfield",
                project: "Historic Victorian Paint Restoration",
                text: "Being a historical home, we needed EPA lead safety and period-accurate color matching. Huestones executed everything impeccably. On time, clean site every evening, and 10/10 quality.",
              },
            ].map((rev, i) => (
              <div key={i} className="glass-card p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{rev.text}"
                </p>
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                    <p className="text-[11px] text-slate-400">{rev.location} • {rev.project}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 text-[10px] font-semibold border border-amber-400/20">
                    Verified Owner
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CONTACT US & CONSULTATION REQUEST SECTION */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Contact Info Column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <Phone className="w-3.5 h-3.5" />
                <span>Get In Touch</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
                Request Your Free Consultation
              </h2>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                Contact Huestones Paint Restoration LLC today. We provide detailed on-site assessments, exact written proposals, and color design advice.
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-4">
                <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Direct Phone Line</h4>
                  {isAdminLoggedIn ? (
                    <EditableText
                      value={phone}
                      onSave={(v) => updateContent("phone", v)}
                      isAdmin={isAdminLoggedIn}
                      className="text-slate-300"
                    />
                  ) : (
                    <a href={`tel:${loaderData.phoneNumeric}`} className="text-slate-300 hover:text-amber-400 transition-colors">
                      {phone}
                    </a>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-4">
                <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Email Estimates</h4>
                  {isAdminLoggedIn ? (
                    <EditableText
                      value={email}
                      onSave={(v) => updateContent("email", v)}
                      isAdmin={isAdminLoggedIn}
                      className="text-slate-300"
                    />
                  ) : (
                    <a href={`mailto:${email}`} className="text-slate-300 hover:text-amber-400 transition-colors">
                      {email}
                    </a>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-4">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white">Headquarters & Operating Region</h4>
                  <p className="text-slate-300 text-xs">
                    <EditableText
                      value={address}
                      onSave={(v) => updateContent("address", v)}
                      isAdmin={isAdminLoggedIn}
                    />
                  </p>
                  <p className="text-amber-400 text-xs mt-1 font-semibold">
                    Domain: www.huestonehomes.com
                  </p>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Monday – Friday:</span>
                <strong className="text-white">7:00 AM – 6:00 PM</strong>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <strong className="text-white">8:00 AM – 3:00 PM</strong>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <strong className="text-amber-400">Emergency & Commercial Only</strong>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-3xl p-6 sm:p-10 border-slate-700/80 shadow-2xl">
              {formSubmitted ? (
                <div className="text-center py-12 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500 text-amber-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white font-serif">
                    Estimate Request Received!
                  </h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Thank you, <strong className="text-white">{formData.name || "Homeowner"}</strong>. A senior restoration estimator from Huestones Paint Restoration LLC will call you at <strong className="text-amber-400">{formData.phone || "your number"}</strong> within 2 hours to confirm your consultation.
                  </p>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 max-w-md mx-auto text-xs text-left text-slate-300 space-y-1.5">
                    <p><strong>Service:</strong> {formData.service}</p>
                    <p><strong>Timeline:</strong> {formData.timeline}</p>
                    <p><strong>Confirmation #:</strong> HUE-{Math.floor(100000 + Math.random() * 900000)}</p>
                  </div>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold text-white font-serif border-b border-slate-800 pb-3">
                    Schedule On-Site Consultation
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Smith"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="(555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Service Requested
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                      >
                        {services.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Property Address / Zip Code
                    </label>
                    <input
                      type="text"
                      placeholder="123 Estate Way, City, Zip"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Project Notes / Details
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe your project, surface conditions, desired paint colors..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-lg shadow-amber-500/25 transition-all text-sm uppercase tracking-wider"
                  >
                    Submit Request For Free Estimate
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="mt-24 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-white font-serif">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-400 mt-1">Everything you need to know about working with Huestones Paint Restoration LLC</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-card rounded-xl border-slate-800 overflow-hidden">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between font-semibold text-sm text-white hover:text-amber-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openFaqIndex === index ? "rotate-180 text-amber-400" : "text-slate-500"}`} />
                </button>
                {openFaqIndex === index && (
                  <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <Paintbrush className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base font-serif">HUESTONES</span>
            </div>
            <p className="text-slate-400 text-xs">
              Huestones Paint Restoration LLC — Residential & Commercial Painting Contractors.
            </p>
            <p className="text-amber-400 text-xs font-semibold">
              www.huestonehomes.com
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Core Services</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="hover:text-amber-400">Exterior Restoration</a></li>
              <li><a href="#services" className="hover:text-amber-400">Interior Precision Painting</a></li>
              <li><a href="#services" className="hover:text-amber-400">Cabinet Spray Refinishing</a></li>
              <li><a href="#services" className="hover:text-amber-400">Historic Landmark Restoration</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Quick Navigation</h4>
            <ul className="space-y-2">
              <li><a href="#transformations" className="hover:text-amber-400">Before & After Showcase</a></li>
              <li><a href="#gallery" className="hover:text-amber-400">Gallery Covers</a></li>
              <li><a href="#estimator" className="hover:text-amber-400">Cost Estimator Tool</a></li>
              <li><a href="#contact" className="hover:text-amber-400">Free Quote Request</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Licensing & Credentials</h4>
            <p className="text-slate-400 leading-relaxed">
              Fully Licensed, Insured & Bonded ($2M CGL). EPA Lead-Safe Certified Firm #NAT-F19482-1. Backed by 10-Year Workmanship Warranty.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Huestones Paint Restoration LLC. All rights reserved. Operating as www.huestonehomes.com.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-amber-400">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400">Terms of Service</a>
            <a href="#" className="hover:text-amber-400">Sitemap</a>
          </div>
        </div>
      </footer>

      {/* SERVICE SPEC MODAL OVERLAY */}
      {selectedService !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card max-w-2xl w-full rounded-2xl p-6 border-slate-700 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {(() => {
              const svc = services.find((s) => s.id === selectedService);
              if (!svc) return null;
              return (
                <>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <svc.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white font-serif">{svc.title}</h3>
                      <p className="text-xs text-amber-400 font-semibold">Huestones Restoration Standard</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">{svc.fullDesc}</p>

                  <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Estimated Duration:</span>
                      <strong className="text-white">{svc.turnaround}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Premium Paint Lines:</span>
                      <strong className="text-amber-400">{svc.paints}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ideal Project Scope:</span>
                      <strong className="text-slate-200">{svc.idealFor}</strong>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-300 mb-2">Scope Checklist</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      {svc.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                    <button
                      onClick={() => setSelectedService(null)}
                      className="px-4 py-2 rounded-lg bg-slate-900 text-slate-300 text-xs font-semibold"
                    >
                      Close Specs
                    </button>
                    <a
                      href="#contact"
                      onClick={() => setSelectedService(null)}
                      className="px-5 py-2 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300"
                    >
                      Book This Service
                    </a>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* GALLERY LIGHTBOX MODAL OVERLAY */}
      {selectedGalleryItem !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="glass-card max-w-3xl w-full rounded-2xl p-6 border-slate-700 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedGalleryItem(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-950/80 text-slate-400 hover:text-white z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {(() => {
              const item = galleryItems.find((g) => g.id === selectedGalleryItem);
              if (!item) return null;
              return (
                <>
                  <div className="relative h-72 rounded-xl overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-bold px-2.5 py-1 rounded">
                      {item.badge}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-amber-400 font-semibold">{item.location} • {item.category}</span>
                    <h3 className="text-xl font-bold text-white font-serif">{item.title}</h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{item.scope}</p>

                  <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block">Paint Color Palette</span>
                      <strong className="text-amber-400">{item.paintColor}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Completion Time</span>
                      <strong className="text-white">{item.duration}</strong>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-xs text-slate-400">Huestones Paint Restoration LLC • www.huestonehomes.com</span>
                    <button
                      onClick={() => setSelectedGalleryItem(null)}
                      className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold"
                    >
                      Close Lightbox
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
