import {
  Files,
  Clock3,
  Star,
  Trash2,
  Settings
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <div className="logo-icon">
          <Files size={22} />
        </div>

        <h2>CloudDrive</h2>
      </div>

      <nav className="sidebar-nav">

        <a href="#" className="nav-item active">
          <Files size={19} />
          <span>My Files</span>
        </a>

        <a href="#" className="nav-item">
          <Clock3 size={19} />
          <span>Recent</span>
        </a>

        <a href="#" className="nav-item">
          <Star size={19} />
          <span>Starred</span>
        </a>

        <a href="#" className="nav-item">
          <Trash2 size={19} />
          <span>Trash</span>
        </a>

      </nav>

      <div className="sidebar-bottom">

        <a href="#" className="nav-item">
          <Settings size={19} />
          <span>Settings</span>
        </a>

      </div>

    </aside>
  );
}

export default Sidebar;