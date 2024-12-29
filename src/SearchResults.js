import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import './SearchResults.css';
import Header from './Header';
import ChatbotApp from './MovieChatbot/ChatbotApp';

const SearchResults = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('q');
    const mediaType = searchParams.get('type') || 'movie';
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSearchResults = async () => {
            setIsLoading(true);
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYzI3N2U4NzIyNjA4YTNjOGU1YWNjZmQ0ZTVmZDk0ZSIsInN1YiI6IjY2MTVkMjg2YWM0MTYxMDE3YzkyOTlhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCbzx_EgdSfu_R2NVoQ8pGKqwIFfm8tXz-yd3HoLJX8',
                },
            };

            try {
                const apiUrl = mediaType === 'movie'
                    ? `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&language=en-US`
                    : `https://api.themoviedb.org/3/search/tv?query=${searchTerm}&language=en-US`;
                
                const response = await fetch(apiUrl, options);
                const data = await response.json();
                setSearchResults(data.results || []);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (searchTerm) {
            fetchSearchResults();
        }
    }, [searchTerm, mediaType]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.getFullYear();
    };

    return (
        <>
            <Header />
            <section className="search-results-section">
                <div className="search-header">
                    <h1 className="search-title">Search Results</h1>
                    <p className="search-subtitle">
                        Found {searchResults.length} {mediaType === 'movie' ? 'movies' : 'TV shows'} for "{searchTerm}"
                    </p>
                </div>

                {isLoading ? (
                    <div className="no-results">Loading...</div>
                ) : searchResults.length === 0 ? (
                    <div className="no-results">No results found</div>
                ) : (
                    <div className="search-grid">
                        {searchResults.map((result) => {
                            const title = mediaType === 'movie' ? result.title : result.name;
                            const releaseDate = mediaType === 'movie' ? result.release_date : result.first_air_date;
                            const imageUrl = result.poster_path
                                ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
                                : '/placeholder-poster.png';

                            return (
                                <div className="search-card" key={result.id}
                                    style={{ backgroundImage: `url(${imageUrl})` }}>
                                    <div className="search-card-overlay">
                                        <h3 className="search-card-title">{title}</h3>
                                        <div className="search-card-info">
                                            <span className="search-card-rating">
                                                <FaStar /> {result.vote_average.toFixed(1)}
                                            </span>
                                            <span className="search-card-date">
                                                {formatDate(releaseDate)}
                                            </span>
                                        </div>
                                        <Link 
                                            to={`/${mediaType}/${result.id}`}
                                            className="search-card-button"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
            <ChatbotApp/>
        </>
    );
};

export default SearchResults;