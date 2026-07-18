import { Car, Package, DollarSign } from 'lucide-react';

const VehicleCard = ({ vehicle }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {vehicle.make} {vehicle.model}
            </h3>
            <span className="inline-block mt-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
              {vehicle.category}
            </span>
          </div>
          <div className="flex items-center text-primary font-bold">
            <DollarSign className="h-4 w-4" />
            <span>{vehicle.price.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-slate-600 mb-4">
          <Package className="h-4 w-4 mr-2" />
          {vehicle.quantity > 0 ? (
            <span>{vehicle.quantity} in stock</span>
          ) : (
            <span className="text-red-500 font-medium">Out of stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
