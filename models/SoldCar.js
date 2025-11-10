const mongoose = require("mongoose");

const soldCarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false, // Make image optional
    },
    description: String,
    soldDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SoldCar", soldCarSchema);
