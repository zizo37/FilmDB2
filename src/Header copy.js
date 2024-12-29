import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import "./App.css";
import "./headerStyle.css";
import "./searchResultsDropdown.css";

function Header() {
  const supabase = createClient(
    "https://ksnouxckabitqorjucgz.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzbm91eGNrYWJpdHFvcmp1Y2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ0MzM4ODgsImV4cCI6MjAzMDAwOTg4OH0.17MF1DByop1lCcnefGB8t3AcS1CGcJvbzunwY3QbK_c"
  );

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mediaType, setMediaType] = useState("movie");
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user data:", error.message);
      } else {
        setUser(user);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm) {
        setSearchResults([]);
        return;
      }

      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYzI3N2U4NzIyNjA4YTNjOGU1YWNjZmQ0ZTVmZDk0ZSIsInN1YiI6IjY2MTVkMjg2YWM0MTYxMDE3YzkyOTlhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCbzx_EgdSfu_R2NVoQ8pGKqwIFfm8tXz-yd3HoLJX8",
        },
      };

      try {
        const url =
          mediaType === "movie"
            ? `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&query=${searchTerm}`
            : `https://api.themoviedb.org/3/search/tv?include_adult=false&language=en-US&page=1&query=${searchTerm}`;

        const response = await fetch(url, options);
        const data = await response.json();
        setSearchResults(data.results || []);
        console.log(data.results);
      } catch (error) {
        console.error(error);
      }
    };

    const delayDebounceFn = setTimeout(fetchSearchResults, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, mediaType]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("User signed out");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm.trim()}&type=${mediaType}`);
      setShowSearchResults(false);
    }
  };

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
    setShowSearchResults(true);
  };

  const handleSearchResultClick = (result) => {
    navigate(`/${mediaType}/${result.id}`, { state: result });
    setSearchTerm("");
    setShowSearchResults(false);
  };

  const handleSearchBlur = (e) => {
    setTimeout(() => {
      setShowSearchResults(false);
    }, 100);
  };

  const handleSearchFocus = () => {
    setShowSearchResults(true);
  };


  return (
    <>
      <header className="app-bar">
        <Link to="/" className="logo-link">
          <img
            className="app-bar__logo logo"
            src="filmdb.png"
            alt="logo"
            style={{ width: "100px" }}
          />
        </Link>
        <div className="app-bar__menu" onClick={toggleMenu}>
          <i className="bi bi-list"></i> {/* Bootstrap icon */}
          <span>Menu</span>
        </div>

        {/* {menuOpen && (
          <div className="header-menu">
            <ul className="menu-list">
              <li className="menu-item">
                <Link to="#" onClick={() => setMediaType("movie")} className={`toggle-button ${mediaType === "movie" ? "active" : ""}`}>
                  Movies
                </Link>
              </li>
              <li className="menu-item">
                <Link to="#" onClick={() => setMediaType("tv")} className={`toggle-button ${mediaType === "tv" ? "active" : ""}`}>
                  Series
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/popular">Popular</Link>
              </li>
              <li className="menu-item">
                <Link to="/toprated">Top Rated</Link>
              </li>
              <li className="menu-item">
                <Link to="/watchlist">Watchlist</Link>
              </li>
            </ul>
          </div>
        )} */}

        {menuOpen && (
          <div className="header-menu">
            <ul className="menu-list">
              <li className="menu-item">
                <Link to="/popular">
                  <i className="bi bi-star"></i> Popular
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/toprated">
                  <i className="bi bi-trophy"></i> Top Rated
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/watchlist">
                  <i className="bi bi-bookmark"></i> Watchlist
                </Link>
              </li>

            </ul>
          </div>
        )}

        <div className="search-container">
          <div
            className="search-type-selector"
            onClick={() => setSearchDropdownOpen(!searchDropdownOpen)}
          >
            <span>{mediaType === "movie" ? "Movies" : "TV Series"}</span>
            <i className="bi bi-chevron-down"></i>
            {searchDropdownOpen && (
              <div className="search-type-dropdown">
                <div
                  className={`search-type-option ${mediaType === "movie" ? "active" : ""
                    }`}
                  onClick={() => {
                    setMediaType("movie");
                    setSearchDropdownOpen(false);
                  }}
                >
                  Movies
                </div>
                <div
                  className={`search-type-option ${mediaType === "tv" ? "active" : ""
                    }`}
                  onClick={() => {
                    setMediaType("tv");
                    setSearchDropdownOpen(false);
                  }}
                >
                  TV Series
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder={`Search ${mediaType === "movie" ? "Movies" : "TV Series"
                }...`}
              value={searchTerm}
              onChange={handleSearchInput}
              onBlur={handleSearchBlur}
              onFocus={handleSearchFocus}
            />
            <button type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>

          {showSearchResults && searchResults.length > 0 && (
            <div className="search-results-dropdown">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="search-result-item d-flex align-items-center"
                  onMouseDown={() => handleSearchResultClick(result)}
                >
                  {result.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185/${result.poster_path}`}
                      alt={mediaType === "movie" ? result.title : result.name}
                      className="search-result-image"
                    />
                  ) : (
                    <div className="no-image-placeholder">No Image</div>
                  )}
                  <span>
                    {mediaType === "movie" ? result.title : result.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="app-bar__watchlist">
          <Link to="/watchlist" className="nav-link">
            <span>Watchlist</span>
          </Link>
        </div>

        {user ? (
          <div className="logout-container">
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
            <Link to="/user" className="nav-link">
              <span>Profil</span>
            </Link>
          </div>
        ) : (
          <div className="app-bar__sign-in">
            <Link to="/signin" className="nav-link">
              <span>Sign In</span>
            </Link>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;