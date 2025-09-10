import React, { useState, useEffect } from 'react';
import { X, MapPin, User, Phone, Home, CreditCard, DollarSign, ShoppingCart, Package, Truck, Calculator, AlertCircle, CheckCircle } from 'lucide-react';

// ZONAS DE ENTREGA EMBEBIDAS - Generadas automáticamente
const EMBEDDED_DELIVERY_ZONES = [
  {
    "name": "nuevo",
    "cost": 100,
    "id": 1757490476632,
    "createdAt": "2025-09-10T07:47:56.632Z",
    "updatedAt": "2025-09-10T07:47:56.632Z"
  }
];

// PRECIOS EMBEBIDOS - Generados automáticamente  
const EMBEDDED_PRICES = {
  "moviePrice": 90,
  "seriesPrice": 400,
  "transferFeePercentage": 15,
  "novelPricePerChapter": 10
};

export interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
}

export interface DeliveryZone {
  id: number;
  name: string;
  cost: number;
}

export interface OrderData {
  orderId: string;
  customerInfo: CustomerInfo;
  deliveryZone: string;
  deliveryCost: number;
  items: any[];
  subtotal: number;
  transferFee: number;
  total: number;
  cashTotal?: number;
  transferTotal?: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (orderData: OrderData) => void;
  items: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
  }>;
  total: number;
}

export function CheckoutModal({ isOpen, onClose, onCheckout, items, total }: CheckoutModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    address: ''
  });
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(EMBEDDED_DELIVERY_ZONES);
  const [currentPrices, setCurrentPrices] = useState(EMBEDDED_PRICES);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Listen for real-time updates from admin panel
  useEffect(() => {
    const handleDeliveryZonesUpdate = (event: CustomEvent) => {
      setDeliveryZones(event.detail);
    };

    const handlePricesUpdate = (event: CustomEvent) => {
      setCurrentPrices(event.detail);
    };

    window.addEventListener('admin_delivery_zones_updated', handleDeliveryZonesUpdate as EventListener);
    window.addEventListener('admin_prices_updated', handlePricesUpdate as EventListener);
    
    return () => {
      window.removeEventListener('admin_delivery_zones_updated', handleDeliveryZonesUpdate as EventListener);
      window.removeEventListener('admin_prices_updated', handlePricesUpdate as EventListener);
    };
  }, []);

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!customerInfo.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^[+]?[0-9s-()]{8,}$/.test(customerInfo.phone.trim())) {
      newErrors.phone = 'Formato de teléfono inválido';
    }
    
    if (!customerInfo.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!selectedZone) {
      newErrors.zone = 'Debe seleccionar una zona de entrega';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!selectedZone) return;
    
    setIsSubmitting(true);
    
    try {
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const orderData: OrderData = {
        orderId,
        customerInfo,
        deliveryZone: selectedZone.name,
        deliveryCost: selectedZone.cost,
        items,
        subtotal: total,
        transferFee: 0,
        total: total + selectedZone.cost
      };
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onCheckout(orderData);
      
      // Reset form
      setCurrentStep(1);
      setCustomerInfo({ fullName: '', phone: '', address: '' });
      setSelectedZone(null);
      setErrors({});
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setCustomerInfo({ fullName: '', phone: '', address: '' });
    setSelectedZone(null);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  const finalTotal = total + (selectedZone?.cost || 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden shadow-2xl animate-in fade-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-xl mr-4 shadow-lg">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Finalizar Pedido</h2>
                <p className="text-sm opacity-90">Paso {currentStep} de 3</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Información</span>
              <span className="text-sm">Entrega</span>
              <span className="text-sm">Confirmación</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="p-6">
            {/* Step 1: Customer Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Información Personal</h3>
                  <p className="text-gray-600">Ingresa tus datos para procesar el pedido</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4 inline mr-2" />
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.fullName}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Ej: Juan Pérez García"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Ej: +53 5123 4567"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Home className="h-4 w-4 inline mr-2" />
                      Dirección Completa *
                    </label>
                    <textarea
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                      rows={3}
                      placeholder="Ej: Calle 23 #456 entre A y B, Vedado, La Habana"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Delivery Zone */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Zona de Entrega</h3>
                  <p className="text-gray-600">Selecciona tu zona para calcular el costo de entrega</p>
                </div>

                {deliveryZones.length === 0 ? (
                  <div className="text-center py-8">
                    <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No hay zonas de entrega configuradas</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {deliveryZones.map((zone) => (
                      <label
                        key={zone.id}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50 ${
                          selectedZone?.id === zone.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryZone"
                          value={zone.id}
                          checked={selectedZone?.id === zone.id}
                          onChange={() => setSelectedZone(zone)}
                          className="mr-4 h-5 w-5 text-green-600 focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{zone.name}</p>
                              <p className="text-sm text-gray-600">Costo de entrega</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">
                                ${zone.cost.toLocaleString()} CUP
                              </p>
                            </div>
                          </div>
                        </div>
                        {selectedZone?.id === zone.id && (
                          <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
                        )}
                      </label>
                    ))}
                  </div>
                )}

                {errors.zone && (
                  <p className="text-red-500 text-sm flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.zone}
                  </p>
                )}
              </div>
            )}

            {/* Step 3: Order Summary */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Package className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Resumen del Pedido</h3>
                  <p className="text-gray-600">Revisa tu pedido antes de confirmar</p>
                </div>

                {/* Customer Info Summary */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Información del Cliente
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Nombre:</span> {customerInfo.fullName}</p>
                    <p><span className="font-medium">Teléfono:</span> {customerInfo.phone}</p>
                    <p><span className="font-medium">Dirección:</span> {customerInfo.address}</p>
                  </div>
                </div>

                {/* Delivery Info */}
                {selectedZone && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Truck className="h-5 w-5 mr-2" />
                      Información de Entrega
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Zona:</span> {selectedZone.name}</p>
                      <p><span className="font-medium">Costo:</span> ${selectedZone.cost.toLocaleString()} CUP</p>
                    </div>
                  </div>
                )}

                {/* Order Total */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Total del Pedido
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({items.length} elementos):</span>
                      <span>${total.toLocaleString()} CUP</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Costo de entrega:</span>
                      <span>${(selectedZone?.cost || 0).toLocaleString()} CUP</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total Final:</span>
                      <span className="text-blue-600">${finalTotal.toLocaleString()} CUP</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {currentStep === 1 && "Completa tu información personal"}
            {currentStep === 2 && "Selecciona tu zona de entrega"}
            {currentStep === 3 && "Revisa y confirma tu pedido"}
          </div>
          
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Atrás
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar Pedido
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}