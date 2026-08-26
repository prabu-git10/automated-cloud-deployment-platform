import { useEffect, useState } from "react";
import {
  FileText,
  Image,
  FileSpreadsheet,
  File,
  MoreVertical,
  Download,
  Star,
  Trash2,
} from "lucide-react";

function FileTable({ searchTerm = "", refreshKey }) {
  const [files, setFiles] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [starredFiles, setStarredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // Get files from backend
  // ========================================

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/files"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }

      const data = await response.json();

      if (data.success) {
        setFiles(data.files);
      } else {
        throw new Error("Failed to load files");
      }
    } catch (error) {
      console.error("File fetch error:", error);
      setError("Unable to load files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [refreshKey]);

  // ========================================
  // Get file type
  // ========================================

  const getFileType = (fileName) => {
    const extension = fileName
      .split(".")
      .pop()
      ?.toLowerCase();

    switch (extension) {
      case "pdf":
        return "PDF";

      case "xlsx":
      case "xls":
      case "csv":
        return "Excel";

      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "webp":
        return "Image";

      case "txt":
        return "Text";

      case "doc":
      case "docx":
        return "Word";

      case "html":
      case "htm":
        return "HTML";

      default:
        return "File";
    }
  };

  // ========================================
  // Get appropriate icon
  // ========================================

  const getFileIcon = (fileName) => {
    const extension = fileName
      .split(".")
      .pop()
      ?.toLowerCase();

    switch (extension) {
      case "pdf":
      case "txt":
      case "doc":
      case "docx":
      case "html":
      case "htm":
        return FileText;

      case "xlsx":
      case "xls":
      case "csv":
        return FileSpreadsheet;

      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "webp":
        return Image;

      default:
        return File;
    }
  };

  // ========================================
  // Format file size
  // ========================================

  const formatFileSize = (bytes) => {
    if (!bytes) {
      return "0 KB";
    }

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  // ========================================
  // Format modified date
  // ========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  // ========================================
  // Search files
  // ========================================

  const filteredFiles = files.filter((file) =>
    file.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // ========================================
  // Toggle action menu
  // ========================================

  const handleMenuToggle = (fileName) => {
    if (activeMenu === fileName) {
      setActiveMenu(null);
    } else {
      setActiveMenu(fileName);
    }
  };

  // ========================================
  // Toggle star
  // ========================================

  const handleStarToggle = (fileName) => {
    setStarredFiles((previousStarred) => {
      if (previousStarred.includes(fileName)) {
        return previousStarred.filter(
          (name) => name !== fileName
        );
      }

      return [...previousStarred, fileName];
    });

    setActiveMenu(null);
  };

  // ========================================
  // Check whether file is starred
  // ========================================

  const isStarred = (fileName) => {
    return starredFiles.includes(fileName);
  };

  // ========================================
  // Download file
  // ========================================

  const handleDownload = async (fileName) => {
    try {
      const response = await fetch(
        `/api/files/download/${encodeURIComponent(
          fileName
        )}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to generate download URL"
        );
      }

      const data = await response.json();

      if (data.success && data.downloadUrl) {
        window.location.href = data.downloadUrl;
      } else {
        throw new Error(
          "Download URL not received"
        );
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file.");
    }

    setActiveMenu(null);
  };

  // ========================================
  // DELETE FILE FROM S3
  // ========================================

  const handleDelete = async (fileName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${fileName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/files/${encodeURIComponent(
          fileName
        )}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete file"
        );
      }

      // Remove file immediately from frontend
      setFiles((previousFiles) =>
        previousFiles.filter(
          (file) => file.name !== fileName
        )
      );

      // Remove from starred list if it was starred
      setStarredFiles((previousStarred) =>
        previousStarred.filter(
          (name) => name !== fileName
        )
      );

      // Close action menu
      setActiveMenu(null);

      console.log(
        `File deleted successfully: ${fileName}`
      );
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete file.");
    }
  };

  // ========================================
  // UI
  // ========================================

  return (
    <section className="files-section">

      {/* Section Header */}
      <div className="section-header">
        <h2>Files</h2>

        <button className="view-all-button">
          View all
        </button>
      </div>

      {/* File Table */}
      <div className="file-table">

        {/* Table Header */}
        <div className="file-table-header">
          <span>Name</span>
          <span>Type</span>
          <span>Size</span>
          <span>Modified</span>
          <span></span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="no-files">
            Loading files...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="no-files">
            {error}
          </div>
        )}

        {/* No files */}
        {!loading &&
          !error &&
          filteredFiles.length === 0 && (
            <div className="no-files">
              No files found.
            </div>
          )}

        {/* Files */}
        {!loading &&
          !error &&
          filteredFiles.length > 0 &&
          filteredFiles.map((file) => {
            const FileIcon = getFileIcon(file.name);
            const starred = isStarred(file.name);

            return (
              <div
                className="file-row"
                key={file.name}
              >

                {/* File Name */}
                <div className="file-name">

                  <div className="file-icon">
                    <FileIcon size={19} />
                  </div>

                  <span>{file.name}</span>

                </div>

                {/* File Type */}
                <span className="file-type">
                  {getFileType(file.name)}
                </span>

                {/* File Size */}
                <span className="file-size">
                  {formatFileSize(file.size)}
                </span>

                {/* Modified Date */}
                <span className="file-date">
                  {formatDate(file.lastModified)}
                </span>

                {/* Actions */}
                <div className="file-action-wrapper">

                  <button
                    className="file-action"
                    onClick={() =>
                      handleMenuToggle(file.name)
                    }
                  >
                    <MoreVertical size={19} />
                  </button>

                  {/* Action Menu */}
                  {activeMenu === file.name && (
                    <div className="file-menu">

                      {/* Download */}
                      <button
                        onClick={() =>
                          handleDownload(file.name)
                        }
                      >
                        <Download size={16} />
                        <span>Download</span>
                      </button>

                      {/* Star */}
                      <button
                        onClick={() =>
                          handleStarToggle(file.name)
                        }
                      >
                        <Star
                          size={16}
                          fill={
                            starred
                              ? "currentColor"
                              : "none"
                          }
                        />

                        <span>
                          {starred
                            ? "Unstar"
                            : "Star"}
                        </span>
                      </button>

                      {/* Delete */}
                      <button
                        className="delete-action"
                        onClick={() =>
                          handleDelete(file.name)
                        }
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>

                    </div>
                  )}

                </div>

              </div>
            );
          })}

      </div>

    </section>
  );
}

export default FileTable;
