import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "menu" | "playing" | "battle" | "paused";

export type BuildingType = "solar_panel" | "wind_turbine" | "power_station" | "gold_mine" | "gaming_office";

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

export interface GameState {
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

  setPhase: (phase: GamePhase) => void;
  startGame: () => void;
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
  tick: () => void;
}

const BUILDING_COSTS: Record<BuildingType, number> = {
  solar_panel: 50,
  wind_turbine: 100,
  power_station: 300,
  gold_mine: 500,
  gaming_office: 1000,
};

const BUILDING_PRODUCTION: Record<BuildingType, { gold: number; energy: number }> = {
  solar_panel: { gold: 0, energy: 5 },
  wind_turbine: { gold: 0, energy: 10 },
  power_station: { gold: 0, energy: 25 },
  gold_mine: { gold: 10, energy: -5 },
  gaming_office: { gold: 15, energy: -10 },
};

const EMPLOYEE_NAMES = [
  "Ahmet", "Mehmet", "Ali", "Ayşe", "Fatma", "Zeynep",
  "Can", "Deniz", "Elif", "Burak", "Emre", "Selin",
  "Onur", "Derya", "Berk", "Ceren", "Tolga", "Nisa",
  "Kaan", "Yasemin", "Mert", "Ezgi", "Ege", "Pınar"
];

const EMPLOYEE_SALARIES: Record<Employee["role"], number> = {
  developer: 20,
  designer: 15,
  manager: 25,
  marketer: 18,
};

let nextBuildingId = 1;
let nextEmployeeId = 1;

export const useGameState = create<GameState>()(
  subscribeWithSelector((set, get) => ({
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

    setPhase: (phase) => set({ phase }),

    startGame: () => set({ phase: "playing", gold: 200, energy: 0, buildings: [], employees: [], lastTick: Date.now() }),

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

    placeBuilding: (type, position) => {
      const cost = BUILDING_COSTS[type];
      const { gold } = get();
      if (gold < cost) return;

      const building: Building = {
        id: `building_${nextBuildingId++}`,
        type,
        position,
        level: 1,
        production: 1,
      };

      set((s) => ({
        gold: s.gold - cost,
        buildings: [...s.buildings, building],
        placementMode: false,
        selectedBuildingType: null,
        energyCapacity: type === "power_station" ? s.energyCapacity + 50 : s.energyCapacity,
      }));
    },

    upgradeBuilding: (id) => {
      const { buildings, gold } = get();
      const building = buildings.find((b) => b.id === id);
      if (!building) return;
      const upgradeCost = BUILDING_COSTS[building.type] * building.level;
      if (gold < upgradeCost) return;

      set((s) => ({
        gold: s.gold - upgradeCost,
        buildings: s.buildings.map((b) =>
          b.id === id ? { ...b, level: b.level + 1, production: b.production + 1 } : b
        ),
      }));
    },

    removeBuilding: (id) => {
      set((s) => ({
        buildings: s.buildings.filter((b) => b.id !== id),
      }));
    },

    hireEmployee: (role) => {
      const salary = EMPLOYEE_SALARIES[role];
      const { gold, employees } = get();
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
    },

    fireEmployee: (id) => {
      set((s) => ({
        employees: s.employees.filter((e) => e.id !== id),
      }));
    },

    upgradeGamingCompany: () => {
      const { gold, gamingCompanyLevel } = get();
      const cost = (gamingCompanyLevel + 1) * 500;
      if (gold < cost) return;

      set((s) => ({
        gold: s.gold - cost,
        gamingCompanyLevel: s.gamingCompanyLevel + 1,
      }));
    },

    startBattle: (mineId) => {
      const playerPower = get().buildings.length * 5 + get().employees.length * 3;
      set({
        phase: "battle",
        battleState: {
          active: true,
          mineId,
          playerHealth: 100 + playerPower,
          enemyHealth: 80 + Math.random() * 60,
          playerAttack: 10 + playerPower * 0.5,
          enemyAttack: 8 + Math.random() * 12,
        },
      });
    },

    attackInBattle: () => {
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
    },

    endBattle: (won) => {
      const { battleState } = get();
      if (won && battleState.mineId) {
        set((s) => ({
          phase: "playing",
          unlockedMines: [...s.unlockedMines, battleState.mineId!],
          gold: s.gold + 100,
          battleState: { ...s.battleState, active: false, mineId: null },
        }));
      } else {
        set((s) => ({
          phase: "playing",
          battleState: { ...s.battleState, active: false, mineId: null },
        }));
      }
    },

    setSelectedBuildingType: (type) => set({ selectedBuildingType: type }),
    setPlacementMode: (mode) => set({ placementMode: mode }),
    toggleBuildPanel: () => set((s) => ({ showBuildPanel: !s.showBuildPanel, showCompanyPanel: false, showEconomicPanel: false })),
    toggleCompanyPanel: () => set((s) => ({ showCompanyPanel: !s.showCompanyPanel, showBuildPanel: false, showEconomicPanel: false })),
    toggleEconomicPanel: () => set((s) => ({ showEconomicPanel: !s.showEconomicPanel, showBuildPanel: false, showCompanyPanel: false })),

    tick: () => {
      const state = get();
      const now = Date.now();
      const dt = (now - state.lastTick) / 1000;
      if (dt < 0.5) return;

      let goldIncome = 0;
      let energyIncome = 0;

      for (const b of state.buildings) {
        const prod = BUILDING_PRODUCTION[b.type];
        goldIncome += prod.gold * b.production * b.level;
        energyIncome += prod.energy * b.production * b.level;
      }

      for (const mine of state.unlockedMines) {
        goldIncome += 5;
      }

      const totalEmployeeSalary = state.employees.reduce((sum, e) => sum + e.salary, 0);
      const employeeProductivity = state.employees.reduce((sum, e) => sum + e.productivity, 0);
      const companyRevenue = state.gamingCompanyLevel * employeeProductivity * 2;

      goldIncome += companyRevenue - totalEmployeeSalary;

      set({
        gold: Math.max(0, state.gold + goldIncome * dt),
        energy: Math.max(0, Math.min(state.energyCapacity, state.energy + energyIncome * dt)),
        goldPerSecond: goldIncome,
        energyPerSecond: energyIncome,
        gamingCompanyRevenue: companyRevenue,
        lastTick: now,
      });
    },
  }))
);
