import { useState } from 'react';
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react';

const inputStyle = {
  background: 'var(--bg-input)',
  border: '1px solid var(--border-primary)',
  color: 'var(--text-primary)',
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
  color: 'var(--text-secondary)',
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
    borderColor: focused === name ? 'var(--color-primary)' : 'var(--border-primary)',
    boxShadow: focused === name ? '0 0 0 3px var(--border-subtle)' : 'none',
  });

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="rounded-2xl p-4 glass">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--color-primary)]" />
          <span style={{ fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }} className="text-[var(--text-secondary)]">
            Filter Vehicles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          {/* Make / Model */}
          <div className="lg:col-span-1">
            <label style={labelStyle}>Make / Model</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none text-[var(--text-muted)]" />
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
                style={{ ...getFocusedStyle('category'), appearance: 'none', paddingRight: '2rem' }}
                className="bg-[var(--bg-input)]"
              >
                <option value="" className="bg-[var(--bg-page-secondary)] text-[var(--text-primary)]">All Categories</option>
                <option value="Sedan" className="bg-[var(--bg-page-secondary)] text-[var(--text-primary)]">Sedan</option>
                <option value="SUV" className="bg-[var(--bg-page-secondary)] text-[var(--text-primary)]">SUV</option>
                <option value="Truck" className="bg-[var(--bg-page-secondary)] text-[var(--text-primary)]">Truck</option>
                <option value="Coupe" className="bg-[var(--bg-page-secondary)] text-[var(--text-primary)]">Coupe</option>
                <option value="Hatchback" className="bg-[var(--bg-page-secondary)] text-[var(--text-primary)]">Hatchback</option>
                <option value="Sports" className="bg-[var(--bg-page-secondary)] text-[var(--text-primary)]">Sports</option>
                <option value="Van" className="bg-[var(--bg-page-secondary)] text-[var(--text-primary)]">Van</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none text-[var(--text-muted)]" />
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
              className="flex items-center justify-center px-3 py-2.5 rounded-xl text-sm transition-all bg-[var(--bg-input)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:bg-[var(--bg-input-hover)]"
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
