import { useState } from "react";
import { Upload, X, File } from "lucide-react";

function UploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Select file
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
      setError("");
    }
  };

  // Upload file
  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        "/api/files",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "File upload failed"
        );
      }

      console.log(
        "File uploaded successfully:",
        data.file
      );

      // Clear selected file
      setSelectedFile(null);

      // Tell Dashboard to refresh
      if (onUploadSuccess) {
        onUploadSuccess();
      }

    } catch (error) {
      console.error("Upload error:", error);

      setError(
        error.message || "Failed to upload file."
      );
    } finally {
      setUploading(false);
    }
  };

  // Reset modal
  const handleClose = () => {
    if (uploading) {
      return;
    }

    setSelectedFile(null);
    setError("");

    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">

      <div className="upload-modal">

        {/* Modal Header */}
        <div className="modal-header">

          <div>
            <h2>Upload Files</h2>

            <p>
              Select files to upload to your cloud storage.
            </p>
          </div>

          <button
            className="modal-close"
            onClick={handleClose}
            disabled={uploading}
          >
            <X size={20} />
          </button>

        </div>

        {/* Upload Area */}
        <div className="upload-area">

          <div className="upload-icon">
            <Upload size={28} />
          </div>

          <h3>Drop files here</h3>

          <p>
            or select files from your computer
          </p>

          <label className="browse-button">

            Browse Files

            <input
              type="file"
              hidden
              onChange={handleFileChange}
              disabled={uploading}
            />

          </label>

        </div>

        {/* Selected File */}
        {selectedFile && (
          <div className="selected-file">

            <File size={20} />

            <div>

              <span>
                {selectedFile.name}
              </span>

              <small>
                {(
                  selectedFile.size /
                  (1024 * 1024)
                ).toFixed(2)}{" "}
                MB
              </small>

            </div>

          </div>
        )}

        {/* Error */}
        {error && (
          <div className="upload-error">
            {error}
          </div>
        )}

        {/* Modal Actions */}
        <div className="modal-actions">

          <button
            className="cancel-button"
            onClick={handleClose}
            disabled={uploading}
          >
            Cancel
          </button>

          <button
            className="upload-button"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default UploadModal;
