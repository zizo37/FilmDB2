import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { FaStar, FaThList, FaThLarge } from "react-icons/fa";
import Header from './Header';
import './Watchlist.css';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [user, setUser] = useState(null);
  const [movieData, setMovieData] = useState([]);
  const [sortedMovieData, setSortedMovieData] = useState([]);
  const [sortOption, setSortOption] = useState('date');
  const [view, setView] = useState('grid');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Error fetching user data:', userError);
        } else {
          setUser(userData.user || null);
        }

        const { data: watchlistData, error: watchlistError } = await supabase
          .from('watchlist')
          .select('*')
          .eq('user_id', userData.user?.id);

        if (watchlistError) {
          console.error('Error fetching watchlist data:', watchlistError);
        } else {
          setWatchlist(watchlistData || []);
        }

        const movieDataPromises = watchlistData.map(async (item) => {
          const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYzI3N2U4NzIyNjA4YTNjOGU1YWNjZmQ0ZTVmZDk0ZSIsInN1YiI6IjY2MTVkMjg2YWM0MTYxMDE3YzkyOTlhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCbzx_EgdSfu_R2NVoQ8pGKqwIFfm8tXz-yd3HoLJX8'
            }
          };

          try {
            const response = await fetch(
              `https://api.themoviedb.org/3/movie/${item.movie_id}?language=en-US`,
              options
            );
            const data = await response.json();
            return data;
          } catch (error) {
            console.error('Error fetching movie data:', error);
            return null;
          }
        });

        const resolvedMovieData = await Promise.all(movieDataPromises);
        setMovieData(resolvedMovieData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const sortMovies = () => {
      let sortedMovies = [...movieData];
      if (sortOption === 'date') {
        sortedMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      } else if (sortOption === 'rating') {
        sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
      } else if (sortOption === 'alphabetical') {
        sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
      }
      setSortedMovieData(sortedMovies);
    };

    sortMovies();
  }, [sortOption, movieData]);

  const handleImageClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <>
      <Header />
      <div className="watchlist-container">
        <div className="watchlist-header">
          <h2 className="section-title">Your Watchlist</h2>
          <div className="watchlist-controls">
            <div className="sort-control">
              <select
                className="sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="rating">Sort by Rating</option>
                <option value="alphabetical">Sort by Title</option>
              </select>
            </div>
            <div className="view-controls">
              <button
                className={`view-btn ${view === 'list' ? 'active' : ''}`}
                onClick={() => setView('list')}
              >
                <FaThList />
              </button>
              <button
                className={`view-btn ${view === 'grid' ? 'active' : ''}`}
                onClick={() => setView('grid')}
              >
                <FaThLarge />
              </button>
            </div>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="movies-grid">
            {sortedMovieData.map((movie, index) =>
  movie && movie.vote_average && movie.release_date ? (
    <div
      className="movie-card"
      key={watchlist[index].id}
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/w500/${movie.poster_path})`
      }}
      onClick={() => handleImageClick(movie.id)}
    >
      <div className="movie-overlay">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-rating">
          <FaStar className="rating-star" />
          <span>{movie.vote_average?.toFixed(1)}</span>
        </div>
        <div className="movie-year">{movie.release_date.substr(0, 4)}</div>
        <div className="movie-genres">
          {movie.genres?.slice(0, 3).map((genre) => (
            <span key={genre.id} className="genre-tag">
              {genre.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  ) : null
)}
          </div>
        ) : (
          <div className="movies-list">
            {sortedMovieData.map((movie, index) =>
  movie && movie.vote_average && movie.release_date ? (
    <div className="list-item" key={watchlist[index].id}>
                  <div className="list-item-poster" onClick={() => handleImageClick(movie.id)}>
                    <img
                      src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                      alt={movie.title}
                    />
                  </div>
                  <div className="list-item-content">
                    <h3 className="list-item-title">{movie.title}</h3>
                    <div className="list-item-meta">
                    <div className="movie-rating">
        <FaStar className="rating-star" />
        <span>{movie.vote_average?.toFixed(1)}</span>
      </div>
                      <span className="list-item-year">{movie.release_date.substr(0, 4)}</span>
                    </div>
                    <p className="list-item-overview">{movie.overview}</p>
                    <div className="list-item-genres">
                      {movie.genres.map((genre) => (
                        <span key={genre.id} className="genre-tag">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Watchlist;