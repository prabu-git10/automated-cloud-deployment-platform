const express = require("express");
const cors = require("cors");

const fileRoutes = require("./routes/fileRoutes");
const { testS3Connection } = require("./services/s3Service");

const app = express();
const PORT = 5000;

// Allow requests from the deployed React frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://15.252.146.163",
    ],
  })
);

app.use(express.json());

app.use("/api/files", fileRoutes);

// Application health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Cloud File Storage API is running!",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  testS3Connection().catch((error) => {
    console.error("S3 connection test failed:", error);
  });
});
