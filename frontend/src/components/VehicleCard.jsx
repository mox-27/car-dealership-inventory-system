import { useState } from 'react';
import axios from 'axios';
import { Car, Package, DollarSign, ShoppingCart, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const VehicleCard = ({ vehicle, onUpdate, onEdit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const handlePurchase = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`/api/vehicles/${vehicle._id}/purchase`);
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete the ${vehicle.make} ${vehicle.model}?`)) return;
    
    setLoading(true);
    try {
      await axios.delete(`/api/vehicles/${vehicle._id}`);
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Delete failed');
      setLoading(false);
    }
  };

  const handleRestock = async () => {
    const qtyStr = window.prompt(`How many ${vehicle.make} ${vehicle.model}s to add to inventory?`);
    if (!qtyStr) return;
    const qty = parseInt(qtyStr, 10);
    if (isNaN(qty) || qty <= 0) return;

    setLoading(true);
    try {
      await axios.post(`/api/vehicles/${vehicle._id}/restock`, { quantity: qty });
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Restock failed');
      setLoading(false);
    }
  };

  const isOutOfStock = vehicle.quantity <= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {vehicle.make} {vehicle.model}
            </h3>
            <span className="inline-block mt-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
              {vehicle.category}
            </span>
          </div>
          <div className="flex items-center text-primary font-bold">
            <DollarSign className="h-4 w-4" />
            <span>{vehicle.price.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-slate-600 mb-4">
          <Package className="h-4 w-4 mr-2" />
          {!isOutOfStock ? (
            <span>{vehicle.quantity} in stock</span>
          ) : (
            <span className="text-red-500 font-medium">Out of stock</span>
          )}
        </div>
        
        {error && (
          <p className="text-red-500 text-xs mt-2 mb-2">{error}</p>
        )}
      </div>

      <div className="px-5 pb-5 mt-auto">
        <button
          onClick={handlePurchase}
          disabled={isOutOfStock || loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShoppingCart className="h-4 w-4" />
          )}
          {isOutOfStock ? 'Out of Stock' : 'Purchase'}
        </button>

        {isAdmin && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button
              onClick={onEdit}
              disabled={loading}
              className="flex items-center justify-center py-1.5 px-2 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center justify-center py-1.5 px-2 border border-red-200 rounded text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={handleRestock}
              disabled={loading}
              className="flex items-center justify-center py-1.5 px-2 border border-green-200 rounded text-xs font-medium text-green-700 hover:bg-green-50 transition-colors"
            >
              Restock
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
