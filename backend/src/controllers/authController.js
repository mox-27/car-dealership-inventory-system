import { registerUser } from '../services/authService.js';

/**
 * Handles POST /api/auth/register.
 * Delegates to authService and returns the created user.
 */
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const user = await registerUser({ name, email, password, role });
  res.status(201).json({ user });
};
