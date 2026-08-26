const express = require("express");
const cors = require("cors");

const fileRoutes = require("./routes/fileRoutes");
const { testS3Connection } = require("./services/s3Service");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Cloud File Storage API is running!",
    version: "v4.0",
    status: "Deployed Successfully"
  });
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy"
  });
});

// Version endpoint
app.get("/version", (req, res) => {
  res.status(200).json({
    version: process.env.APP_VERSION || "v4.0-CLOUD-FILE-STORAGE"
  });
});

// Cloud File Storage API routes
app.use("/api/files", fileRoutes);

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    testS3Connection().catch((error) => {
      console.error("S3 connection test failed:", error);
    });
  });
}

module.exports = app;