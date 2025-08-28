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
  
  // Get prices from admin context with real-time updates
  const moviePrice = adminContext?.state?.prices?.moviePrice || 80;
  const seriesPrice = adminContext?.state?.prices?.seriesPrice || 300;
  const transferFeePercentage = adminContext?.state?.prices?.transferFeePercentage || 10;
  
  const calculatePrice = () => {
    if (type === 'movie') {
      return moviePrice;
    } else {
      return selectedSeasons.length * seriesPrice;
    }
  };

  const price = calculatePrice();
  const transferPrice = Math.round(price * (1 + transferFeePercentage / 100));
  
  // [Resto de la implementación del PriceCard]
}