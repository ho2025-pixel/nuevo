import React from 'react';
import { DollarSign, Tv, Film, Star, CreditCard } from 'lucide-react';
import { AdminContext } from '../context/AdminContext';

interface PriceCardProps {
  type: 'movie' | 'tv';
  selectedSeasons?: number[];
  episodeCount?: number;
  isAnime?: boolean;
}

export function PriceCard({ type, selectedSeasons = [], episodeCount = 0, isAnime = false }: PriceCardProps) {
  const adminContext = React.useContext(AdminContext);
  const [currentPrices, setCurrentPrices] = React.useState({
    moviePrice: 80,
    seriesPrice: 300,
    transferFeePercentage: 10
  });
  const [lastUpdate, setLastUpdate] = React.useState<string | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Real-time price sync listener
  React.useEffect(() => {
    const handlePriceUpdate = (event: any) => {
      const { prices, timestamp } = event.detail;
      
      // Show updating animation
      setIsUpdating(true);
      
      setCurrentPrices({
        moviePrice: prices.moviePrice,
        seriesPrice: prices.seriesPrice,
        transferFeePercentage: prices.transferFeePercentage
      });
      setLastUpdate(timestamp);
      
      // Hide updating animation after a short delay
      setTimeout(() => setIsUpdating(false), 1000);
    };
    
    window.addEventListener('adminPriceUpdate', handlePriceUpdate);
    return () => window.removeEventListener('adminPriceUpdate', handlePriceUpdate);
  }, []);

  // Initialize prices from admin context
  React.useEffect(() => {
    if (adminContext?.state?.prices) {
      setCurrentPrices({
        moviePrice: adminContext.state.prices.moviePrice,
        seriesPrice: adminContext.state.prices.seriesPrice,
        transferFeePercentage: adminContext.state.prices.transferFeePercentage
      });
    }
  }, [adminContext?.state?.prices]);
  
  // Use real-time synchronized prices
  const moviePrice = currentPrices.moviePrice;
  const seriesPrice = currentPrices.seriesPrice;
  const transferFeePercentage = currentPrices.transferFeePercentage;
  
  const calculatePrice = () => {
    if (type === 'movie') {
      return moviePrice;
    } else {
      // Series: precio dinámico por temporada
      if (isAnime) {
        return selectedSeasons.length * seriesPrice;
      } else {
        return selectedSeasons.length * seriesPrice;
      }
    }
  };

  const price = calculatePrice();
  const transferPrice = Math.round(price * (1 + transferFeePercentage / 100));
  
  const getIcon = () => {
    if (type === 'movie') {
      return isAnime ? '🎌' : '🎬';
    }
    return isAnime ? '🎌' : '📺';
  };

  const getTypeLabel = () => {
    if (type === 'movie') {
      return isAnime ? 'Película Animada' : 'Película';
    }
    return isAnime ? 'Anime' : 'Serie';
  };

  return (
    <div className={`bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 shadow-lg relative transition-all duration-300 ${
      isUpdating ? 'ring-2 ring-green-400 ring-opacity-75 animate-pulse' : ''
    }`}>
      {(lastUpdate || isUpdating) && (
        <div className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full ${
          isUpdating ? 'bg-blue-500 animate-bounce' : 'bg-green-500 animate-pulse'
        }`}>
          {isUpdating ? '🔄 Actualizando...' : '✅ Sincronizado'}
        </div>
      )}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="bg-green-100 p-2 rounded-lg mr-3 shadow-sm">
            <span className="text-lg">{getIcon()}</span>
          </div>
          <div>
            <h3 className="font-bold text-green-800 text-sm">{getTypeLabel()}</h3>
            <p className="text-green-600 text-xs">
              {type === 'tv' && selectedSeasons.length > 0 
                ? `${selectedSeasons.length} temporada${selectedSeasons.length > 1 ? 's' : ''}`
                : 'Contenido completo'
              }
            </p>
          </div>
        </div>
        <div className="bg-green-500 text-white p-2 rounded-full shadow-md">
          <DollarSign className="h-4 w-4" />
        </div>
      </div>
      
      <div className="space-y-3">
        {/* Precio en Efectivo */}
        <div className="bg-white rounded-lg p-3 border border-green-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-green-700 flex items-center">
              <DollarSign className="h-3 w-3 mr-1" />
              Efectivo
            </span>
            <span className="text-lg font-bold text-green-700">
              ${price.toLocaleString()} CUP
            </span>
          </div>
        </div>
        
        {/* Precio con Transferencia */}
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-orange-700 flex items-center">
              <CreditCard className="h-3 w-3 mr-1" />
              Transferencia
            </span>
            <span className="text-lg font-bold text-orange-700">
              ${transferPrice.toLocaleString()} CUP
            </span>
          </div>
          <div className="text-xs text-orange-600">
            +{transferFeePercentage}% recargo bancario
          </div>
        </div>
        
        {type === 'tv' && selectedSeasons.length > 0 && (
          <div className="text-xs text-green-600 text-center bg-green-100 rounded-lg p-2">
            ${(price / selectedSeasons.length).toLocaleString()} CUP por temporada (efectivo)
          </div>
        )}
        
        {/* Indicador de sincronización */}
        <div className={`text-xs text-center rounded-lg p-2 flex items-center justify-center transition-all duration-300 ${
          isUpdating 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-gray-100 text-gray-500'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            isUpdating 
              ? 'bg-blue-500 animate-spin' 
              : 'bg-green-500 animate-pulse'
          }`}></div>
          {isUpdating 
            ? 'Actualizando precios...' 
            : `Precios sincronizados • Transferencia: ${transferFeePercentage}%`
          }
        </div>
      </div>
    </div>
  );
}