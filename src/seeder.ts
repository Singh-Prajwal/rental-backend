import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db";
import User from "./models/User";
import Property from "./models/Property";

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

// --- PREDEFINED DATA ---

const adminUser = {
  name: "Admin User",
  email: "admin@Digital Guidebook.com",
  password: "adminpassword", // We will hash this before saving
  role: "admin",
};

const properties = [
  {
    name: "Modern City Apartment",
    type: "Entire Apartment",
    description:
      "This beautifully renovated space offers a perfect blend of classic architecture and modern amenities, providing a comfortable and stylish retreat after a day of exploring the city. The location is ideal, close to many restaurants and shops.",
    heroImage:
      "https://plus.unsplash.com/premium_photo-1684175656320-5c3f701c082c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
      "https://plus.unsplash.com/premium_photo-1673014200221-524696a1edd9?q=80&w=2131&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    amenities: [
      "Wifi",
      "Kitchen",
      "Washer",
      "TV",
      "Free parking on premises",
      "Air conditioning",
    ],
    wifi_ssid: "Digital Guidebook_Guest_Modern",
    wifi_password: "modern-stay-2024!",
    checkin_instructions:
      "The key is in the lockbox by the front door. The code is 1234. Please make yourself at home!",
    checkout_instructions:
      "Please load and run the dishwasher, take out all trash to the bins outside, and lock the door behind you.",
    appliances: [
      {
        name: "Smart TV",
        model: "Samsung QN90C",
        manual_text:
          "To turn on the TV, press the red power button on the remote. Use the source button to switch between HDMI 1 (Cable) and HDMI 2 (Apple TV). The apps for Netflix, Hulu, and more are available on the home screen.",
      },
      {
        name: "Nespresso Machine",
        model: "VertuoPlus",
        manual_text:
          "To use the Nespresso, ensure there is water in the tank. Place a Nespresso pod in the top and close the lid. Press the button to brew. Do not try to start if the orange light is flashing; it may need cleaning.",
      },
    ],
    beds: 2,
    bedrooms: 2,
    baths: 1,
    maxGuests: 3,
    pricePerNight: 170,
    location: "Mission District, San Francisco",
    host: {
      name: "Sophia Carter",
      avatarUrl:
        "https://images.unsplash.com/photo-1600188768079-6df9f96e0b86?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    reviews: [],
  },
  // Add another property object here if you want more sample data
];

// --- SCRIPT LOGIC ---

// Import data into DB
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Property.deleteMany();

    // Insert the admin user
    // The password will be hashed automatically by the 'pre-save' hook in the User model
    await User.create(adminUser);

    // Insert the properties
    await Property.insertMany(properties);

    console.log("✅ Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
};

// Destroy data from DB
const destroyData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Property.deleteMany();

    console.log("🗑️ Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
};

// Check for command-line arguments
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
