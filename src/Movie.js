import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaPlus, FaMinus, FaPlay, FaTimes } from 'react-icons/fa';
import './Movie.css';
import Header from './Header';
import { supabase } from './supabaseClient';

const Movie = () => {
  const { id } = useParams();
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  

  // Check authentication status
  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error.message);
        return;
      }
      setUser(user);
    };

    getUser();
  }, []);


  const handleRating = async (rating) => {
    if (!user) {
      alert('Please sign in to rate the movie');
      return;
    }
  
    try {
      // Insérer ou mettre à jour la note de l'utilisateur pour le film
      const { error } = await supabase
        .from('ratings')
        .upsert([
          {
            user_id: user.id,
            movie_id: movieData.id.toString(),
            rating: rating
          }
        ]);
  
      if (error) throw error;
  
      setUserRating(rating); // Met à jour l'état local avec la note donnée
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating');
    }
  };

  
  const handleReviewSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
  
    if (!user) {
      alert('Please sign in to write a review');
      return;
    }
  
    if (!reviewText.trim()) {
      alert('Review text cannot be empty');
      return;
    }
  
    try {
      // Insérer un nouvel avis
      const { error } = await supabase
        .from('reviews')
        .insert([
          {
            user_id: user.id,
            movie_id: movieData.id.toString(),
            review: reviewText.trim()
          }
        ]);
  
      if (error) throw error;
  
      // Rafraîchit la liste des avis après soumission
      setReviews([
        {
          id: Math.random(), // ID temporaire
          user_id: user.id,
          movie_id: movieData.id.toString(),
          review: reviewText.trim(),
          created_at: new Date().toISOString(),
          profiles: {
            username: user.email.split('@')[0] // Exemple : nom d'utilisateur à partir de l'email
          }
        },
        ...reviews
      ]);
  
      setReviewText(''); // Réinitialise le champ d'entrée
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };
  
  
  // Fetch movie data
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=en-US&append_to_response=videos,credits`,
          {
            headers: {
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYzI3N2U4NzIyNjA4YTNjOGU1YWNjZmQ0ZTVmZDk0ZSIsInN1YiI6IjY2MTVkMjg2YWM0MTYxMDE3YzkyOTlhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCbzx_EgdSfu_R2NVoQ8pGKqwIFfm8tXz-yd3HoLJX8'
            }
          }
        );
        const data = await response.json();
        setMovieData(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch movie data');
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  // Fetch user-specific data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !movieData) return;

      try {
        // Check watchlist status
        const { data: watchlistData, error: watchlistError } = await supabase
          .from('watchlist')
          .select('*')
          .eq('user_id', user.id)
          .eq('movie_id', movieData.id.toString());

        if (watchlistError) throw watchlistError;
        setIsInWatchlist(watchlistData && watchlistData.length > 0);

        // Check user rating
        const { data: ratingData, error: ratingError } = await supabase
          .from('ratings')
          .select('rating')
          .eq('user_id', user.id)
          .eq('movie_id', movieData.id.toString());

        if (ratingError) throw ratingError;
        if (ratingData && ratingData.length > 0) {
          setUserRating(ratingData[0].rating);
        }

        // Fetch all reviews for the specific movie
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            id,
            review,
            created_at,
            user_id,
            movie_id
          `)
          .eq('movie_id', movieData.id.toString())
          .order('created_at', { ascending: false });
          console.log('Fetched reviews:', reviewsData);

        if (reviewsError) throw reviewsError;
        setReviews(reviewsData || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user, movieData]);

  const handleWatchlist = async () => {
    if (!user) {
      alert('Please sign in to manage your watchlist');
      return;
    }

    try {
      if (isInWatchlist) {
        const { error } = await supabase
          .from('watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('movie_id', movieData.id.toString());

        if (error) throw error;
        setIsInWatchlist(false);
      } else {
        const { error } = await supabase
          .from('watchlist')
          .insert([
            {
              user_id: user.id,
              movie_id: movieData.id.toString()
            }
          ]);

        if (error) throw error;
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
      alert(`Failed to ${isInWatchlist ? 'remove from' : 'add to'} watchlist`);
    }
  };

  if (loading) return (
    <>
      <Header />
      <div className="movie-container">
        <div className="loading">Loading...</div>
      </div>
    </>
  );
  
  if (error) return (
    <>
      <Header />
      <div className="movie-container">
        <div className="error">{error}</div>
      </div>
    </>
  );
  
  if (!movieData) return (
    <>
      <Header />
      <div className="movie-container">
        <div className="error">Movie not found</div>
      </div>
    </>
  );

  const trailerVideo = movieData.videos?.results?.find(
    video => video.type === "Trailer" && video.site === "YouTube"
  );

  return (
    <>
    <Header />
    <div className="movie-container">
      
      {/* Hero Section with Backdrop */}
      <div 
        className="movie-hero"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movieData.backdrop_path})`
        }}
      >
        <div className="hero-content">
          <h1 className="movie-title">{movieData.title}</h1>
          <div className="movie-meta">
            <div className="rating-badge">
              <FaStar /> {movieData.vote_average?.toFixed(1)}
            </div>
            {movieData.release_date && (
              <span>{movieData.release_date.slice(0, 4)}</span>
            )}
            {movieData.runtime && (
              <span>{movieData.runtime} min</span>
            )}
          </div>
          <div className="movie-actions">
            {trailerVideo && (
              <button 
                className="action-button primary-button"
                onClick={() => setShowTrailer(true)}
              >
                <FaPlay /> Watch Trailer
              </button>
            )}
            <button 
              className="action-button secondary-button"
              onClick={handleWatchlist}
            >
              {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="movie-content">
        <div className="content-grid">
          <div className="movie-poster">
            <img 
              src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`}
              alt={movieData.title}
              style={{ width: '100%', borderRadius: '12px' }}
            />
          </div>
          
          <div className="movie-info">
            <h2>Overview</h2>
            <p className="movie-plot">{movieData.overview}</p>
            
            <div className="info-grid">
              {movieData.credits?.crew && (
                <div className="info-item">
                  <div className="info-label">Director</div>
                  <div>{movieData.credits.crew.find(person => person.job === 'Director')?.name || 'N/A'}</div>
                </div>
              )}
              {movieData.credits?.cast && (
                <div className="info-item">
                  <div className="info-label">Cast</div>
                  <div>{movieData.credits.cast.slice(0, 3).map(actor => actor.name).join(', ')}</div>
                </div>
              )}
              {movieData.genres && (
                <div className="info-item">
                  <div className="info-label">Genres</div>
                  <div>{movieData.genres.map(genre => genre.name).join(', ')}</div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
              <div className="reviews-header">
                <h2 className="reviews-title">Reviews</h2>
              </div>
              
              {user ? (
                <form className="review-form" onSubmit={handleReviewSubmit}>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your review..."
                    className="review-input"
                  />
                  <button type="submit" className="action-button primary-button">
                    Submit Review
                  </button>
                </form>
              ) : (
                <p className="login-prompt">Please sign in to write a review</p>
              )}

            <div className="reviews-list">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <span className="review-author">
                            {review.user_id.substring(0, 8)}
                          </span>
                          <span className="review-date">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="review-content">{review.review}</p>
                      </div>
                    ))
                  ) : (
                    <p className="no-reviews">No reviews yet. Be the first to write one!</p>
                  )}
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailerVideo && (
        <div className={`trailer-modal ${showTrailer ? 'active' : ''}`}>
          <div className="trailer-container">
            <button 
              className="close-trailer"
              onClick={() => setShowTrailer(false)}
            >
              <FaTimes />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1`}
              title="Movie Trailer"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Movie;