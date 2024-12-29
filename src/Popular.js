import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header';
import './Popular.css';
import Footer from './Footer';
import ChatbotApp from './MovieChatbot/ChatbotApp';

const Popular = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      const options = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNjQ0Y2JiMzI5MDgyZTk1OTAzZDk2ZjEyODNlM2I2OSIsInN1YiI6IjY2MmVjZjllYTgwNjczMDEyYmU4Zjk1ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nYL5Y57gkbQgzUIyklXYX8Hft8YIQH4XvX85IHGgCXk'
        }
      };

      try {
        const response = await axios.request(options);
        setPopularMovies(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYzI3N2U4NzIyNjA4YTNjOGU1YWNjZmQ0ZTVmZDk0ZSIsInN1YiI6IjY2MTVkMjg2YWM0MTYxMDE3YzkyOTlhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCbzx_EgdSfu_R2NVoQ8pGKqwIFfm8tXz-yd3HoLJX8'
        }
      };

      try {
        const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list?language=en', options);
        setGenres(response.data.genres);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreClick = (genreId) => {
    setSelectedGenres(prev => 
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const filteredMovies = selectedGenres.length > 0
    ? popularMovies.filter(movie =>
        movie.genre_ids.some(id => selectedGenres.includes(id))
      )
    : popularMovies;

  return (
    <>
      <Header />
      <div className="movie-container">
        <h1 className="page-title">Popular Movies</h1>
        
        <div className="genre-filter">
          <h3>Filter by Genre</h3>
          <div className="genre-buttons">
            {genres.map(genre => (
              <button
                key={genre.id}
                onClick={() => handleGenreClick(genre.id)}
                className={`genre-btn ${selectedGenres.includes(genre.id) ? 'active' : ''}`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        <div className="movies-grid">
          {loading ? (
            <div className="no-results">Loading movies...</div>
          ) : filteredMovies.length === 0 ? (
            <div className="no-results">No movies found for selected genres</div>
          ) : (
            filteredMovies.map(movie => {
              const { id, title, poster_path, vote_average } = movie;
              const imageUrl = `https://image.tmdb.org/t/p/w500${poster_path}`;
              const movieLink = `/movie/${id}`;

              return (
                <div className="movie-wrapper" key={id}>
                  <Link to={movieLink}>
                    <div
                      className="movie-card"
                      style={{
                        backgroundImage: `url(${imageUrl})`,
                      }}
                    >
                      <div className="hover-overlay">
                        <h3 className="movie-title">{title}</h3>
                        <div className="movie-rating">
                          <i className="bi bi-star-fill rating-star"></i>
                          <span>{vote_average.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
      <Footer />
      <ChatbotApp/>
    </>
  );
};

export default Popular;