/**
 * Oyun sabitleri ve konfigürasyon dosyası.
 * Tüm denge ayarları, maliyetler ve üretim değerleri burada toplanmıştır.
 */

import type { BuildingType, Employee } from "./stores/useGameState";

/** Bina maliyetleri */
export const BUILDING_COSTS: Record<BuildingType, number> = {
  solar_panel: 50,
  wind_turbine: 100,
  power_station: 300,
  gold_mine: 500,
  gaming_office: 1000,
  battery_storage: 400,
  research_lab: 800,
};

/** Bina üretim değerleri (saniyede) */
export const BUILDING_PRODUCTION: Record<BuildingType, { gold: number; energy: number }> = {
  solar_panel: { gold: 0, energy: 5 },
  wind_turbine: { gold: 0, energy: 10 },
  power_station: { gold: 0, energy: 25 },
  gold_mine: { gold: 10, energy: -5 },
  gaming_office: { gold: 15, energy: -10 },
  battery_storage: { gold: 0, energy: 0 },   // Kapasite artırır
  research_lab: { gold: -5, energy: -8 },     // Araştırma puanı üretir
};

/** Bina meta bilgileri */
export const BUILDING_META: Record<BuildingType, {
  name: string;
  description: string;
  icon: string;
  prodText: string;
  category: "energy" | "economy" | "special";
}> = {
  solar_panel: {
    name: "Güneş Paneli",
    description: "Temiz enerji üretir",
    icon: "☀️",
    prodText: "+5 Enerji/s",
    category: "energy",
  },
  wind_turbine: {
    name: "Rüzgar Türbini",
    description: "Güçlü enerji kaynağı",
    icon: "🌬️",
    prodText: "+10 Enerji/s",
    category: "energy",
  },
  power_station: {
    name: "Enerji Santrali",
    description: "Yüksek enerji + kapasite",
    icon: "🏭",
    prodText: "+25 Enerji/s",
    category: "energy",
  },
  battery_storage: {
    name: "Batarya Deposu",
    description: "Enerji kapasitesini artırır",
    icon: "🔋",
    prodText: "+100 Kapasite",
    category: "energy",
  },
  gold_mine: {
    name: "Altın Madeni",
    description: "Altın üretir, enerji harcar",
    icon: "⛏️",
    prodText: "+10 Altın/s, -5 Enerji/s",
    category: "economy",
  },
  gaming_office: {
    name: "Oyun Ofisi",
    description: "Oyun şirketi geliri",
    icon: "🎮",
    prodText: "+15 Altın/s, -10 Enerji/s",
    category: "economy",
  },
  research_lab: {
    name: "Araştırma Labi",
    description: "Teknoloji araştırması yapar",
    icon: "🔬",
    prodText: "+1 Araştırma/s",
    category: "special",
  },
};

/** Çalışan isimleri */
export const EMPLOYEE_NAMES = [
  "Ahmet", "Mehmet", "Ali", "Ayşe", "Fatma", "Zeynep",
  "Can", "Deniz", "Elif", "Burak", "Emre", "Selin",
  "Onur", "Derya", "Berk", "Ceren", "Tolga", "Nisa",
  "Kaan", "Yasemin", "Mert", "Ezgi", "Ege", "Pınar",
  "Arda", "Hakan", "Seda", "Furkan", "Yıldız", "Barış",
];

/** Çalışan maaşları */
export const EMPLOYEE_SALARIES: Record<Employee["role"], number> = {
  developer: 20,
  designer: 15,
  manager: 25,
  marketer: 18,
};

/** Teknoloji ağacı tanımları */
export interface TechNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  researchTime: number; // saniye
  requires: string[];
  effect: {
    type: "production_boost" | "cost_reduction" | "unlock_building" | "capacity_boost" | "battle_boost";
    target?: BuildingType | string;
    value: number;
  };
}

export const TECH_TREE: TechNode[] = [
  {
    id: "solar_efficiency",
    name: "Gelişmiş Güneş Panelleri",
    description: "Güneş paneli verimliliğini %50 artırır",
    icon: "☀️",
    cost: 200,
    researchTime: 30,
    requires: [],
    effect: { type: "production_boost", target: "solar_panel", value: 1.5 },
  },
  {
    id: "wind_power",
    name: "Mega Rüzgar Türbinleri",
    description: "Rüzgar türbini üretimini %50 artırır",
    icon: "🌬️",
    cost: 300,
    researchTime: 45,
    requires: [],
    effect: { type: "production_boost", target: "wind_turbine", value: 1.5 },
  },
  {
    id: "battery_tech",
    name: "Batarya Teknolojisi",
    description: "Batarya deposu binasını açar",
    icon: "🔋",
    cost: 400,
    researchTime: 60,
    requires: ["solar_efficiency"],
    effect: { type: "unlock_building", target: "battery_storage", value: 1 },
  },
  {
    id: "mining_drill",
    name: "Gelişmiş Maden Matkabı",
    description: "Altın madeni üretimini 2 katına çıkarır",
    icon: "⛏️",
    cost: 500,
    researchTime: 60,
    requires: [],
    effect: { type: "production_boost", target: "gold_mine", value: 2.0 },
  },
  {
    id: "research_facility",
    name: "Araştırma Tesisi",
    description: "Araştırma labi binasını açar",
    icon: "🔬",
    cost: 600,
    researchTime: 90,
    requires: ["solar_efficiency", "wind_power"],
    effect: { type: "unlock_building", target: "research_lab", value: 1 },
  },
  {
    id: "smart_grid",
    name: "Akıllı Şebeke",
    description: "Tüm enerji üretimini %30 artırır",
    icon: "🌐",
    cost: 800,
    researchTime: 120,
    requires: ["battery_tech"],
    effect: { type: "production_boost", target: "all_energy", value: 1.3 },
  },
  {
    id: "ai_gaming",
    name: "Yapay Zeka Oyun Motoru",
    description: "Oyun ofisi gelirini 2 katına çıkarır",
    icon: "🤖",
    cost: 1000,
    researchTime: 120,
    requires: ["research_facility"],
    effect: { type: "production_boost", target: "gaming_office", value: 2.0 },
  },
  {
    id: "military_training",
    name: "Askeri Eğitim",
    description: "Savaş saldırı gücünü %50 artırır",
    icon: "⚔️",
    cost: 400,
    researchTime: 60,
    requires: ["mining_drill"],
    effect: { type: "battle_boost", value: 1.5 },
  },
  {
    id: "cost_optimization",
    name: "Maliyet Optimizasyonu",
    description: "Tüm inşaat maliyetlerini %20 azaltır",
    icon: "💰",
    cost: 700,
    researchTime: 90,
    requires: ["mining_drill", "smart_grid"],
    effect: { type: "cost_reduction", value: 0.8 },
  },
  {
    id: "fusion_reactor",
    name: "Füzyon Reaktörü",
    description: "Enerji santralini 3 katına çıkarır",
    icon: "⚛️",
    cost: 2000,
    researchTime: 180,
    requires: ["smart_grid", "research_facility"],
    effect: { type: "production_boost", target: "power_station", value: 3.0 },
  },
];

/** Rastgele olay tanımları */
export interface GameEvent {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: "positive" | "negative" | "neutral";
  effect: (state: any) => Partial<any>;
  duration?: number; // saniye
}

export const RANDOM_EVENTS: GameEvent[] = [
  {
    id: "solar_flare",
    title: "Güneş Patlaması!",
    description: "Güneş aktivitesi artışı! Güneş panelleri 30sn boyunca %200 verimli.",
    icon: "🌞",
    type: "positive",
    duration: 30,
    effect: () => ({ eventMultiplier: { solar_panel: 3.0 } }),
  },
  {
    id: "gold_rush",
    title: "Altın Dalgası!",
    description: "Zengin bir altın damarı bulundu! +500 altın.",
    icon: "💎",
    type: "positive",
    effect: (s: any) => ({ gold: s.gold + 500 }),
  },
  {
    id: "storm",
    title: "Fırtına!",
    description: "Şiddetli fırtına! Rüzgar türbinleri 20sn boyunca %300 verimli.",
    icon: "⛈️",
    type: "positive",
    duration: 20,
    effect: () => ({ eventMultiplier: { wind_turbine: 4.0 } }),
  },
  {
    id: "earthquake",
    title: "Deprem!",
    description: "Hafif deprem hasarı. Bir rastgele bina 1 seviye kaybetti.",
    icon: "🌍",
    type: "negative",
    effect: (s: any) => {
      if (s.buildings.length === 0) return {};
      const idx = Math.floor(Math.random() * s.buildings.length);
      const buildings = [...s.buildings];
      if (buildings[idx].level > 1) {
        buildings[idx] = { ...buildings[idx], level: buildings[idx].level - 1 };
      }
      return { buildings };
    },
  },
  {
    id: "tax_break",
    title: "Vergi İndirimi!",
    description: "Devletten teşvik geldi! +300 altın.",
    icon: "🏛️",
    type: "positive",
    effect: (s: any) => ({ gold: s.gold + 300 }),
  },
  {
    id: "power_outage",
    title: "Elektrik Kesintisi!",
    description: "Bölgesel kesinti! Enerji sıfırlandı.",
    icon: "🔌",
    type: "negative",
    effect: () => ({ energy: 0 }),
  },
  {
    id: "investor",
    title: "Yatırımcı İlgisi!",
    description: "Bir yatırımcı ilgilendi! +1000 altın.",
    icon: "🤝",
    type: "positive",
    effect: (s: any) => ({ gold: s.gold + 1000 }),
  },
  {
    id: "market_crash",
    title: "Piyasa Çöküşü!",
    description: "Altın fiyatları düştü! Altının %20'si kayboldu.",
    icon: "📉",
    type: "negative",
    effect: (s: any) => ({ gold: s.gold * 0.8 }),
  },
  {
    id: "tech_breakthrough",
    title: "Teknolojik Atılım!",
    description: "Araştırmacılar keşif yaptı! Tüm üretim 60sn boyunca %50 arttı.",
    icon: "🧪",
    type: "positive",
    duration: 60,
    effect: () => ({ eventMultiplier: { all: 1.5 } }),
  },
  {
    id: "employee_bonus",
    title: "Çalışan Morali Yükseldi!",
    description: "Harika bir gün! Tüm çalışanların verimliliği geçici olarak arttı.",
    icon: "🎉",
    type: "positive",
    duration: 45,
    effect: () => ({ eventMultiplier: { employees: 2.0 } }),
  },
];

/** Başarım tanımları */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (state: any) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_building", title: "İlk Adım", description: "İlk binayı inşa et", icon: "🏗️", condition: (s) => s.buildings.length >= 1 },
  { id: "builder_5", title: "İnşaatçı", description: "5 bina inşa et", icon: "🏢", condition: (s) => s.buildings.length >= 5 },
  { id: "builder_15", title: "Usta İnşaatçı", description: "15 bina inşa et", icon: "🏙️", condition: (s) => s.buildings.length >= 15 },
  { id: "gold_1000", title: "Zenginleşme", description: "1000 altın biriktir", icon: "💰", condition: (s) => s.gold >= 1000 },
  { id: "gold_10000", title: "Milyoner", description: "10000 altın biriktir", icon: "💎", condition: (s) => s.gold >= 10000 },
  { id: "mine_1", title: "Kaşif", description: "İlk madeni fethet", icon: "⛏️", condition: (s) => s.unlockedMines.length >= 1 },
  { id: "mine_all", title: "Fatih", description: "Tüm madenleri fethet", icon: "👑", condition: (s) => s.unlockedMines.length >= 4 },
  { id: "first_employee", title: "Patron", description: "İlk çalışanı işe al", icon: "👔", condition: (s) => s.employees.length >= 1 },
  { id: "company_5", title: "Büyük Şirket", description: "Şirket seviyesini 5'e çıkar", icon: "🎮", condition: (s) => s.gamingCompanyLevel >= 5 },
  { id: "first_tech", title: "Araştırmacı", description: "İlk teknolojiyi araştır", icon: "🔬", condition: (s) => s.unlockedTechs.length >= 1 },
  { id: "battle_win", title: "Savaşçı", description: "İlk savaşı kazan", icon: "⚔️", condition: (s) => s.battlesWon >= 1 },
  { id: "energy_500", title: "Enerji Baronu", description: "500 enerji kapasitesine ulaş", icon: "⚡", condition: (s) => s.energyCapacity >= 500 },
];

/** Günün saat dilimleri */
export const DAY_PHASES = {
  dawn: { start: 0.2, end: 0.3, ambientColor: "#ff9966", intensity: 0.5 },
  day: { start: 0.3, end: 0.7, ambientColor: "#fff5e0", intensity: 1.2 },
  dusk: { start: 0.7, end: 0.8, ambientColor: "#ff6633", intensity: 0.6 },
  night: { start: 0.8, end: 0.2, ambientColor: "#1a1a4e", intensity: 0.2 },
} as const;

/** Save/Load key */
export const SAVE_KEY = "energy_tycoon_save";
export const SETTINGS_KEY = "energy_tycoon_settings";
