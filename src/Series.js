// Series.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaPlus, FaMinus, FaPlay, FaTimes } from 'react-icons/fa';
import './Series.css'; // We can reuse the Movie.css styles
import Header from './Header';
import { supabase } from './supabaseClient';

const Series = () => {
  const { id } = useParams();
  const [seriesData, setSeriesData] = useState(null);
  const [castData, setCastData] = useState([]);
  const [imagesData, setImagesData] = useState({ backdrops: [], posters: [] });
  const [videosData, setVideosData] = useState([]);
  const [awardsData, setAwardsData] = useState([]);
  const [soundtrackData, setSoundtrackData] = useState([]);
  const [selectedMediaType, setSelectedMediaType] = useState('images');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);

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

  // Fetch series data
  useEffect(() => {
    const fetchSeriesData = async () => {
      try {
        // Fetch series details
        const seriesResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?language=en-US&append_to_response=videos`,
          {
            headers: {
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYzI3N2U4NzIyNjA4YTNjOGU1YWNjZmQ0ZTVmZDk0ZSIsInN1YiI6IjY2MTVkMjg2YWM0MTYxMDE3YzkyOTlhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCbzx_EgdSfu_R2NVoQ8pGKqwIFfm8tXz-yd3HoLJX8'
            }
          }
        );
        const seriesData = await seriesResponse.json();
        setSeriesData(seriesData);

        // Fetch cast data
        const castResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/credits`,
          {
            headers: {
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYzI3N2U4NzIyNjA4YTNjOGU1YWNjZmQ0ZTVmZDk0ZSIsInN1YiI6IjY2MTVkMjg2YWM0MTYxMDE3YzkyOTlhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCbzx_EgdSfu_R2NVoQ8pGKqwIFfm8tXz-yd3HoLJX8'
            }
          }
        );
        const castData = await castResponse.json();
        setCastData(castData.cast || []);

        setLoading(false);
      } catch (error) {
        setError('Failed to fetch series data');
        setLoading(false);
      }
    };

    fetchSeriesData();
  }, [id]);


  useEffect(() => {
    const fetchAllSeriesData = async () => {
      try {
        const headers = {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYzI3N2U4NzIyNjA4YTNjOGU1YWNjZmQ0ZTVmZDk0ZSIsInN1YiI6IjY2MTVkMjg2YWM0MTYxMDE3YzkyOTlhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCbzx_EgdSfu_R2NVoQ8pGKqwIFfm8tXz-yd3HoLJX8'
        };

        // Fetch basic series info
        const seriesResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?language=en-US&append_to_response=videos,content_ratings,keywords`,
          { headers }
        );
        const seriesData = await seriesResponse.json();
        setSeriesData(seriesData);

        // Fetch cast and crew with full details
        const creditsResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/aggregate_credits`,
          { headers }
        );
        const creditsData = await creditsResponse.json();
        setCastData(creditsData.cast || []);

        // Fetch images
        const imagesResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/images`,
          { headers }
        );
        const imagesData = await imagesResponse.json();
        setImagesData(imagesData);

        // Fetch videos (trailers, behind-the-scenes, etc.)
        const videosResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/videos`,
          { headers }
        );
        const videosData = await videosResponse.json();
        setVideosData(videosData.results || []);

        // Fetch external IDs for additional data
        const externalIdsResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/external_ids`,
          { headers }
        );
        const externalIds = await externalIdsResponse.json();

        setLoading(false);
      } catch (error) {
        setError('Failed to fetch series data');
        setLoading(false);
      }
    };

    fetchAllSeriesData();
  }, [id]);

  const handleVideoPlay = (videoKey) => {
    const url = `https://www.youtube.com/watch?v=${videoKey}`;
    window.open(url, '_blank'); // Ouvre la vidéo dans un nouvel onglet
  };
  

  const renderMediaSection = () => {
    switch (selectedMediaType) {
      case 'images':
        return (
          <div className="media-grid">
            {imagesData.backdrops.slice(0, 9).map((image, index) => (
              <div key={index} className="media-item">
                <img
                  src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                  alt={`Series still ${index + 1}`}
                  className="media-image"
                />
              </div>
            ))}
          </div>
        );
      case 'videos':
        return (
          <div className="videos-grid">
            {videosData.map((video, index) => (
              <div key={index} className="video-card">
                <h4>{video.name}</h4>
                <p>{video.type}</p>
                <button
                  className="action-button primary-button"
                  onClick={() => handleVideoPlay(video.key)}
                >
                  <FaPlay /> Watch
                </button>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Fetch user-specific data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !seriesData) return;

      try {
        // Check watchlist status
        const { data: watchlistData, error: watchlistError } = await supabase
          .from('watchlist')
          .select('*')
          .eq('user_id', user.id)
          .eq('series_id', seriesData.id.toString());

        if (watchlistError) throw watchlistError;
        setIsInWatchlist(watchlistData && watchlistData.length > 0);

        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            id,
            review,
            created_at,
            user_id,
            series_id
          `)
          .eq('series_id', seriesData.id.toString())
          .order('created_at', { ascending: false });

        if (reviewsError) throw reviewsError;
        setReviews(reviewsData || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user, seriesData]);

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
          .eq('series_id', seriesData.id.toString());

        if (error) throw error;
        setIsInWatchlist(false);
      } else {
        const { error } = await supabase
          .from('watchlist')
          .insert([
            {
              user_id: user.id,
              series_id: seriesData.id.toString()
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please sign in to write a review');
      return;
    }

    if (!reviewText.trim()) {
      alert('Review text cannot be empty');
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .insert([
          {
            user_id: user.id,
            series_id: seriesData.id.toString(),
            review: reviewText.trim()
          }
        ]);

      if (error) throw error;

      setReviews([
        {
          id: Math.random(),
          user_id: user.id,
          series_id: seriesData.id.toString(),
          review: reviewText.trim(),
          created_at: new Date().toISOString()
        },
        ...reviews
      ]);

      setReviewText('');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
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

  if (!seriesData) return (
    <>
      <Header />
      <div className="movie-container">
        <div className="error">Series not found</div>
      </div>
    </>
  );

  const trailerVideo = seriesData.videos?.results?.find(
    video => video.type === "Trailer" && video.site === "YouTube"
  );

  return (
    <>
      <Header />
      <div className="movie-container">
        {/* Hero Section */}
        <div 
          className="movie-hero"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${seriesData.backdrop_path})`
          }}
        >
          <div className="hero-content">
            <h1 className="movie-title">{seriesData.name}</h1>
            <div className="movie-meta">
              <div className="rating-badge">
                <FaStar /> {seriesData.vote_average?.toFixed(1)}
              </div>
              {seriesData.first_air_date && (
                <span>{seriesData.first_air_date.slice(0, 4)}</span>
              )}
              <span>{seriesData.number_of_seasons} Seasons</span>
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

        <div className="movie-content">
          <div className="content-grid">
            <div className="movie-poster">
              <img 
                src={`https://image.tmdb.org/t/p/w500${seriesData.poster_path}`}
                alt={seriesData.name}
                style={{ width: '100%', borderRadius: '12px' }}
              />
              
              {/* Seasons Section */}
              <div className="seasons-section" style={{ marginTop: '2rem' }}>
                <h3>Seasons</h3>
                <select 
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                    className="season-select"
                    >
                    {seriesData.seasons
                        .filter(season => season.season_number > 0)
                        .map(season => (
                        <option key={season.season_number} value={season.season_number}>
                            Season {season.season_number} ({season.episode_count} episodes)
                        </option>
                        ))}
                    </select>
              </div>

              {/* Media Navigation */}
              <div className="media-nav">
                <button
                  className={`nav-button ${selectedMediaType === 'images' ? 'active' : ''}`}
                  onClick={() => setSelectedMediaType('images')}
                >
                  Images
                </button>
                <button
                  className={`nav-button ${selectedMediaType === 'videos' ? 'active' : ''}`}
                  onClick={() => setSelectedMediaType('videos')}
                >
                  Videos
                </button>
              </div>
            </div>
            
            <div className="movie-info">
              <h2>Overview</h2>
              <p className="movie-plot">{seriesData.overview}</p>
              
              {/* Cast Section */}
              <div className="cast-section">
                <h2>Cast & Characters</h2>
                <div className="cast-grid">
                  {castData.slice(0, 6).map(actor => (
                    <div key={actor.id} className="cast-card">
                      <img
                        src={actor.profile_path 
                          ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                          : '/placeholder-actor.png'}
                        alt={actor.name}
                      />
                      <div className="cast-info">
                        <h4>{actor.name}</h4>
                        <p>{actor.roles?.[0]?.character}</p>
                        <p className="episode-count">
                          {actor.total_episode_count} episodes
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Media Section */}
              <div className="media-section">
                <h2>Media</h2>
                {renderMediaSection()}
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
                title="Series Trailer"
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

export default Series;