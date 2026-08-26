const s3 = require("../config/s3");

const {
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// ========================================
// Test S3 Connection
// ========================================

async function testS3Connection() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET,
    });

    const response = await s3.send(command);

    console.log("S3 connection successful!");
    console.log("Files in bucket:", response.Contents || []);

    return response;
  } catch (error) {
    console.error("S3 connection failed:", error);
    throw error;
  }
}

// ========================================
// Get Files from S3
// ========================================

async function listFiles() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET,
    });

    const response = await s3.send(command);

    const files = (response.Contents || []).map((file) => ({
      name: file.Key,
      size: file.Size,
      lastModified: file.LastModified,
    }));

    return files;
  } catch (error) {
    console.error("S3 list files failed:", error);
    throw error;
  }
}

// ========================================
// Upload File to S3
// ========================================

async function uploadFile(file) {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    const response = await s3.send(command);

    console.log(
      `File uploaded successfully: ${file.originalname}`
    );

    return response;
  } catch (error) {
    console.error("S3 upload failed:", error);
    throw error;
  }
}

// ========================================
// Generate Temporary Download URL
// ========================================

async function getDownloadUrl(fileName) {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,

      ResponseContentDisposition:
        `attachment; filename="${fileName}"`,
    });

    const url = await getSignedUrl(s3, command, {
      expiresIn: 300,
    });

    return url;
  } catch (error) {
    console.error(
      "Failed to generate download URL:",
      error
    );

    throw error;
  }
}

// ========================================
// Delete File from S3
// ========================================

async function deleteFile(fileName) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
    });

    const response = await s3.send(command);

    console.log(
      `File deleted successfully: ${fileName}`
    );

    return response;
  } catch (error) {
    console.error("S3 delete failed:", error);
    throw error;
  }
}
// Calculate total storage used in S3
async function getStorageUsage() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET,
    });

    const response = await s3.send(command);

    const files = response.Contents || [];

    const totalBytes = files.reduce(
      (total, file) => total + (file.Size || 0),
      0
    );

    return {
      totalBytes,
    };
  } catch (error) {
    console.error("Failed to calculate storage usage:", error);
    throw error;
  }
}

// ========================================
// Export Functions
// ========================================

module.exports = {
  testS3Connection,
  listFiles,
  uploadFile,
  getDownloadUrl,
  deleteFile,
  getStorageUsage,
};