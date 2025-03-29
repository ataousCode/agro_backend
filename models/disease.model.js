const mongoose = require("mongoose");

const diseaseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    cropType: {
      type: String,
      required: true,
    },
    symptoms: {
      type: String,
      required: true,
    },
    causes: {
      type: String,
      required: true,
    },
    prevention: {
      type: String,
      required: true,
    },
    solution: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    videoLink: {
      type: String,
    },
    contentType: {
      type: String,
      enum: ["blog", "video"],
      default: "blog",
    },
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

const Disease = mongoose.model("Disease", diseaseSchema);

module.exports = Disease;
