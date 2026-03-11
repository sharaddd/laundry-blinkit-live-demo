import React, { useState, useCallback } from "react";
import {
  Home, RotateCcw, Grid3X3, Printer, Shirt,
  Sparkles, Clock, CreditCard, ChevronLeft, ChevronRight,
  MapPin, Calendar, Timer, Shield, Droplets, Baby, Footprints,
  Briefcase, Star, Check, Package, Truck, Camera,
  Zap, Leaf, Plus, Minus, Trash2, ShoppingBag,
  Info, Award, RefreshCw, Box, Waves, ScanSearch, MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────
type Tab = "home" | "reorder" | "categories" | "print" | "laundry";
type LaundryScreen =
  | "landing"
  | "newOrder"
  | "tierSelect"
  | "addons"
  | "stainMarking"
  | "scheduling"
  | "review"
  | "confirmed"
  | "tracking"
  | "pass";

type GarmentType = "shirt" | "saree" | "other";

interface StainMarker {
  id: string;
  x: number;
  y: number;
  side: "front" | "back";
  type: string;
  note: string;
}

interface StainData {
  garmentType: GarmentType;
  description: string;
  markers: StainMarker[];
}

interface CartItem {
  service: string;
  tier: string;
  price: number;
}

// ─── Mock Data ──────────────────────────────────────────────────
const SERVICE_TIERS = [
  { id: "wash-fold", name: "Wash & Fold", price: 69, unit: "/kg", desc: "Machine wash, tumble dry, folded", icon: Waves, popular: false },
  { id: "wash-iron", name: "Wash & Iron", price: 99, unit: "/kg", desc: "Machine wash, steam pressed, hung", icon: Sparkles, popular: true },
  { id: "dry-clean", name: "Dry Clean", price: 149, unit: "/pc", desc: "Professional solvent clean, pressed", icon: Droplets, popular: false },
  { id: "premium", name: "Premium Care", price: 249, unit: "/pc", desc: "Hand wash, stain treat, luxury press", icon: Star, popular: false },
];

const ADDONS = [
  { id: "express", name: "Express 6-Hour", price: 49, icon: Zap, desc: "Lightning-fast turnaround" },
  { id: "eco", name: "Eco-Wash", price: 0, icon: Leaf, desc: "Plant-based detergents, cold wash" },
  { id: "baby", name: "Baby Care", price: 29, icon: Baby, desc: "Hypoallergenic, extra rinse cycle" },
  { id: "shoe", name: "Shoe Spa", price: 199, icon: Footprints, desc: "Deep clean & deodorize footwear" },
  { id: "bag", name: "Bag Restoration", price: 299, icon: Briefcase, desc: "Leather/canvas cleaning & care" },
  { id: "fragrance", name: "Premium Fragrance", price: 19, icon: Sparkles, desc: "Long-lasting lavender finish" },
];

const STAIN_TYPES = ["Tea", "Ink", "Oil", "Blood", "Wine", "Grass", "Other"];

const TRACKING_STAGES = [
  { id: "pickup", label: "Picked Up", time: "10:30 AM", done: true },
  { id: "sorting", label: "Sorting", time: "11:00 AM", done: true },
  { id: "stain", label: "Stain Treatment", time: "11:45 AM", done: true },
  { id: "washing", label: "Washing", time: "12:30 PM", done: false, active: true },
  { id: "ironing", label: "Steam Ironing", time: "2:00 PM", done: false },
  { id: "qc", label: "Quality Check", time: "3:00 PM", done: false },
  { id: "delivery", label: "Out for Delivery", time: "4:00 PM", done: false },
];

const LAUNDRY_PLANS = [
  { id: "basic", name: "Basic", kg: 10, price: 499, perKg: 49.9, features: ["Wash & Fold", "Free pickup", "48h turnaround"] },
  { id: "plus", name: "Plus", kg: 20, price: 899, perKg: 44.9, features: ["Wash & Iron", "Free pickup", "24h turnaround", "Priority slots"], popular: true },
  { id: "family", name: "Family", kg: 40, price: 1599, perKg: 39.9, features: ["All services", "Free pickup", "Same-day option", "Priority slots", "Free Blinkit Protect"] },
];

const DETERGENT_PRODUCTS = [
  { name: "Blinkit Fresh Pods", price: 349, img: "🧴", rating: 4.5 },
  { name: "Eco Liquid Wash", price: 279, img: "🌿", rating: 4.3 },
  { name: "Baby Soft Detergent", price: 399, img: "👶", rating: 4.7 },
];

// ─── Main App ───────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("laundry");

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8 overflow-hidden font-sans">
      {/* Phone Case */}
      <div className="relative w-[430px] h-[880px] bg-[#1a1a1a] rounded-[60px] border-[10px] border-[#252525] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_0_0_2px_#2a2a2a] ring-1 ring-black/5 flex flex-col overflow-hidden">

        {/* Speaker & Sensor Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160px] h-[34px] bg-[#252525] rounded-b-[20px] z-[60] flex items-center justify-center gap-4 px-2">
          <div className="w-12 h-1 bg-[#111] rounded-full" /> {/* Speaker */}
          <div className="w-2 h-2 rounded-full bg-[#111] border border-white/5" /> {/* Camera */}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-400/30 rounded-full z-[60]" />

        {/* Screen Content */}
        <div className="flex-1 w-full bg-gray-50 relative flex flex-col overflow-hidden rounded-[50px]">
          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide pb-24">
            {activeTab === "laundry" ? <LaundryTab /> : <PlaceholderTab tab={activeTab} />}
          </div>
          <BottomNav active={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      {/* Platform Note */}
      <div className="fixed bottom-10 right-10 text-right opacity-30">
        <p className="text-gray-900 text-[10px] font-bold uppercase tracking-[2px]">Blinkit Laundry Prototype</p>
        <p className="text-gray-500 text-[9px]">Optimized for mobile view</p>
      </div>
    </div>
  );
}

// ─── Bottom Navigation ──────────────────────────────────────────
function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: typeof Home }[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "reorder", label: "Order again", icon: RotateCcw },
    { id: "categories", label: "Categories", icon: Grid3X3 },
    { id: "print", label: "Print", icon: Printer },
    { id: "laundry", label: "Laundry", icon: Shirt },
  ];

  return (
    <nav className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 z-50 px-4 pb-8 pt-2">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all active:scale-90",
                isActive ? "text-[#F8CB46] bg-yellow-50/50" : "text-gray-400"
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={cn("text-[9px] uppercase tracking-tighter", isActive ? "font-black" : "font-semibold")}>{item.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-[#F8CB46] mt-0.5" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Placeholder Tab ────────────────────────────────────────────
function PlaceholderTab({ tab }: { tab: Tab }) {
  const names: Record<Tab, string> = { home: "Home", reorder: "Order Again", categories: "Categories", print: "Print", laundry: "Laundry" };
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#F8CB46]/20 flex items-center justify-center mx-auto mb-4">
          <Shirt size={32} className="text-[#F8CB46]" />
        </div>
        <p className="text-lg font-bold text-gray-800">{names[tab]}</p>
        <p className="text-sm text-gray-400 mt-1">Coming soon</p>
      </div>
    </div>
  );
}

// ─── Laundry Tab (Stack Navigation) ─────────────────────────────
function LaundryTab() {
  const [screen, setScreen] = useState<LaundryScreen>("landing");
  const [selectedTier, setSelectedTier] = useState(SERVICE_TIERS[1]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [stainData, setStainData] = useState<StainData>({ garmentType: "shirt", description: "", markers: [] });
  const [blinkitProtect, setBlinkitProtect] = useState(false);
  const [emptyBagSwap, setEmptyBagSwap] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("Today");
  const [scheduledTime, setScheduledTime] = useState("2:00 - 4:00 PM");
  const [usePass, setUsePass] = useState(false);
  const [quantity, setQuantity] = useState(3);

  const nav = (s: LaundryScreen) => setScreen(s);

  const totalAddonsPrice = ADDONS.filter((a) => selectedAddons.includes(a.id)).reduce((s, a) => s + a.price, 0);
  const basePrice = selectedTier.unit === "/kg" ? selectedTier.price * quantity : selectedTier.price * quantity;
  const protectPrice = blinkitProtect ? 29 : 0;
  const totalPrice = basePrice + totalAddonsPrice + protectPrice;

  switch (screen) {
    case "landing":
      return <LaundryLanding nav={nav} />;
    case "newOrder":
      return <NewOrderDiscovery nav={nav} />;
    case "tierSelect":
      return (
        <TierSelect
          nav={nav}
          selected={selectedTier}
          onSelect={setSelectedTier}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      );
    case "addons":
      return (
        <AddonsScreen
          nav={nav}
          selected={selectedAddons}
          onToggle={(id) =>
            setSelectedAddons((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
          }
          blinkitProtect={blinkitProtect}
          setBlinkitProtect={setBlinkitProtect}
        />
      );
    case "stainMarking":
      return <StainMarkingScreen nav={nav} stainData={stainData} setStainData={setStainData} />;
    case "scheduling":
      return (
        <SchedulingScreen
          nav={nav}
          date={scheduledDate}
          setDate={setScheduledDate}
          time={scheduledTime}
          setTime={setScheduledTime}
          emptyBagSwap={emptyBagSwap}
          setEmptyBagSwap={setEmptyBagSwap}
        />
      );
    case "review":
      return (
        <ReviewScreen
          nav={nav}
          tier={selectedTier}
          addons={selectedAddons}
          stainData={stainData}
          protect={blinkitProtect}
          bagSwap={emptyBagSwap}
          date={scheduledDate}
          time={scheduledTime}
          total={totalPrice}
          quantity={quantity}
          usePass={usePass}
          setUsePass={setUsePass}
        />
      );
    case "confirmed":
      return <ConfirmedScreen nav={nav} date={scheduledDate} time={scheduledTime} />;
    case "tracking":
      return <TrackingScreen nav={nav} />;
    case "pass":
      return <PassScreen nav={nav} />;
    default:
      return <LaundryLanding nav={nav} />;
  }
}

// ─── Header Component ───────────────────────────────────────────
function ScreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 pt-11 pb-3 flex items-center gap-3">
      <button onClick={onBack} className="p-1 -ml-1 rounded-full hover:bg-gray-100">
        <ChevronLeft size={22} className="text-gray-700" />
      </button>
      <h1 className="text-base font-bold text-gray-900">{title}</h1>
    </div>
  );
}

// ─── Laundry Landing ────────────────────────────────────────────
function LaundryLanding({ nav }: { nav: (s: LaundryScreen) => void }) {
  return (
    <div>
      {/* Header */}
      <div className="bg-[#F8CB46] px-5 pt-11 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-xs font-medium text-yellow-900/70">Delivery in</p>
            <p className="text-lg font-black text-gray-900">10 minutes</p>
          </div>
          <div className="flex items-center gap-1 bg-white/30 rounded-full px-3 py-1.5">
            <MapPin size={14} className="text-gray-900" />
            <span className="text-xs font-semibold text-gray-900">Home</span>
            <ChevronRight size={14} className="text-gray-900" />
          </div>
        </div>
        <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#F8CB46]/20 rounded-xl flex items-center justify-center">
              <Shirt size={24} className="text-[#E5A800]" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-black text-gray-900">Blinkit Laundry</h2>
              <p className="text-xs text-gray-500 mt-0.5">Professional care, delivered fast</p>
            </div>
            <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">NEW</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 -mt-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "New Order", icon: Plus, color: "bg-yellow-50 text-[#E5A800]", screen: "newOrder" as LaundryScreen },
            { label: "Track Order", icon: Package, color: "bg-blue-50 text-blue-600", screen: "tracking" as LaundryScreen },
            { label: "Laundry Pass", icon: CreditCard, color: "bg-purple-50 text-purple-600", screen: "pass" as LaundryScreen },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => nav(item.screen)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.color)}>
                <item.icon size={20} />
              </div>
              <span className="text-xs font-bold text-gray-800">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-black text-gray-900 mb-3">Services</h3>
        <div className="grid grid-cols-2 gap-3">
          {SERVICE_TIERS.map((tier) => (
            <button
              key={tier.id}
              onClick={() => nav("newOrder")}
              className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 text-left relative active:scale-95 transition-transform"
            >
              {tier.popular && (
                <div className="absolute -top-2 right-3 bg-[#F8CB46] text-[10px] font-bold px-2 py-0.5 rounded-full text-gray-900">
                  POPULAR
                </div>
              )}
              <tier.icon size={20} className="text-[#E5A800] mb-2" />
              <p className="text-sm font-bold text-gray-900">{tier.name}</p>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{tier.desc}</p>
              <p className="text-sm font-black text-[#E5A800] mt-2">
                ₹{tier.price}<span className="text-[10px] font-medium text-gray-400">{tier.unit}</span>
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Active Order Banner */}
      <div className="px-4 mt-6">
        <button
          onClick={() => nav("tracking")}
          className="w-full bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Truck size={20} className="text-blue-600" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-gray-900">Order in progress</p>
            <p className="text-xs text-gray-500">Washing stage · ETA 4:00 PM</p>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
      </div>

      {/* Pass Promo */}
      <div className="px-4 mt-4 mb-6">
        <button
          onClick={() => nav("pass")}
          className="w-full bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Award size={20} className="text-purple-600" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-gray-900">Laundry Pass</p>
            <p className="text-xs text-gray-500">Save up to 20% on every wash</p>
          </div>
          <div className="bg-purple-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
            VIEW
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── New Order Discovery ────────────────────────────────────────
function NewOrderDiscovery({ nav }: { nav: (s: LaundryScreen) => void }) {
  return (
    <div>
      <ScreenHeader title="New Laundry Order" onBack={() => nav("landing")} />
      <div className="px-4 py-4">
        <div className="bg-[#F8CB46]/10 rounded-2xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-[#E5A800]" />
            <span className="text-xs font-bold text-gray-900">How it works</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {["Schedule Pickup", "We Collect", "Expert Care", "Delivered"].map((step, i) => (
              <div key={step} className="text-center">
                <div className="w-8 h-8 bg-[#F8CB46] rounded-full flex items-center justify-center mx-auto text-xs font-black text-gray-900">
                  {i + 1}
                </div>
                <p className="text-[10px] text-gray-600 mt-1 leading-tight">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <h3 className="text-sm font-black text-gray-900 mb-3">Choose service type</h3>
        <div className="space-y-3">
          {SERVICE_TIERS.map((tier) => (
            <button
              key={tier.id}
              onClick={() => nav("tierSelect")}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-transform text-left"
            >
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center shrink-0">
                <tier.icon size={22} className="text-[#E5A800]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900">{tier.name}</p>
                  {tier.popular && (
                    <span className="bg-[#F8CB46] text-[9px] font-bold px-1.5 py-0.5 rounded-full text-gray-900">POPULAR</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{tier.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black text-gray-900">₹{tier.price}</p>
                <p className="text-[10px] text-gray-400">{tier.unit}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tier Select + Quantity ─────────────────────────────────────
function TierSelect({
  nav, selected, onSelect, quantity, setQuantity,
}: {
  nav: (s: LaundryScreen) => void;
  selected: typeof SERVICE_TIERS[0];
  onSelect: (t: typeof SERVICE_TIERS[0]) => void;
  quantity: number;
  setQuantity: (n: number) => void;
}) {
  return (
    <div>
      <ScreenHeader title="Select Service" onBack={() => nav("newOrder")} />
      <div className="px-4 py-4 space-y-4">
        {SERVICE_TIERS.map((tier) => (
          <button
            key={tier.id}
            onClick={() => onSelect(tier)}
            className={cn(
              "w-full rounded-2xl p-4 border-2 text-left transition-all active:scale-[0.98]",
              selected.id === tier.id
                ? "border-[#F8CB46] bg-yellow-50/50 shadow-sm"
                : "border-gray-100 bg-white"
            )}
          >
            <div className="flex items-center gap-3">
              <tier.icon size={20} className={selected.id === tier.id ? "text-[#E5A800]" : "text-gray-400"} />
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{tier.name}</p>
                <p className="text-xs text-gray-400">{tier.desc}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-gray-900">₹{tier.price}<span className="text-[10px] font-normal text-gray-400">{tier.unit}</span></p>
              </div>
            </div>
            {selected.id === tier.id && (
              <div className="mt-3 pt-3 border-t border-yellow-200 flex items-center justify-between">
                <span className="text-xs text-gray-600">Quantity ({tier.unit === "/kg" ? "kg" : "pieces"})</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); setQuantity(Math.max(1, quantity - 1)); }}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setQuantity(quantity + 1); }}
                    className="w-8 h-8 rounded-full bg-[#F8CB46] flex items-center justify-center"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}
          </button>
        ))}

        <button
          onClick={() => nav("addons")}
          className="w-full bg-[#F8CB46] text-gray-900 font-bold py-3.5 rounded-2xl text-sm active:scale-[0.98] transition-transform shadow-sm"
        >
          Continue · ₹{selected.price * quantity}
        </button>
      </div>
    </div>
  );
}

// ─── Add-ons & Protect ──────────────────────────────────────────
function AddonsScreen({
  nav, selected, onToggle, blinkitProtect, setBlinkitProtect,
}: {
  nav: (s: LaundryScreen) => void;
  selected: string[];
  onToggle: (id: string) => void;
  blinkitProtect: boolean;
  setBlinkitProtect: (v: boolean) => void;
}) {
  return (
    <div>
      <ScreenHeader title="Customise Your Order" onBack={() => nav("tierSelect")} />
      <div className="px-4 py-4">
        <h3 className="text-sm font-black text-gray-900 mb-3">Add-on Services</h3>
        <div className="space-y-2.5">
          {ADDONS.map((addon) => {
            const isSelected = selected.includes(addon.id);
            return (
              <button
                key={addon.id}
                onClick={() => onToggle(addon.id)}
                className={cn(
                  "w-full rounded-2xl p-3.5 border-2 flex items-center gap-3 text-left transition-all active:scale-[0.98]",
                  isSelected ? "border-[#F8CB46] bg-yellow-50/50" : "border-gray-100 bg-white"
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", isSelected ? "bg-[#F8CB46]/20" : "bg-gray-50")}>
                  <addon.icon size={18} className={isSelected ? "text-[#E5A800]" : "text-gray-400"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{addon.name}</p>
                  <p className="text-[11px] text-gray-400">{addon.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  {addon.price > 0 ? (
                    <p className="text-sm font-bold text-gray-900">+₹{addon.price}</p>
                  ) : (
                    <p className="text-xs font-bold text-green-600">FREE</p>
                  )}
                </div>
                <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  isSelected ? "border-[#F8CB46] bg-[#F8CB46]" : "border-gray-300"
                )}>
                  {isSelected && <Check size={12} className="text-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Blinkit Protect */}
        <div className="mt-5">
          <h3 className="text-sm font-black text-gray-900 mb-3">Protection</h3>
          <button
            onClick={() => setBlinkitProtect(!blinkitProtect)}
            className={cn(
              "w-full rounded-2xl p-4 border-2 text-left transition-all active:scale-[0.98]",
              blinkitProtect ? "border-green-400 bg-green-50" : "border-gray-100 bg-white"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", blinkitProtect ? "bg-green-100" : "bg-gray-50")}>
                <Shield size={18} className={blinkitProtect ? "text-green-600" : "text-gray-400"} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900">Blinkit Protect</p>
                  <span className="bg-green-100 text-green-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">RECOMMENDED</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">10x refund guarantee · Fabric restoration coverage</p>
              </div>
              <p className="text-sm font-bold text-gray-900 shrink-0">₹29</p>
            </div>
          </button>
        </div>

        {/* AI Stain Assist */}
        <div className="mt-5">
          <button
            onClick={() => nav("stainMarking")}
            className="w-full bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-[#F8CB46] rounded-2xl p-4 text-left active:scale-[0.98] transition-transform mb-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F8CB46] rounded-xl flex items-center justify-center shrink-0">
                <ScanSearch size={20} className="text-gray-900" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900">AI Stain Assist</p>
                  <span className="bg-[#F8CB46] text-gray-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full">SMART</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">Mark tough stains so our partner focuses extra attention</p>
              </div>
              <ChevronRight size={18} className="text-[#E5A800] shrink-0" />
            </div>
          </button>
          <button
            onClick={() => nav("scheduling")}
            className="w-full bg-[#F8CB46] text-gray-900 font-bold py-3.5 rounded-2xl text-sm active:scale-[0.98] transition-transform shadow-sm"
          >
            Continue to Scheduling
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Digital Stain Marker ────────────────────────────────────
function StainMarkingScreen({
  nav, stainData, setStainData,
}: {
  nav: (s: LaundryScreen) => void;
  stainData: StainData;
  setStainData: (d: StainData) => void;
}) {
  const { garmentType, description, markers } = stainData;
  const [side, setSide] = useState<"front" | "back">("front");
  const [selectedType, setSelectedType] = useState("Tea");
  const [note, setNote] = useState("");

  const setGarmentType = (t: GarmentType) => setStainData({ ...stainData, garmentType: t });
  const setDescription = (d: string) => setStainData({ ...stainData, description: d });
  const setMarkers = (m: StainMarker[]) => setStainData({ ...stainData, markers: m });

  const handleTapShirt = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const id = `stain-${Date.now()}`;
      setStainData({ ...stainData, markers: [...markers, { id, x, y, side, type: selectedType, note }] });
      setNote("");
    },
    [stainData, markers, side, selectedType, note, setStainData]
  );

  const handleTapCanvas = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const id = `stain-${Date.now()}`;
      setStainData({ ...stainData, markers: [...markers, { id, x, y, side: "front", type: selectedType, note }] });
      setNote("");
    },
    [stainData, markers, selectedType, note, setStainData]
  );

  const removeMarker = (id: string) => setMarkers(markers.filter((m) => m.id !== id));

  const garmentOptions: { id: GarmentType; label: string; icon: typeof Shirt }[] = [
    { id: "shirt", label: "Shirt", icon: Shirt },
    { id: "saree", label: "Saree", icon: Waves },
    { id: "other", label: "Other", icon: Package },
  ];

  return (
    <div>
      <ScreenHeader title="AI Stain Marker" onBack={() => nav("addons")} />
      <div className="px-4 py-4">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 mb-4 border border-[#F8CB46]/30">
          <div className="flex items-center gap-2 mb-1">
            <ScanSearch size={16} className="text-[#E5A800]" />
            <span className="text-xs font-bold text-gray-900">Digital Stain Marker</span>
            <span className="bg-[#F8CB46] text-gray-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full">AI</span>
          </div>
          <p className="text-[11px] text-gray-500">Mark tough stains so our partner focuses extra attention on them</p>
        </div>

        {/* Garment Type Selector */}
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-700 mb-2">Garment Type</p>
          <div className="flex gap-2">
            {garmentOptions.map((g) => {
              const Icon = g.icon;
              const active = garmentType === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setGarmentType(g.id)}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-xs font-bold border-2 transition-all flex flex-col items-center gap-1.5",
                    active ? "border-[#F8CB46] bg-yellow-50 text-gray-900" : "border-gray-100 bg-white text-gray-500"
                  )}
                >
                  <Icon size={18} className={active ? "text-[#E5A800]" : "text-gray-400"} />
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* === SHIRT MODE === */}
        {garmentType === "shirt" && (
          <>
            {/* Side Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
              {(["front", "back"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSide(s)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-xs font-bold transition-all capitalize",
                    side === s ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                  )}
                >
                  {s} View
                </button>
              ))}
            </div>

            {/* Mannequin SVG Area */}
            <div className="relative bg-white rounded-2xl border-2 border-gray-100 p-4 mb-4">
              <p className="text-[10px] text-gray-400 text-center mb-2">Tap on the garment to mark stains</p>
              <div className="relative mx-auto w-48 h-64 cursor-crosshair" onClick={handleTapShirt}>
                <svg viewBox="0 0 200 280" className="w-full h-full">
                  {side === "front" ? (
                    <>
                      <path d="M60 0 L30 40 L10 35 L25 70 L40 60 L40 270 L160 270 L160 60 L175 70 L190 35 L170 40 L140 0 L120 20 Q100 30 80 20 Z" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" />
                      <line x1="100" y1="20" x2="100" y2="270" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
                      <circle cx="100" cy="60" r="3" fill="#e5e7eb" />
                      <circle cx="100" cy="90" r="3" fill="#e5e7eb" />
                      <circle cx="100" cy="120" r="3" fill="#e5e7eb" />
                      <path d="M65 0 Q100 8 135 0" fill="none" stroke="#d1d5db" strokeWidth="1.5" />
                    </>
                  ) : (
                    <>
                      <path d="M60 0 L30 40 L10 35 L25 70 L40 60 L40 270 L160 270 L160 60 L175 70 L190 35 L170 40 L140 0 L120 15 Q100 22 80 15 Z" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" />
                      <path d="M65 0 Q100 6 135 0" fill="none" stroke="#d1d5db" strokeWidth="1.5" />
                      <path d="M70 60 Q100 70 130 60" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                    </>
                  )}
                </svg>
                {markers.filter((m) => m.side === side).map((m, i) => (
                  <div
                    key={m.id}
                    className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-red-500 border-2 border-white shadow-lg flex items-center justify-center cursor-pointer"
                    style={{ left: `${m.x}%`, top: `${m.y}%` }}
                    onClick={(e) => { e.stopPropagation(); removeMarker(m.id); }}
                  >
                    <span className="text-[9px] font-bold text-white">{i + 1}</span>
                  </div>
                ))}
              </div>
              <div className="text-center mt-2">
                <span className="text-[10px] text-gray-400">{side === "front" ? "Front" : "Back"} · {markers.filter((m) => m.side === side).length} stain{markers.filter((m) => m.side === side).length !== 1 ? "s" : ""} marked</span>
              </div>
            </div>
          </>
        )}

        {/* === SAREE MODE === */}
        {garmentType === "saree" && (
          <>
            {/* Saree canvas */}
            <div className="relative bg-white rounded-2xl border-2 border-gray-100 p-4 mb-4">
              <p className="text-[10px] text-gray-400 text-center mb-2">Tap on the fabric to mark stain locations</p>
              <div className="relative mx-auto w-full h-56 cursor-crosshair rounded-xl overflow-hidden" onClick={handleTapCanvas}>
                <svg viewBox="0 0 320 220" className="w-full h-full">
                  {/* Saree cloth shape - draped rectangle */}
                  <rect x="10" y="10" width="300" height="200" rx="8" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" />
                  {/* Decorative border pattern (pallu) */}
                  <rect x="10" y="10" width="70" height="200" rx="8" fill="#fef3c7" stroke="#d1d5db" strokeWidth="1" />
                  <line x1="80" y1="10" x2="80" y2="210" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
                  {/* Pleat lines */}
                  {[120, 160, 200, 240].map((lx) => (
                    <line key={lx} x1={lx} y1="30" x2={lx} y2="190" stroke="#e5e7eb" strokeWidth="0.8" strokeDasharray="6 6" />
                  ))}
                  {/* Labels */}
                  <text x="45" y="115" textAnchor="middle" fill="#92400e" fontSize="10" fontWeight="bold">Pallu</text>
                  <text x="200" y="115" textAnchor="middle" fill="#9ca3af" fontSize="10">Body</text>
                  <text x="280" y="115" textAnchor="middle" fill="#9ca3af" fontSize="9">Pleats</text>
                </svg>
                {markers.map((m, i) => (
                  <div
                    key={m.id}
                    className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-red-500 border-2 border-white shadow-lg flex items-center justify-center cursor-pointer"
                    style={{ left: `${m.x}%`, top: `${m.y}%` }}
                    onClick={(e) => { e.stopPropagation(); removeMarker(m.id); }}
                  >
                    <span className="text-[9px] font-bold text-white">{i + 1}</span>
                  </div>
                ))}
              </div>
              <div className="text-center mt-2">
                <span className="text-[10px] text-gray-400">{markers.length} stain{markers.length !== 1 ? "s" : ""} marked</span>
              </div>
            </div>

            {/* Description field - strongly prompted for saree */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={14} className="text-[#E5A800]" />
                <p className="text-xs font-bold text-gray-700">Describe Stain Location <span className="text-red-500">*</span></p>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Red wine on pallu border, oil near pleats area, turmeric on body middle section"
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#F8CB46] resize-none"
              />
              {!description && (
                <p className="text-[10px] text-orange-500 mt-1 flex items-center gap-1">
                  <Info size={10} /> Please describe the stain location to help our cleaners
                </p>
              )}
            </div>
          </>
        )}

        {/* === OTHER MODE === */}
        {garmentType === "other" && (
          <>
            {/* Generic cloth canvas */}
            <div className="relative bg-white rounded-2xl border-2 border-gray-100 p-4 mb-4">
              <p className="text-[10px] text-gray-400 text-center mb-2">Tap to roughly mark stain areas (optional)</p>
              <div className="relative mx-auto w-full h-48 cursor-crosshair rounded-xl overflow-hidden" onClick={handleTapCanvas}>
                <svg viewBox="0 0 320 190" className="w-full h-full">
                  <rect x="10" y="10" width="300" height="170" rx="12" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2" strokeDasharray="8 4" />
                  <text x="160" y="95" textAnchor="middle" fill="#9ca3af" fontSize="12">Garment Area</text>
                  <text x="160" y="115" textAnchor="middle" fill="#d1d5db" fontSize="9">Tap to place stain markers</text>
                </svg>
                {markers.map((m, i) => (
                  <div
                    key={m.id}
                    className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-red-500 border-2 border-white shadow-lg flex items-center justify-center cursor-pointer"
                    style={{ left: `${m.x}%`, top: `${m.y}%` }}
                    onClick={(e) => { e.stopPropagation(); removeMarker(m.id); }}
                  >
                    <span className="text-[9px] font-bold text-white">{i + 1}</span>
                  </div>
                ))}
              </div>
              <div className="text-center mt-2">
                <span className="text-[10px] text-gray-400">{markers.length} stain{markers.length !== 1 ? "s" : ""} marked</span>
              </div>
            </div>

            {/* Description field */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={14} className="text-[#E5A800]" />
                <p className="text-xs font-bold text-gray-700">Describe the Garment & Stain</p>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Blue kurta with ink stain near collar, or bedsheet with tea stain in the center"
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#F8CB46] resize-none"
              />
            </div>
          </>
        )}

        {/* Stain Type Selector (all garment types) */}
        <div className="mb-3">
          <p className="text-xs font-bold text-gray-700 mb-2">Stain Type</p>
          <div className="flex flex-wrap gap-2">
            {STAIN_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  selectedType === t
                    ? "bg-[#F8CB46] text-gray-900 font-bold"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Note (all garment types) */}
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-700 mb-2">Add Note (optional)</p>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={garmentType === "shirt" ? "e.g. Old coffee stain on left pocket" : "e.g. Stubborn grease, needs pre-treatment"}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#F8CB46]"
          />
        </div>

        {/* Markers List */}
        {markers.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-700 mb-2">Marked Stains ({markers.length})</p>
            <div className="space-y-2">
              {markers.map((m, i) => (
                <div key={m.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-red-600">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900">
                      {m.type}{garmentType === "shirt" ? ` · ${m.side}` : ""}
                    </p>
                    {m.note && <p className="text-[10px] text-gray-400 truncate">{m.note}</p>}
                  </div>
                  <button onClick={() => removeMarker(m.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => nav("addons")}
          className="w-full bg-[#F8CB46] text-gray-900 font-bold py-3.5 rounded-2xl text-sm active:scale-[0.98] transition-transform shadow-sm"
        >
          Done · {markers.length} stain{markers.length !== 1 ? "s" : ""} marked
        </button>
      </div>
    </div>
  );
}

// ─── Scheduling Screen ──────────────────────────────────────────
function SchedulingScreen({
  nav, date, setDate, time, setTime, emptyBagSwap, setEmptyBagSwap,
}: {
  nav: (s: LaundryScreen) => void;
  date: string; setDate: (d: string) => void;
  time: string; setTime: (t: string) => void;
  emptyBagSwap: boolean; setEmptyBagSwap: (v: boolean) => void;
}) {
  const dates = ["Today", "Tomorrow", "Wed, 12 Mar"];
  const times = ["10:00 - 12:00 PM", "12:00 - 2:00 PM", "2:00 - 4:00 PM", "4:00 - 6:00 PM", "6:00 - 8:00 PM"];

  return (
    <div>
      <ScreenHeader title="Schedule Pickup" onBack={() => nav("addons")} />
      <div className="px-4 py-4">
        {/* Date */}
        <h3 className="text-sm font-black text-gray-900 mb-3">Pickup Date</h3>
        <div className="flex gap-2.5 mb-5">
          {dates.map((d) => (
            <button
              key={d}
              onClick={() => setDate(d)}
              className={cn(
                "flex-1 py-3 rounded-xl text-xs font-bold border-2 transition-all",
                date === d ? "border-[#F8CB46] bg-yellow-50 text-gray-900" : "border-gray-100 bg-white text-gray-500"
              )}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Time */}
        <h3 className="text-sm font-black text-gray-900 mb-3">Pickup Time Slot</h3>
        <div className="space-y-2 mb-5">
          {times.map((t) => (
            <button
              key={t}
              onClick={() => setTime(t)}
              className={cn(
                "w-full py-3 px-4 rounded-xl text-xs font-medium border-2 text-left transition-all flex items-center justify-between",
                time === t ? "border-[#F8CB46] bg-yellow-50 text-gray-900 font-bold" : "border-gray-100 bg-white text-gray-600"
              )}
            >
              <span className="flex items-center gap-2">
                <Clock size={14} className={time === t ? "text-[#E5A800]" : "text-gray-400"} />
                {t}
              </span>
              {time === t && <Check size={16} className="text-[#E5A800]" />}
            </button>
          ))}
        </div>

        {/* Delivery Method */}
        <h3 className="text-sm font-black text-gray-900 mb-3">Delivery Method</h3>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-3">
          <div className="flex items-center gap-3">
            <Box size={20} className="text-purple-500" />
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Reusable Stackable Box</p>
              <p className="text-[11px] text-gray-400">Eco-friendly delivery in reusable wardrobe boxes</p>
            </div>
            <div className="bg-green-100 text-green-700 text-[9px] font-bold px-2 py-1 rounded-full">ECO</div>
          </div>
        </div>

        {/* Empty Bag Swap */}
        <button
          onClick={() => setEmptyBagSwap(!emptyBagSwap)}
          className={cn(
            "w-full rounded-2xl p-4 border-2 text-left transition-all mb-5",
            emptyBagSwap ? "border-[#F8CB46] bg-yellow-50" : "border-gray-100 bg-white"
          )}
        >
          <div className="flex items-center gap-3">
            <RefreshCw size={18} className={emptyBagSwap ? "text-[#E5A800]" : "text-gray-400"} />
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Empty Bag Swap</p>
              <p className="text-[11px] text-gray-400">Get a fresh laundry bag at pickup. Return the old one — we'll sanitise and reuse it.</p>
            </div>
            <div className={cn("w-10 h-6 rounded-full p-0.5 transition-colors", emptyBagSwap ? "bg-[#F8CB46]" : "bg-gray-200")}>
              <div className={cn("w-5 h-5 bg-white rounded-full shadow transition-transform", emptyBagSwap ? "translate-x-4" : "translate-x-0")} />
            </div>
          </div>
        </button>

        <button
          onClick={() => nav("review")}
          className="w-full bg-[#F8CB46] text-gray-900 font-bold py-3.5 rounded-2xl text-sm active:scale-[0.98] transition-transform shadow-sm"
        >
          Review Order
        </button>
      </div>
    </div>
  );
}

// ─── Review Screen ──────────────────────────────────────────────
function ReviewScreen({
  nav, tier, addons, stainData, protect, bagSwap, date, time, total, quantity, usePass, setUsePass,
}: {
  nav: (s: LaundryScreen) => void;
  tier: typeof SERVICE_TIERS[0];
  addons: string[];
  stainData: StainData;
  protect: boolean;
  bagSwap: boolean;
  date: string;
  time: string;
  total: number;
  quantity: number;
  usePass: boolean;
  setUsePass: (v: boolean) => void;
}) {
  const { garmentType, description, markers } = stainData;
  const addonItems = ADDONS.filter((a) => addons.includes(a.id));
  const passDiscount = usePass ? Math.round(total * 0.15) : 0;
  const finalTotal = total - passDiscount;
  const garmentLabel = garmentType === "shirt" ? "Shirt" : garmentType === "saree" ? "Saree" : "Other";

  return (
    <div>
      <ScreenHeader title="Order Review" onBack={() => nav("scheduling")} />
      <div className="px-4 py-4 space-y-4">
        {/* Service */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Service</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900">{tier.name}</p>
              <p className="text-xs text-gray-400">{quantity} {tier.unit === "/kg" ? "kg" : "pcs"} × ₹{tier.price}</p>
            </div>
            <p className="text-sm font-bold">₹{tier.price * quantity}</p>
          </div>
        </div>

        {/* Add-ons */}
        {addonItems.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Add-ons</h4>
            {addonItems.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-1">
                <p className="text-sm text-gray-700">{a.name}</p>
                <p className="text-sm font-medium">{a.price > 0 ? `₹${a.price}` : "Free"}</p>
              </div>
            ))}
          </div>
        )}

        {/* Protect */}
        {protect && (
          <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-green-600" />
              <span className="text-sm font-bold text-gray-900">Blinkit Protect</span>
              <span className="ml-auto text-sm font-bold">₹29</span>
            </div>
            <p className="text-[11px] text-green-700 mt-1">10x refund · Fabric restoration included</p>
          </div>
        )}

        {/* Stains */}
        {(markers.length > 0 || description) && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <ScanSearch size={14} className="text-[#E5A800]" />
              <h4 className="text-xs font-bold text-gray-400 uppercase">AI Stain Assist</h4>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full">{garmentLabel}</span>
              <p className="text-sm text-gray-700">{markers.length} stain{markers.length !== 1 ? "s" : ""} marked</p>
            </div>
            {description && (
              <div className="bg-gray-50 rounded-xl p-2.5 mb-2">
                <p className="text-[11px] text-gray-600 italic">"{description}"</p>
              </div>
            )}
            {markers.length > 0 && (
              <div className="space-y-1.5 mt-2">
                {markers.map((m, i) => (
                  <div key={m.id} className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold text-red-600">{i + 1}</span>
                    </div>
                    <span className="text-xs text-gray-700">
                      {m.type}{garmentType === "shirt" ? ` (${m.side})` : ""}
                    </span>
                    {m.note && <span className="text-[10px] text-gray-400">· {m.note}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Schedule */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Pickup Schedule</h4>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400" />
            <p className="text-sm text-gray-700">{date} · {time}</p>
          </div>
          {bagSwap && (
            <div className="flex items-center gap-2 mt-2">
              <RefreshCw size={14} className="text-[#E5A800]" />
              <p className="text-xs text-gray-500">Empty bag swap included</p>
            </div>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Box size={14} className="text-purple-500" />
            <p className="text-xs text-gray-500">Delivery in reusable stackable box</p>
          </div>
        </div>

        {/* Apply Pass */}
        <button
          onClick={() => setUsePass(!usePass)}
          className={cn(
            "w-full rounded-2xl p-4 border-2 text-left transition-all",
            usePass ? "border-purple-400 bg-purple-50" : "border-gray-100 bg-white"
          )}
        >
          <div className="flex items-center gap-3">
            <CreditCard size={18} className={usePass ? "text-purple-600" : "text-gray-400"} />
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Apply Laundry Pass</p>
              <p className="text-[11px] text-gray-400">Save 15% · 8.5 kg remaining this month</p>
            </div>
            <div className={cn("w-10 h-6 rounded-full p-0.5 transition-colors", usePass ? "bg-purple-500" : "bg-gray-200")}>
              <div className={cn("w-5 h-5 bg-white rounded-full shadow transition-transform", usePass ? "translate-x-4" : "translate-x-0")} />
            </div>
          </div>
        </button>

        {/* Total */}
        <div className="bg-gray-900 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Subtotal</span>
            <span className="text-sm text-gray-300">₹{total}</span>
          </div>
          {usePass && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-400">Pass Discount (15%)</span>
              <span className="text-sm text-purple-400">-₹{passDiscount}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-gray-700">
            <span className="text-base font-black text-white">Total</span>
            <span className="text-base font-black text-[#F8CB46]">₹{finalTotal}</span>
          </div>
        </div>

        <button
          onClick={() => nav("confirmed")}
          className="w-full bg-[#F8CB46] text-gray-900 font-bold py-4 rounded-2xl text-sm active:scale-[0.98] transition-transform shadow-sm"
        >
          Place Order · ₹{finalTotal}
        </button>
      </div>
    </div>
  );
}

// ─── Order Confirmed ────────────────────────────────────────────
function ConfirmedScreen({ nav, date, time }: { nav: (s: LaundryScreen) => void; date: string; time: string }) {
  return (
    <div>
      <div className="px-4 py-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={36} className="text-green-600" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-1">Order Confirmed!</h2>
        <p className="text-sm text-gray-500 mb-6">Your laundry will be picked up soon</p>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 text-left mb-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">What to keep ready</h4>
          <div className="space-y-3">
            {[
              { icon: ShoppingBag, text: "Keep your laundry bag near the door" },
              { icon: Clock, text: `Pickup window: ${date}, ${time}` },
              { icon: Camera, text: "Our executive will click an inventory photo" },
              { icon: Package, text: "You'll receive an AI-generated receipt" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <item.icon size={16} className="text-[#E5A800] mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-sell */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 text-left mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-[#E5A800]" />
            <p className="text-xs font-bold text-gray-900">Liked the smell? Buy detergent</p>
          </div>
          <div className="flex gap-3 overflow-x-auto">
            {DETERGENT_PRODUCTS.map((p) => (
              <div key={p.name} className="shrink-0 w-28 bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-3xl mb-1">{p.img}</div>
                <p className="text-[10px] font-bold text-gray-900 leading-tight">{p.name}</p>
                <p className="text-[10px] text-gray-500">★ {p.rating}</p>
                <p className="text-xs font-bold text-gray-900 mt-1">₹{p.price}</p>
                <button className="mt-1.5 w-full bg-[#F8CB46] text-[10px] font-bold py-1 rounded-lg text-gray-900">ADD</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => nav("tracking")}
            className="flex-1 bg-[#F8CB46] text-gray-900 font-bold py-3 rounded-2xl text-sm active:scale-[0.98] transition-transform"
          >
            Track Order
          </button>
          <button
            onClick={() => nav("landing")}
            className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-2xl text-sm active:scale-[0.98] transition-transform"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tracking Screen ────────────────────────────────────────────
function TrackingScreen({ nav }: { nav: (s: LaundryScreen) => void }) {
  return (
    <div>
      <ScreenHeader title="Order Tracking" onBack={() => nav("landing")} />
      <div className="px-4 py-4 space-y-4">
        {/* Order Info */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-400">ORDER #BLK-7842</span>
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full">IN PROGRESS</span>
          </div>
          <p className="text-sm font-bold text-gray-900">Wash & Iron · 3 kg</p>
          <div className="flex items-center gap-2 mt-1">
            <Timer size={12} className="text-[#E5A800]" />
            <p className="text-xs text-gray-500">ETA: Today, 4:00 PM</p>
          </div>
        </div>

        {/* Timeline Stepper */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Progress</h4>
          <div className="space-y-0">
            {TRACKING_STAGES.map((stage, i) => {
              const isLast = i === TRACKING_STAGES.length - 1;
              return (
                <div key={stage.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2",
                      stage.done ? "bg-green-500 border-green-500" : stage.active ? "bg-[#F8CB46] border-[#F8CB46] animate-pulse" : "bg-white border-gray-200"
                    )}>
                      {stage.done ? (
                        <Check size={14} className="text-white" />
                      ) : stage.active ? (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      ) : (
                        <div className="w-2 h-2 bg-gray-200 rounded-full" />
                      )}
                    </div>
                    {!isLast && (
                      <div className={cn("w-0.5 h-8", stage.done ? "bg-green-300" : "bg-gray-200")} />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className={cn("text-sm font-bold", stage.done || stage.active ? "text-gray-900" : "text-gray-400")}>
                      {stage.label}
                    </p>
                    <p className="text-[11px] text-gray-400">{stage.done ? `Completed at ${stage.time}` : stage.active ? "In progress" : stage.time}</p>
                    {stage.id === "stain" && stage.done && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <Camera size={11} className="text-purple-500" />
                        <span className="text-[10px] text-purple-600 font-medium">Wash-Cam available</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wash-Cam Placeholder */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Camera size={20} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Wash-Cam</p>
              <p className="text-[11px] text-gray-400">Live view available during Stain Treatment & Washing</p>
            </div>
            <button className="bg-purple-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full opacity-50">
              VIEW
            </button>
          </div>
        </div>

        {/* AI Inventory Receipt */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-[#E5A800]" />
            <h4 className="text-xs font-bold text-gray-900">AI Inventory Receipt</h4>
            <span className="bg-yellow-100 text-yellow-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">AI</span>
          </div>
          <div className="flex gap-3 mb-3">
            <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
              <Camera size={24} className="text-gray-300" />
              <span className="text-[8px] text-gray-400 absolute mt-8">Pickup photo</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-700 mb-1.5">Detected Items</p>
              <div className="space-y-1">
                {[
                  { item: "Shirts", count: 5 },
                  { item: "Trousers", count: 2 },
                  { item: "T-shirts", count: 3 },
                  { item: "Towels", count: 1 },
                ].map((d) => (
                  <div key={d.item} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{d.item}</span>
                    <span className="text-xs font-bold text-gray-900">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 flex items-center gap-2">
            <Info size={12} className="text-gray-400 shrink-0" />
            <p className="text-[10px] text-gray-500">AI-counted at pickup. Review & raise dispute within 2 hours.</p>
          </div>
        </div>

        {/* Blinkit Protect Status */}
        <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-green-600" />
            <p className="text-sm font-bold text-gray-900">Blinkit Protect Active</p>
          </div>
          <p className="text-[11px] text-green-700 mt-1">This order is covered · 10x refund guarantee</p>
        </div>

        {/* Reusable Box Info */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <Box size={18} className="text-purple-500" />
            <div>
              <p className="text-sm font-bold text-gray-900">Delivery in Reusable Box</p>
              <p className="text-[11px] text-gray-400">Stackable wardrobe box · Return on next pickup</p>
            </div>
          </div>
        </div>

        {/* Cross-sell */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-[#E5A800]" />
            <p className="text-xs font-bold text-gray-900">Liked the smell? Buy detergent</p>
          </div>
          <div className="flex gap-3 overflow-x-auto">
            {DETERGENT_PRODUCTS.map((p) => (
              <div key={p.name} className="shrink-0 w-28 bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-3xl mb-1">{p.img}</div>
                <p className="text-[10px] font-bold text-gray-900 leading-tight">{p.name}</p>
                <p className="text-[10px] text-gray-500">★ {p.rating}</p>
                <p className="text-xs font-bold text-gray-900 mt-1">₹{p.price}</p>
                <button className="mt-1.5 w-full bg-[#F8CB46] text-[10px] font-bold py-1 rounded-lg text-gray-900">ADD</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Laundry Pass Screen ────────────────────────────────────────
function PassScreen({ nav }: { nav: (s: LaundryScreen) => void }) {
  const [selectedPlan, setSelectedPlan] = useState("plus");
  const usedKg = 11.5;
  const totalKg = 20;
  const pct = (usedKg / totalKg) * 100;

  return (
    <div>
      <ScreenHeader title="Laundry Pass" onBack={() => nav("landing")} />
      <div className="px-4 py-4">
        {/* Active Pass Balance */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-5 text-white mb-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-medium text-purple-200">Active Pass</p>
              <p className="text-lg font-black">Plus · 20kg</p>
            </div>
            <div className="bg-white/20 rounded-xl px-3 py-1.5">
              <p className="text-[10px] font-medium text-purple-200">Expires</p>
              <p className="text-xs font-bold">Apr 10</p>
            </div>
          </div>
          {/* Balance Meter */}
          <div className="mb-2">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-purple-200">Used: {usedKg} kg</span>
              <span className="text-purple-200">Remaining: {totalKg - usedKg} kg</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-[#F8CB46] rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <p className="text-[10px] text-purple-200 mt-1">Used in 3 orders this month</p>
        </div>

        {/* Plans */}
        <h3 className="text-sm font-black text-gray-900 mb-3">Choose a Plan</h3>
        <div className="space-y-3 mb-5">
          {LAUNDRY_PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={cn(
                "w-full rounded-2xl p-4 border-2 text-left transition-all relative active:scale-[0.98]",
                selectedPlan === plan.id
                  ? "border-purple-400 bg-purple-50"
                  : "border-gray-100 bg-white"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-2.5 right-4 bg-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  BEST VALUE
                </div>
              )}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-base font-black text-gray-900">{plan.name}</p>
                  <p className="text-xs text-gray-400">{plan.kg} kg/month</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-gray-900">₹{plan.price}</p>
                  <p className="text-[10px] text-gray-400">₹{plan.perKg}/kg</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {plan.features.map((f) => (
                  <span key={f} className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
                    <Check size={10} className="text-green-500" />
                    {f}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        <button className="w-full bg-purple-600 text-white font-bold py-4 rounded-2xl text-sm active:scale-[0.98] transition-transform shadow-sm">
          Buy {LAUNDRY_PLANS.find((p) => p.id === selectedPlan)?.name} Pass · ₹{LAUNDRY_PLANS.find((p) => p.id === selectedPlan)?.price}
        </button>
        <p className="text-[10px] text-gray-400 text-center mt-2">Cancel anytime · Pass applied automatically at checkout</p>
      </div>
    </div>
  );
}
