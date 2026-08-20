const express = require("express");

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).json({
    message: "CloudOps Dashboard API - CI/CD Deployment Successful"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy"
  });
});

app.get("/version", (req, res) => {
  res.status(200).json({
    version: process.env.APP_VERSION || "development"
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;