const express = require("express");
const router = express.Router();
const SoldCar = require("../models/SoldCar");
const { protect, adminOnly } = require("../middleware/auth"); // Changed from authorize to adminOnly
const { uploadCars } = require("../middleware/upload");

// Get all sold cars
router.get("/", async (req, res) => {
  try {
    const soldCars = await SoldCar.find().sort({ soldDate: -1 });
    res.json({ success: true, data: soldCars });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new sold car (admin only)
router.post(
  "/",
  protect,
  adminOnly,
  uploadCars.single("image"),
  async (req, res) => {
    try {
      console.log("Received body:", req.body);
      console.log("Received file:", req.file);

      const soldCarData = {
        name: req.body.name,
        description: req.body.description,
        soldDate: req.body.soldDate,
      };

      // Handle image
      if (req.file) {
        soldCarData.image = `/uploads/cars/${req.file.filename}`;
      } else if (req.body.image) {
        soldCarData.image = req.body.image;
      } else if (req.body.imageUrl) {
        soldCarData.image = req.body.imageUrl;
      }
      // If no image, leave it undefined (optional field)

      const soldCar = await SoldCar.create(soldCarData);
      res.status(201).json({ success: true, data: soldCar });
    } catch (error) {
      console.error("Error creating sold car:", error);
      res.status(400).json({ success: false, error: error.message });
    }
  }
);

// Update sold car (admin only)
router.put(
  "/:id",
  protect,
  adminOnly,
  uploadCars.single("image"),
  async (req, res) => {
    try {
      console.log("Updating sold car:", req.params.id);
      console.log("Received body:", req.body);
      console.log("Received file:", req.file);

      const soldCarData = {
        name: req.body.name,
        description: req.body.description,
        soldDate: req.body.soldDate,
      };

      // Handle image update
      if (req.file) {
        soldCarData.image = `/uploads/cars/${req.file.filename}`;
      } else if (req.body.imageUrl) {
        soldCarData.image = req.body.imageUrl;
      } else if (req.body.removeImage === "true") {
        soldCarData.image = null;
      }
      // If no new image and no removal, keep existing image

      const soldCar = await SoldCar.findByIdAndUpdate(
        req.params.id,
        soldCarData,
        { new: true, runValidators: true }
      );

      if (!soldCar) {
        return res
          .status(404)
          .json({ success: false, error: "Sold car not found" });
      }

      res.json({ success: true, data: soldCar });
    } catch (error) {
      console.error("Error updating sold car:", error);
      res.status(400).json({ success: false, error: error.message });
    }
  }
);

// Delete sold car (admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await SoldCar.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
