import React, { useState, useEffect } from 'react';
import { X, MapPin, User, Phone, Home, CreditCard, DollarSign, Calculator, Truck } from 'lucide-react';

export interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
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
  items: Array<{ id: number; title: string; price: number; quantity: number }>;
  total: number;
}

export function CheckoutModal({ isOpen, onClose, onCheckout, items, total }: CheckoutModalProps) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    address: ''
  });
  const [selectedDeliveryZone, setSelectedDeliveryZone] = useState('');
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [deliveryZones, setDeliveryZones] = useState<Array<{id: number; name: string; cost: number}>>([]);
  const [errors, setErrors] = useState<Partial<CustomerInfo & { deliveryZone: string }>>({});

  // Get delivery zones from admin context with real-time updates
  const getDeliveryZones = () => {
    try {
      const adminState = localStorage.getItem('admin_system_state');
      if (adminState) {
        const state = JSON.parse(adminState);
        return state.deliveryZones || [];
      }
    } catch (error) {
      console.warn('Error getting delivery zones:', error);
    }
    return [];
  };

  // Load delivery zones on mount and listen for changes
  useEffect(() => {
    const loadZones = () => {
      const zones = getDeliveryZones();
      setDeliveryZones(zones);
    };

    loadZones();

    const handleStorageChange = () => {
      loadZones();
    };

    const handleAdminChange = () => {
      loadZones();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('admin_state_change', handleAdminChange);
    window.addEventListener('admin_full_sync', handleAdminChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('admin_state_change', handleAdminChange);
      window.removeEventListener('admin_full_sync', handleAdminChange);
    };
  }, []);

  // Update delivery cost when zone changes
  useEffect(() => {
    if (selectedDeliveryZone) {
      const zone = deliveryZones.find(z => z.name === selectedDeliveryZone);
      setDeliveryCost(zone ? zone.cost : 0);
    } else {
      setDeliveryCost(0);
    }
  }, [selectedDeliveryZone, deliveryZones]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo & { deliveryZone: string }> = {};

    if (!customerInfo.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^[+]?[0-9\s\-()]{8,}$/.test(customerInfo.phone)) {
      newErrors.phone = 'Formato de teléfono inválido';
    }

    if (!customerInfo.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!selectedDeliveryZone) {
      newErrors.deliveryZone = 'Debe seleccionar una zona de entrega';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const orderId = `TV-${Date.now()}`;
    const orderData: OrderData = {
      orderId,
      customerInfo,
      deliveryZone: selectedDeliveryZone,
      deliveryCost,
      items,
      subtotal: total,
      transferFee: 0,
      total: total + deliveryCost
    };

    onCheckout(orderData);
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDeliveryZoneChange = (zoneName: string) => {
    setSelectedDeliveryZone(zoneName);
    if (errors.deliveryZone) {
      setErrors(prev => ({ ...prev, deliveryZone: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-xl mr-4">
                <Calculator className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Finalizar Pedido</h2>
                <p className="text-blue-100">Complete sus datos para proceder</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Customer Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <User className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ingrese su nombre completo"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ej: +53 5123 4567"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección Completa *
                  </label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ingrese su dirección completa con referencias"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Zone */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Truck className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Zona de Entrega</h3>
              </div>

              {deliveryZones.length > 0 ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccione su zona de entrega *
                  </label>
                  <select
                    value={selectedDeliveryZone}
                    onChange={(e) => handleDeliveryZoneChange(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.deliveryZone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccione una zona...</option>
                    {deliveryZones.map((zone) => (
                      <option key={zone.id} value={zone.name}>
                        {zone.name} - ${zone.cost.toLocaleString()} CUP
                      </option>
                    ))}
                  </select>
                  {errors.deliveryZone && (
                    <p className="text-red-500 text-sm mt-1">{errors.deliveryZone}</p>
                  )}
                  
                  {selectedDeliveryZone && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-800">
                          Costo de entrega:
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          ${deliveryCost.toLocaleString()} CUP
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    No hay zonas de entrega disponibles
                  </h4>
                  <p className="text-gray-600">
                    El administrador aún no ha configurado las zonas de entrega.
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <Calculator className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Resumen del Pedido</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal ({items.length} elementos):</span>
                  <span className="font-semibold">${total.toLocaleString()} CUP</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Costo de entrega:</span>
                  <span className="font-semibold">${deliveryCost.toLocaleString()} CUP</span>
                </div>
                
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${(total + deliveryCost).toLocaleString()} CUP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={deliveryZones.length === 0}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                  deliveryZones.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                }`}
              >
                Enviar Pedido por WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}