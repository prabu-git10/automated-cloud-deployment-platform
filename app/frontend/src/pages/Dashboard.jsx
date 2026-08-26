import { useState } from "react";
import { Upload } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StorageBar from "../components/StorageBar";
import FolderCard from "../components/FolderCard";
import FileTable from "../components/FileTable";
import UploadModal from "../components/UploadModal";

function Dashboard() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Used to refresh files and storage after upload/delete
  const [refreshKey, setRefreshKey] = useState(0);

  // Trigger refresh
  const handleRefresh = () => {
    setRefreshKey((previousKey) => previousKey + 1);
  };

  return (
    <div className="app-layout">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Application Area */}
      <main className="main-content">

        {/* Top Navigation */}
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Dashboard Content */}
        <section className="dashboard-content">

          {/* Dashboard Heading */}
          <div className="dashboard-heading">

            <div>
              <h1>My Files</h1>

              <p>
                Manage your files securely in the cloud.
              </p>
            </div>

            <button
              className="upload-main-button"
              onClick={() => setIsUploadOpen(true)}
            >
              <Upload size={18} />
              Upload
            </button>

          </div>

          {/* Storage */}
          <StorageBar refreshKey={refreshKey} />

          {/* Folders */}
          <section className="folders-section">

            <div className="section-header">

              <h2>Folders</h2>

              <button className="view-all-button">
                View all
              </button>

            </div>

            <div className="folders-grid">

              <FolderCard
                name="Projects"
                items={12}
              />

              <FolderCard
                name="Documents"
                items={8}
              />

              <FolderCard
                name="Certificates"
                items={5}
              />

              <FolderCard
                name="Internship"
                items={15}
              />

            </div>

          </section>

          {/* Files */}
          <FileTable
            searchTerm={searchTerm}
            refreshKey={refreshKey}
          />

        </section>

      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={() => {
          setIsUploadOpen(false);
          handleRefresh();
        }}
      />

    </div>
  );
}

export default Dashboard;