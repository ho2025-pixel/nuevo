// Servicio de sincronización en tiempo real para toda la aplicación
export class RealTimeSyncService {
  private static instance: RealTimeSyncService;
  private syncCallbacks: Map<string, Function[]> = new Map();
  private isInitialized = false;

  static getInstance(): RealTimeSyncService {
    if (!RealTimeSyncService.instance) {
      RealTimeSyncService.instance = new RealTimeSyncService();
    }
    return RealTimeSyncService.instance;
  }

  initialize(): void {
    if (this.isInitialized) return;

    // Escuchar cambios del admin
    window.addEventListener('admin_state_change', this.handleAdminStateChange.bind(this));
    window.addEventListener('admin_full_sync', this.handleAdminFullSync.bind(this));
    window.addEventListener('storage', this.handleStorageChange.bind(this));

    // Configurar sincronización automática
    this.setupAutoSync();
    
    this.isInitialized = true;
    console.log('🔄 Real-time sync service initialized');
  }

  private handleAdminStateChange(event: CustomEvent): void {
    const { type, data, timestamp } = event.detail;
    
    console.log(`🔄 Admin state change detected: ${type}`, data);
    
    // Emitir eventos específicos para cada tipo de cambio
    switch (type) {
      case 'novel_add':
      case 'novel_update':
      case 'novel_delete':
        this.notifySubscribers('novels', data);
        this.updateHomePageNovels();
        break;
        
      case 'delivery_zone_add':
      case 'delivery_zone_update':
      case 'delivery_zone_delete':
        this.notifySubscribers('deliveryZones', data);
        this.updateCheckoutOptions();
        break;
        
      case 'prices':
        this.notifySubscribers('prices', data);
        this.updateAllPrices(data);
        break;
        
      default:
        this.notifySubscribers('general', data);
    }
    
    // Actualizar timestamp de sincronización
    this.updateSyncTimestamp();
  }

  private handleAdminFullSync(event: CustomEvent): void {
    const { config } = event.detail;
    console.log('🔄 Full admin sync detected', config);
    
    // Sincronizar toda la configuración
    this.syncFullConfiguration(config);
  }

  private handleStorageChange(event: StorageEvent): void {
    if (event.key === 'admin_system_state' || event.key === 'system_config') {
      console.log('🔄 Storage change detected, syncing...');
      this.syncFromStorage();
    }
  }

  private setupAutoSync(): void {
    // Sincronización automática cada 30 segundos
    setInterval(() => {
      this.performAutoSync();
    }, 30000);
  }

  private performAutoSync(): void {
    try {
      const adminState = localStorage.getItem('admin_system_state');
      if (adminState) {
        const state = JSON.parse(adminState);
        this.syncFullConfiguration(state);
      }
    } catch (error) {
      console.error('Error in auto sync:', error);
    }
  }

  private syncFromStorage(): void {
    try {
      const adminState = localStorage.getItem('admin_system_state');
      const systemConfig = localStorage.getItem('system_config');
      
      if (adminState) {
        const state = JSON.parse(adminState);
        this.syncFullConfiguration(state);
      } else if (systemConfig) {
        const config = JSON.parse(systemConfig);
        this.syncFullConfiguration(config);
      }
    } catch (error) {
      console.error('Error syncing from storage:', error);
    }
  }

  private syncFullConfiguration(config: any): void {
    // Sincronizar novelas
    if (config.novels) {
      this.notifySubscribers('novels', config.novels);
      this.updateHomePageNovels();
    }
    
    // Sincronizar precios
    if (config.prices) {
      this.notifySubscribers('prices', config.prices);
      this.updateAllPrices(config.prices);
    }
    
    // Sincronizar zonas de entrega
    if (config.deliveryZones) {
      this.notifySubscribers('deliveryZones', config.deliveryZones);
      this.updateCheckoutOptions();
    }
    
    // Emitir evento global de sincronización completa
    const syncEvent = new CustomEvent('real_time_full_sync', {
      detail: { config, timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(syncEvent);
  }

  private updateHomePageNovels(): void {
    // Forzar actualización de las secciones de novelas en Home
    const homeUpdateEvent = new CustomEvent('home_novels_update', {
      detail: { timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(homeUpdateEvent);
  }

  private updateAllPrices(prices: any): void {
    // Actualizar precios en todos los componentes
    const priceUpdateEvent = new CustomEvent('prices_update', {
      detail: { prices, timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(priceUpdateEvent);
  }

  private updateCheckoutOptions(): void {
    // Actualizar opciones de checkout
    const checkoutUpdateEvent = new CustomEvent('checkout_options_update', {
      detail: { timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(checkoutUpdateEvent);
  }

  private updateSyncTimestamp(): void {
    const timestamp = new Date().toISOString();
    localStorage.setItem('last_sync_timestamp', timestamp);
    
    const timestampEvent = new CustomEvent('sync_timestamp_update', {
      detail: { timestamp }
    });
    window.dispatchEvent(timestampEvent);
  }

  // Métodos públicos para suscripción
  subscribe(eventType: string, callback: Function): () => void {
    if (!this.syncCallbacks.has(eventType)) {
      this.syncCallbacks.set(eventType, []);
    }
    
    this.syncCallbacks.get(eventType)!.push(callback);
    
    // Retornar función de cleanup
    return () => {
      const callbacks = this.syncCallbacks.get(eventType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  private notifySubscribers(eventType: string, data: any): void {
    const callbacks = this.syncCallbacks.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in sync callback for ${eventType}:`, error);
        }
      });
    }
  }

  // Métodos para forzar sincronización
  forceSyncNovels(): void {
    try {
      const adminState = localStorage.getItem('admin_system_state');
      if (adminState) {
        const state = JSON.parse(adminState);
        if (state.novels) {
          this.updateHomePageNovels();
          this.notifySubscribers('novels', state.novels);
        }
      }
    } catch (error) {
      console.error('Error forcing novel sync:', error);
    }
  }

  forceSyncPrices(): void {
    try {
      const adminState = localStorage.getItem('admin_system_state');
      if (adminState) {
        const state = JSON.parse(adminState);
        if (state.prices) {
          this.updateAllPrices(state.prices);
          this.notifySubscribers('prices', state.prices);
        }
      }
    } catch (error) {
      console.error('Error forcing price sync:', error);
    }
  }

  forceSyncDeliveryZones(): void {
    try {
      const adminState = localStorage.getItem('admin_system_state');
      if (adminState) {
        const state = JSON.parse(adminState);
        if (state.deliveryZones) {
          this.updateCheckoutOptions();
          this.notifySubscribers('deliveryZones', state.deliveryZones);
        }
      }
    } catch (error) {
      console.error('Error forcing delivery zones sync:', error);
    }
  }

  // Obtener estado actual
  getCurrentState(): any {
    try {
      const adminState = localStorage.getItem('admin_system_state');
      return adminState ? JSON.parse(adminState) : null;
    } catch (error) {
      console.error('Error getting current state:', error);
      return null;
    }
  }

  // Verificar si hay cambios pendientes
  hasPendingChanges(): boolean {
    try {
      const state = this.getCurrentState();
      return state?.syncStatus?.pendingChanges > 0;
    } catch (error) {
      return false;
    }
  }

  // Limpiar callbacks
  cleanup(): void {
    this.syncCallbacks.clear();
    window.removeEventListener('admin_state_change', this.handleAdminStateChange.bind(this));
    window.removeEventListener('admin_full_sync', this.handleAdminFullSync.bind(this));
    window.removeEventListener('storage', this.handleStorageChange.bind(this));
    this.isInitialized = false;
  }
}

export const realTimeSyncService = RealTimeSyncService.getInstance();

// Hook para usar sincronización en tiempo real
export function useRealTimeSync() {
  const [lastUpdate, setLastUpdate] = React.useState<Date>(new Date());
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    // Inicializar servicio
    realTimeSyncService.initialize();

    // Escuchar actualizaciones
    const handleSyncUpdate = () => {
      setLastUpdate(new Date());
    };

    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('real_time_full_sync', handleSyncUpdate);
    window.addEventListener('sync_timestamp_update', handleSyncUpdate);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('real_time_full_sync', handleSyncUpdate);
      window.removeEventListener('sync_timestamp_update', handleSyncUpdate);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  return {
    lastUpdate,
    isOnline,
    forceSyncNovels: realTimeSyncService.forceSyncNovels.bind(realTimeSyncService),
    forceSyncPrices: realTimeSyncService.forceSyncPrices.bind(realTimeSyncService),
    forceSyncDeliveryZones: realTimeSyncService.forceSyncDeliveryZones.bind(realTimeSyncService),
    getCurrentState: realTimeSyncService.getCurrentState.bind(realTimeSyncService),
    hasPendingChanges: realTimeSyncService.hasPendingChanges.bind(realTimeSyncService)
  };
}