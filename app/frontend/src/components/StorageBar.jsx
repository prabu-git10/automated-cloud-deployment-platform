import { useEffect, useState } from "react";
import { HardDrive } from "lucide-react";

function StorageBar({ refreshKey }) {
  const totalStorage = 100;

  const [usedBytes, setUsedBytes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStorageUsage = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/files/storage"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch storage usage");
      }

      const data = await response.json();

      if (data.success) {
        setUsedBytes(data.storage.totalBytes);
      } else {
        throw new Error("Failed to load storage usage");
      }
    } catch (error) {
      console.error("Storage usage error:", error);
      setError("Unable to load storage.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchStorageUsage();
}, [refreshKey]);

  // Convert bytes to GB
  const usedStorage =
    usedBytes / (1024 * 1024 * 1024);

  const usagePercentage =
    Math.min((usedStorage / totalStorage) * 100, 100);

  const remainingStorage =
    Math.max(totalStorage - usedStorage, 0);

  return (
    <div className="storage-card">

      <div className="storage-header">

        <div className="storage-title">
          <HardDrive size={20} />
          <span>Storge</span>
        </div>

        <span className="storage-percentage">
          {loading
            ? "..."
            : `${usagePercentage.toFixed(2)}%`}
        </span>

      </div>

      {error ? (
        <div className="storage-info">
          <span>{error}</span>
        </div>
      ) : (
        <>
          <div className="storage-info">

            <strong>
              {loading
                ? "..."
                : `${usedStorage.toFixed(2)} GB`}
            </strong>

            <span>
              of {totalStorage} GB used
            </span>

          </div>

          <div className="storage-track">

            <div
              className="storage-progress"
              style={{
                width: `${usagePercentage}%`,
              }}
            ></div>

          </div>

          <p className="storage-description">

            {loading
              ? "Calculating storage usage..."
              : `You have ${remainingStorage.toFixed(
                  2
                )} GB of storage remaining.`}

          </p>
        </>
      )}

    </div>
  );
}

export default StorageBar;
