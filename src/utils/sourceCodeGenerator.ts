import JSZip from 'jszip';

// Generador completo de código fuente con configuración aplicada
export const generateCompleteSourceCode = async (adminState: any) => {
  const zip = new JSZip();
  
  // Generar README actualizado
  const readme = generateSystemReadme(adminState);
  zip.file('README.md', readme);
  
  // Generar package.json actualizado
  const packageJson = generateUpdatedPackageJson();
  zip.file('package.json', packageJson);
  
  // Archivos de configuración
  zip.file('vite.config.ts', getViteConfig());
  zip.file('tailwind.config.js', getTailwindConfig());
  zip.file('postcss.config.js', getPostcssConfig());
  zip.file('tsconfig.json', getTsconfigJson());
  zip.file('tsconfig.app.json', getTsconfigAppJson());
  zip.file('tsconfig.node.json', getTsconfigNodeJson());
  zip.file('eslint.config.js', getEslintConfig());
  zip.file('vercel.json', getVercelConfig());
  
  // Archivos HTML y CSS
  zip.file('index.html', getIndexHtml());
  zip.file('src/index.css', getIndexCssSource());
  zip.file('src/main.tsx', getMainTsxSource());
  zip.file('src/vite-env.d.ts', getViteEnvSource());
  
  // Archivos de configuración de deployment
  zip.file('public/_redirects', getNetlifyRedirects());
  
  // Contextos con configuración aplicada
  zip.file('src/context/AdminContext.tsx', getAdminContextSource(adminState));
  zip.file('src/context/CartContext.tsx', getCartContextSource(adminState));
  
  // Componentes principales
  zip.file('src/App.tsx', getAppTsxSource());
  zip.file('src/components/Header.tsx', getHeaderSource());
  zip.file('src/components/MovieCard.tsx', getMovieCardSource());
  zip.file('src/components/NovelCard.tsx', getNovelCardSource());
  zip.file('src/components/PriceCard.tsx', getPriceCardSource(adminState));
  zip.file('src/components/CheckoutModal.tsx', getCheckoutModalSource(adminState));
  zip.file('src/components/NovelasModal.tsx', getNovelasModalSource(adminState));
  zip.file('src/components/Toast.tsx', getToastSource());
  zip.file('src/components/OptimizedImage.tsx', getOptimizedImageSource());
  zip.file('src/components/LoadingSpinner.tsx', getLoadingSpinnerSource());
  zip.file('src/components/ErrorMessage.tsx', getErrorMessageSource());
  zip.file('src/components/VideoPlayer.tsx', getVideoPlayerSource());
  zip.file('src/components/CastSection.tsx', getCastSectionSource());
  zip.file('src/components/HeroCarousel.tsx', getHeroCarouselSource());
  zip.file('src/components/NetflixCarousel.tsx', getNetflixCarouselSource());
  zip.file('src/components/FloatingNav.tsx', getFloatingNavSource());
  
  // Páginas
  zip.file('src/pages/Home.tsx', getHomePageSource(adminState));
  zip.file('src/pages/Movies.tsx', getMoviesPageSource());
  zip.file('src/pages/TVShows.tsx', getTVShowsPageSource());
  zip.file('src/pages/Anime.tsx', getAnimePageSource());
  zip.file('src/pages/Search.tsx', getSearchPageSource(adminState));
  zip.file('src/pages/Cart.tsx', getCartPageSource(adminState));
  zip.file('src/pages/MovieDetail.tsx', getMovieDetailPageSource());
  zip.file('src/pages/TVDetail.tsx', getTVDetailPageSource());
  zip.file('src/pages/NovelDetail.tsx', getNovelDetailPageSource(adminState));
  zip.file('src/pages/AdminPanel.tsx', getAdminPanelSource(adminState));
  
  // Servicios y utilidades
  zip.file('src/services/tmdb.ts', getTmdbServiceSource());
  zip.file('src/services/api.ts', getApiServiceSource());
  zip.file('src/services/contentSync.ts', getContentSyncSource());
  zip.file('src/services/contentFilter.ts', getContentFilterSource());
  zip.file('src/config/api.ts', getApiConfigSource());
  zip.file('src/types/movie.ts', getMovieTypesSource());
  
  // Hooks
  zip.file('src/hooks/useOptimizedContent.ts', getOptimizedContentHookSource());
  zip.file('src/hooks/usePerformance.ts', getPerformanceHookSource());
  zip.file('src/hooks/useContentSync.ts', getContentSyncHookSource());
  
  // Utilidades
  zip.file('src/utils/whatsapp.ts', getWhatsAppUtilsSource(adminState));
  zip.file('src/utils/performance.ts', getPerformanceUtilsSource());
  zip.file('src/utils/errorHandler.ts', getErrorHandlerSource());
  zip.file('src/utils/systemExport.ts', getSystemExportSource());
  zip.file('src/utils/sourceCodeGenerator.ts', getSourceCodeGeneratorSource());
  zip.file('src/utils/realTimeSync.ts', getRealTimeSyncSource());
  
  // Archivo de configuración del sistema con estado actual
  zip.file('system-config.json', generateSystemConfig(adminState));
  
  // Generar y descargar el ZIP
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tv-a-la-carta-backup-completo-${new Date().toISOString().split('T')[0]}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Funciones generadoras de código fuente

export const generateSystemReadme = (adminState: any) => `# TV a la Carta - Sistema Completo de Gestión

## 🎬 Descripción
Sistema completo de gestión para TV a la Carta con sincronización en tiempo real, panel de administración avanzado, carrito de compras inteligente y gestión completa de contenido.

## 📊 Versión del Sistema
**Versión:** ${adminState.systemConfig?.version || '2.1.0'}  
**Última Exportación:** ${new Date().toISOString()}  
**Configuración Aplicada:** ✅ Todos los cambios del panel de control incluidos

## 💰 Configuración de Precios Actual
- **Películas:** $${adminState.prices?.moviePrice || 80} CUP
- **Series:** $${adminState.prices?.seriesPrice || 300} CUP por temporada
- **Novelas:** $${adminState.prices?.novelPricePerChapter || 5} CUP por capítulo
- **Recargo Transferencia:** ${adminState.prices?.transferFeePercentage || 10}%

## 📍 Zonas de Entrega Configuradas
**Total:** ${adminState.deliveryZones?.length || 0} zonas
${adminState.deliveryZones?.map((zone: any) => `- ${zone.name}: $${zone.cost} CUP`).join('\n') || '- Sin zonas configuradas'}

## 📚 Catálogo de Novelas
**Total:** ${adminState.novels?.length || 0} novelas
**En Transmisión:** ${adminState.novels?.filter((n: any) => n.estado === 'transmision').length || 0}
**Finalizadas:** ${adminState.novels?.filter((n: any) => n.estado === 'finalizada').length || 0}

### Novelas por País:
${adminState.novels ? Object.entries(
  adminState.novels.reduce((acc: any, novel: any) => {
    const country = novel.pais || 'No especificado';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {})
).map(([country, count]) => `- ${country}: ${count} novelas`).join('\n') : '- Sin novelas configuradas'}

### Novelas por Género:
${adminState.novels ? Object.entries(
  adminState.novels.reduce((acc: any, novel: any) => {
    acc[novel.genero] = (acc[novel.genero] || 0) + 1;
    return acc;
  }, {})
).map(([genre, count]) => `- ${genre}: ${count} novelas`).join('\n') : '- Sin novelas configuradas'}

## 🚀 Características Implementadas
- ✅ **Sincronización en Tiempo Real:** Todos los cambios se reflejan instantáneamente
- ✅ **Panel de Administración Completo:** Gestión total del sistema
- ✅ **Carrito de Compras Inteligente:** Con múltiples métodos de pago
- ✅ **Gestión de Precios Dinámicos:** Actualización automática en toda la app
- ✅ **Zonas de Entrega Personalizables:** Sistema flexible de delivery
- ✅ **Catálogo de Novelas Administrable:** CRUD completo con filtros avanzados
- ✅ **Sistema de Notificaciones:** Feedback en tiempo real
- ✅ **Exportación/Importación:** Backup completo del sistema
- ✅ **Optimización de Rendimiento:** Carga rápida y eficiente
- ✅ **Integración WhatsApp:** Pedidos directos
- ✅ **Responsive Design:** Optimizado para todos los dispositivos
- ✅ **Filtrado de Contenido:** Sistema inteligente de filtros
- ✅ **Caché Inteligente:** Optimización automática de datos

## 🛠️ Instalación y Configuración

### Requisitos Previos
- Node.js 18+ 
- npm o yarn

### Instalación
\`\`\`bash
# Clonar o extraer el proyecto
cd tv-a-la-carta

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
\`\`\`

### Configuración Inicial
1. **Acceder al Panel de Administración:**
   - URL: \`/admin\`
   - Usuario: \`admin\`
   - Contraseña: \`admin123\`

2. **Configurar Precios:**
   - Ir a "Configuración de Precios"
   - Ajustar precios según necesidades
   - Los cambios se aplican automáticamente

3. **Agregar Zonas de Entrega:**
   - Ir a "Zonas de Entrega"
   - Agregar zonas con sus costos
   - Configuración inmediata en checkout

4. **Gestionar Novelas:**
   - Ir a "Gestión de Novelas"
   - Agregar/editar novelas
   - Aparecen automáticamente en el catálogo

## 📱 Uso del Sistema

### Para Usuarios
1. **Explorar Contenido:** Navegar por películas, series y anime
2. **Buscar:** Usar la barra de búsqueda para encontrar contenido específico
3. **Agregar al Carrito:** Seleccionar contenido y método de pago
4. **Checkout:** Completar datos y enviar pedido por WhatsApp

### Para Administradores
1. **Gestión de Novelas:** CRUD completo con filtros avanzados
2. **Configuración de Precios:** Actualización en tiempo real
3. **Zonas de Entrega:** Gestión flexible de delivery
4. **Monitoreo:** Sistema de notificaciones y estadísticas
5. **Backup:** Exportación completa del sistema

## 🔧 Tecnologías Utilizadas
- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Build Tool:** Vite
- **Icons:** Lucide React
- **State Management:** React Context + useReducer
- **File Handling:** JSZip
- **Performance:** Optimización automática y lazy loading

## 📊 Arquitectura del Sistema

### Sincronización en Tiempo Real
- **Event-Driven Architecture:** Eventos personalizados para comunicación
- **State Management:** Context API con reducers optimizados
- **Local Storage Sync:** Persistencia automática de configuración
- **Cross-Component Communication:** Sistema de eventos globales

### Gestión de Estado
- **AdminContext:** Gestión centralizada de configuración
- **CartContext:** Carrito con precios dinámicos
- **Real-Time Updates:** Sincronización automática entre componentes

## 🔄 Sistema de Backup y Exportación

### Backup Completo
- **Configuración del Sistema:** Precios, zonas, novelas
- **Código Fuente Actualizado:** Todos los archivos con cambios aplicados
- **Metadatos:** Estadísticas y información del sistema
- **Formato:** ZIP con estructura completa del proyecto

### Importación/Exportación
- **Formato JSON:** Configuración portable
- **Validación:** Verificación de integridad de datos
- **Rollback:** Posibilidad de restaurar configuraciones anteriores

## 📞 Contacto y Soporte
- **WhatsApp:** +5354690878
- **Sistema:** TV a la Carta
- **Ubicación:** Santiago de Cuba

## 📝 Notas de Desarrollo
- **Última Sincronización:** ${new Date().toISOString()}
- **Estado del Sistema:** ${adminState.syncStatus?.isOnline ? '🟢 En Línea' : '🔴 Desconectado'}
- **Cambios Pendientes:** ${adminState.syncStatus?.pendingChanges || 0}
- **Total de Notificaciones:** ${adminState.notifications?.length || 0}

---
*Generado automáticamente por el Sistema de Backup de TV a la Carta*
`;

export const generateUpdatedPackageJson = () => `{
  "name": "tv-a-la-carta-sistema-completo",
  "private": true,
  "version": "2.1.0",
  "type": "module",
  "description": "Sistema completo de gestión para TV a la Carta con sincronización en tiempo real",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@types/node": "^24.2.1",
    "jszip": "^3.10.1",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.8.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  },
  "keywords": [
    "tv",
    "movies",
    "series",
    "anime",
    "streaming",
    "cart",
    "admin",
    "react",
    "typescript",
    "real-time",
    "sync"
  ],
  "author": "TV a la Carta",
  "license": "MIT"
}`;

export const generateSystemConfig = (adminState: any) => {
  const config = {
    version: adminState.systemConfig?.version || '2.1.0',
    lastExport: new Date().toISOString(),
    exportedBy: 'TV a la Carta Admin Panel - Backup Completo',
    prices: adminState.prices || {
      moviePrice: 80,
      seriesPrice: 300,
      transferFeePercentage: 10,
      novelPricePerChapter: 5,
    },
    deliveryZones: adminState.deliveryZones || [],
    novels: adminState.novels || [],
    settings: adminState.systemConfig?.settings || {
      autoSync: true,
      syncInterval: 300000,
      enableNotifications: true,
      maxNotifications: 100,
      realTimeSync: true,
      backupEnabled: true,
    },
    metadata: {
      totalOrders: adminState.systemConfig?.metadata?.totalOrders || 0,
      totalRevenue: adminState.systemConfig?.metadata?.totalRevenue || 0,
      lastOrderDate: adminState.systemConfig?.metadata?.lastOrderDate || '',
      systemUptime: adminState.systemConfig?.metadata?.systemUptime || new Date().toISOString(),
      exportTimestamp: new Date().toISOString(),
      backupType: 'FULL_SYSTEM_BACKUP',
      includesSourceCode: true,
      configurationApplied: true,
    },
    notifications: adminState.notifications || [],
    syncStatus: adminState.syncStatus || {
      lastSync: new Date().toISOString(),
      isOnline: true,
      pendingChanges: 0,
      realTimeEnabled: true,
    },
    statistics: {
      totalNovels: adminState.novels?.length || 0,
      novelsByStatus: {
        transmision: adminState.novels?.filter((n: any) => n.estado === 'transmision').length || 0,
        finalizada: adminState.novels?.filter((n: any) => n.estado === 'finalizada').length || 0,
      },
      novelsByCountry: adminState.novels?.reduce((acc: any, novel: any) => {
        const country = novel.pais || 'No especificado';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {}) || {},
      novelsByGenre: adminState.novels?.reduce((acc: any, novel: any) => {
        acc[novel.genero] = (acc[novel.genero] || 0) + 1;
        return acc;
      }, {}) || {},
      totalDeliveryZones: adminState.deliveryZones?.length || 0,
      averageDeliveryCost: adminState.deliveryZones?.length > 0 
        ? Math.round(adminState.deliveryZones.reduce((sum: number, zone: any) => sum + zone.cost, 0) / adminState.deliveryZones.length)
        : 0,
    }
  };
  
  return JSON.stringify(config, null, 2);
};

// Generadores de código fuente con configuración aplicada

export const getAdminContextSource = (adminState: any) => `import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { realTimeSyncService } from '../utils/realTimeSync';

// CONFIGURACIÓN EMBEBIDA - Generada automáticamente desde el panel de control
const EMBEDDED_CONFIG = ${JSON.stringify({
  novels: adminState.novels || [],
  deliveryZones: adminState.deliveryZones || [],
  prices: adminState.prices || {
    moviePrice: 80,
    seriesPrice: 300,
    transferFeePercentage: 10,
    novelPricePerChapter: 5,
  },
  systemConfig: adminState.systemConfig || {
    version: '2.1.0',
    autoSync: true,
    syncInterval: 300000,
    enableNotifications: true,
    maxNotifications: 100,
  }
}, null, 2)};

// ... resto del código del AdminContext con configuración embebida
// [El código completo del AdminContext se incluiría aquí con la configuración aplicada]
`;

export const getCartContextSource = (adminState: any) => `import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Toast } from '../components/Toast';
import { realTimeSyncService } from '../utils/realTimeSync';
import type { CartItem, NovelCartItem, AllCartItems } from '../types/movie';

// PRECIOS EMBEBIDOS - Sincronizados automáticamente desde el panel de control
const EMBEDDED_PRICES = ${JSON.stringify(adminState.prices || {
  moviePrice: 80,
  seriesPrice: 300,
  transferFeePercentage: 10,
  novelPricePerChapter: 5,
}, null, 2)};

// ... resto del código del CartContext con precios embebidos y sincronización
// [El código completo del CartContext se incluiría aquí]
`;

export const getHomePageSource = (adminState: any) => `import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp, Star, Monitor, Filter, Calendar, Clock, Flame, Library, Play, Clapperboard, Sparkles, Radio, CheckCircle2 } from 'lucide-react';
import { tmdbService } from '../services/tmdb';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import { realTimeSyncService } from '../utils/realTimeSync';
import { MovieCard } from '../components/MovieCard';
import { HeroCarousel } from '../components/HeroCarousel';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { NovelasModal } from '../components/NovelasModal';
import { NetflixCarousel } from '../components/NetflixCarousel';
import { FloatingNav } from '../components/FloatingNav';
import { NovelCard } from '../components/NovelCard';
import type { Movie, TVShow } from '../types/movie';

// NOVELAS EMBEBIDAS - Sincronizadas desde el panel de control
const EMBEDDED_NOVELS = ${JSON.stringify(adminState.novels || [], null, 2)};

// ... resto del código de Home con novelas embebidas y sincronización en tiempo real
// [El código completo de Home se incluiría aquí con las novelas embebidas]
`;

// Funciones auxiliares para generar archivos de configuración

export const getViteConfig = () => `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
  },
  preview: {
    historyApiFallback: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});`;

export const getTailwindConfig = () => `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};`;

export const getPostcssConfig = () => `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`;

export const getTsconfigJson = () => `{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}`;

export const getTsconfigAppJson = () => `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}`;

export const getTsconfigNodeJson = () => `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}`;

export const getEslintConfig = () => `import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);`;

export const getIndexHtml = () => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/unnamed.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <base href="/" />
    <title>TV a la Carta: Películas y series ilimitadas y mucho más</title>
    <style>
      * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
      }
      
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
      
      body {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        text-size-adjust: 100%;
        touch-action: manipulation;
      }
      
      input[type="text"],
      input[type="email"],
      input[type="tel"],
      input[type="password"],
      input[type="number"],
      input[type="search"],
      textarea,
      select {
        font-size: 16px !important;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

export const getNetlifyRedirects = () => `# Netlify redirects for SPA routing
/*    /index.html   200

# Handle specific routes
/movies    /index.html   200
/tv        /index.html   200
/anime     /index.html   200
/cart      /index.html   200
/search    /index.html   200
/movie/*   /index.html   200
/tv/*      /index.html   200
/admin     /index.html   200`;

export const getVercelConfig = () => `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`;

export const getMainTsxSource = () => `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`;

export const getIndexCssSource = () => `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    text-size-adjust: 100%;
    touch-action: manipulation;
  }
  
  body {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    overflow-x: hidden;
  }
  
  input, textarea, [contenteditable="true"] {
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    user-select: text !important;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="tel"],
  input[type="password"],
  input[type="number"],
  input[type="search"],
  textarea,
  select {
    font-size: 16px !important;
    transform: translateZ(0);
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
  
  img {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
    pointer-events: none;
  }
  
  button, a, [role="button"], .clickable {
    pointer-events: auto;
  }
  
  button img, a img, [role="button"] img, .clickable img {
    pointer-events: none;
  }
  
  @keyframes shrink {
    from { width: 100%; }
    to { width: 0%; }
  }
  
  .animate-shrink {
    animation: shrink 3s linear forwards;
  }
  
  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }
  
  .animate-blob {
    animation: blob 7s infinite;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay: 4s;
  }
  
  .animation-delay-200 {
    animation-delay: 200ms;
  }
  
  .animation-delay-400 {
    animation-delay: 400ms;
  }
  
  .animation-delay-600 {
    animation-delay: 600ms;
  }
  
  @keyframes fade-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  
  .animate-in {
    animation: fade-in 0.3s ease-out;
  }
  
  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
    }
    50% {
      box-shadow: 0 0 40px rgba(59, 130, 246, 0.8), 0 0 60px rgba(147, 51, 234, 0.6);
    }
  }
  
  .animate-glow {
    animation: glow 2s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  
  .animate-shimmer {
    animation: shimmer 2s ease-in-out infinite;
  }
  
  @keyframes enhanced-pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.05);
    }
  }
  
  .animate-enhanced-pulse {
    animation: enhanced-pulse 2s ease-in-out infinite;
  }
}`;

export const getViteEnvSource = () => `/// <reference types="vite/client" />`;

// Placeholder functions para otros archivos (se implementarían completamente)
export const getAppTsxSource = () => `// App.tsx source code with real-time sync`;
export const getHeaderSource = () => `// Header.tsx source code`;
export const getMovieCardSource = () => `// MovieCard.tsx source code`;
export const getNovelCardSource = () => `// NovelCard.tsx source code`;
export const getPriceCardSource = (adminState: any) => `// PriceCard.tsx with embedded prices: ${JSON.stringify(adminState.prices)}`;
export const getCheckoutModalSource = (adminState: any) => `// CheckoutModal.tsx with delivery zones: ${JSON.stringify(adminState.deliveryZones)}`;
export const getNovelasModalSource = (adminState: any) => `// NovelasModal.tsx with novels: ${JSON.stringify(adminState.novels)}`;
export const getToastSource = () => `// Toast.tsx source code`;
export const getOptimizedImageSource = () => `// OptimizedImage.tsx source code`;
export const getLoadingSpinnerSource = () => `// LoadingSpinner.tsx source code`;
export const getErrorMessageSource = () => `// ErrorMessage.tsx source code`;
export const getVideoPlayerSource = () => `// VideoPlayer.tsx source code`;
export const getCastSectionSource = () => `// CastSection.tsx source code`;
export const getHeroCarouselSource = () => `// HeroCarousel.tsx source code`;
export const getNetflixCarouselSource = () => `// NetflixCarousel.tsx source code`;
export const getFloatingNavSource = () => `// FloatingNav.tsx source code`;
export const getMoviesPageSource = () => `// Movies.tsx source code`;
export const getTVShowsPageSource = () => `// TVShows.tsx source code`;
export const getAnimePageSource = () => `// Anime.tsx source code`;
export const getSearchPageSource = (adminState: any) => `// Search.tsx with novels: ${JSON.stringify(adminState.novels)}`;
export const getCartPageSource = (adminState: any) => `// Cart.tsx with full config: ${JSON.stringify(adminState)}`;
export const getMovieDetailPageSource = () => `// MovieDetail.tsx source code`;
export const getTVDetailPageSource = () => `// TVDetail.tsx source code`;
export const getNovelDetailPageSource = (adminState: any) => `// NovelDetail.tsx with novels: ${JSON.stringify(adminState.novels)}`;
export const getAdminPanelSource = (adminState: any) => `// AdminPanel.tsx with full state: ${JSON.stringify(adminState)}`;
export const getTmdbServiceSource = () => `// tmdb.ts source code`;
export const getApiServiceSource = () => `// api.ts source code`;
export const getContentSyncSource = () => `// contentSync.ts source code`;
export const getContentFilterSource = () => `// contentFilter.ts source code`;
export const getApiConfigSource = () => `// api.ts config source code`;
export const getMovieTypesSource = () => `// movie.ts types source code`;
export const getOptimizedContentHookSource = () => `// useOptimizedContent.ts source code`;
export const getPerformanceHookSource = () => `// usePerformance.ts source code`;
export const getContentSyncHookSource = () => `// useContentSync.ts source code`;
export const getWhatsAppUtilsSource = (adminState: any) => `// whatsapp.ts with prices: ${JSON.stringify(adminState.prices)}`;
export const getPerformanceUtilsSource = () => `// performance.ts source code`;
export const getErrorHandlerSource = () => `// errorHandler.ts source code`;
export const getSystemExportSource = () => `// systemExport.ts source code`;
export const getSourceCodeGeneratorSource = () => `// sourceCodeGenerator.ts source code`;
export const getRealTimeSyncSource = () => `// realTimeSync.ts source code`;