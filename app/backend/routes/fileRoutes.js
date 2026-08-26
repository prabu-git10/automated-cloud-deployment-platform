const express = require("express");
const multer = require("multer");

const {
  uploadFile,
  listFiles,
  getDownloadUrl,
  deleteFile,
  getStorageUsage,
} = require("../services/s3Service");

const router = express.Router();

// ========================================
// Multer Configuration
// ========================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

// ========================================
// Get All Files
// ========================================

router.get("/", async (req, res) => {
  try {
    const files = await listFiles();

    res.json({
      success: true,
      files,
    });
  } catch (error) {
    console.error("Get files error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve files",
    });
  }
});

// ========================================
// Upload File
// ========================================

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    await uploadFile(req.file);

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",

      file: {
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error("Upload route error:", error);

    res.status(500).json({
      success: false,
      message: "File upload failed",
    });
  }
});

// ========================================
// Generate Download URL
// ========================================

router.get("/download/:key", async (req, res) => {
  try {
    const fileName = req.params.key;

    const downloadUrl = await getDownloadUrl(fileName);

    res.json({
      success: true,
      downloadUrl,
    });
  } catch (error) {
    console.error("Download route error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate download URL",
    });
  }
});

// ========================================
// Delete File
// ========================================

router.delete("/:key", async (req, res) => {
  try {
    const fileName = req.params.key;

    await deleteFile(fileName);

    res.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete route error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete file",
    });
  }
});

// ========================================
// Get Storage Usage
// ========================================

router.get("/storage", async (req, res) => {
  try {
    const storage = await getStorageUsage();

    res.json({
      success: true,
      storage,
    });
  } catch (error) {
    console.error("Storage route error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to calculate storage usage",
    });
  }
});

// ========================================
// Multer Error Handler
// ========================================

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size cannot exceed 10 MB",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
});

module.exports = router;