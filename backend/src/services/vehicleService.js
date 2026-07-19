import Vehicle from '../models/Vehicle.js';

/**
 * Creates a new vehicle in the database.
 * @param {Object} vehicleData - { make, model, category, price, quantity }
 * @returns {Promise<Object>} The created vehicle
 */
export const addVehicle = async (vehicleData) => {
  // Check for duplicate (same make + model, case-insensitive)
  const existing = await Vehicle.findOne({
    make: { $regex: new RegExp(`^${vehicleData.make}$`, 'i') },
    model: { $regex: new RegExp(`^${vehicleData.model}$`, 'i') },
  });

  if (existing) {
    const error = new Error(
      `Vehicle '${vehicleData.make} ${vehicleData.model}' already exists`
    );
    error.statusCode = 409;
    throw error;
  }

  const vehicle = await Vehicle.create(vehicleData);
  return vehicle;
};

/**
 * Creates multiple new vehicles in the database, ignoring duplicates.
 * @param {Array} vehiclesData - Array of vehicle objects
 * @returns {Promise<Object>} Results containing insertedCount
 */
export const bulkAddVehicles = async (vehiclesData) => {
  if (!Array.isArray(vehiclesData)) {
    const error = new Error('Input must be an array of vehicles');
    error.statusCode = 400;
    throw error;
  }

  try {
    // ordered: false ensures that if some fail (e.g. duplicates), the rest still insert
    const result = await Vehicle.insertMany(vehiclesData, { ordered: false });
    return {
      insertedCount: result.length,
      failedCount: 0,
    };
  } catch (error) {
    // MongoBulkWriteError occurs when some inserts fail (e.g. duplicate keys)
    if (error.name === 'MongoBulkWriteError' || error.name === 'BulkWriteError') {
      return {
        insertedCount: error.insertedCount || 0,
        failedCount: error.writeErrors ? error.writeErrors.length : 0,
      };
    }
    throw error;
  }
};

/**
 * Retrieves all vehicles from the database.
 * @returns {Promise<Array>} List of vehicles
 */
export const getAllVehicles = async () => {
  const vehicles = await Vehicle.find({});
  return vehicles;
};

/**
 * Searches for vehicles based on query filters.
 * @param {Object} query - { make, model, category, minPrice, maxPrice }
 * @returns {Promise<Array>} List of filtered vehicles
 */
export const searchVehicles = async ({ make, model, category, minPrice, maxPrice }) => {
  const filter = {};

  if (make) filter.make = new RegExp(make, 'i');
  if (model) filter.model = new RegExp(model, 'i');
  if (category) filter.category = new RegExp(category, 'i');

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  const vehicles = await Vehicle.find(filter);
  return vehicles;
};

/**
 * Retrieves a single vehicle by ID.
 * @param {string} id - Vehicle ID
 * @returns {Promise<Object|null>} The vehicle or null
 */
export const getVehicleById = async (id) => {
  const vehicle = await Vehicle.findById(id);
  return vehicle;
};

/**
 * Updates a vehicle by ID.
 * @param {string} id - Vehicle ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object>} The updated vehicle
 * @throws {Error} If vehicle is not found
 */
export const updateVehicle = async (id, updateData) => {
  const vehicle = await Vehicle.findByIdAndUpdate(id, updateData, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }

  return vehicle;
};

/**
 * Deletes a vehicle by ID.
 * @param {string} id - Vehicle ID
 * @returns {Promise<Object>} The deleted vehicle
 * @throws {Error} If vehicle is not found
 */
export const deleteVehicle = async (id) => {
  const vehicle = await Vehicle.findByIdAndDelete(id);

  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }

  return vehicle;
};

/**
 * Purchases a vehicle (decrements quantity by 1).
 * @param {string} id - Vehicle ID
 * @returns {Promise<Object>} The updated vehicle
 * @throws {Error} If vehicle is not found or out of stock
 */
export const purchaseVehicle = async (id) => {
  const vehicle = await Vehicle.findById(id);
  
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }

  if (vehicle.quantity <= 0) {
    const error = new Error('Vehicle is out of stock');
    error.statusCode = 400;
    throw error;
  }

  vehicle.quantity -= 1;
  await vehicle.save();
  return vehicle;
};

/**
 * Restocks a vehicle (increments quantity).
 * @param {string} id - Vehicle ID
 * @param {number} amount - Quantity to add
 * @returns {Promise<Object>} The updated vehicle
 * @throws {Error} If vehicle is not found or amount is invalid
 */
export const restockVehicle = async (id, amount) => {
  if (amount == null || amount <= 0) {
    const error = new Error('Invalid restock quantity');
    error.statusCode = 400;
    throw error;
  }

  const vehicle = await Vehicle.findById(id);
  
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }

  vehicle.quantity += amount;
  await vehicle.save();
  return vehicle;
};
