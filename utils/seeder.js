require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Seed = require("../models/seed.model");
const Seedling = require("../models/seedling.model");
const Machinery = require("../models/machinery.model");
const Worker = require("../models/worker.model");
const Cultivation = require("../models/cultivation.model");
const Disease = require("../models/disease.model");
const connectDB = require("../config/db");

// Connect to DB
connectDB();

// Sample data
const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    phone: "1234567890",
    password: "password123",
    role: "admin",
    isVerified: true,
  },
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "0987654321",
    password: "password123",
    role: "user",
    isVerified: true,
  },
];

const seeds = [
  {
    name: "Rice Seeds",
    description: "High-quality rice seeds for optimal growth.",
    price: 150,
    image: "rice-seeds.jpg",
    category: "seed",
    rating: 4.5,
    numReviews: 12,
    stockQuantity: 500,
    isAvailable: true,
    unit: "kg",
    seedType: "crop",
    growthTime: "90-120 days",
    sowingSeason: "Spring/Summer",
  },
  {
    name: "Wheat Seeds",
    description: "Premium wheat seeds for higher yield.",
    price: 100,
    image: "wheat-seeds.jpg",
    category: "seed",
    rating: 4.0,
    numReviews: 8,
    stockQuantity: 400,
    isAvailable: true,
    unit: "kg",
    seedType: "crop",
    growthTime: "100-130 days",
    sowingSeason: "Winter",
  },
];

const seedlings = [
  {
    name: "Tomato Seedlings",
    description: "Healthy tomato seedlings for your garden.",
    price: 20,
    image: "tomato-seedlings.jpg",
    category: "seedling",
    rating: 4.8,
    numReviews: 15,
    stockQuantity: 200,
    isAvailable: true,
    unit: "pcs",
    seedlingType: "vegetable",
    age: "3 weeks",
    heightCm: 15,
  },
  {
    name: "Mango Seedlings",
    description: "Grafted mango seedlings for commercial farming.",
    price: 80,
    image: "mango-seedlings.jpg",
    category: "seedling",
    rating: 4.6,
    numReviews: 10,
    stockQuantity: 150,
    isAvailable: true,
    unit: "pcs",
    seedlingType: "fruit",
    age: "2 months",
    heightCm: 45,
  },
];

const machinery = [
  {
    name: "Tractor",
    description: "High-power tractor for agricultural use.",
    price: 0,
    image: "tractor.jpg",
    category: "machinery",
    rating: 4.9,
    numReviews: 20,
    stockQuantity: 5,
    isAvailable: true,
    rentingPrice: 700,
    sellingPrice: 120000,
    unit: "day",
    machineryType: "vehicle",
    manufacturer: "John Deere",
    model: "JD-5050",
    yearOfManufacture: 2020,
  },
  {
    name: "Rice Transplanter",
    description: "Efficient rice transplanter for paddy fields.",
    price: 0,
    image: "rice-transplanter.jpg",
    category: "machinery",
    rating: 4.7,
    numReviews: 12,
    stockQuantity: 3,
    isAvailable: true,
    rentingPrice: 600,
    sellingPrice: 80000,
    unit: "day",
    machineryType: "planting",
    manufacturer: "Kubota",
    model: "KT-100",
    yearOfManufacture: 2021,
  },
];

const workers = [
  {
    name: "Farm Worker Team",
    description:
      "Experienced farm workers for planting, harvesting, and general farm work.",
    price: 0,
    image: "farm-workers.jpg",
    category: "worker",
    rating: 4.4,
    numReviews: 18,
    stockQuantity: 20,
    isAvailable: true,
    wage: 400,
    unit: "day",
    specialization: "General Farming",
    experience: "5+ years",
  },
  {
    name: "Irrigation Specialist",
    description: "Expert in setting up and maintaining irrigation systems.",
    price: 0,
    image: "irrigation-specialist.jpg",
    category: "worker",
    rating: 4.8,
    numReviews: 14,
    stockQuantity: 5,
    isAvailable: true,
    wage: 600,
    unit: "day",
    specialization: "Irrigation",
    experience: "8+ years",
  },
];

const cultivationProcesses = [
  {
    title: "Rice Cultivation in Bangladesh",
    cropType: "crop",
    description: "A comprehensive guide to rice cultivation in Bangladesh.",
    image: "rice-cultivation.jpg",
    steps: [
      {
        title: "Land Preparation",
        description: "Prepare land by plowing and leveling the field.",
        orderIndex: 1,
      },
      {
        title: "Seed Selection",
        description: "Select high-quality seeds suitable for your region.",
        orderIndex: 2,
      },
      {
        title: "Sowing",
        description: "Sow seeds in a nursery bed for transplanting later.",
        orderIndex: 3,
      },
      {
        title: "Transplanting",
        description: "Transplant seedlings to the main field after 3-4 weeks.",
        orderIndex: 4,
      },
      {
        title: "Water Management",
        description: "Maintain proper water level in the field.",
        orderIndex: 5,
      },
      {
        title: "Fertilizer Application",
        description: "Apply fertilizers as per recommended dosage.",
        orderIndex: 6,
      },
      {
        title: "Pest Management",
        description: "Monitor and control pests and diseases.",
        orderIndex: 7,
      },
      {
        title: "Harvesting",
        description: "Harvest when 80-85% of the grains are mature.",
        orderIndex: 8,
      },
    ],
    relatedProducts: [],
  },
  {
    title: "Wheat Cultivation",
    cropType: "crop",
    description: "Guidelines for successful wheat cultivation.",
    image: "wheat-cultivation.jpg",
    steps: [
      {
        title: "Land Preparation",
        description: "Prepare a fine tilth by plowing 2-3 times.",
        orderIndex: 1,
      },
      {
        title: "Seed Treatment",
        description: "Treat seeds with fungicides before sowing.",
        orderIndex: 2,
      },
      {
        title: "Sowing",
        description: "Sow seeds using a seed drill at appropriate spacing.",
        orderIndex: 3,
      },
      {
        title: "Irrigation",
        description: "Provide first irrigation 20-25 days after sowing.",
        orderIndex: 4,
      },
      {
        title: "Weed Control",
        description: "Control weeds by manual weeding or herbicides.",
        orderIndex: 5,
      },
      {
        title: "Fertilizer Management",
        description: "Apply fertilizers as per soil test recommendations.",
        orderIndex: 6,
      },
      {
        title: "Harvesting",
        description: "Harvest when the crop turns golden yellow.",
        orderIndex: 7,
      },
    ],
    relatedProducts: [],
  },
];

const diseases = [
  {
    title: "Rice Blast",
    cropType: "Rice",
    symptoms:
      "Lesions on leaves, stems, and panicles. Leaf lesions are typically diamond-shaped.",
    causes: "Fungal pathogen Pyricularia oryzae.",
    prevention:
      "Use resistant varieties, balanced fertilization, proper spacing.",
    solution:
      "Apply fungicides like Tricyclazole or Propiconazole at recommended doses.",
    image: "rice-blast.jpg",
    contentType: "blog",
    relatedProducts: [],
  },
  {
    title: "Wheat Rust",
    cropType: "Wheat",
    symptoms: "Orange-brown pustules on leaves and stems.",
    causes: "Fungal pathogens of the Puccinia species.",
    prevention:
      "Plant resistant varieties, early sowing, balanced fertilization.",
    solution:
      "Apply fungicides like Propiconazole or Tebuconazole at recommended doses.",
    image: "wheat-rust.jpg",
    contentType: "blog",
    relatedProducts: [],
  },
];

// Seed data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Seed.deleteMany();
    await Seedling.deleteMany();
    await Machinery.deleteMany();
    await Worker.deleteMany();
    await Cultivation.deleteMany();
    await Disease.deleteMany();

    // Create users with hashed passwords
    const createdUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        return await User.create({
          ...user,
          password: hashedPassword,
        });
      })
    );

    const adminUser = createdUsers[0]._id;

    // Add admin user to seeds
    const seedsWithUser = seeds.map((seed) => ({
      ...seed,
      user: adminUser,
    }));

    // Create seeds
    const createdSeeds = await Seed.insertMany(seedsWithUser);

    // Add admin user to seedlings
    const seedlingsWithUser = seedlings.map((seedling) => ({
      ...seedling,
      user: adminUser,
    }));

    // Create seedlings
    const createdSeedlings = await Seedling.insertMany(seedlingsWithUser);

    // Add admin user to machinery
    const machineryWithUser = machinery.map((item) => ({
      ...item,
      user: adminUser,
    }));

    // Create machinery
    const createdMachinery = await Machinery.insertMany(machineryWithUser);

    // Add admin user to workers
    const workersWithUser = workers.map((worker) => ({
      ...worker,
      user: adminUser,
    }));

    // Create workers
    const createdWorkers = await Worker.insertMany(workersWithUser);

    // Add related products to cultivation processes
    const cultivationWithProducts = cultivationProcesses.map((process) => ({
      ...process,
      relatedProducts: [createdSeeds[0]._id, createdMachinery[0]._id],
    }));

    // Create cultivation processes
    const createdCultivationProcesses = await Cultivation.insertMany(
      cultivationWithProducts
    );

    // Add related products to diseases
    const diseasesWithProducts = diseases.map((disease) => ({
      ...disease,
      relatedProducts: [createdSeeds[0]._id],
    }));

    // Create diseases
    const createdDiseases = await Disease.insertMany(diseasesWithProducts);

    console.log("Data imported successfully");
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Seed.deleteMany();
    await Seedling.deleteMany();
    await Machinery.deleteMany();
    await Worker.deleteMany();
    await Cultivation.deleteMany();
    await Disease.deleteMany();

    console.log("Data destroyed successfully");
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
