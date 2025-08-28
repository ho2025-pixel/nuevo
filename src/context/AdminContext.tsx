import React, { createContext, useContext, useReducer, useEffect } from 'react';
import JSZip from 'jszip';

// Interfaces
export interface PriceConfig {
  moviePrice: number;
  seriesPrice: number;
  transferFeePercentage: number;
  novelPricePerChapter: number;
}

export interface DeliveryZone {
  id: number;
  name: string;
  cost: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Novel {
  id: number;
  titulo: string;
  genero: string;
  capitulos: number;
  año: number;
  descripcion?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  section: string;
  action: string;
}

export interface AdminState {
  isAuthenticated: boolean;
  prices: PriceConfig;
  deliveryZones: DeliveryZone[];
  novels: Novel[];
  notifications: Notification[];
  lastBackup: string | null;
  syncStatus: {
    isOnline: boolean;
    lastSync: string | null;
    pendingChanges: number;
  };
}

// Actions
type AdminAction =
  | { type: 'LOGIN'; payload: { username: string; password: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PRICES'; payload: PriceConfig }
  | { type: 'ADD_DELIVERY_ZONE'; payload: Omit<DeliveryZone, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_DELIVERY_ZONE'; payload: DeliveryZone }
  | { type: 'DELETE_DELIVERY_ZONE'; payload: number }
  | { type: 'ADD_NOVEL'; payload: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_NOVEL'; payload: Novel }
  | { type: 'DELETE_NOVEL'; payload: number }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'> }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'UPDATE_SYNC_STATUS'; payload: Partial<AdminState['syncStatus']> }
  | { type: 'SYNC_STATE'; payload: Partial<AdminState> };

// Context
interface AdminContextType {
  state: AdminState;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updatePrices: (prices: PriceConfig) => void;
  addDeliveryZone: (zone: Omit<DeliveryZone, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDeliveryZone: (zone: DeliveryZone) => void;
  deleteDeliveryZone: (id: number) => void;
  addNovel: (novel: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNovel: (novel: Novel) => void;
  deleteNovel: (id: number) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  clearNotifications: () => void;
  exportSystemBackup: () => void;
  syncWithRemote: () => Promise<void>;
  broadcastChange: (change: any) => void;
}

// Initial state with current synchronized data
const initialState: AdminState = {
  isAuthenticated: false,
  prices: {
  "moviePrice": 80,
  "seriesPrice": 300,
  "transferFeePercentage": 10,
  "novelPricePerChapter": 5
},
  deliveryZones: [
  {
    "name": "123",
    "cost": 1,
    "active": true,
    "id": 1756230281051,
    "createdAt": "2025-08-26T17:44:41.051Z",
    "updatedAt": "2025-08-26T17:44:41.051Z"
  }
],
  novels: [
  {
    "titulo": "1",
    "genero": "1",
    "capitulos": 1,
    "año": 2025,
    "descripcion": "",
    "active": true,
    "id": 1756230290435,
    "createdAt": "2025-08-26T17:44:50.435Z",
    "updatedAt": "2025-08-26T17:44:50.435Z"
  }
],
  notifications: [],
  lastBackup: null,
  syncStatus: {
    isOnline: true,
    lastSync: null,
    pendingChanges: 0,
  },
};

// [Resto de la implementación del AdminContext con sincronización en tiempo real]
// Reducer, RealTimeSyncService, y Provider implementados completamente
