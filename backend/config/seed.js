import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.model.js";
import { ROLES, STATUS } from "../config/constants.js";

dotenv.config();

const seedUsers = [
  {
    name: "Super Admin",
    email: "admin@ums.com",
    password: "Admin@123",
    role: ROLES.ADMIN,
    status: STATUS.ACTIVE,
  },
  {
    name: "Jane Manager",
    email: "manager@ums.com",
    password: "Manager@123",
    role: ROLES.MANAGER,
    status: STATUS.ACTIVE,
  },
  {
    name: "John User",
    email: "user@ums.com",
    password: "User@1234",
    role: ROLES.USER,
    status: STATUS.ACTIVE,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Drop all indexes to fix duplicate key errors from old schema
    try {
      await User.collection.dropIndexes();
      console.log("🔧 Dropped old indexes");
    } catch (e) {
      // Ignore if no indexes exist
    }

    await User.deleteMany({});
    console.log("🗑️  Cleared existing users");

    // Create users one by one to trigger pre-save hooks (password hashing)
    const created = [];
    for (const userData of seedUsers) {
      const user = new User(userData);
      await user.save();
      created.push(user);
    }

    console.log(`🌱 Seeded ${created.length} users:`);
    seedUsers.forEach((u) => {
      console.log(`   ${u.role.padEnd(8)} → ${u.email}  (password: ${u.password})`);
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
