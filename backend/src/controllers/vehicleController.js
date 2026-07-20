import {
  addVehicle,
  getAllVehicles,
  updateVehicle,
  deleteVehicle,
  searchVehicles,
  purchaseVehicle,
  restockVehicle,
  bulkAddVehicles,
  getAnalytics,
} from '../services/vehicleService.js';

/**
 * Handles POST /api/vehicles — create a new vehicle.
 */
export const create = async (req, res) => {
  const vehicle = await addVehicle(req.body);
  res.status(201).json({ vehicle });
};

/**
 * Handles POST /api/vehicles/bulk — create multiple vehicles.
 */
export const bulkCreate = async (req, res) => {
  const result = await bulkAddVehicles(req.body.vehicles);
  res.status(201).json(result);
};

/**
 * Handles GET /api/vehicles — list all vehicles (paginated).
 */
export const list = async (req, res) => {
  const { page, limit } = req.query;
  const result = await searchVehicles({ page, limit });
  res.status(200).json(result);
};

/**
 * Handles GET /api/vehicles/search — filter vehicles.
 */
export const search = async (req, res) => {
  const { make, model, category, minPrice, maxPrice, page, limit } = req.query;
  const result = await searchVehicles({ make, model, category, minPrice, maxPrice, page, limit });
  res.status(200).json(result);
};

/**
 * Handles GET /api/vehicles/analytics — get unpaginated filtered data for analytics.
 */
export const analytics = async (req, res) => {
  const { make, model, category, minPrice, maxPrice } = req.query;
  const vehicles = await getAnalytics({ make, model, category, minPrice, maxPrice });
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

/**
 * Handles POST /api/vehicles/:id/purchase — decrement vehicle quantity.
 */
export const purchase = async (req, res) => {
  const vehicle = await purchaseVehicle(req.params.id);
  res.status(200).json({ vehicle });
};

/**
 * Handles POST /api/vehicles/:id/restock — increment vehicle quantity (admin only).
 */
export const restock = async (req, res) => {
  const vehicle = await restockVehicle(req.params.id, req.body.quantity);
  res.status(200).json({ vehicle });
};
