import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import VehicleCard from '../components/VehicleCard';
import SearchFilter from '../components/SearchFilter';
import VehicleForm from '../components/VehicleForm';
import { AlertCircle, Loader2, Plus, Car, TrendingUp, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div
    className="rounded-2xl p-4 flex items-center gap-4"
    style={{ background: 'rgba(21,21,31,0.7)', border: '1px solid rgba(99,102,241,0.12)', backdropFilter: 'blur(10px)' }}
  >
    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + '20', border: `1px solid ${color}30` }}>
      <Icon className="h-5 w-5" style={{ color }} />
    </div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>{label}</p>
      <p className="text-xl font-700 text-white">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});

  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const fetchVehicles = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const endpoint = params.toString() ? `/api/vehicles/search?${params.toString()}` : '/api/vehicles';
      const response = await axios.get(endpoint);
      setVehicles(response.data.vehicles);
      setError(null);
    } catch (err) {
      setError('Failed to load vehicles. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles(currentFilters);
  }, [fetchVehicles, currentFilters]);

  const handleSearch = (filters) => setCurrentFilters(filters);
  const handleUpdate = () => fetchVehicles(currentFilters);

  const handleFormSubmit = async (formData) => {
    try {
      if (editingVehicle) {
        await axios.put(`/api/vehicles/${editingVehicle._id}`, formData);
      } else {
        await axios.post('/api/vehicles', formData);
      }
      setShowForm(false);
      setEditingVehicle(null);
      handleUpdate();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to save vehicle');
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const totalVehicles = vehicles.length;
  const inStock = vehicles.filter((v) => v.quantity > 0).length;

  if (loading && vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]" data-testid="loading-spinner">
        <div className="relative">
          <div className="w-16 h-16 rounded-full" style={{ border: '2px solid rgba(99,102,241,0.1)' }} />
          <div className="absolute inset-0 w-16 h-16 rounded-full animate-spin" style={{ border: '2px solid transparent', borderTopColor: '#6366f1' }} />
          <Car className="absolute inset-0 m-auto h-6 w-6 animate-pulse" style={{ color: '#6366f1' }} />
        </div>
        <p className="mt-5 text-sm font-medium" style={{ color: '#64748b' }}>Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#6366f1' }}>
            AutoVerse Dealership
          </p>
          <h1 className="text-3xl font-display font-800 text-white">
            Vehicle <span className="gradient-text">Inventory</span>
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#64748b' }}>
            Browse and purchase from our premium collection
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setEditingVehicle(null); setShowForm(true); }}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm self-start sm:self-end"
          >
            <Plus className="h-4 w-4" />
            Add Vehicle
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard icon={Car} label="Total Models" value={totalVehicles} color="#6366f1" />
        <StatCard icon={Package} label="In Stock" value={inStock} color="#10b981" />
        <StatCard
          icon={TrendingUp}
          label="Out of Stock"
          value={totalVehicles - inStock}
          color="#f59e0b"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Vehicle Form */}
      {showForm && (
        <VehicleForm
          vehicle={editingVehicle}
          onSubmit={handleFormSubmit}
          onCancel={() => { setShowForm(false); setEditingVehicle(null); }}
        />
      )}

      {/* Search filter */}
      <SearchFilter onSearch={handleSearch} />

      {/* Vehicle grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#6366f1' }} />
        </div>
      ) : vehicles.length === 0 ? (
        <div
          className="text-center py-20 rounded-2xl"
          style={{ background: 'rgba(21,21,31,0.6)', border: '1px dashed rgba(99,102,241,0.2)' }}
        >
          <Car className="h-10 w-10 mx-auto mb-3 opacity-30" style={{ color: '#6366f1' }} />
          <p className="text-base font-medium" style={{ color: '#64748b' }}>No vehicles found</p>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle, i) => (
            <div
              key={vehicle._id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
            >
              <VehicleCard
                vehicle={vehicle}
                onUpdate={handleUpdate}
                onEdit={() => handleEdit(vehicle)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
