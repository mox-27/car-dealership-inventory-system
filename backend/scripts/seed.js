import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';
import { registerUser } from '../src/services/authService.js';
import Vehicle from '../src/models/Vehicle.js';

const seed = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    // 1. Seed Admin User
    try {
      await registerUser({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      });
      console.log('✅ Admin user created: admin@example.com / password123');
    } catch (err) {
      if (err.message === 'Email already registered') {
        console.log('✅ Admin user already exists: admin@example.com / password123');
      } else {
        throw err;
      }
    }

    // 2. Seed some vehicles if empty
    const count = await Vehicle.countDocuments();
    if (count === 0) {
      const vehicles = [
        { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 4600000, quantity: 5 },
        { make: 'Honda', model: 'CR-V', category: 'SUV', price: 3500000, quantity: 3 },
        { make: 'Ford', model: 'Mustang', category: 'Sports', price: 7500000, quantity: 2 },
        { make: 'Tesla', model: 'Model 3', category: 'Sedan', price: 6000000, quantity: 4 },
        { make: 'Mahindra', model: 'Scorpio', category: 'SUV', price: 1800000, quantity: 6 }
      ];

      await Vehicle.insertMany(vehicles);
      console.log('✅ Vehicles seeded successfully.');
    } else {
      console.log(`✅ Vehicles already exist (${count} found).`);
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
