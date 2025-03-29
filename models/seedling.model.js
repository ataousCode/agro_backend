const mongoose = require("mongoose");
const Product = require("./product.model");

const seedlingSchema = new mongoose.Schema({
  unit: {
    type: String,
    required: true,
    enum: ["pcs", "dozen", "tray"],
    default: "pcs",
  },
  seedlingType: {
    type: String,
    required: true,
    enum: ["vegetable", "fruit", "flower", "crop"],
  },
  age: {
    type: String,
  },
  heightCm: {
    type: Number,
  },
});

const Seedling = Product.discriminator("Seedling", seedlingSchema);

module.exports = Seedling;
