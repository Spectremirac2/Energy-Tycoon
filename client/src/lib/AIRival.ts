/**
 * AI Rakip Sistemi - Utility-Based karar motoru.
 * Her rakip farklı kişilik ve stratejiye sahiptir.
 */

/** Rakip kişilik profili */
export interface AIPersonality {
  aggression: number;     // 0-1: agresif fiyatlandırma
  expansion: number;      // 0-1: hızlı genişleme
  research: number;       // 0-1: araştırma önceliği
  efficiency: number;     // 0-1: verimlilik odağı
}

/** Tek bir AI rakip */
export interface AIRival {
  id: string;
  name: string;
  color: string;
  personality: AIPersonality;
  gold: number;
  energy: number;
  buildingCount: number;
  techLevel: number;
  marketShare: number;      // 0-1 arası pazar payı
  energyPrice: number;      // $/kWh
  reputation: number;       // 0-100
  lastAction: string;
}

/** Olası AI eylemleri */
type AIAction = "build" | "research" | "price_cut" | "price_hike" | "upgrade" | "idle";

/** Varsayılan rakipler */
export const DEFAULT_RIVALS: AIRival[] = [
  {
    id: "rival_voltex",
    name: "VoltEx Enerji",
    color: "#e74c3c",
    personality: { aggression: 0.8, expansion: 0.7, research: 0.3, efficiency: 0.4 },
    gold: 150,
    energy: 50,
    buildingCount: 2,
    techLevel: 0,
    marketShare: 0.2,
    energyPrice: 12,
    reputation: 50,
    lastAction: "Piyasaya giriş yaptı",
  },
  {
    id: "rival_greenwave",
    name: "GreenWave Corp",
    color: "#2ecc71",
    personality: { aggression: 0.3, expansion: 0.5, research: 0.8, efficiency: 0.7 },
    gold: 180,
    energy: 30,
    buildingCount: 1,
    techLevel: 1,
    marketShare: 0.15,
    energyPrice: 14,
    reputation: 65,
    lastAction: "Ar-Ge'ye yatırım yapıyor",
  },
  {
    id: "rival_titanpower",
    name: "TitanPower Inc",
    color: "#f39c12",
    personality: { aggression: 0.5, expansion: 0.9, research: 0.4, efficiency: 0.5 },
    gold: 200,
    energy: 70,
    buildingCount: 3,
    techLevel: 0,
    marketShare: 0.25,
    energyPrice: 11,
    reputation: 45,
    lastAction: "Yeni tesis kuruyor",
  },
];

/**
 * @description Utility-Based karar motoru.
 *   Her eylem için fayda puanı hesaplar ve en yüksek puanlıyı seçer.
 */
export function evaluateRivalAction(
  rival: AIRival,
  playerGold: number,
  playerBuildingCount: number,
  marketDemand: number
): { action: AIAction; description: string } {
  try {
    const scores: Record<AIAction, number> = {
      build: 0,
      research: 0,
      price_cut: 0,
      price_hike: 0,
      upgrade: 0,
      idle: 0.1,
    };

    const { personality } = rival;

    // Bina yap: Altını yeterliyse ve genişlemeci kişilik
    if (rival.gold > 80) {
      scores.build = personality.expansion * 0.6 + (rival.buildingCount < 5 ? 0.3 : 0.1);
    }

    // Araştırma: Altın varsa ve araştırmacı kişilik
    if (rival.gold > 120 && rival.techLevel < 5) {
      scores.research = personality.research * 0.7 + (1 - rival.techLevel / 5) * 0.2;
    }

    // Fiyat kır: Agresifse ve pazar payı düşükse
    if (rival.energyPrice > 8) {
      scores.price_cut = personality.aggression * 0.5 + (rival.marketShare < 0.2 ? 0.3 : 0);
    }

    // Fiyat artır: Pazar payı yüksekse ve verimlilik odağı
    if (rival.marketShare > 0.3) {
      scores.price_hike = personality.efficiency * 0.4 + (rival.gold < 50 ? 0.3 : 0);
    }

    // Yükselt: Binaları varsa ve verimlilik odağı
    if (rival.buildingCount > 2 && rival.gold > 60) {
      scores.upgrade = personality.efficiency * 0.5 + (rival.techLevel > 1 ? 0.2 : 0);
    }

    // En yüksek puanlı eylemi seç
    let bestAction: AIAction = "idle";
    let bestScore = -1;
    for (const [action, score] of Object.entries(scores) as [AIAction, number][]) {
      if (score > bestScore) {
        bestScore = score;
        bestAction = action;
      }
    }

    return {
      action: bestAction,
      description: getActionDescription(bestAction, rival.name),
    };
  } catch (e) {
    console.error("[AIRival] evaluateAction hatası:", e);
    return { action: "idle", description: `${rival.name} bekliyor` };
  }
}

/**
 * @description AI rakip tick'i - durumu günceller ve eylem yapar.
 */
export function tickRival(rival: AIRival, playerGold: number, playerBuildingCount: number): AIRival {
  try {
    const { action, description } = evaluateRivalAction(rival, playerGold, playerBuildingCount, 1);

    const updated = { ...rival, lastAction: description };

    switch (action) {
      case "build":
        updated.gold -= 50;
        updated.buildingCount += 1;
        updated.energy += 15;
        updated.marketShare = Math.min(0.4, updated.marketShare + 0.02);
        break;
      case "research":
        updated.gold -= 80;
        updated.techLevel += 1;
        updated.reputation += 5;
        break;
      case "price_cut":
        updated.energyPrice = Math.max(6, updated.energyPrice - 1.5);
        updated.marketShare = Math.min(0.4, updated.marketShare + 0.03);
        updated.reputation -= 2;
        break;
      case "price_hike":
        updated.energyPrice += 1;
        updated.gold += 20;
        updated.reputation += 1;
        break;
      case "upgrade":
        updated.gold -= 40;
        updated.energy += 10;
        updated.reputation += 2;
        break;
      default:
        // idle - pasif gelir
        updated.gold += updated.buildingCount * 3;
        break;
    }

    // Pasif gelir (her tick)
    updated.gold += updated.buildingCount * 2;
    updated.gold = Math.max(0, updated.gold);
    updated.reputation = Math.max(0, Math.min(100, updated.reputation));
    updated.marketShare = Math.max(0, Math.min(0.4, updated.marketShare));

    return updated;
  } catch (e) {
    console.error("[AIRival] tickRival hatası:", e);
    return rival;
  }
}

/** @description Eylem açıklama metni */
function getActionDescription(action: AIAction, name: string): string {
  switch (action) {
    case "build": return `${name} yeni tesis kuruyor`;
    case "research": return `${name} Ar-Ge'ye yatırım yapıyor`;
    case "price_cut": return `${name} fiyatları düşürdü!`;
    case "price_hike": return `${name} fiyatları artırdı`;
    case "upgrade": return `${name} tesisleri yükseltiyor`;
    default: return `${name} strateji planılıyor`;
  }
}
