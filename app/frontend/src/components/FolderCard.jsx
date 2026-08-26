import { Folder } from "lucide-react";

function FolderCard({ name, items }) {
  return (
    <div className="folder-card">

      <div className="folder-icon">
        <Folder size={24} />
      </div>

      <div className="folder-info">
        <h3>{name}</h3>
        <span>{items} items</span>
      </div>

    </div>
  );
}

export default FolderCard;