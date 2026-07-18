import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

const VehicleForm = ({ vehicle = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    category: 'Sedan',
    price: '',
    quantity: '',
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-4">
        {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="make" className="block text-sm font-medium text-slate-700 mb-1">Make</label>
          <input
            type="text"
            id="make"
            name="make"
            required
            value={formData.make}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-slate-700 mb-1">Model</label>
          <input
            type="text"
            id="model"
            name="model"
            required
            value={formData.model}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm bg-white"
          >
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Truck">Truck</option>
            <option value="Coupe">Coupe</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Sports">Sports</option>
            <option value="Van">Van</option>
          </select>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            min="0"
            required
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="0"
            required
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none transition-colors"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none transition-colors"
        >
          <Save className="h-4 w-4 mr-2" />
          {vehicle ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default VehicleForm;
