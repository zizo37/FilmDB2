import React, { useState, useEffect } from 'react';
import './Series.css';

const EpisodeHeatmap = ({ seriesId }) => {
  const [seasonData, setSeasonData] = useState([]);
  const [maxEpisodes, setMaxEpisodes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeasonEpisodes = async (seasonNumber) => {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}`,
        {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYzI3N2U4NzIyNjA4YTNjOGU1YWNjZmQ0ZTVmZDk0ZSIsIm5iZiI6MTcxMjcwNjE4Mi4xNjk5OTk4LCJzdWIiOiI2NjE1ZDI4NmFjNDE2MTAxN2M5Mjk5YWMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.o0pedQS8CKLnYW9BB7R9cb1shlM8Hi85P-pIOVwQPfU',
          },
        }
      );
      return await response.json();
    };

    const fetchAllData = async () => {
      try {
        const seriesResponse = await fetch(
          `https://api.themoviedb.org/3/tv/${seriesId}`,
          {
            headers: {
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYzI3N2U4NzIyNjA4YTNjOGU1YWNjZmQ0ZTVmZDk0ZSIsIm5iZiI6MTcxMjcwNjE4Mi4xNjk5OTk4LCJzdWIiOiI2NjE1ZDI4NmFjNDE2MTAxN2M5Mjk5YWMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.o0pedQS8CKLnYW9BB7R9cb1shlM8Hi85P-pIOVwQPfU',
            },
          }
        );
        const seriesData = await seriesResponse.json();

        let maxEps = 0;
        const allSeasons = [];

        for (let i = 1; i <= seriesData.number_of_seasons; i++) {
          const seasonData = await fetchSeasonEpisodes(i);
          const episodes = seasonData.episodes.map((ep) => ({
            episodeNumber: ep.episode_number,
            rating: ep.vote_average,
          }));
          maxEps = Math.max(maxEps, episodes.length);
          allSeasons.push({
            seasonNumber: i,
            episodes: episodes,
          });
        }

        setMaxEpisodes(maxEps);
        setSeasonData(allSeasons);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchAllData();
  }, [seriesId]);

  const getColorClass = (rating) => {
    if (!rating) return 'rating-gray';
    if (rating >= 8.5) return 'rating-green';
    if (rating >= 7.5) return 'rating-yellow-light';
    if (rating >= 6.5) return 'rating-yellow';
    return 'rating-red';
  };

  if (loading) return <div style={{ color: '#fff', padding: '1rem' }}>Loading...</div>;

  return (
    <div style={{
      marginTop: '2rem',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '1.5rem',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <h3 style={{ color: '#fe9d00', marginBottom: '1rem' }}>Episode Ratings</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '2px',
          marginTop: '1rem'
        }}>
          <thead>
            <tr>
              <th style={{
                background: '#18171f',
                color: '#fe9d00',
                padding: '0.75rem',
                fontWeight: 'bold',
                textAlign: 'center',
                borderRadius: '6px'
              }}>Episode</th>
              {seasonData.map((season) => (
                <th
                  key={season.seasonNumber}
                  style={{
                    background: '#18171f',
                    color: '#fe9d00',
                    padding: '0.75rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderRadius: '6px'
                  }}
                >
                  S{season.seasonNumber}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(maxEpisodes)].map((_, episodeIndex) => (
              <tr key={episodeIndex}>
                <td style={{
                  background: '#18171f',
                  color: '#fe9d00',
                  padding: '0.75rem',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  borderRadius: '6px'
                }}>E{episodeIndex + 1}</td>
                {seasonData.map((season) => {
                  const episode = season.episodes.find(
                    (ep) => ep.episodeNumber === episodeIndex + 1
                  );
                  return (
                    <td
                      key={season.seasonNumber}
                      className={getColorClass(episode?.rating)}
                      style={{
                        padding: '0.75rem',
                        textAlign: 'center',
                        borderRadius: '6px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {episode ? episode.rating?.toFixed(1) : 'N/A'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EpisodeHeatmap;