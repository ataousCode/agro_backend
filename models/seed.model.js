const mongoose = require("mongoose");
const Product = require("./product.model");

const seedSchema = new mongoose.Schema({
  unit: {
    type: String,
    required: true,
    enum: ["kg", "g", "packet"],
    default: "kg",
  },
  seedType: {
    type: String,
    required: true,
    enum: ["vegetable", "fruit", "flower", "crop"],
  },
  growthTime: {
    type: String,
  },
  sowingSeason: {
    type: String,
  },
});

const Seed = Product.discriminator("Seed", seedSchema);

module.exports = Seed;
