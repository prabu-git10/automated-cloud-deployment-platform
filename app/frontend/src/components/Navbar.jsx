import { Search, Bell, UserCircle } from "lucide-react";

function Navbar({ searchTerm, setSearchTerm }) {
  return (
    <header className="navbar">

      <div className="search-box">
        <Search size={19} />

        <input
  type="text"
  placeholder="Search files..."
  value={searchTerm}
  onChange={(event) => setSearchTerm(event.target.value)}
/>
      </div>

      <div className="navbar-actions">

        <button className="icon-button">
          <Bell size={20} />
        </button>

        <div className="user-profile">
          <UserCircle size={32} />

          <div className="user-info">
            <span className="user-name">Prabu</span>
            <span className="user-role">User</span>
          </div>
        </div>

      </div>

    </header>
  );
}

export default Navbar;