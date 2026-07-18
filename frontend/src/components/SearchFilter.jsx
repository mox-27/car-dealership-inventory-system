import { useState } from 'react';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(99, 102, 241, 0.18)',
  color: '#e2e8f0',
  borderRadius: '0.75rem',
  padding: '0.625rem 0.875rem',
  fontSize: '0.8125rem',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.7rem',
  fontWeight: '600',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#64748b',
  marginBottom: '0.375rem',
};

const SearchFilter = ({ onSearch }) => {
  const [filters, setFilters] = useState({ make: '', category: '', minPrice: '', maxPrice: '' });
  const [focused, setFocused] = useState(null);

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

  const getFocusedStyle = (name) => ({
    ...inputStyle,
    borderColor: focused === name ? '#6366f1' : 'rgba(99,102,241,0.18)',
    boxShadow: focused === name ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none',
  });

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div
        className="rounded-2xl p-4"
        style={{
          background: 'rgba(21,21,31,0.7)',
          border: '1px solid rgba(99,102,241,0.15)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="h-3.5 w-3.5" style={{ color: '#6366f1' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
            Filter Vehicles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          {/* Make / Model */}
          <div className="lg:col-span-1">
            <label style={labelStyle}>Make / Model</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none" style={{ color: '#475569' }} />
              <input
                type="text"
                id="make"
                name="make"
                placeholder="e.g. Toyota"
                value={filters.make}
                onChange={handleChange}
                onFocus={() => setFocused('make')}
                onBlur={() => setFocused(null)}
                style={{ ...getFocusedStyle('make'), paddingLeft: '2.25rem' }}
              />
            </div>
          </div>

          {/* Category */}
          <div className="lg:col-span-1">
            <label htmlFor="category" style={labelStyle}>Category</label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleChange}
                onFocus={() => setFocused('category')}
                onBlur={() => setFocused(null)}
                style={{ ...getFocusedStyle('category'), appearance: 'none', paddingRight: '2rem', background: 'rgba(255,255,255,0.04)' }}
              >
                <option value="" style={{ background: '#1c1c2e' }}>All Categories</option>
                <option value="Sedan" style={{ background: '#1c1c2e' }}>Sedan</option>
                <option value="SUV" style={{ background: '#1c1c2e' }}>SUV</option>
                <option value="Truck" style={{ background: '#1c1c2e' }}>Truck</option>
                <option value="Coupe" style={{ background: '#1c1c2e' }}>Coupe</option>
                <option value="Hatchback" style={{ background: '#1c1c2e' }}>Hatchback</option>
                <option value="Sports" style={{ background: '#1c1c2e' }}>Sports</option>
                <option value="Van" style={{ background: '#1c1c2e' }}>Van</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none" style={{ color: '#475569' }} />
            </div>
          </div>

          {/* Min Price */}
          <div className="lg:col-span-1">
            <label style={labelStyle}>Min Price (₹)</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              className='no-spinner'
              placeholder="0"
              min="0"
              value={filters.minPrice}
              onChange={handleChange}
              onFocus={() => setFocused('minPrice')}
              onBlur={() => setFocused(null)}
              style={getFocusedStyle('minPrice')}
            />
          </div>

          {/* Max Price */}
          <div className="lg:col-span-1">
            <label style={labelStyle}>Max Price (₹)</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              className='no-spinner'
              placeholder="Any"
              min="0"
              value={filters.maxPrice}
              onChange={handleChange}
              onFocus={() => setFocused('maxPrice')}
              onBlur={() => setFocused(null)}
              style={getFocusedStyle('maxPrice')}
            />
          </div>

          {/* Actions */}
          <div className="lg:col-span-1 flex gap-2">
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm"
            >
              <Search className="h-3.5 w-3.5" />
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center px-3 py-2.5 rounded-xl text-sm transition-all"
              title="Reset Filters"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b', border: '1px solid rgba(255,255,255,0.07)' }}
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
