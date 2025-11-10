const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        process.env.FRONTEND_URL,
        process.env.ADMIN_URL,
      ].filter(Boolean);

      console.log("CORS check - Origin:", origin, "Allowed:", allowedOrigins);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/carshowroom_new",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/banners", require("./routes/banners"));
app.use("/api/brands", require("./routes/brands"));
app.use("/api/cars", require("./routes/cars"));
app.use("/api/sold-cars", require("./routes/soldcars"));
app.use("/api/rentals", require("./routes/rentals"));
app.use("/api/upload", require("./routes/upload"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Car Showroom API is running",
    timestamp: new Date().toISOString(),
  });
});

// Default route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Car Showroom API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      banners: "/api/banners",
      brands: "/api/brands",
      cars: "/api/cars",
      soldCars: "/api/sold-cars",
      rentals: "/api/rentals",
      upload: "/api/upload",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.stack : {},
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app
  .listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`📊 API endpoints:`);
    console.log(`  - Health check: ${process.env.API_URL}/api/health`);
    console.log(`  - Auth: ${process.env.API_URL}/api/auth`);
    console.log(`  - Banners: ${process.env.API_URL}/api/banners`);
    console.log(`  - Brands: ${process.env.API_URL}/api/brands`);
    console.log(`  - Cars: ${process.env.API_URL}/api/cars`);
    console.log(`  - Sold Cars: ${process.env.API_URL}/api/sold-cars`);
    console.log(`  - Rentals: ${process.env.API_URL}/api/rentals`);
    console.log(`  - Upload: ${process.env.API_URL}/api/upload`);
  })
  .on("error", (err) => {
    console.error("Server error:", err);
    if (err.code === "EADDRINUSE") {
      console.log(
        `Port ${PORT} is already in use. Please try a different port.`
      );
    }
  });
