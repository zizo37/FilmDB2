import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { supabase } from '../supabaseClient';

const UserWatchlist = () => {
  const [session, setSession] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching user data:", error.message);
      } else {
        setSession(data.session);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (session) {
      const fetchWatchlistData = async () => {
        const { data, error } = await supabase
          .from("watchlist")
          .select("movie_id")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching watchlist:", error.message);
        } else {
          setWatchlist(data);
        }
      };
      fetchWatchlistData();
    }
  }, [session]);

  useEffect(() => {
    const fetchMovieDetails = async (movieId) => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=b2efe9b0108d8645f514bc9b0363d199`
        );
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    };

    const fetchAllMovies = async () => {
      setMovies([]); // Reset movies before fetching
      const movieDetails = await Promise.all(
        watchlist.map(item => fetchMovieDetails(item.movie_id))
      );
      setMovies(movieDetails.filter(movie => movie !== null));
    };

    if (watchlist.length > 0) {
      fetchAllMovies();
    }
  }, [watchlist]);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <section className="movies-section">
      <h2 className="section-title">Your Watchlist</h2>
      <div className="movies-grid">
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <div
              className="movie-card"
              key={`${movie.id}-${index}`}
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.poster_path})`
              }}
              onClick={() => handleMovieClick(movie.id)}
            >
              <div className="movie-overlay">
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-rating">
                <FaStar className="rating-star" />
                <span>{movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</span>
              </div>

                <button className="show-more-btn">
                  More Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-watchlist">
            <h3>No movies in your watchlist</h3>
            <p>Start adding movies to keep track of what you want to watch!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserWatchlist;