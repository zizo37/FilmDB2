import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { supabase } from '../supabaseClient';
import axios from "axios";


const MovieCard = ({ movie, review, create }) => {
  const navigate = useNavigate();

  const handleMovieClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movie-card" onClick={handleMovieClick}>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="movie-poster"
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-date">
          {create.substr(0, 10)} {create.substr(12, 4)}
        </p>
        <p className="movie-review">{review}</p>
      </div>
    </div>
  );
};


const UserReview = () => {
  // const supabaseUrl = "https://ksnouxckabitqorjucgz.supabase.co";
  // const supabaseAnonKey =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtzbm91eGNrYWJpdHFvcmp1Y2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ0MzM4ODgsImV4cCI6MjAzMDAwOTg4OH0.17MF1DByop1lCcnefGB8t3AcS1CGcJvbzunwY3QbK_c";

  // const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const [session, setSession] = useState(null);
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);

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
    const fetchReviewData = async () => {
      if (session) {
        const { data, error } = await supabase
          .from("reviews")
          .select("movie_id, review, created_at")
          .eq("user_id", session.user.id)
          .order("created_at", {
            ascending: false,
          });

        if (error) {
          console.error("Error fetching reviews:", error.message);
        } else {
          setReviews(data);
        }
      }
    };

    fetchReviewData();
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
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      const fetchedMovies = [];
      for (const item of reviews) {
        const movie = await fetchMovieDetails(item.movie_id);
        if (movie) {
          fetchedMovies.push({
            ...movie,
            review: item.review,
            created_at: item.created_at,
          });
        }
      }
      setMovies(fetchedMovies);
    };

    fetchMovies();
  }, [reviews]);

  return (
    <div className="section-container">
      <div className="section-header">
        <h2 className="section-title">Your Reviews</h2>
      </div>
      <div className="movie-grid">
        {movies ? (
          movies.map((movie, index) => (
            <MovieCard
              key={`${movie.id}-${index}`}
              movie={movie}
              review={movie.review}
              create={movie.created_at}
            />
          ))
        ) : (
          <div className="no-content">No movie reviews yet</div>
        )}
      </div>
    </div>
  );
};

export default UserReview;