const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({
    message: "Automated Cloud Deployment & DevOps Platform"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy"
  });
});

app.get("/version", (req, res) => {
  res.json({
    version: process.env.APP_VERSION || "development"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});