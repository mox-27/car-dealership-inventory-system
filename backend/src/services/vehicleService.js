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
