import Vehicle from '../models/Vehicle.js';

/**
 * Creates a new vehicle in the database.
 * @param {Object} vehicleData - { make, model, category, price, quantity }
 * @returns {Promise<Object>} The created vehicle
 */
export const addVehicle = async (vehicleData) => {
  const vehicle = await Vehicle.create(vehicleData);
  return vehicle;
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
