import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: [true, 'Make is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
  },
  { timestamps: true }
);

// Prevent duplicate vehicles (same make + model, case-insensitive)
vehicleSchema.index(
  { make: 1, model: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
