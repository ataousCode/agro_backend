const mongoose = require("mongoose");

const cultivationStepSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  orderIndex: {
    type: Number,
    required: true,
  },
});

const cultivationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    cropType: {
      type: String,
      required: true,
      enum: ["crop", "vegetable", "flower", "fruit"],
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    steps: [cultivationStepSchema],
    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cultivation = mongoose.model("Cultivation", cultivationSchema);

module.exports = Cultivation;
