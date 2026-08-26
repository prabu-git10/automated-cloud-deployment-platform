const express = require("express");

const app = express();

const PORT = process.env.PORT || 5000;

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "CloudOps Dashboard API",
    version: "v2.0",
    status: "Deployed Successfully"
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy"
  });
});

// CI/CD version test endpoint
app.get("/version", (req, res) => {
  res.status(200).json({
    version: "v3.0-CICD-TEST"
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;