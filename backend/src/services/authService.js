import User from '../models/User.js';

/**
 * Registers a new user in the database.
 * @param {Object} userData - { name, email, password, role }
 * @returns {Promise<Object>} The created user (without password)
 * @throws {Error} If email already exists or validation fails
 */
export const registerUser = async ({ name, email, password, role }) => {
  const user = await User.create({ name, email, password, role });

  // Return user data without the password
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};
