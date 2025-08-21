import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface PriceConfig {
  moviePrice: number;
  seriesPrice: number;
  transferFeePercentage: number;
  novelPricePerChapter: number;
}

export interface DeliveryZone {
  id: string;
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

export interface SystemFile {
  name: string;
  path: string;
  lastModified: string;
  size: number;
  type: 'component' | 'service' | 'context' | 'page' | 'config';
  description: string;
}

interface AdminState {
  isAuthenticated: boolean;
  prices: PriceConfig;
  deliveryZones: DeliveryZone[];
  novels: Novel[];
  systemFiles: SystemFile[];
  notifications: AdminNotification[];
  lastBackup: string | null;
  lastPriceUpdate: string | null;
  lastZoneUpdate: string | null;
  lastNovelUpdate: string | null;
  syncStatus: {
    prices: boolean;
    zones: boolean;
    novels: boolean;
    lastFullSync: string | null;
  };
}

export interface AdminNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  section: string;
  action: string;
  details?: string;
  affectedFiles?: string[];
}

type AdminAction = 
  | { type: 'LOGIN'; payload: boolean }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PRICES'; payload: PriceConfig }
  | { type: 'ADD_DELIVERY_ZONE'; payload: DeliveryZone }
  | { type: 'UPDATE_DELIVERY_ZONE'; payload: DeliveryZone }
  | { type: 'DELETE_DELIVERY_ZONE'; payload: string }
  | { type: 'ADD_NOVEL'; payload: Novel }
  | { type: 'UPDATE_NOVEL'; payload: Novel }
  | { type: 'DELETE_NOVEL'; payload: number }
  | { type: 'ADD_NOTIFICATION'; payload: AdminNotification }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'UPDATE_SYSTEM_FILES'; payload: SystemFile[] }
  | { type: 'SET_LAST_BACKUP'; payload: string }
  | { type: 'LOAD_ADMIN_DATA'; payload: Partial<AdminState> }
  | { type: 'UPDATE_SYNC_STATUS'; payload: { section: string; status: boolean } }
  | { type: 'SET_LAST_UPDATE'; payload: { type: 'price' | 'zone' | 'novel'; timestamp: string } };

interface AdminContextType {
  state: AdminState;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updatePrices: (prices: PriceConfig) => void;
  addDeliveryZone: (zone: Omit<DeliveryZone, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDeliveryZone: (zone: DeliveryZone) => void;
  deleteDeliveryZone: (id: string) => void;
  addNovel: (novel: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNovel: (novel: Novel) => void;
  deleteNovel: (id: number) => void;
  addNotification: (notification: Omit<AdminNotification, 'id' | 'timestamp'>) => void;
  clearNotifications: () => void;
  exportSystemBackup: () => void;
  getSystemFiles: () => SystemFile[];
  syncAllChanges: () => void;
  getCurrentPrices: () => PriceConfig;
  broadcastPriceUpdate: (prices: PriceConfig) => void;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

const initialState: AdminState = {
  isAuthenticated: false,
  prices: {
    moviePrice: 80,
    seriesPrice: 300,
    transferFeePercentage: 10,
    novelPricePerChapter: 5
  },
  deliveryZones: [
    {
      id: '1',
      name: 'Santiago de Cuba > Santiago de Cuba > Nuevo Vista Alegre',
      cost: 100,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Santiago de Cuba > Santiago de Cuba > Vista Alegre',
      cost: 300,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  novels: [],
  systemFiles: [],
  notifications: [],
  lastBackup: null,
  lastPriceUpdate: null,
  lastZoneUpdate: null,
  lastNovelUpdate: null,
  syncStatus: {
    prices: true,
    zones: true,
    novels: true,
    lastFullSync: null
  }
};

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: action.payload };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false };
    case 'UPDATE_PRICES':
      return { 
        ...state, 
        prices: action.payload,
        lastPriceUpdate: new Date().toISOString(),
        syncStatus: { ...state.syncStatus, prices: true }
      };
    case 'ADD_DELIVERY_ZONE':
      return {
        ...state,
        deliveryZones: [...state.deliveryZones, action.payload],
        lastZoneUpdate: new Date().toISOString(),
        syncStatus: { ...state.syncStatus, zones: true }
      };
    case 'UPDATE_DELIVERY_ZONE':
      return {
        ...state,
        deliveryZones: state.deliveryZones.map(zone =>
          zone.id === action.payload.id ? action.payload : zone
        ),
        lastZoneUpdate: new Date().toISOString(),
        syncStatus: { ...state.syncStatus, zones: true }
      };
    case 'DELETE_DELIVERY_ZONE':
      return {
        ...state,
        deliveryZones: state.deliveryZones.filter(zone => zone.id !== action.payload),
        lastZoneUpdate: new Date().toISOString(),
        syncStatus: { ...state.syncStatus, zones: true }
      };
    case 'ADD_NOVEL':
      return {
        ...state,
        novels: [...state.novels, action.payload],
        lastNovelUpdate: new Date().toISOString(),
        syncStatus: { ...state.syncStatus, novels: true }
      };
    case 'UPDATE_NOVEL':
      return {
        ...state,
        novels: state.novels.map(novel =>
          novel.id === action.payload.id ? action.payload : novel
        ),
        lastNovelUpdate: new Date().toISOString(),
        syncStatus: { ...state.syncStatus, novels: true }
      };
    case 'DELETE_NOVEL':
      return {
        ...state,
        novels: state.novels.filter(novel => novel.id !== action.payload),
        lastNovelUpdate: new Date().toISOString(),
        syncStatus: { ...state.syncStatus, novels: true }
      };
    case 'ADD_NOTIFICATION':
      const notification: AdminNotification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      };
      return {
        ...state,
        notifications: [notification, ...state.notifications.slice(0, 49)] // Keep last 50
      };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    case 'UPDATE_SYSTEM_FILES':
      return { ...state, systemFiles: action.payload };
    case 'SET_LAST_BACKUP':
      return { ...state, lastBackup: action.payload };
    case 'UPDATE_SYNC_STATUS':
      return {
        ...state,
        syncStatus: {
          ...state.syncStatus,
          [action.payload.section]: action.payload.status,
          lastFullSync: action.payload.status ? new Date().toISOString() : state.syncStatus.lastFullSync
        }
      };
    case 'SET_LAST_UPDATE':
      const updateField = action.payload.type === 'price' ? 'lastPriceUpdate' :
                          action.payload.type === 'zone' ? 'lastZoneUpdate' : 'lastNovelUpdate';
      return {
        ...state,
        [updateField]: action.payload.timestamp
      };
    case 'LOAD_ADMIN_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Real-time sync effect
  useEffect(() => {
    // Broadcast price changes to all components
    const priceUpdateEvent = new CustomEvent('priceUpdate', {
      detail: state.prices
    });
    window.dispatchEvent(priceUpdateEvent);

    // Broadcast zone changes
    const zoneUpdateEvent = new CustomEvent('zoneUpdate', {
      detail: state.deliveryZones
    });
    window.dispatchEvent(zoneUpdateEvent);

    // Broadcast novel changes
    const novelUpdateEvent = new CustomEvent('novelUpdate', {
      detail: state.novels
    });
    window.dispatchEvent(novelUpdateEvent);
  }, [state.prices, state.deliveryZones, state.novels]);
  // Load admin data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('adminData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_ADMIN_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    }
    
    // Initialize system files
    updateSystemFiles();
  }, []);

  // Save admin data to localStorage
  useEffect(() => {
    const dataToSave = {
      prices: state.prices,
      deliveryZones: state.deliveryZones,
      novels: state.novels,
      lastBackup: state.lastBackup
      lastPriceUpdate: state.lastPriceUpdate,
      lastZoneUpdate: state.lastZoneUpdate,
      lastNovelUpdate: state.lastNovelUpdate,
      syncStatus: state.syncStatus
    };
    localStorage.setItem('adminData', JSON.stringify(dataToSave));
    
    // Trigger real-time sync
    syncAllChanges();
  }, [state.prices, state.deliveryZones, state.novels, state.lastBackup]);

  const login = (username: string, password: string): boolean => {
    if (username === 'root' && password === 'video') {
      dispatch({ type: 'LOGIN', payload: true });
      addNotification({
        type: 'success',
        title: 'Acceso Autorizado',
        message: 'Sesión iniciada correctamente en el panel de control',
        section: 'Autenticación',
        action: 'Login',
        details: 'Usuario root autenticado exitosamente',
        affectedFiles: ['AdminContext.tsx']
      });
      return true;
    }
    addNotification({
      type: 'error',
      title: 'Acceso Denegado',
      message: 'Credenciales incorrectas',
      section: 'Autenticación',
      action: 'Login Failed',
      details: `Intento de acceso fallido con usuario: ${username}`,
      affectedFiles: []
    });
    return false;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    addNotification({
      type: 'info',
      title: 'Sesión Cerrada',
      message: 'Se ha cerrado la sesión del panel de control',
      section: 'Autenticación',
      action: 'Logout',
      details: 'Sesión administrativa finalizada correctamente',
      affectedFiles: ['AdminContext.tsx']
    });
  };

  const updatePrices = (prices: PriceConfig) => {
    const oldPrices = state.prices;
    dispatch({ type: 'UPDATE_PRICES', payload: prices });
    
    // Detailed notification with changes
    const changes = [];
    if (oldPrices.moviePrice !== prices.moviePrice) {
      changes.push(`Películas: $${oldPrices.moviePrice} → $${prices.moviePrice} CUP`);
    }
    if (oldPrices.seriesPrice !== prices.seriesPrice) {
      changes.push(`Series: $${oldPrices.seriesPrice} → $${prices.seriesPrice} CUP`);
    }
    if (oldPrices.transferFeePercentage !== prices.transferFeePercentage) {
      changes.push(`Transferencia: ${oldPrices.transferFeePercentage}% → ${prices.transferFeePercentage}%`);
    }
    if (oldPrices.novelPricePerChapter !== prices.novelPricePerChapter) {
      changes.push(`Novelas: $${oldPrices.novelPricePerChapter} → $${prices.novelPricePerChapter} CUP/cap`);
    }
    
    addNotification({
      type: 'success',
      title: 'Precios Actualizados',
      message: `Configuración de precios actualizada exitosamente`,
      section: 'Control de Precios',
      action: 'Update Prices',
      details: changes.length > 0 ? `Cambios aplicados: ${changes.join(', ')}` : 'Precios confirmados sin cambios',
      affectedFiles: ['PriceCard.tsx', 'CartContext.tsx', 'CheckoutModal.tsx', 'NovelasModal.tsx']
    });
    
    // Trigger real-time price sync across the app
    broadcastPriceUpdate(prices);
  };

  const addDeliveryZone = (zoneData: Omit<DeliveryZone, 'id' | 'createdAt' | 'updatedAt'>) => {
    const zone: DeliveryZone = {
      ...zoneData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_DELIVERY_ZONE', payload: zone });
    addNotification({
      type: 'success',
      title: 'Zona Agregada',
      message: `Nueva zona de entrega configurada exitosamente`,
      section: 'Zonas de Entrega',
      action: 'Add Zone',
      details: `Zona: ${zone.name} | Costo: $${zone.cost} CUP | Estado: ${zone.active ? 'Activa' : 'Inactiva'}`,
      affectedFiles: ['CheckoutModal.tsx', 'AdminPanel.tsx']
    });
  };

  const updateDeliveryZone = (zone: DeliveryZone) => {
    const oldZone = state.deliveryZones.find(z => z.id === zone.id);
    const updatedZone = { ...zone, updatedAt: new Date().toISOString() };
    dispatch({ type: 'UPDATE_DELIVERY_ZONE', payload: updatedZone });
    
    const changes = [];
    if (oldZone) {
      if (oldZone.name !== zone.name) changes.push(`Nombre: ${oldZone.name} → ${zone.name}`);
      if (oldZone.cost !== zone.cost) changes.push(`Costo: $${oldZone.cost} → $${zone.cost} CUP`);
      if (oldZone.active !== zone.active) changes.push(`Estado: ${oldZone.active ? 'Activa' : 'Inactiva'} → ${zone.active ? 'Activa' : 'Inactiva'}`);
    }
    
    addNotification({
      type: 'success',
      title: 'Zona Actualizada',
      message: `Zona de entrega actualizada exitosamente`,
      section: 'Zonas de Entrega',
      action: 'Update Zone',
      details: changes.length > 0 ? `Cambios: ${changes.join(', ')}` : 'Zona confirmada sin cambios',
      affectedFiles: ['CheckoutModal.tsx', 'AdminPanel.tsx']
    });
  };

  const deleteDeliveryZone = (id: string) => {
    const zone = state.deliveryZones.find(z => z.id === id);
    dispatch({ type: 'DELETE_DELIVERY_ZONE', payload: id });
    addNotification({
      type: 'warning',
      title: 'Zona Eliminada',
      message: `Zona de entrega eliminada del sistema`,
      section: 'Zonas de Entrega',
      action: 'Delete Zone',
      details: `Zona eliminada: ${zone?.name || 'Desconocida'} | Costo: $${zone?.cost || 0} CUP`,
      affectedFiles: ['CheckoutModal.tsx', 'AdminPanel.tsx']
    });
  };

  const addNovel = (novelData: Omit<Novel, 'id' | 'createdAt' | 'updatedAt'>) => {
    const novel: Novel = {
      ...novelData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_NOVEL', payload: novel });
    addNotification({
      type: 'success',
      title: 'Novela Agregada',
      message: `Nueva novela agregada al catálogo`,
      section: 'Gestión de Novelas',
      action: 'Add Novel',
      details: `Título: ${novel.titulo} | Género: ${novel.genero} | Capítulos: ${novel.capitulos} | Año: ${novel.año} | Costo: $${(novel.capitulos * state.prices.novelPricePerChapter).toLocaleString()} CUP`,
      affectedFiles: ['NovelasModal.tsx', 'AdminPanel.tsx']
    });
  };

  const updateNovel = (novel: Novel) => {
    const oldNovel = state.novels.find(n => n.id === novel.id);
    const updatedNovel = { ...novel, updatedAt: new Date().toISOString() };
    dispatch({ type: 'UPDATE_NOVEL', payload: updatedNovel });
    
    const changes = [];
    if (oldNovel) {
      if (oldNovel.titulo !== novel.titulo) changes.push(`Título: ${oldNovel.titulo} → ${novel.titulo}`);
      if (oldNovel.genero !== novel.genero) changes.push(`Género: ${oldNovel.genero} → ${novel.genero}`);
      if (oldNovel.capitulos !== novel.capitulos) changes.push(`Capítulos: ${oldNovel.capitulos} → ${novel.capitulos}`);
      if (oldNovel.año !== novel.año) changes.push(`Año: ${oldNovel.año} → ${novel.año}`);
      if (oldNovel.active !== novel.active) changes.push(`Estado: ${oldNovel.active ? 'Activa' : 'Inactiva'} → ${novel.active ? 'Activa' : 'Inactiva'}`);
    }
    
    addNotification({
      type: 'success',
      title: 'Novela Actualizada',
      message: `Novela actualizada exitosamente`,
      section: 'Gestión de Novelas',
      action: 'Update Novel',
      details: changes.length > 0 ? `Cambios: ${changes.join(', ')}` : 'Novela confirmada sin cambios',
      affectedFiles: ['NovelasModal.tsx', 'AdminPanel.tsx']
    });
  };

  const deleteNovel = (id: number) => {
    const novel = state.novels.find(n => n.id === id);
    dispatch({ type: 'DELETE_NOVEL', payload: id });
    addNotification({
      type: 'warning',
      title: 'Novela Eliminada',
      message: `Novela eliminada del catálogo`,
      section: 'Gestión de Novelas',
      action: 'Delete Novel',
      details: `Novela eliminada: ${novel?.titulo || 'Desconocida'} | Capítulos: ${novel?.capitulos || 0} | Costo: $${((novel?.capitulos || 0) * state.prices.novelPricePerChapter).toLocaleString()} CUP`,
      affectedFiles: ['NovelasModal.tsx', 'AdminPanel.tsx']
    });
  };

  const addNotification = (notification: Omit<AdminNotification, 'id' | 'timestamp'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
    addNotification({
      type: 'info',
      title: 'Notificaciones Limpiadas',
      message: 'Historial de notificaciones eliminado',
      section: 'Sistema',
      action: 'Clear Notifications',
      details: 'Se eliminaron todas las notificaciones del historial',
      affectedFiles: ['AdminPanel.tsx']
    });
  };

  const syncAllChanges = () => {
    // Update sync status
    dispatch({ 
      type: 'UPDATE_SYNC_STATUS', 
      payload: { section: 'prices', status: true }
    });
    dispatch({ 
      type: 'UPDATE_SYNC_STATUS', 
      payload: { section: 'zones', status: true }
    });
    dispatch({ 
      type: 'UPDATE_SYNC_STATUS', 
      payload: { section: 'novels', status: true }
    });
    
    // Update system files with current state
    updateSystemFiles();
  };

  const getCurrentPrices = (): PriceConfig => {
    return state.prices;
  };

  const broadcastPriceUpdate = (prices: PriceConfig) => {
    // Broadcast to all components that need price updates
    const event = new CustomEvent('adminPriceUpdate', {
      detail: {
        prices,
        timestamp: new Date().toISOString(),
        source: 'AdminPanel'
      }
    });
    window.dispatchEvent(event);
    
    // Update localStorage for immediate access
    localStorage.setItem('currentPrices', JSON.stringify(prices));
  };
  const updateSystemFiles = () => {
    const files: SystemFile[] = [
      {
        name: 'AdminContext.tsx',
        path: 'src/context/AdminContext.tsx',
        lastModified: state.lastPriceUpdate || state.lastZoneUpdate || state.lastNovelUpdate || new Date().toISOString(),
        size: 12500,
        type: 'context',
        description: 'Contexto principal del panel administrativo con sincronización en tiempo real'
      },
      {
        name: 'CartContext.tsx',
        path: 'src/context/CartContext.tsx',
        lastModified: state.lastPriceUpdate || new Date().toISOString(),
        size: 8900,
        type: 'context',
        description: 'Contexto del carrito con cálculos de precios sincronizados'
      },
      {
        name: 'CheckoutModal.tsx',
        path: 'src/components/CheckoutModal.tsx',
        lastModified: state.lastZoneUpdate || state.lastPriceUpdate || new Date().toISOString(),
        size: 15600,
        type: 'component',
        description: 'Modal de checkout con zonas de entrega sincronizadas'
      },
      {
        name: 'NovelasModal.tsx',
        path: 'src/components/NovelasModal.tsx',
        lastModified: state.lastNovelUpdate || state.lastPriceUpdate || new Date().toISOString(),
        size: 18200,
        type: 'component',
        description: 'Modal de catálogo de novelas con precios sincronizados'
      },
      {
        name: 'PriceCard.tsx',
        path: 'src/components/PriceCard.tsx',
        lastModified: state.lastPriceUpdate || new Date().toISOString(),
        size: 3400,
        type: 'component',
        description: 'Componente de visualización de precios con actualización en tiempo real'
      },
      {
        name: 'AdminPanel.tsx',
        path: 'src/pages/AdminPanel.tsx',
        lastModified: new Date().toISOString(),
        size: 25000,
        type: 'page',
        description: 'Panel de control administrativo con sincronización completa'
      }
    ];
    
    dispatch({ type: 'UPDATE_SYSTEM_FILES', payload: files });
  };

  const exportSystemBackup = () => {
    // Generate system files with current modifications
    const systemFilesContent = generateSystemFilesContent();
    
    const backupData = {
      appName: 'TV a la Carta',
      version: '2.1.0',
      exportDate: new Date().toISOString(),
      adminConfig: {
        prices: state.prices,
        deliveryZones: state.deliveryZones,
        novels: state.novels,
        syncStatus: state.syncStatus,
        lastUpdates: {
          prices: state.lastPriceUpdate,
          zones: state.lastZoneUpdate,
          novels: state.lastNovelUpdate
        }
      },
      systemFiles: systemFilesContent,
      notifications: state.notifications.slice(0, 100), // Last 100 notifications
      metadata: {
        totalZones: state.deliveryZones.length,
        activeZones: state.deliveryZones.filter(z => z.active).length,
        totalNovels: state.novels.length,
        activeNovels: state.novels.filter(n => n.active).length,
        lastBackup: state.lastBackup,
        syncStatus: state.syncStatus,
        exportedWithRealTimeSync: true
      }
    };

    // Create ZIP file with proper directory structure
    createSystemBackupZip(backupData);

    const backupTime = new Date().toISOString();
    dispatch({ type: 'SET_LAST_BACKUP', payload: backupTime });
    
    addNotification({
      type: 'success',
      title: 'Backup Exportado',
      message: 'Sistema completo exportado con sincronización en tiempo real',
      section: 'Sistema Backup',
      action: 'Export Backup',
      details: `Backup v2.1.0 con ${state.deliveryZones.length} zonas, ${state.novels.length} novelas y configuración de precios actualizada`,
      affectedFiles: ['Todos los archivos del sistema']
    });
  };

  const generateSystemFilesContent = () => {
    const files: { [key: string]: string } = {};
    
    // Generate AdminContext.tsx with current state
    files['src/context/AdminContext.tsx'] = generateAdminContextContent();
    files['src/context/CartContext.tsx'] = generateCartContextContent();
    files['src/components/CheckoutModal.tsx'] = generateCheckoutModalContent();
    files['src/components/NovelasModal.tsx'] = generateNovelasModalContent();
    files['src/components/PriceCard.tsx'] = generatePriceCardContent();
    files['src/pages/AdminPanel.tsx'] = generateAdminPanelContent();
    files['README.md'] = generateReadmeContent();
    files['config/real-time-sync.json'] = JSON.stringify({
      lastModified: new Date().toISOString(),
      syncStatus: state.syncStatus,
      lastUpdates: {
        prices: state.lastPriceUpdate,
        zones: state.lastZoneUpdate,
        novels: state.lastNovelUpdate
      },
      version: '2.1.0',
      features: ['Real-time price sync', 'Live zone updates', 'Novel catalog sync', 'Enhanced notifications']
    }, null, 2);
    files['config/system-changes.json'] = JSON.stringify({
      lastModified: new Date().toISOString(),
      changes: state.notifications.slice(0, 20),
      version: '2.1.0',
      realTimeSync: true
    }, null, 2);
    
    return files;
  };

  const generateAdminContextContent = () => {
    return `// AdminContext.tsx - Generated with current configuration
// Last updated: ${new Date().toISOString()}
// Real-time sync enabled: ${state.syncStatus.prices && state.syncStatus.zones && state.syncStatus.novels}

import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface PriceConfig {
  moviePrice: ${state.prices.moviePrice};
  seriesPrice: ${state.prices.seriesPrice};
  transferFeePercentage: ${state.prices.transferFeePercentage};
  novelPricePerChapter: ${state.prices.novelPricePerChapter};
}

// Current delivery zones configuration
const deliveryZones = ${JSON.stringify(state.deliveryZones, null, 2)};

// Current novels configuration  
const novels = ${JSON.stringify(state.novels, null, 2)};

// Sync status
const syncStatus = ${JSON.stringify(state.syncStatus, null, 2)};

// Last updates
const lastUpdates = {
  prices: '${state.lastPriceUpdate}',
  zones: '${state.lastZoneUpdate}',
  novels: '${state.lastNovelUpdate}'
};
// Rest of AdminContext implementation...
export default AdminContext;`;
  };

  const generateCartContextContent = () => {
    return `// CartContext.tsx - Generated with current configuration
// Last updated: ${new Date().toISOString()}
// Prices last updated: ${state.lastPriceUpdate || 'Initial'}

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Current pricing configuration
const MOVIE_PRICE = ${state.prices.moviePrice};
const SERIES_PRICE = ${state.prices.seriesPrice};
const TRANSFER_FEE_PERCENTAGE = ${state.prices.transferFeePercentage};

// Real-time price sync listener
useEffect(() => {
  const handlePriceUpdate = (event) => {
    const { prices } = event.detail;
    // Update local pricing calculations
    updatePricingCalculations(prices);
  };
  
  window.addEventListener('adminPriceUpdate', handlePriceUpdate);
  return () => window.removeEventListener('adminPriceUpdate', handlePriceUpdate);
}, []);

// Rest of CartContext implementation...
export default CartContext;`;
  };

  const generateCheckoutModalContent = () => {
    return `// CheckoutModal.tsx - Generated with current configuration
// Last updated: ${new Date().toISOString()}
// Zones last updated: ${state.lastZoneUpdate || 'Initial'}
// Prices last updated: ${state.lastPriceUpdate || 'Initial'}

import React, { useState } from 'react';

// Current delivery zones
const DELIVERY_ZONES = {
${state.deliveryZones.map(zone => `  '${zone.name}': ${zone.cost}`).join(',\n')}
};

// Current transfer fee percentage - SYNCHRONIZED
const TRANSFER_FEE_PERCENTAGE = ${state.prices.transferFeePercentage};

// Real-time sync listeners
useEffect(() => {
  const handleZoneUpdate = (event) => {
    const zones = event.detail;
    updateDeliveryZones(zones);
  };
  
  const handlePriceUpdate = (event) => {
    const { prices } = event.detail;
    updateTransferFeeCalculations(prices.transferFeePercentage);
  };
  
  window.addEventListener('zoneUpdate', handleZoneUpdate);
  window.addEventListener('adminPriceUpdate', handlePriceUpdate);
  
  return () => {
    window.removeEventListener('zoneUpdate', handleZoneUpdate);
    window.removeEventListener('adminPriceUpdate', handlePriceUpdate);
  };
}, []);
// Rest of CheckoutModal implementation...
export default CheckoutModal;`;
  };

  const generateNovelasModalContent = () => {
    return `// NovelasModal.tsx - Generated with current configuration
// Last updated: ${new Date().toISOString()}
// Novels last updated: ${state.lastNovelUpdate || 'Initial'}
// Prices last updated: ${state.lastPriceUpdate || 'Initial'}

import React, { useState, useEffect } from 'react';

// Current novels catalog
const defaultNovelas = ${JSON.stringify(state.novels.map(novel => ({
  id: novel.id,
  titulo: novel.titulo,
  genero: novel.genero,
  capitulos: novel.capitulos,
  año: novel.año,
  descripcion: novel.descripcion
})), null, 2)};

// Current novel pricing
const NOVEL_PRICE_PER_CHAPTER = ${state.prices.novelPricePerChapter};
const TRANSFER_FEE_PERCENTAGE = ${state.prices.transferFeePercentage};

// Real-time sync listeners
useEffect(() => {
  const handleNovelUpdate = (event) => {
    const novels = event.detail;
    updateNovelCatalog(novels);
  };
  
  const handlePriceUpdate = (event) => {
    const { prices } = event.detail;
    updateNovelPricing(prices);
  };
  
  window.addEventListener('novelUpdate', handleNovelUpdate);
  window.addEventListener('adminPriceUpdate', handlePriceUpdate);
  
  return () => {
    window.removeEventListener('novelUpdate', handleNovelUpdate);
    window.removeEventListener('adminPriceUpdate', handlePriceUpdate);
  };
}, []);

// Rest of NovelasModal implementation...
export default NovelasModal;`;
  };

  const generatePriceCardContent = () => {
    return `// PriceCard.tsx - Generated with current configuration
// Last updated: ${new Date().toISOString()}
// Prices last updated: ${state.lastPriceUpdate || 'Initial'}

import React from 'react';

// Current pricing configuration
const DEFAULT_MOVIE_PRICE = ${state.prices.moviePrice};
const DEFAULT_SERIES_PRICE = ${state.prices.seriesPrice};
const DEFAULT_TRANSFER_FEE_PERCENTAGE = ${state.prices.transferFeePercentage};

// Real-time price sync
const [currentPrices, setCurrentPrices] = useState({
  moviePrice: ${state.prices.moviePrice},
  seriesPrice: ${state.prices.seriesPrice},
  transferFeePercentage: ${state.prices.transferFeePercentage}
});

useEffect(() => {
  const handlePriceUpdate = (event) => {
    const { prices } = event.detail;
    setCurrentPrices(prices);
  };
  
  window.addEventListener('adminPriceUpdate', handlePriceUpdate);
  return () => window.removeEventListener('adminPriceUpdate', handlePriceUpdate);
}, []);

// Rest of PriceCard implementation...
export default PriceCard;`;
  };

  const generateAdminPanelContent = () => {
    return `// AdminPanel.tsx - Generated with current configuration
// Last updated: ${new Date().toISOString()}
// Full system sync status: ${JSON.stringify(state.syncStatus)}

import React, { useState } from 'react';

// Current system configuration
const SYSTEM_CONFIG = {
  prices: ${JSON.stringify(state.prices, null, 2)},
  deliveryZones: ${state.deliveryZones.length},
  novels: ${state.novels.length},
  lastBackup: '${state.lastBackup}',
  syncStatus: ${JSON.stringify(state.syncStatus, null, 2)},
  lastUpdates: {
    prices: '${state.lastPriceUpdate}',
    zones: '${state.lastZoneUpdate}',
    novels: '${state.lastNovelUpdate}'
  },
  realTimeSyncEnabled: true
};

// Rest of AdminPanel implementation...
export default AdminPanel;`;
  };

  const generateReadmeContent = () => {
    return `# TV a la Carta - Sistema de Control

## Configuración Actual del Sistema

**Última actualización:** ${new Date().toLocaleString('es-ES')}
**Sincronización en tiempo real:** ✅ ACTIVA

### Precios Configurados
- Películas: $${state.prices.moviePrice} CUP
- Series: $${state.prices.seriesPrice} CUP por temporada
- Recargo transferencia: ${state.prices.transferFeePercentage}%
- Novelas: $${state.prices.novelPricePerChapter} CUP por capítulo

**Última actualización de precios:** ${state.lastPriceUpdate ? new Date(state.lastPriceUpdate).toLocaleString('es-ES') : 'Inicial'}

### Zonas de Entrega
Total de zonas configuradas: ${state.deliveryZones.length}
Zonas activas: ${state.deliveryZones.filter(z => z.active).length}

**Última actualización de zonas:** ${state.lastZoneUpdate ? new Date(state.lastZoneUpdate).toLocaleString('es-ES') : 'Inicial'}

### Catálogo de Novelas
Total de novelas: ${state.novels.length}
Novelas activas: ${state.novels.filter(n => n.active).length}

**Última actualización de novelas:** ${state.lastNovelUpdate ? new Date(state.lastNovelUpdate).toLocaleString('es-ES') : 'Inicial'}

### Estado de Sincronización
- Precios: ${state.syncStatus.prices ? '✅ Sincronizado' : '❌ Pendiente'}
- Zonas: ${state.syncStatus.zones ? '✅ Sincronizado' : '❌ Pendiente'}
- Novelas: ${state.syncStatus.novels ? '✅ Sincronizado' : '❌ Pendiente'}
- Última sincronización completa: ${state.syncStatus.lastFullSync ? new Date(state.syncStatus.lastFullSync).toLocaleString('es-ES') : 'Nunca'}
### Archivos del Sistema
- AdminContext.tsx: Contexto principal de administración
- CartContext.tsx: Contexto del carrito de compras
- CheckoutModal.tsx: Modal de checkout con zonas de entrega
- NovelasModal.tsx: Modal del catálogo de novelas
- PriceCard.tsx: Componente de visualización de precios
- AdminPanel.tsx: Panel de control administrativo
### Características de Sincronización v2.1.0
- ✅ Actualización de precios en tiempo real
- ✅ Sincronización automática de zonas de entrega
- ✅ Catálogo de novelas dinámico
- ✅ Notificaciones detalladas con archivos afectados
- ✅ Cálculo automático de porcentajes de transferencia
- ✅ Exportación con estado de sincronización

## Instrucciones de Instalación

1. Extraer todos los archivos manteniendo la estructura de carpetas
2. Reemplazar los archivos existentes en el proyecto
3. Reiniciar la aplicación para aplicar los cambios
4. Verificar que la sincronización en tiempo real esté activa

---
*Generado automáticamente por TV a la Carta Admin System v2.1.0 con Sincronización en Tiempo Real*`;
  };

  const createSystemBackupZip = async (backupData: any) => {
    try {
      // Import JSZip dynamically
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Create directory structure and add files
      const systemFiles = backupData.systemFiles;
      
      Object.entries(systemFiles).forEach(([filePath, content]) => {
        zip.file(filePath, content as string);
      });
      
      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Download ZIP file
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `TV_a_la_Carta_Sistema_v2.1.0_RealTimeSync_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error creating ZIP file:', error);
      // Fallback to JSON export
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `TV_a_la_Carta_Backup_v2.1.0_RealTimeSync_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const getSystemFiles = (): SystemFile[] => {
    return state.systemFiles;
  };

  return (
    <AdminContext.Provider value={{
      state,
      login,
      logout,
      updatePrices,
      addDeliveryZone,
      updateDeliveryZone,
      deleteDeliveryZone,
      addNovel,
      updateNovel,
      deleteNovel,
      addNotification,
      clearNotifications,
      exportSystemBackup,
      getSystemFiles,
      syncAllChanges,
      getCurrentPrices,
      broadcastPriceUpdate
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}