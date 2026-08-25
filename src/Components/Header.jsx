import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext";
import "./Header.css";

const Header = ({ onSearch, searchValue }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchValue || "");
  const { watchlist, openSurprise } = useWatchlist();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  return (
    <header className={`netflix-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-left">
        {/* Cineva Red Logo */}
        <Link to="/" className="netflix-logo">
          CINEVA
        </Link>

        {/* Primary Navigation Links */}
        <nav className="header-nav">
          <Link
            to="/"
            className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>
          <a href="#trending-row" className="nav-item">
            Trending
          </a>
          <a href="#action-row" className="nav-item">
            Movies
          </a>
          <a href="#top-rated-row" className="nav-item">
            New & Popular
          </a>
          <Link
            to="/my-list"
            className={`nav-item ${location.pathname === "/my-list" ? "active" : ""}`}
          >
            My List
            {watchlist.length > 0 && (
              <span className="nav-list-badge">{watchlist.length}</span>
            )}
          </Link>
          <button
            type="button"
            className="nav-surprise-btn"
            onClick={openSurprise}
            title="Play Something (Random Movie)"
          >
            <i className="fa-solid fa-dice"></i>
            <span>Surprise Me</span>
          </button>
        </nav>
      </div>

      <div className="header-right">
        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className={`netflix-search ${isSearchOpen ? "open" : ""}`}
        >
          <button
            type="button"
            className="search-btn-icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          <input
            type="text"
            placeholder="Titles, people, genres..."
            value={searchTerm}
            onChange={handleInputChange}
            onBlur={() => {
              if (!searchTerm) setIsSearchOpen(false);
            }}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => {
                setSearchTerm("");
                if (onSearch) onSearch("");
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </form>

        {/* My List Quick Nav Icon on Mobile */}
        <Link to="/my-list" className="mobile-list-icon" title="My List">
          <i className="fa-solid fa-bookmark"></i>
          {watchlist.length > 0 && (
            <span className="mobile-list-badge">{watchlist.length}</span>
          )}
        </Link>

        {/* Notifications Icon */}
        <div className="header-icon notification-bell">
          <i className="fa-regular fa-bell"></i>
          <span className="notification-dot"></span>
        </div>

        {/* Profile Avatar */}
        <div className="profile-menu">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
            alt="Profile Avatar"
            className="profile-avatar"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60";
            }}
          />
          <i className="fa-solid fa-caret-down caret-icon"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
