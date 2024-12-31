import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MovieDetails from './MovieDetails';
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import './Content.css';
import { Link } from "react-router-dom";

const Content = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);
  const [popularshowAll, setPopularshowAll] = useState(false);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedSeries, setTopRatedSeries] = useState([]);
  const [topRatedshowAll, setTopRatedshowAll] = useState(false);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [upcomingshowAll, setUpcomingshowAll] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const [autoSlideInterval, setAutoSlideInterval] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
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
        setPopularMovies(popularshowAll ? response.data.results : response.data.results.slice(0, 4));
        console.log(response.data.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovies();
  }, [popularshowAll]);



  useEffect(() => {
    const fetchSeries = async () => {
      const options = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/tv/popular?language=en-US&page=1',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNjQ0Y2JiMzI5MDgyZTk1OTAzZDk2ZjEyODNlM2I2OSIsInN1YiI6IjY2MmVjZjllYTgwNjczMDEyYmU4Zjk1ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nYL5Y57gkbQgzUIyklXYX8Hft8YIQH4XvX85IHGgCXk'
        }
      };
      try {
        const response = await axios.request(options);
        setPopularSeries(popularshowAll ? response.data.results : response.data.results.slice(0, 4));
        console.log(response.data.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSeries();
  }, [popularshowAll]);

  useEffect(() => {
    const fetchMovies = async () => {
      const options = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNjQ0Y2JiMzI5MDgyZTk1OTAzZDk2ZjEyODNlM2I2OSIsInN1YiI6IjY2MmVjZjllYTgwNjczMDEyYmU4Zjk1ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nYL5Y57gkbQgzUIyklXYX8Hft8YIQH4XvX85IHGgCXk'
        }
      };
      try {
        const response = await axios.request(options);
        setTopRatedMovies(topRatedshowAll ? response.data.results : response.data.results.slice(0, 4));
        console.log(response.data.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovies();
  }, [topRatedshowAll]);


  useEffect(() => {
    const fetchSeries = async () => {
      const options = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNjQ0Y2JiMzI5MDgyZTk1OTAzZDk2ZjEyODNlM2I2OSIsInN1YiI6IjY2MmVjZjllYTgwNjczMDEyYmU4Zjk1ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nYL5Y57gkbQgzUIyklXYX8Hft8YIQH4XvX85IHGgCXk'
        }
      };
      try {
        const response = await axios.request(options);
        setTopRatedSeries(topRatedshowAll ? response.data.results : response.data.results.slice(0, 4));
        console.log(response.data.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSeries();
  }, [topRatedshowAll]);

  useEffect(() => {
    const fetchMovies = async () => {
      const options = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNjQ0Y2JiMzI5MDgyZTk1OTAzZDk2ZjEyODNlM2I2OSIsInN1YiI6IjY2MmVjZjllYTgwNjczMDEyYmU4Zjk1ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nYL5Y57gkbQgzUIyklXYX8Hft8YIQH4XvX85IHGgCXk'
        }
      };
      try {
        const response = await axios.request(options);
        setUpcomingMovies(upcomingshowAll ? response.data.results : response.data.results.slice(0, 4));
        console.log(response.data.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovies();
  }, [upcomingshowAll]);

  const popularHandleShowAll = () => {
    setPopularshowAll(!popularshowAll);
  };

  const topRatedHandleShowAll = () => {
    setTopRatedshowAll(!topRatedshowAll);
  };

  const upcomingHandleShowAll = () => {
    setUpcomingshowAll(!upcomingshowAll);
  };

  const handleMovieDetails = (movie) => {
    setSelectedMovie(movie);
  };

  const startAutoSlide = () => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 4000); // Change slide every 3 seconds
    setAutoSlideInterval(interval);
  };

  const stopAutoSlide = () => {
    clearInterval(autoSlideInterval);
  };

  const handlePrevSlide = () => {
    stopAutoSlide();
    setCurrentSlide(currentSlide === 0 ? upcomingMovies.length - 1 : currentSlide - 1);
  };

  const handleNextSlide = () => {
    stopAutoSlide();
    setCurrentSlide((prevSlide) => {
      const isLastSlide = prevSlide === upcomingMovies.length - 1;
      return isLastSlide ? 0 : prevSlide + 1;
    });
  };

  useEffect(() => {
    startAutoSlide();
    return () => {
      stopAutoSlide();
    };
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
  }, [currentSlide]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
  }, [currentSlide]);


    return (
      <>
        <section className="slider-section">
          <h2 className="section-title">Upcoming Movies</h2>
          <div className="slider-container">
            <div className="slider" ref={sliderRef}>
              {upcomingMovies.map((movie, index) => (
                <div className="slide" key={index}>
                  <img
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    style={{ width: '100%', height: '600px', objectFit: 'cover' }}
                  />
                  <div className="slide-content">
                    <h3 className="slide-title">{movie.title}</h3>
                    <div className="slide-info">
                      <span className="rating-badge">
                        <FaStar /> {movie.vote_average.toFixed(1)}
                      </span>
                      <span>{movie.release_date.slice(0, 4)}</span>
                    </div>
                    <button
                      className="show-more-btn"
                      onClick={() => handleMovieDetails(movie)}
                    >
                      More Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="slider-controls">
              <button className="slider-btn" onClick={handlePrevSlide}>
                <FaChevronLeft />
              </button>
              <button className="slider-btn" onClick={handleNextSlide}>
                <FaChevronRight />
              </button>
            </div>
          </div>
        </section>
  
        <section className="movies-section">
          <h2 className="section-title">Popular Movies</h2>
          <div className="movies-grid">
            {popularMovies.map((movie, index) => (
              <div
                className="movie-card"
                key={index}
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.poster_path})`
                }}
              >
                <div className="movie-overlay">
                  <h3 className="movie-title">{movie.title}</h3>
                  <div className="movie-rating">
                    <FaStar className="rating-star" />
                    <span>{movie.vote_average.toFixed(1)}</span>
                  </div>
                  <button
                    className="show-more-btn"
                    onClick={() => handleMovieDetails(movie)}
                  >
                    More Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Link to="/popular"><button className="show-more-btn" >
            {/* {popularshowAll ? 'Show Less' : 'Show More'} */}
            Show More
          </button></Link>
        </section>



        <section className="movies-section">
          <h2 className="section-title">Popular Series</h2>
          <div className="movies-grid">
            {popularSeries.map((movie, index) => (
              <div
                className="movie-card"
                key={index}
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.poster_path})`
                }}
              >
                <div className="movie-overlay">
                  <h3 className="movie-title">{movie.name}</h3>
                  <div className="movie-rating">
                    <FaStar className="rating-star" />
                    <span>{movie.vote_average.toFixed(1)}</span>
                  </div>
                  <button
                    className="show-more-btn"
                    onClick={() => handleMovieDetails(movie)}
                  >
                    More Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Link to="/popularS"><button className="show-more-btn" >
            {/* {popularshowAll ? 'Show Less' : 'Show More'} */}
            Show More
          </button></Link>
        </section>
  
        <section className="movies-section">
          <h2 className="section-title">Top Rated Movies</h2>
          <div className="movies-grid">
            {topRatedMovies.map((movie, index) => (
              <div
                className="movie-card"
                key={index}
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.poster_path})`
                }}
              >
                <div className="movie-overlay">
                  <h3 className="movie-title">{movie.title}</h3>
                  <div className="movie-rating">
                    <FaStar className="rating-star" />
                    <span>{movie.vote_average.toFixed(1)}</span>
                  </div>
                  <button
                    className="show-more-btn"
                    onClick={() => handleMovieDetails(movie)}
                  >
                    More Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Link to="/toprated"><button className="show-more-btn" >
            {/* {popularshowAll ? 'Show Less' : 'Show More'} */}
            Show More
          </button></Link>
        </section>



        <section className="movies-section">
          <h2 className="section-title">Top Rated Series</h2>
          <div className="movies-grid">
            {topRatedSeries.map((movie, index) => (
              <div
                className="movie-card"
                key={index}
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.poster_path})`
                }}
              >
                <div className="movie-overlay">
                  <h3 className="movie-title">{movie.name}</h3>
                  <div className="movie-rating">
                    <FaStar className="rating-star" />
                    <span>{movie.vote_average.toFixed(1)}</span>
                  </div>
                  <button
                    className="show-more-btn"
                    onClick={() => handleMovieDetails(movie)}
                  >
                    More Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="show-more-btn" onClick={topRatedHandleShowAll}>
            {topRatedshowAll ? 'Show Less' : 'Show More'}
          </button>
        </section>
  
        {selectedMovie && (
          <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
        )}
      </>
  );
};

export default Content;
