import { registerUser, loginUser } from '../services/authService.js';

/**
 * Handles POST /api/auth/register.
 * Delegates to authService and returns the created user.
 */
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const user = await registerUser({ name, email, password, role });
  res.status(201).json({ user });
};

/**
 * Handles POST /api/auth/login.
 * Delegates to authService and returns a JWT.
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  const token = await loginUser({ email, password });
  res.status(200).json({ token });
};
