import { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchFilter = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    make: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      make: '',
      category: '',
      minPrice: '',
      maxPrice: '',
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        
        <div className="lg:col-span-1">
          <label htmlFor="make" className="block text-sm font-medium text-slate-700 mb-1">Make / Model</label>
          <input
            type="text"
            id="make"
            name="make"
            placeholder="Search make or model..."
            value={filters.make}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
          />
        </div>

        <div className="lg:col-span-1">
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm bg-white"
          >
            <option value="">All Categories</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Truck">Truck</option>
            <option value="Coupe">Coupe</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Sports">Sports</option>
            <option value="Van">Van</option>
          </select>
        </div>

        <div className="lg:col-span-1">
          <label htmlFor="minPrice" className="block text-sm font-medium text-slate-700 mb-1">Min Price</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="Min price"
            min="0"
            value={filters.minPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
          />
        </div>

        <div className="lg:col-span-1">
          <label htmlFor="maxPrice" className="block text-sm font-medium text-slate-700 mb-1">Max Price</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder="Max price"
            min="0"
            value={filters.maxPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
          />
        </div>

        <div className="lg:col-span-1 flex gap-2">
          <button
            type="submit"
            className="flex-1 inline-flex justify-center items-center gap-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none transition-colors"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex justify-center items-center py-2 px-3 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none transition-colors"
            title="Reset Filters"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

      </div>
    </form>
  );
};

export default SearchFilter;
