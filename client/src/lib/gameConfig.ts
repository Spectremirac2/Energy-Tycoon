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

/** ===== HARİTA KONFİGÜRASYONU ===== */
export const MAP_CONFIG = {
  /** Toplam harita boyutu (birim) */
  SIZE: 400,
  /** Oynanabilir alan sınırı (±) */
  BOUNDS: 190,
  /** Arka plan düzlem boyutu */
  BG_SIZE: 800,
  /** Bina yerleştirme grid boyutu */
  GRID_SNAP: 3,
  /** Bina minimum mesafe */
  MIN_SPACING: 3,
  /** Sis başlangıç mesafesi */
  FOG_NEAR: 80,
  /** Sis bitiş mesafesi */
  FOG_FAR: 250,
  /** Kamera far plane */
  CAMERA_FAR: 600,
  /** Gölge kamera boyutu */
  SHADOW_SIZE: 100,
  /** Ağaç sayısı */
  TREE_COUNT: 500,
  /** Kaya sayısı */
  ROCK_COUNT: 200,
  /** Ağaç dağılım yarıçapı */
  TREE_RADIUS: 185,
  /** Kaya dağılım yarıçapı */
  ROCK_RADIUS: 180,
  /** Texture tekrar sayısı */
  TEXTURE_REPEAT: 80,
} as const;

/** ===== BÖLGE SİSTEMİ ===== */
export interface Region {
  id: string;
  name: string;
  center: [number, number, number];
  radius: number;
  color: string;
  icon: string;
  description: string;
  bonus: {
    type: "gold_boost" | "salary_reduce" | "energy_boost" | "production_boost";
    value: number;
    label: string;
  };
}

export const REGIONS: Region[] = [
  {
    id: "city",
    name: "Ticaret Şehri",
    center: [80, 0, -70],
    radius: 35,
    color: "#c4a35a",
    icon: "🏙️",
    description: "Ticaret yapabileceğin canlı şehir. Banka, market ve depolar var.",
    bonus: { type: "gold_boost", value: 1.3, label: "+%30 Altın Geliri" },
  },
  {
    id: "farm",
    name: "Çiftlik Kasaba",
    center: [-75, 0, 65],
    radius: 30,
    color: "#8B7355",
    icon: "🌾",
    description: "Verimli tarım arazileri. Hayvan çiftlikleri ve pazar yeri.",
    bonus: { type: "salary_reduce", value: 0.8, label: "-%20 Çalışan Maaşı" },
  },
  {
    id: "forest",
    name: "Yoğun Orman",
    center: [-60, 0, -60],
    radius: 40,
    color: "#1a4a12",
    icon: "🌲",
    description: "Doğal kaynakları bol yoğun orman bölgesi.",
    bonus: { type: "energy_boost", value: 1.2, label: "+%20 Enerji Üretimi" },
  },
  {
    id: "factory",
    name: "Sanayi Bölgesi",
    center: [70, 0, 70],
    radius: 25,
    color: "#5a5a6a",
    icon: "🏭",
    description: "Endüstriyel üretim bölgesi. Fabrikalar ve depolar.",
    bonus: { type: "production_boost", value: 1.5, label: "+%50 Üretim Hızı" },
  },
];

/** Bölge yakınlık kontrolü */
export function getRegionAt(x: number, z: number): Region | null {
  for (const region of REGIONS) {
    const dx = x - region.center[0];
    const dz = z - region.center[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist <= region.radius) return region;
  }
  return null;
}

/** Bina konumuna göre bonus çarpanı hesapla */
export function getRegionBonus(x: number, z: number): { goldMult: number; energyMult: number; salaryMult: number; prodMult: number } {
  const region = getRegionAt(x, z);
  const result = { goldMult: 1, energyMult: 1, salaryMult: 1, prodMult: 1 };
  if (!region) return result;
  switch (region.bonus.type) {
    case "gold_boost": result.goldMult = region.bonus.value; break;
    case "energy_boost": result.energyMult = region.bonus.value; break;
    case "salary_reduce": result.salaryMult = region.bonus.value; break;
    case "production_boost": result.prodMult = region.bonus.value; break;
  }
  return result;
}

/** Ticaret piyasa fiyatları */
export const TRADE_CONFIG = {
  /** Enerji birimi başına altın (temel fiyat) */
  BASE_ENERGY_PRICE: 2,
  /** Fiyat dalgalanma aralığı */
  PRICE_VARIANCE: 0.5,
  /** Banka faiz oranı (saniyede) */
  BANK_INTEREST_RATE: 0.001,
  /** Market buffs */
  MARKET_ITEMS: [
    { id: "speed_boost", name: "Hız Güçlendirme", cost: 500, icon: "⚡", description: "30sn tüm üretim %200", duration: 30, mult: 2 },
    { id: "gold_magnet", name: "Altın Mıknatısı", cost: 800, icon: "🧲", description: "60sn altın üretimi %300", duration: 60, mult: 3 },
    { id: "shield", name: "Koruma Kalkanı", cost: 1000, icon: "🛡️", description: "Negatif olayları 120sn engeller", duration: 120, mult: 1 },
  ],
} as const;

/** Biome tanımları */
export interface Biome {
  id: string;
  name: string;
  color: string;
  treeDensity: number;  // 0-1
  rockDensity: number;  // 0-1
  heightVariation: number;
}

export const BIOMES: Biome[] = [
  { id: "grassland", name: "Çayırlık", color: "#2d5a1e", treeDensity: 0.4, rockDensity: 0.2, heightVariation: 0.1 },
  { id: "desert", name: "Çöl", color: "#c2a645", treeDensity: 0.05, rockDensity: 0.5, heightVariation: 0.2 },
  { id: "snow", name: "Karlık", color: "#d4e5f7", treeDensity: 0.2, rockDensity: 0.4, heightVariation: 0.3 },
  { id: "forest", name: "Orman", color: "#1a4a12", treeDensity: 0.9, rockDensity: 0.3, heightVariation: 0.15 },
  { id: "mountain", name: "Dağlık", color: "#5a5a5a", treeDensity: 0.1, rockDensity: 0.8, heightVariation: 0.5 },
];

/** Yeni maden lokasyonları (büyük harita için) */
export const MINE_LOCATIONS = [
  { id: "mine_1", position: [25, 0, -20] as [number, number, number], name: "Altın Dağı", difficulty: 1 },
  { id: "mine_2", position: [-35, 0, 15] as [number, number, number], name: "Gizli Maden", difficulty: 2 },
  { id: "mine_3", position: [40, 0, 35] as [number, number, number], name: "Kadim Ocak", difficulty: 3 },
  { id: "mine_4", position: [-25, 0, -40] as [number, number, number], name: "Ejder Madeni", difficulty: 4 },
  { id: "mine_5", position: [60, 0, -50] as [number, number, number], name: "Kristal Mağara", difficulty: 5 },
  { id: "mine_6", position: [-55, 0, 55] as [number, number, number], name: "Karanlık Kuyu", difficulty: 6 },
  { id: "mine_7", position: [70, 0, 60] as [number, number, number], name: "Volkan Madeni", difficulty: 7 },
  { id: "mine_8", position: [-70, 0, -65] as [number, number, number], name: "Elmas Uçurumu", difficulty: 8 },
];

/** Yeni bina tipleri (nuclear, solar_farm, energy_trader, training_center) */
export const NEW_BUILDING_COSTS: Record<string, number> = {
  nuclear_plant: 5000,
  solar_farm: 2000,
  energy_trader: 1500,
  training_center: 2500,
  hydroelectric: 3000,
  geothermal: 4000,
};

export const NEW_BUILDING_PRODUCTION: Record<string, { gold: number; energy: number }> = {
  nuclear_plant: { gold: 0, energy: 100 },
  solar_farm: { gold: 0, energy: 30 },
  energy_trader: { gold: 25, energy: -20 },
  training_center: { gold: -10, energy: -5 },
  hydroelectric: { gold: 0, energy: 50 },
  geothermal: { gold: 5, energy: 40 },
};

export const NEW_BUILDING_META: Record<string, {
  name: string;
  description: string;
  icon: string;
  prodText: string;
  category: "energy" | "economy" | "special";
  requiresTech?: string;
}> = {
  nuclear_plant: {
    name: "Nükleer Santral",
    description: "Devasa enerji üretimi, yüksek maliyet",
    icon: "☢️",
    prodText: "+100 Enerji/s",
    category: "energy",
    requiresTech: "fusion_reactor",
  },
  solar_farm: {
    name: "Güneş Çiftliği",
    description: "Büyük alan, yüksek güneş enerjisi",
    icon: "🌅",
    prodText: "+30 Enerji/s",
    category: "energy",
    requiresTech: "solar_efficiency",
  },
  energy_trader: {
    name: "Enerji Borsası",
    description: "Fazla enerjiyi altına çevirir",
    icon: "📈",
    prodText: "+25 Altın/s, -20 Enerji/s",
    category: "economy",
    requiresTech: "smart_grid",
  },
  training_center: {
    name: "Eğitim Merkezi",
    description: "Çalışan verimliliğini artırır",
    icon: "🎓",
    prodText: "+%25 Çalışan Verimi",
    category: "special",
    requiresTech: "ai_gaming",
  },
  hydroelectric: {
    name: "Hidroelektrik Santral",
    description: "Su gücüyle enerji üretir",
    icon: "💧",
    prodText: "+50 Enerji/s",
    category: "energy",
    requiresTech: "battery_tech",
  },
  geothermal: {
    name: "Jeotermal Santral",
    description: "Yer altı ısısından enerji ve altın",
    icon: "🌋",
    prodText: "+40 Enerji/s, +5 Altın/s",
    category: "energy",
    requiresTech: "mining_drill",
  },
};

/** Save/Load key */
export const SAVE_KEY = "energy_tycoon_save";
export const SETTINGS_KEY = "energy_tycoon_settings";
