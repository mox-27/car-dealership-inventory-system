import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const VehicleForm = ({ vehicle = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    make: '', model: '', category: 'Sedan', price: '', quantity: '',
  });

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

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--ink)]/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="w-full max-w-2xl spec-panel animate-fade-in-up">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between spec-border-b bg-[var(--paper)]">
          <h3 className="font-display text-2xl text-[var(--ink)]">
            {vehicle ? 'EDIT VEHICLE' : 'NEW VEHICLE ENTRY'}
          </h3>
          <button
            onClick={onCancel}
            className="text-[var(--text-muted)] hover:text-[var(--ink)] font-mono text-sm px-2"
          >
            [X]
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-6 bg-[var(--panel)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div>
              <label htmlFor="make" className="block font-mono text-xs text-[var(--text-secondary)] mb-1.5 uppercase">Make</label>
              <input
                type="text"
                id="make"
                name="make"
                required
                placeholder="e.g. TOYOTA"
                value={formData.make}
                onChange={handleChange}
                className="input-theme w-full p-2.5 font-mono text-sm"
              />
            </div>

            <div>
              <label htmlFor="model" className="block font-mono text-xs text-[var(--text-secondary)] mb-1.5 uppercase">Model</label>
              <input
                type="text"
                id="model"
                name="model"
                required
                placeholder="e.g. CAMRY"
                value={formData.model}
                onChange={handleChange}
                className="input-theme w-full p-2.5 font-mono text-sm"
              />
            </div>

            <div>
              <label htmlFor="category" className="block font-mono text-xs text-[var(--text-secondary)] mb-1.5 uppercase">Category</label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="input-theme w-full p-2.5 font-mono text-sm"
                style={{ appearance: 'none' }}
              >
                {['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Sports', 'Van'].map((cat) => (
                  <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block font-mono text-xs text-[var(--text-secondary)] mb-1.5 uppercase">Price (INR)</label>
              <input
                type="number"
                id="price"
                name="price"
                className="input-theme w-full p-2.5 no-spinner font-mono text-sm"
                min="0"
                required
                placeholder="e.g. 2000000"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block font-mono text-xs text-[var(--text-secondary)] mb-1.5 uppercase">Initial Qty</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                className="input-theme w-full p-2.5 no-spinner font-mono text-sm"
                min="0"
                required
                placeholder="e.g. 5"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 spec-border-t">
            <button
              type="button"
              onClick={onCancel}
              className="btn-outline px-6 py-2.5 text-xs"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="btn-signal px-6 py-2.5 text-xs"
            >
              {vehicle ? 'UPDATE ENTRY' : 'SUBMIT ENTRY'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default VehicleForm;
