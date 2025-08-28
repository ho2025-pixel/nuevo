import React, { useState, useEffect } from 'react';
import { X, Download, MessageCircle, Phone, BookOpen, Info, Check, DollarSign, CreditCard, Calculator, Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { AdminContext } from '../context/AdminContext';

interface Novela {
  id: number;
  titulo: string;
  genero: string;
  capitulos: number;
  año: number;
  descripcion?: string;
  paymentType?: 'cash' | 'transfer';
}

interface NovelasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NovelasModal({ isOpen, onClose }: NovelasModalProps) {
  const adminContext = React.useContext(AdminContext);
  
  // Get novels and prices from admin context with real-time updates
  const adminNovels = adminContext?.state?.novels || [];
  const novelPricePerChapter = adminContext?.state?.prices?.novelPricePerChapter || 5;
  const transferFeePercentage = adminContext?.state?.prices?.transferFeePercentage || 10;
  
  // Base novels list with current admin novels synchronized
  const defaultNovelas: Novela[] = [
    { id: 1, titulo: "Corazón Salvaje", genero: "Drama/Romance", capitulos: 185, año: 2009 },
    { id: 2, titulo: "La Usurpadora", genero: "Drama/Melodrama", capitulos: 98, año: 1998 },
    // ... resto de novelas base
    { id: 1756230290435, titulo: "1", genero: "1", capitulos: 1, año: 2025 },
  ];

  // [Implementación completa del NovelasModal con sincronización en tiempo real]
}