require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/db");

const { notFound, errorHandler } = require("./middlewares/error.middleware");

// Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const seedRoutes = require("./routes/seed.routes");
const seedlingRoutes = require("./routes/seedling.routes");
const machineryRoutes = require("./routes/machinery.routes");
const workerRoutes = require("./routes/worker.routes");
const cultivationRoutes = require("./routes/cultivation.routes");
const diseaseRoutes = require("./routes/disease.routes");
const orderRoutes = require("./routes/order.routes");
//./routes/order.routes
//  "data:import": "node src/utils/seeder.js",
//     "data:destroy": "node src/utils/seeder.js -d"
// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Set static folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/seeds", seedRoutes);
app.use("/api/seedlings", seedlingRoutes);
app.use("/api/machinery", machineryRoutes);

app.use("/api/workers", workerRoutes);
app.use("/api/cultivation", cultivationRoutes);
app.use("/api/diseases", diseaseRoutes);
app.use("/api/orders", orderRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});
