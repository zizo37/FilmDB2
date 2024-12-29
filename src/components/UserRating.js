// import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Rating from "react-rating-stars-component";
import { supabase } from '../supabaseClient';
const MovieCard = ({ movie, rating }) => {
  const navigate = useNavigate();

  const handleMovieClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="rating-card" onClick={handleMovieClick}>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="movie-poster"
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <Rating
          count={5}
          value={rating}
          size={24}
          activeColor="#fe9d00"
          isHalf={true}
          edit={false}
        />
      </div>
    </div>
  );
};


const UserRating = () => {
  // const supabaseUrl = "https://ksnouxckabitqorjucgz.supabase.co";
  // const supabaseAnonKey =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzbm91eGNrYWJpdHFvcmp1Y2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ0MzM4ODgsImV4cCI6MjAzMDAwOTg4OH0.17MF1DByop1lCcnefGB8t3AcS1CGcJvbzunwY3QbK_c";

  // const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const [session, setSession] = useState(null);
  const [movies, setMovies] = useState([]);
  const [rating, setRating] = useState([]);
  const [moviesrating, setMoviesRating] = useState([]);

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
    const fetchRatingData = async () => {
      if (session) {
        const { data, error } = await supabase
          .from("ratings")
          .select("movie_id,rating")
          .eq("user_id", session.user.id)
          .order("created_at", {
            ascending: false,
          }); // Tri par date (du plus récent au plus ancien)
        // .limit(1); // Récupère uniquement la première entrée (la plus récente)

        if (error) {
          console.error(
            "Erreur lors de la récupération des notations :",
            error.message
          );
        } else {
          console.log(data);
          setRating(data);
          // console.log(setRating);
        }
      }
    };
    fetchRatingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);
  const fetchMovieDetails = async (movieId) => {
    const options = {
      method: "GET",
      url: `https://api.themoviedb.org/3/movie/${movieId}`,
      params: {
        api_key: "b2efe9b0108d8645f514bc9b0363d199",
      },
    };

    try {
      const response = await axios.request(options);
      // setMovies((prevMovies) => [...prevMovies, response.data]);
      return response.data;

      // console.log(movies);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // useEffect(() => {
  //   const fetchMovies = async () => {
  //     for (const item of rating) {
  //       await fetchMovieDetails(item.movie_id);
  //       setMoviesRating(item.rating);
  //     }
  //   };

  //   fetchMovies();

  //   setMovies([]);
  // }, [rating]);

  useEffect(() => {
    const fetchMovies = async () => {
      const fetchedMovies = [];
      for (const item of rating) {
        const movie = await fetchMovieDetails(item.movie_id);
        if (movie) {
          fetchedMovies.push({
            ...movie,
            review: item.review,
          });
        }
      }
      setMovies(fetchedMovies);
    };

    fetchMovies();
  }, [rating]);
  return (
    <div className="section-container">
      <div className="section-header">
        <h2 className="section-title">Your Ratings</h2>
      </div>
      <div className="slider-container">
        <div className="movie-slider">
          {movies.length > 0 ? (
            movies.map((movie, index) => (
              <MovieCard
                key={`${movie.id}-${index}`}
                movie={movie}
                rating={rating[index]?.rating}
              />
            ))
          ) : (
            <div className="no-content">No rated movies yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRating;