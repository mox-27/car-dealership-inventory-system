import { useState, useEffect } from 'react';
import { X, Save, Car } from 'lucide-react';

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(99,102,241,0.2)',
  color: '#e2e8f0',
  borderRadius: '0.75rem',
  padding: '0.625rem 0.875rem',
  fontSize: '0.875rem',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: '600',
  color: '#94a3b8',
  marginBottom: '0.375rem',
};

const VehicleForm = ({ vehicle = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    make: '', model: '', category: 'Sedan', price: '', quantity: '',
  });
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make || '',
        model: vehicle.model || '',
        category: vehicle.category || 'Sedan',
        price: vehicle.price || '',
        quantity: vehicle.quantity !== undefined ? vehicle.quantity : '',
      });
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, price: Number(formData.price), quantity: Number(formData.quantity) });
  };

  const getFocusedStyle = (name) => ({
    ...inputStyle,
    borderColor: focused === name ? '#6366f1' : 'rgba(99,102,241,0.2)',
    boxShadow: focused === name ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none',
  });

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(21,21,31,0.9)',
        border: '1px solid rgba(99,102,241,0.25)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(99,102,241,0.12)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}>
            <Car className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-base font-semibold text-white">
            {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h3>
        </div>
        <button
          onClick={onCancel}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b' }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="make" style={labelStyle}>Make</label>
            <input
              type="text"
              id="make"
              name="make"
              required
              placeholder="e.g. Toyota"
              value={formData.make}
              onChange={handleChange}
              onFocus={() => setFocused('make')}
              onBlur={() => setFocused(null)}
              style={getFocusedStyle('make')}
            />
          </div>

          <div>
            <label htmlFor="model" style={labelStyle}>Model</label>
            <input
              type="text"
              id="model"
              name="model"
              required
              placeholder="e.g. Camry"
              value={formData.model}
              onChange={handleChange}
              onFocus={() => setFocused('model')}
              onBlur={() => setFocused(null)}
              style={getFocusedStyle('model')}
            />
          </div>

          <div>
            <label htmlFor="category" style={labelStyle}>Category</label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              onFocus={() => setFocused('category')}
              onBlur={() => setFocused(null)}
              style={{ ...getFocusedStyle('category'), appearance: 'none' }}
            >
              {['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Sports', 'Van'].map((cat) => (
                <option key={cat} value={cat} style={{ background: '#1c1c2e' }}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price" style={labelStyle}>Price (₹)</label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              required
              placeholder="e.g. 2000000"
              value={formData.price}
              onChange={handleChange}
              onFocus={() => setFocused('price')}
              onBlur={() => setFocused(null)}
              style={getFocusedStyle('price')}
            />
          </div>

          <div>
            <label htmlFor="quantity" style={labelStyle}>Quantity in Stock</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="0"
              required
              placeholder="e.g. 5"
              value={formData.quantity}
              onChange={handleChange}
              onFocus={() => setFocused('quantity')}
              onBlur={() => setFocused(null)}
              style={getFocusedStyle('quantity')}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary px-6 py-2.5 flex items-center gap-2 text-sm"
          >
            <Save className="h-4 w-4" />
            {vehicle ? 'Update Vehicle' : 'Save Vehicle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;
