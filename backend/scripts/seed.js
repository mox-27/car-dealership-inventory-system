import dotenv from "dotenv";
dotenv.config();

import connectDB from "../src/config/db.js";
import { registerUser } from "../src/services/authService.js";

const seedAdmin = async () => {
  try {
    await connectDB();
    console.log("Connected to DB");

    try {
      await registerUser({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
      });
      console.log(
        `✅ Admin user created: ${process.env.ADMIN_EMAIL} / ${process.env.ADMIN_PASSWORD}`,
      );
    } catch (err) {
      if (err.message === "Email already registered") {
        console.log(
          `✅ Admin user already exists: ${process.env.ADMIN_EMAIL} / ${process.env.ADMIN_PASSWORD}`,
        );
      } else {
        throw err;
      }
    }

    console.log("Seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedAdmin();
