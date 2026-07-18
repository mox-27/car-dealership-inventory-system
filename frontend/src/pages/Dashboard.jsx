import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import VehicleCard from '../components/VehicleCard';
import SearchFilter from '../components/SearchFilter';
import VehicleForm from '../components/VehicleForm';
import { AlertCircle, Loader2, Plus, Car, TrendingUp, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const StatItem = ({ label, value }) => (
  <div className="p-4 flex flex-col justify-center items-center text-center">
    <p className="text-3xl font-mono text-[var(--ink)] tracking-tight">{value}</p>
    <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] mt-1">{label}</p>
  </div>
);

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
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
    } catch (err) {
      toast.error('Failed to load vehicles. Please try again later.');
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
        toast.success('Vehicle updated successfully');
      } else {
        await axios.post('/api/vehicles', formData);
        toast.success('Vehicle added successfully');
      }
      setShowForm(false);
      setEditingVehicle(null);
      handleUpdate();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to save vehicle');
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
        <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] animate-pulse">LOADING INVENTORY...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-6 relative overflow-hidden">
      {/* Page header */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest mb-1 text-[var(--text-muted)]">
            AutoVerse Inventory System
          </p>
          <h1 className="text-4xl font-display text-[var(--ink)]">
            Vehicle Inventory
          </h1>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setEditingVehicle(null); setShowForm(true); }}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 text-xs self-start sm:self-end"
          >
            <Plus className="h-4 w-4" />
            Add Vehicle
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="flex-shrink-0 spec-panel flex flex-row justify-between w-full divide-x divide-[var(--line)]">
        <div className="flex-1"><StatItem label="Total Models" value={totalVehicles} /></div>
        <div className="flex-1"><StatItem label="In Stock" value={inStock} /></div>
        <div className="flex-1"><StatItem label="Out of Stock" value={totalVehicles - inStock} /></div>
      </div>

      {/* Vehicle Form */}
      {showForm && (
        <VehicleForm
          vehicle={editingVehicle}
          onSubmit={handleFormSubmit}
          onCancel={() => { setShowForm(false); setEditingVehicle(null); }}
        />
      )}

      {/* Content Area with Sidebar */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Sidebar */}
        <div className="w-full lg:w-64 xl:w-72 flex-shrink-0 overflow-y-auto pr-2">
          <SearchFilter onSearch={handleSearch} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 overflow-y-auto pr-2 pb-4">
          {/* Vehicle grid */}
          {loading ? (
            <div className="flex justify-center py-16">
              <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] animate-pulse">UPDATING...</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="spec-panel text-center py-20">
              <p className="text-sm font-mono uppercase tracking-widest text-[var(--ink)]">No vehicles match these filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
      </div>
    </div>
  );
};

export default Dashboard;
