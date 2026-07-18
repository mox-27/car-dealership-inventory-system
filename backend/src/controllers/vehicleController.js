import {
  addVehicle,
  getAllVehicles,
  updateVehicle,
  deleteVehicle,
  searchVehicles,
} from '../services/vehicleService.js';

/**
 * Handles POST /api/vehicles — create a new vehicle.
 */
export const create = async (req, res) => {
  const vehicle = await addVehicle(req.body);
  res.status(201).json({ vehicle });
};

/**
 * Handles GET /api/vehicles — list all vehicles.
 */
export const list = async (_req, res) => {
  const vehicles = await getAllVehicles();
  res.status(200).json({ vehicles });
};

/**
 * Handles GET /api/vehicles/search — filter vehicles.
 */
export const search = async (req, res) => {
  const { make, model, category, minPrice, maxPrice } = req.query;
  const vehicles = await searchVehicles({ make, model, category, minPrice, maxPrice });
  res.status(200).json({ vehicles });
};

/**
 * Handles PUT /api/vehicles/:id — update a vehicle.
 */
export const update = async (req, res) => {
  const vehicle = await updateVehicle(req.params.id, req.body);
  res.status(200).json({ vehicle });
};

/**
 * Handles DELETE /api/vehicles/:id — delete a vehicle (admin only).
 */
export const remove = async (req, res) => {
  await deleteVehicle(req.params.id);
  res.status(200).json({ message: 'Vehicle deleted successfully' });
};
