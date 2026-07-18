import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import VehicleCard from '../components/VehicleCard';
import SearchFilter from '../components/SearchFilter';
import { AlertCircle, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehicles = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      // Build query string from filters
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
    fetchVehicles();
  }, [fetchVehicles]);

  const handleSearch = (filters) => {
    fetchVehicles(filters);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]" data-testid="loading-spinner">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-slate-500">Loading vehicles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 border border-red-200">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vehicle Inventory</h1>
          <p className="mt-1 text-sm text-slate-500">
            Browse all available vehicles in the dealership.
          </p>
        </div>
      </div>

      <SearchFilter onSearch={handleSearch} />

      {vehicles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
          <p className="text-slate-500">No vehicles found in the inventory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
