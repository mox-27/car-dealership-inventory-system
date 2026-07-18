import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

/**
 * Registers a new user in the database.
 * @param {Object} userData - { name, email, password, role }
 * @returns {Promise<Object>} The created user (without password)
 * @throws {Error} If email already exists or validation fails
 */
export const registerUser = async ({ name, email, password, role }) => {
  // Validate required fields
  if (!name || !email || !password) {
    const error = new Error('Name, email, and password are required');
    error.statusCode = 400;
    throw error;
  }

  // Check for existing email first for a cleaner error message
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({ name, email, password, role });

  // Return user data without the password
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

/**
 * Authenticates a user and returns a JWT.
 * @param {Object} credentials - { email, password }
 * @returns {Promise<string>} JWT token
 * @throws {Error} If credentials are invalid
 */
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return token;
};
