const mongoose = require("mongoose");
const Product = require("./product.model");

const machinerySchema = new mongoose.Schema({
  rentingPrice: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    enum: ["hour", "day", "week", "month"],
    default: "day",
  },
  machineryType: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
  },
  model: {
    type: String,
  },
  yearOfManufacture: {
    type: Number,
  },
});

const Machinery = Product.discriminator("Machinery", machinerySchema);

module.exports = Machinery;
