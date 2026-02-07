/**
 * Bildirim/Toast sistemi store'u.
 * Oyun içi bildirimleri yönetir.
 */
import { create } from "zustand";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info" | "event";
  icon?: string;
  duration?: number;
  createdAt: number;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (n: Omit<Notification, "id" | "createdAt">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

/** @description Bildirim store - toast mesajları */
export const useNotifications = create<NotificationStore>((set) => ({
  notifications: [],

  addNotification: (n) => {
    try {
      const id = `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const notification: Notification = {
        ...n,
        id,
        createdAt: Date.now(),
        duration: n.duration ?? 4000,
      };
      set((state) => ({
        notifications: [...state.notifications.slice(-9), notification],
      }));

      // Otomatik kaldırma
      const dur = notification.duration ?? 4000;
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((x) => x.id !== id),
        }));
      }, dur);
    } catch (err) {
      console.error("[Notifications] addNotification error:", err);
    }
  },

  removeNotification: (id) => {
    try {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    } catch (err) {
      console.error("[Notifications] removeNotification error:", err);
    }
  },

  clearAll: () => set({ notifications: [] }),
}));
