/**
 * Ana oyun durumu store'u - Zustand ile yönetilir.
 * Save/Load, Teknoloji Ağacı, Gündüz/Gece, Rastgele Olaylar, Başarımlar içerir.
 */
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  BUILDING_COSTS,
  BUILDING_PRODUCTION,
  EMPLOYEE_NAMES,
  EMPLOYEE_SALARIES,
  RANDOM_EVENTS,
  ACHIEVEMENTS,
  TECH_TREE,
  SAVE_KEY,
  type TechNode,
} from "../gameConfig";

export type GamePhase = "menu" | "playing" | "battle" | "paused";

export type BuildingType =
  | "solar_panel"
  | "wind_turbine"
  | "power_station"
  | "gold_mine"
  | "gaming_office"
  | "battery_storage"
  | "research_lab";

export interface Building {
  id: string;
  type: BuildingType;
  position: [number, number, number];
  level: number;
  production: number;
}

export interface Employee {
  id: string;
  name: string;
  role: "developer" | "designer" | "manager" | "marketer";
  salary: number;
  productivity: number;
}

export interface BattleState {
  active: boolean;
  mineId: string | null;
  playerHealth: number;
  enemyHealth: number;
  playerAttack: number;
  enemyAttack: number;
}

export interface ActiveEvent {
  id: string;
  title: string;
  icon: string;
  endsAt: number;
  multiplier?: Record<string, number>;
}

export interface GameState {
  // --- Temel durum ---
  phase: GamePhase;
  gold: number;
  energy: number;
  energyCapacity: number;
  goldPerSecond: number;
  energyPerSecond: number;
  buildings: Building[];
  employees: Employee[];
  gamingCompanyLevel: number;
  gamingCompanyRevenue: number;
  unlockedMines: string[];
  battleState: BattleState;
  selectedBuildingType: BuildingType | null;
  placementMode: boolean;
  showBuildPanel: boolean;
  showCompanyPanel: boolean;
  showEconomicPanel: boolean;
  lastTick: number;

  // --- Yeni sistemler ---
  dayTime: number; // 0-1 arası (0=gece yarısı, 0.5=öğle)
  unlockedTechs: string[];
  currentResearch: string | null;
  researchProgress: number;
  activeEvents: ActiveEvent[];
  unlockedAchievements: string[];
  battlesWon: number;
  totalPlayTime: number;
  showTechPanel: boolean;
  showSettingsPanel: boolean;
  selectedBuildingId: string | null;
  tutorialStep: number; // 0=kapalı, 1+=adım no
  tutorialCompleted: boolean;

  // --- Aksiyonlar ---
  setPhase: (phase: GamePhase) => void;
  startGame: () => void;
  loadGame: () => boolean;
  saveGame: () => void;
  deleteSave: () => void;
  hasSave: () => boolean;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  addEnergy: (amount: number) => void;
  placeBuilding: (type: BuildingType, position: [number, number, number]) => void;
  upgradeBuilding: (id: string) => void;
  removeBuilding: (id: string) => void;
  hireEmployee: (role: Employee["role"]) => void;
  fireEmployee: (id: string) => void;
  upgradeGamingCompany: () => void;
  startBattle: (mineId: string) => void;
  attackInBattle: () => void;
  endBattle: (won: boolean) => void;
  setSelectedBuildingType: (type: BuildingType | null) => void;
  setPlacementMode: (mode: boolean) => void;
  toggleBuildPanel: () => void;
  toggleCompanyPanel: () => void;
  toggleEconomicPanel: () => void;
  toggleTechPanel: () => void;
  toggleSettingsPanel: () => void;
  closeAllPanels: () => void;
  selectBuilding: (id: string | null) => void;
  startResearch: (techId: string) => void;
  cancelResearch: () => void;
  nextTutorialStep: () => void;
  skipTutorial: () => void;
  triggerRandomEvent: () => void;
  checkAchievements: () => string[];
  getEffectiveCost: (type: BuildingType) => number;
  getTechBoost: (type: BuildingType) => number;
  tick: () => void;
}

let nextBuildingId = 1;
let nextEmployeeId = 1;

/**
 * @description Kayıt edilecek state alanları
 */
function extractSaveable(s: GameState) {
  return {
    gold: s.gold,
    energy: s.energy,
    energyCapacity: s.energyCapacity,
    buildings: s.buildings,
    employees: s.employees,
    gamingCompanyLevel: s.gamingCompanyLevel,
    unlockedMines: s.unlockedMines,
    unlockedTechs: s.unlockedTechs,
    currentResearch: s.currentResearch,
    researchProgress: s.researchProgress,
    unlockedAchievements: s.unlockedAchievements,
    battlesWon: s.battlesWon,
    totalPlayTime: s.totalPlayTime,
    tutorialCompleted: s.tutorialCompleted,
    dayTime: s.dayTime,
  };
}

export const useGameState = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    // --- Başlangıç değerleri ---
    phase: "menu",
    gold: 200,
    energy: 0,
    energyCapacity: 100,
    goldPerSecond: 0,
    energyPerSecond: 0,
    buildings: [],
    employees: [],
    gamingCompanyLevel: 0,
    gamingCompanyRevenue: 0,
    unlockedMines: [],
    battleState: {
      active: false,
      mineId: null,
      playerHealth: 100,
      enemyHealth: 100,
      playerAttack: 15,
      enemyAttack: 10,
    },
    selectedBuildingType: null,
    placementMode: false,
    showBuildPanel: false,
    showCompanyPanel: false,
    showEconomicPanel: false,
    lastTick: Date.now(),

    // --- Yeni ---
    dayTime: 0.35,
    unlockedTechs: [],
    currentResearch: null,
    researchProgress: 0,
    activeEvents: [],
    unlockedAchievements: [],
    battlesWon: 0,
    totalPlayTime: 0,
    showTechPanel: false,
    showSettingsPanel: false,
    selectedBuildingId: null,
    tutorialStep: 0,
    tutorialCompleted: false,

    // --- Faz yönetimi ---
    setPhase: (phase) => set({ phase }),

    startGame: () => {
      try {
        nextBuildingId = 1;
        nextEmployeeId = 1;
        set({
          phase: "playing",
          gold: 200,
          energy: 0,
          energyCapacity: 100,
          buildings: [],
          employees: [],
          gamingCompanyLevel: 0,
          gamingCompanyRevenue: 0,
          unlockedMines: [],
          unlockedTechs: [],
          currentResearch: null,
          researchProgress: 0,
          activeEvents: [],
          unlockedAchievements: [],
          battlesWon: 0,
          totalPlayTime: 0,
          dayTime: 0.35,
          lastTick: Date.now(),
          tutorialStep: 1,
          tutorialCompleted: false,
          showBuildPanel: false,
          showCompanyPanel: false,
          showEconomicPanel: false,
          showTechPanel: false,
          showSettingsPanel: false,
          selectedBuildingId: null,
        });
      } catch (err) {
        console.error("[GameState] startGame error:", err);
      }
    },

    // --- Save / Load ---
    hasSave: () => {
      try {
        return localStorage.getItem(SAVE_KEY) !== null;
      } catch {
        return false;
      }
    },

    saveGame: () => {
      try {
        const state = get();
        const data = extractSaveable(state);
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        console.log("[GameState] Oyun kaydedildi");
      } catch (err) {
        console.error("[GameState] saveGame error:", err);
      }
    },

    loadGame: () => {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return false;
        const data = JSON.parse(raw);

        // ID sayaclarını ayarla
        const maxBId = data.buildings?.reduce((m: number, b: Building) => {
          const n = parseInt(b.id.replace("building_", ""), 10);
          return isNaN(n) ? m : Math.max(m, n);
        }, 0) ?? 0;
        nextBuildingId = maxBId + 1;

        const maxEId = data.employees?.reduce((m: number, e: Employee) => {
          const n = parseInt(e.id.replace("emp_", ""), 10);
          return isNaN(n) ? m : Math.max(m, n);
        }, 0) ?? 0;
        nextEmployeeId = maxEId + 1;

        set({
          phase: "playing",
          gold: data.gold ?? 200,
          energy: data.energy ?? 0,
          energyCapacity: data.energyCapacity ?? 100,
          buildings: data.buildings ?? [],
          employees: data.employees ?? [],
          gamingCompanyLevel: data.gamingCompanyLevel ?? 0,
          gamingCompanyRevenue: 0,
          unlockedMines: data.unlockedMines ?? [],
          unlockedTechs: data.unlockedTechs ?? [],
          currentResearch: data.currentResearch ?? null,
          researchProgress: data.researchProgress ?? 0,
          unlockedAchievements: data.unlockedAchievements ?? [],
          battlesWon: data.battlesWon ?? 0,
          totalPlayTime: data.totalPlayTime ?? 0,
          dayTime: data.dayTime ?? 0.35,
          tutorialCompleted: data.tutorialCompleted ?? false,
          tutorialStep: data.tutorialCompleted ? 0 : 1,
          lastTick: Date.now(),
          showBuildPanel: false,
          showCompanyPanel: false,
          showEconomicPanel: false,
          showTechPanel: false,
          showSettingsPanel: false,
          activeEvents: [],
          selectedBuildingId: null,
        });
        console.log("[GameState] Oyun yüklendi");
        return true;
      } catch (err) {
        console.error("[GameState] loadGame error:", err);
        return false;
      }
    },

    deleteSave: () => {
      try {
        localStorage.removeItem(SAVE_KEY);
      } catch (err) {
        console.error("[GameState] deleteSave error:", err);
      }
    },

    // --- Kaynak yönetimi ---
    addGold: (amount) => set((s) => ({ gold: s.gold + amount })),

    spendGold: (amount) => {
      const { gold } = get();
      if (gold >= amount) {
        set({ gold: gold - amount });
        return true;
      }
      return false;
    },

    addEnergy: (amount) => set((s) => ({ energy: Math.min(s.energy + amount, s.energyCapacity) })),

    // --- Maliyet ve boost hesaplaması ---
    getEffectiveCost: (type) => {
      try {
        const { unlockedTechs } = get();
        let cost = BUILDING_COSTS[type] ?? 100;
        const hasCostReduction = unlockedTechs.includes("cost_optimization");
        if (hasCostReduction) cost *= 0.8;
        return Math.floor(cost);
      } catch {
        return BUILDING_COSTS[type] ?? 100;
      }
    },

    getTechBoost: (type) => {
      try {
        const { unlockedTechs } = get();
        let boost = 1.0;
        for (const techId of unlockedTechs) {
          const tech = TECH_TREE.find((t) => t.id === techId);
          if (!tech) continue;
          if (tech.effect.type === "production_boost") {
            if (tech.effect.target === type) boost *= tech.effect.value;
            if (tech.effect.target === "all_energy" && ["solar_panel", "wind_turbine", "power_station"].includes(type)) {
              boost *= tech.effect.value;
            }
          }
        }
        return boost;
      } catch {
        return 1.0;
      }
    },

    // --- Bina yönetimi ---
    placeBuilding: (type, position) => {
      try {
        const state = get();
        const cost = state.getEffectiveCost(type);
        if (state.gold < cost) return;

        // Kilitli binaları kontrol et
        if (type === "battery_storage" && !state.unlockedTechs.includes("battery_tech")) return;
        if (type === "research_lab" && !state.unlockedTechs.includes("research_facility")) return;

        const building: Building = {
          id: `building_${nextBuildingId++}`,
          type,
          position,
          level: 1,
          production: 1,
        };

        let extraCapacity = 0;
        if (type === "power_station") extraCapacity = 50;
        if (type === "battery_storage") extraCapacity = 100;

        set((s) => ({
          gold: s.gold - cost,
          buildings: [...s.buildings, building],
          placementMode: false,
          selectedBuildingType: null,
          energyCapacity: s.energyCapacity + extraCapacity,
        }));
      } catch (err) {
        console.error("[GameState] placeBuilding error:", err);
      }
    },

    upgradeBuilding: (id) => {
      try {
        const { buildings, gold } = get();
        const building = buildings.find((b) => b.id === id);
        if (!building) return;
        const upgradeCost = (BUILDING_COSTS[building.type] ?? 100) * building.level;
        if (gold < upgradeCost) return;

        set((s) => ({
          gold: s.gold - upgradeCost,
          buildings: s.buildings.map((b) =>
            b.id === id ? { ...b, level: b.level + 1, production: b.production + 1 } : b
          ),
        }));
      } catch (err) {
        console.error("[GameState] upgradeBuilding error:", err);
      }
    },

    removeBuilding: (id) => {
      try {
        const building = get().buildings.find((b) => b.id === id);
        const refund = building ? Math.floor((BUILDING_COSTS[building.type] ?? 0) * 0.5) : 0;
        set((s) => ({
          buildings: s.buildings.filter((b) => b.id !== id),
          gold: s.gold + refund,
          selectedBuildingId: s.selectedBuildingId === id ? null : s.selectedBuildingId,
        }));
      } catch (err) {
        console.error("[GameState] removeBuilding error:", err);
      }
    },

    selectBuilding: (id) => set({ selectedBuildingId: id }),

    // --- Çalışan yönetimi ---
    hireEmployee: (role) => {
      try {
        const salary = EMPLOYEE_SALARIES[role];
        const { gold } = get();
        if (gold < salary * 5) return;

        const name = EMPLOYEE_NAMES[Math.floor(Math.random() * EMPLOYEE_NAMES.length)];
        const employee: Employee = {
          id: `emp_${nextEmployeeId++}`,
          name,
          role,
          salary,
          productivity: 0.8 + Math.random() * 0.4,
        };

        set((s) => ({
          gold: s.gold - salary * 5,
          employees: [...s.employees, employee],
        }));
      } catch (err) {
        console.error("[GameState] hireEmployee error:", err);
      }
    },

    fireEmployee: (id) => {
      set((s) => ({ employees: s.employees.filter((e) => e.id !== id) }));
    },

    upgradeGamingCompany: () => {
      try {
        const { gold, gamingCompanyLevel } = get();
        const cost = (gamingCompanyLevel + 1) * 500;
        if (gold < cost) return;

        set((s) => ({
          gold: s.gold - cost,
          gamingCompanyLevel: s.gamingCompanyLevel + 1,
        }));
      } catch (err) {
        console.error("[GameState] upgradeGamingCompany error:", err);
      }
    },

    // --- Savaş sistemi ---
    startBattle: (mineId) => {
      try {
        const state = get();
        const playerPower = state.buildings.length * 5 + state.employees.length * 3;
        const hasBattleBoost = state.unlockedTechs.includes("military_training");
        const attackMultiplier = hasBattleBoost ? 1.5 : 1.0;

        set({
          phase: "battle",
          battleState: {
            active: true,
            mineId,
            playerHealth: 100 + playerPower,
            enemyHealth: 80 + Math.random() * 60,
            playerAttack: (10 + playerPower * 0.5) * attackMultiplier,
            enemyAttack: 8 + Math.random() * 12,
          },
        });
      } catch (err) {
        console.error("[GameState] startBattle error:", err);
      }
    },

    attackInBattle: () => {
      try {
        const { battleState } = get();
        if (!battleState.active) return;

        const playerDmg = battleState.playerAttack * (0.8 + Math.random() * 0.4);
        const enemyDmg = battleState.enemyAttack * (0.8 + Math.random() * 0.4);

        const newEnemyHealth = Math.max(0, battleState.enemyHealth - playerDmg);
        const newPlayerHealth = Math.max(0, battleState.playerHealth - enemyDmg);

        if (newEnemyHealth <= 0) {
          get().endBattle(true);
          return;
        }
        if (newPlayerHealth <= 0) {
          get().endBattle(false);
          return;
        }

        set({
          battleState: {
            ...battleState,
            enemyHealth: newEnemyHealth,
            playerHealth: newPlayerHealth,
          },
        });
      } catch (err) {
        console.error("[GameState] attackInBattle error:", err);
      }
    },

    endBattle: (won) => {
      try {
        const { battleState } = get();
        if (won && battleState.mineId) {
          set((s) => ({
            phase: "playing",
            unlockedMines: [...s.unlockedMines, battleState.mineId!],
            gold: s.gold + 200,
            battlesWon: s.battlesWon + 1,
            battleState: { ...s.battleState, active: false, mineId: null },
          }));
        } else {
          set((s) => ({
            phase: "playing",
            battleState: { ...s.battleState, active: false, mineId: null },
          }));
        }
      } catch (err) {
        console.error("[GameState] endBattle error:", err);
      }
    },

    // --- Panel toggle'ları ---
    setSelectedBuildingType: (type) => set({ selectedBuildingType: type }),
    setPlacementMode: (mode) => set({ placementMode: mode }),
    toggleBuildPanel: () => set((s) => ({
      showBuildPanel: !s.showBuildPanel,
      showCompanyPanel: false, showEconomicPanel: false, showTechPanel: false, showSettingsPanel: false,
    })),
    toggleCompanyPanel: () => set((s) => ({
      showCompanyPanel: !s.showCompanyPanel,
      showBuildPanel: false, showEconomicPanel: false, showTechPanel: false, showSettingsPanel: false,
    })),
    toggleEconomicPanel: () => set((s) => ({
      showEconomicPanel: !s.showEconomicPanel,
      showBuildPanel: false, showCompanyPanel: false, showTechPanel: false, showSettingsPanel: false,
    })),
    toggleTechPanel: () => set((s) => ({
      showTechPanel: !s.showTechPanel,
      showBuildPanel: false, showCompanyPanel: false, showEconomicPanel: false, showSettingsPanel: false,
    })),
    toggleSettingsPanel: () => set((s) => ({
      showSettingsPanel: !s.showSettingsPanel,
      showBuildPanel: false, showCompanyPanel: false, showEconomicPanel: false, showTechPanel: false,
    })),
    closeAllPanels: () => set({
      showBuildPanel: false, showCompanyPanel: false, showEconomicPanel: false,
      showTechPanel: false, showSettingsPanel: false,
    }),

    // --- Teknoloji ağacı ---
    startResearch: (techId) => {
      try {
        const state = get();
        if (state.currentResearch) return;
        if (state.unlockedTechs.includes(techId)) return;

        const tech = TECH_TREE.find((t) => t.id === techId);
        if (!tech) return;
        if (tech.requires.some((r) => !state.unlockedTechs.includes(r))) return;
        if (state.gold < tech.cost) return;

        set((s) => ({
          gold: s.gold - tech.cost,
          currentResearch: techId,
          researchProgress: 0,
        }));
      } catch (err) {
        console.error("[GameState] startResearch error:", err);
      }
    },

    cancelResearch: () => {
      try {
        const { currentResearch } = get();
        if (!currentResearch) return;
        const tech = TECH_TREE.find((t) => t.id === currentResearch);
        // Yarısını geri ver
        const refund = tech ? Math.floor(tech.cost * 0.5) : 0;
        set((s) => ({
          currentResearch: null,
          researchProgress: 0,
          gold: s.gold + refund,
        }));
      } catch (err) {
        console.error("[GameState] cancelResearch error:", err);
      }
    },

    // --- Tutorial ---
    nextTutorialStep: () => set((s) => {
      const next = s.tutorialStep + 1;
      if (next > 6) return { tutorialStep: 0, tutorialCompleted: true };
      return { tutorialStep: next };
    }),

    skipTutorial: () => set({ tutorialStep: 0, tutorialCompleted: true }),

    // --- Rastgele olaylar ---
    triggerRandomEvent: () => {
      try {
        const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
        const state = get();

        // Efekti uygula
        const changes = event.effect(state);

        if (event.duration) {
          const activeEvent: ActiveEvent = {
            id: `${event.id}_${Date.now()}`,
            title: event.title,
            icon: event.icon,
            endsAt: Date.now() + event.duration * 1000,
            multiplier: changes.eventMultiplier,
          };
          set((s) => ({
            ...changes,
            activeEvents: [...s.activeEvents, activeEvent],
          }));
        } else {
          set(changes);
        }
      } catch (err) {
        console.error("[GameState] triggerRandomEvent error:", err);
      }
    },

    // --- Başarımlar ---
    checkAchievements: () => {
      try {
        const state = get();
        const newAchievements: string[] = [];
        for (const achievement of ACHIEVEMENTS) {
          if (state.unlockedAchievements.includes(achievement.id)) continue;
          if (achievement.condition(state)) {
            newAchievements.push(achievement.id);
          }
        }
        if (newAchievements.length > 0) {
          set((s) => ({
            unlockedAchievements: [...s.unlockedAchievements, ...newAchievements],
          }));
        }
        return newAchievements;
      } catch {
        return [];
      }
    },

    // --- Ana tick döngüsü ---
    tick: () => {
      try {
        const state = get();
        const now = Date.now();
        const dt = (now - state.lastTick) / 1000;
        if (dt < 0.5) return;

        // --- Gündüz/Gece döngüsü (1 tam döngü = 5 dakika) ---
        const daySpeed = 1 / 300;
        const newDayTime = (state.dayTime + dt * daySpeed) % 1;

        // --- Aktif olay kontrolü ---
        const activeEvents = state.activeEvents.filter((e) => e.endsAt > now);

        // --- Olay çarpanını hesapla ---
        const eventMultipliers: Record<string, number> = {};
        for (const event of activeEvents) {
          if (event.multiplier) {
            for (const [key, value] of Object.entries(event.multiplier)) {
              eventMultipliers[key] = (eventMultipliers[key] ?? 1) * value;
            }
          }
        }
        const globalMultiplier = eventMultipliers["all"] ?? 1;

        // --- Üretim hesaplamaları ---
        let goldIncome = 0;
        let energyIncome = 0;

        for (const b of state.buildings) {
          const prod = BUILDING_PRODUCTION[b.type];
          if (!prod) continue;
          const techBoost = state.getTechBoost(b.type);
          const eventBoost = eventMultipliers[b.type] ?? 1;

          goldIncome += prod.gold * b.production * b.level * techBoost * eventBoost * globalMultiplier;
          energyIncome += prod.energy * b.production * b.level * techBoost * eventBoost * globalMultiplier;
        }

        // Gece enerji penaltisi (solar paneller gece %20 verimli)
        const isNight = newDayTime < 0.2 || newDayTime > 0.8;
        if (isNight) {
          const solarReduction = state.buildings
            .filter((b) => b.type === "solar_panel")
            .reduce((sum, b) => {
              const prod = BUILDING_PRODUCTION.solar_panel;
              const techBoost = state.getTechBoost("solar_panel");
              return sum + prod.energy * b.production * b.level * techBoost * 0.8;
            }, 0);
          energyIncome -= solarReduction;
        }

        // Fethedilen madenler
        for (const _mine of state.unlockedMines) {
          goldIncome += 5 * globalMultiplier;
        }

        // Şirket geliri
        const totalEmployeeSalary = state.employees.reduce((sum, e) => sum + e.salary, 0);
        const empBoost = eventMultipliers["employees"] ?? 1;
        const employeeProductivity = state.employees.reduce((sum, e) => sum + e.productivity * empBoost, 0);
        const companyRevenue = state.gamingCompanyLevel * employeeProductivity * 2 * globalMultiplier;

        goldIncome += companyRevenue - totalEmployeeSalary;

        // --- Araştırma ilerlemesi ---
        let newResearchProgress = state.researchProgress;
        let newCurrentResearch = state.currentResearch;
        let newUnlockedTechs = state.unlockedTechs;

        if (state.currentResearch) {
          const tech = TECH_TREE.find((t) => t.id === state.currentResearch);
          if (tech) {
            const labCount = state.buildings.filter((b) => b.type === "research_lab").length;
            const researchSpeed = Math.max(1, labCount); // Lab sayısına göre hız
            newResearchProgress = state.researchProgress + (dt * researchSpeed) / tech.researchTime;
            if (newResearchProgress >= 1) {
              newUnlockedTechs = [...state.unlockedTechs, state.currentResearch];
              newCurrentResearch = null;
              newResearchProgress = 0;
            }
          }
        }

        // --- Otomatik kaydetme (her 60 saniyede) ---
        const newPlayTime = state.totalPlayTime + dt;
        if (Math.floor(newPlayTime / 60) > Math.floor(state.totalPlayTime / 60)) {
          setTimeout(() => get().saveGame(), 0);
        }

        set({
          gold: Math.max(0, state.gold + goldIncome * dt),
          energy: Math.max(0, Math.min(state.energyCapacity, state.energy + energyIncome * dt)),
          goldPerSecond: goldIncome,
          energyPerSecond: energyIncome,
          gamingCompanyRevenue: companyRevenue,
          lastTick: now,
          dayTime: newDayTime,
          activeEvents,
          currentResearch: newCurrentResearch,
          researchProgress: newResearchProgress,
          unlockedTechs: newUnlockedTechs,
          totalPlayTime: newPlayTime,
        });
      } catch (err) {
        console.error("[GameState] tick error:", err);
      }
    },
  }))
);
