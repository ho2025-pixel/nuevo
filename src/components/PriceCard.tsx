import React from 'react';
import { DollarSign, Tv, Film, Star, CreditCard } from 'lucide-react';
import { useAdmin, AdminContext } from '../context/AdminContext';

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

  // Real-time price sync listener
  React.useEffect(() => {
    const handlePriceUpdate = (event: CustomEvent) => {
      const { prices, timestamp } = event.detail;
      setCurrentPrices({
        moviePrice: prices.moviePrice,
        seriesPrice: prices.seriesPrice,
        transferFeePercentage: prices.transferFeePercentage
      });
      setLastUpdate(timestamp);
    };
    
    window.addEventListener('adminPriceUpdate', handlePriceUpdate as EventListener);
    return () => window.removeEventListener('adminPriceUpdate', handlePriceUpdate as EventListener);
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
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 shadow-lg relative">
      {lastUpdate && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          Actualizado
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
        <div className="text-xs text-gray-500 text-center bg-gray-100 rounded-lg p-2 flex items-center justify-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Precios sincronizados en tiempo real
        </div>
      </div>
    </div>
  );
}