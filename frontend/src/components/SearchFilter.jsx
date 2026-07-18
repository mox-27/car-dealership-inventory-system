import { useState } from 'react';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';

const labelStyle = "block font-mono text-xs text-[var(--text-secondary)] mb-1.5 uppercase tracking-widest";

const SearchFilter = ({ onSearch }) => {
  const [filters, setFilters] = useState({ make: '', category: '', minPrice: '', maxPrice: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    const reset = { make: '', category: '', minPrice: '', maxPrice: '' };
    setFilters(reset);
    onSearch(reset);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="spec-panel p-5 h-full">
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal className="h-4 w-4 text-[var(--ink)]" />
          <span className="font-display text-lg text-[var(--ink)] tracking-widest">
            FILTER INVENTORY
          </span>
        </div>

        <div className="flex flex-col gap-5">
          {/* Make / Model */}
          <div>
            <label className={labelStyle}>Make / Model</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none text-[var(--text-muted)]" />
              <input
                type="text"
                id="make"
                name="make"
                placeholder="e.g. TOYOTA"
                value={filters.make}
                onChange={handleChange}
                className="input-theme w-full p-2.5 font-mono text-sm pl-9 uppercase"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className={labelStyle}>Category</label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="input-theme w-full p-2.5 font-mono text-sm pr-9 uppercase"
                style={{ appearance: 'none' }}
              >
                <option value="">ALL CATEGORIES</option>
                {['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Sports', 'Van'].map((cat) => (
                  <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-[var(--text-muted)]" />
            </div>
          </div>

          {/* Min Price */}
          <div>
            <label className={labelStyle}>Min Price (INR)</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              className="input-theme w-full p-2.5 no-spinner font-mono text-sm"
              placeholder="0"
              min="0"
              value={filters.minPrice}
              onChange={handleChange}
            />
          </div>

          {/* Max Price */}
          <div>
            <label className={labelStyle}>Max Price (INR)</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              className="input-theme w-full p-2.5 no-spinner font-mono text-sm"
              placeholder="ANY"
              min="0"
              value={filters.maxPrice}
              onChange={handleChange}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5 text-xs h-[42px]"
            >
              <Search className="h-3.5 w-3.5" />
              SEARCH
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn-outline flex items-center justify-center px-4 h-[42px]"
              title="Reset Filters"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchFilter;
