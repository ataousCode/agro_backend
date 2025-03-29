const mongoose = require("mongoose");
const Product = require("./product.model");

const workerSchema = new mongoose.Schema({
  wage: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    enum: ["hour", "day", "week", "month"],
    default: "day",
  },
  specialization: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
  },
});

const Worker = Product.discriminator("Worker", workerSchema);

module.exports = Worker;
