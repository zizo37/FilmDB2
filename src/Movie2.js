import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiShare2 } from 'react-icons/fi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component'; // Import ReactStars component

const Movie = (props) => {
  const { id, userID } = useParams();
  const [imdb, setImdb] = useState(null);
  const [movieData, setMovieData] = useState();
  const [backgroundImageUrl, setBackgroundImageUrl] = useState();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [ratevalue, setRatevalue] = useState(0);
  const [filled, setFilled] = useState(false);
  const [genres, setGenres] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [whatchReview, setWhatchReview] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [urlYoutybe, setUrlYoutybe] = useState('');
  const [rating, setRating] = useState('');

  const supabase = createClient(
    "https://ksnouxckabitqorjucgz.supabase.co",
    "YOUR_SUPABASE_KEY"
  );

  useEffect(() => {
    async function getData() {
      if (id) {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer YOUR_TMDB_API_KEY',
          },
        };

        try {
          const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options);
          const data = await response.json();
          setImdb(data.imdb_id || null);
          setMovieData(data);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setImdb(null);
          setLoading(false);
        }
      }
    }
    getData();
  }, [id]);

  useEffect(() => {
    if (imdb) {
      const apiKey = '2b73a326';
      const url = `https://www.omdbapi.com/?i=${imdb}&apikey=${apiKey}`;
      axios.get(url)
        .then(response => {
          const donne = response.data;
          setData(donne);
        })
        .catch(error => {
          console.error('Error fetching data from OMDB API:', error);
        });
    }
  }, [imdb]);

  useEffect(() => {
    if (movieData && movieData.backdrop_path) {
      setBackgroundImageUrl(`https://image.tmdb.org/t/p/original${movieData.backdrop_path}`);
    }
  }, [movieData]);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user data:", error.message);
      } else {
        setUser(user);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchRating = async () => {
      if (user && props.data) {
        try {
          const { data, error } = await supabase
            .from('ratings')
            .select('rating')
            .eq('user_id', user.id)
            .eq('movie_id', props.data.imdbID);

          if (error) {
            console.error('Error fetching rating:', error.message);
            return;
          }

          if (data.length > 0) {
            setRatevalue(data[0].rating / 2);
            setFilled(true);
          }
        } catch (error) {
          console.error('Error fetching rating:', error.message);
        }
      }
    };

    fetchRating();
  }, [user, props.data]);

  const ratingChanged = async (newRating) => {
    if (!filled) {
      try {
        const { data, error } = await supabase
          .from('ratings')
          .insert([{ movie_id: props.data.imdbID, rating: newRating * 2, user_id: user.id }]);

        if (error) {
          console.error('Error adding rating:', error.message);
          return;
        }

        setFilled(true);
        setRatevalue(newRating);
      } catch (error) {
        console.error('Error adding rating:', error.message);
      }
    } else {
      try {
        const { data, error } = await supabase
          .from('ratings')
          .update({ rating: newRating * 2 })
          .eq('user_id', user.id)
          .eq('movie_id', props.data.imdbID);

        if (error) {
          console.error('Error updating rating:', error.message);
          return;
        }

        setRatevalue(newRating);
      } catch (error) {
        console.error('Error updating rating:', error.message);
      }
    }
  };

  useEffect(() => {
    if (ratevalue > 0) {
      console.log(ratevalue);
    }
  }, [ratevalue]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          text: 'Check out this awesome movie!',
          url: `https://filmdata.onrender.com/movie/${props.ID}`
        });
        console.log('Page shared successfully');
      } else {
        console.log('Web Share API not supported');
      }
    } catch (error) {
      console.error('Error sharing page:', error.message);
    }
  };
  return (
    <>
      <Header />
      <section style={{ flexGrow: 1 }}>
        {loading ? (
          <p>Loading...</p>
        ) : data ? (
          <div className="container-fluid" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${backgroundImageUrl})`, backgroundSize: "cover", minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px' }}>
            <div className="row justify-content-end m-0">
                    <div className="col-auto" >
                      <a href="#" className="btn btn-link" style={{color:'white',textDecoration: 'none',}} >Cast & Crew</a>
                    </div>
                    <div className="col-auto">
                      <a href="#" className="btn btn-link" style={{color:'white',textDecoration: 'none',}}>User Review</a>
                    </div>
                    <div className="col-auto">
                      <a href="#" className="btn btn-link"style={{color:'white',textDecoration: 'none',}}>Trivia</a>
                    </div>
                    <div className="col-auto">
                      <a href="#" className="btn btn-link"style={{color:'white',textDecoration: 'none',}}>FAQ</a>
                    </div>
                    <div className="col-auto">
                      <a href="#" className="btn btn-link"style={{color:'white',textDecoration: 'none',}}>imdbPro</a>
                    </div>
                    <div className="col-auto">
                      <a href="#" className="btn btn-link"style={{color:'white',textDecoration: 'none',}}>All tapics</a>
                    </div>
                    <div className="col-auto">
                      <a href="#" className="btn btn-link"style={{color:'white',textDecoration: 'none',}}><FiShare2  onClick={handleShare} style={{ cursor: 'pointer', color: 'white' }} /></a>
                    </div>
                    
            
                    {/* <div className="col-auto">
                      <a href="#" className="btn btn-link">
                        <FontAwesomeIcon icon={faShareAlt} />
                      </a>
                    </div> */}
            
                  </div>
            <div className="row">
                        <div className="col-lg-8">
                            <h3 style={{color:'white'}} >{props.data.Title}</h3>
                            <div style={{color:'white'}}>
                                {props.data.Year} .  {props.data.Rated} .   {props.data.Runtime} 
                            </div>
                        </div>
                        <div className="col-lg-4 d-flex align-items-center " style={{color:'white'}} >
                            <div className='col-6 '>
                                <ul style={{listStyleType: "none"}} >
                                    <li>Rating filmDB</li>
                                    <li >
                                        <span style={{fontSize: '24px'}}>
                                            <FaStar 
                                                color={true ? 'orange' : 'grey'} 
                                                style={{ cursor: 'pointer' }} 
                                            />
                                        </span>
                                        {rating}
                                    </li>
                                    <li></li>
                                </ul>
                            </div>
                            <div className='col-6'>
                                <ul style={{listStyleType: "none"}}>
                                   
                                        {/* <span  onClick={handleRateClick}>
                                            {filled ? (
                                                <FaStar style={{ color: 'orange',fontSize: '24px' }} />
                                            ) : (
                                                <FaStar style={{ color: 'grey',fontSize: '24px'  }} />
                                            )}
                                        </span>  
                                        <span  style={{color:'orange',fontSize: '18px'}}>
                                            Rate
                                        </span> */}
                                        {user && ratevalue > 0 && (
                                            <>
                                             <li>YOUR RATING</li>
                                            <li>
                                                <ReactStars
                                                    count={5}
                                                    onChange={ratingChanged}
                                                    value={ratevalue>0? ratevalue :0} // Utiliser la valeur de l'état
                                                    size={30}
                                                    isHalf={true}
                                                    emptyIcon={<i className="far fa-star"></i>}
                                                    halfIcon={<i className="fa fa-star-half-alt"></i>}
                                                    fullIcon={<i className="fa fa-star"></i>}
                                                    activeColor="orange"
                                                />
                                                <   span style={{color:'orange',fontSize: '18px'}}>
                                                    Rate
                                                </span>
                                                </li>
                                        </>
                                        )}
                                         {user && ratevalue === 0 && (
                                            <>
                                             <li>YOUR RATING</li>
                                            <li>
                                                <ReactStars
                                                    count={5}
                                                    onChange={ratingChanged}
                                                    value={ratevalue>0? ratevalue :0} // Utiliser la valeur de l'état
                                                    size={30}
                                                    isHalf={true}
                                                    emptyIcon={<i className="far fa-star"></i>}
                                                    halfIcon={<i className="fa fa-star-half-alt"></i>}
                                                    fullIcon={<i className="fa fa-star"></i>}
                                                    activeColor="orange"
                                                />
                                                <   span style={{color:'orange',fontSize: '18px'}}>
                                                    Rate
                                                </span>
                                                </li>
                                        </>
                                        )}
                                        
                                   
                                </ul>
                            </div>     
                        </div>
                    </div>
                    <div className="row  "style={{justifyContent:''} }>
      <div className="col-3 m-1 conteneur-parent d-flex justify-content-center align-items-center "  >
        {/* Colonne contenant la photo du film */}
        <img src={props.data.Poster} alt="Poster du film" className="img-fluid " />
      </div>
      <div className="col-lg-8  m-1"        
 >
        {/* Colonne contenant le trailer du film */}
        <iframe
          width="100%"
          height="100%"
          src={urlYoutybe}
          title="Trailer du film"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

    </div>
            <div className="row">
                  <div className="col-lg-8 col-md-8 col-sm-12">
                    <div className='row'>
                      <div style={{ color: 'white', textDecoration: 'none', margin: "20px" }}>
                        {genres.map(item => <span style={styleElement} key={item}> {item}</span>)}
                        <p>
                          <br></br>
                          {props.data.Plot}
                        </p>
                      </div>
                      <hr style={{ color: 'white', textDecoration: 'none' }}></hr>
                      <div style={{ color: 'white', textDecoration: 'none' }}>
                        <span style={{ textTransform: 'uppercase', fontSize: '1em' }}>Director </span><span style={{ color: 'blue' }}> {props.data.Director} </span>
                      </div>
                      <hr style={{ color: 'white', textDecoration: 'none' }}></hr>
                      <div style={{ color: 'white', textDecoration: 'none' }}>
                        <span style={{ textTransform: 'uppercase', fontSize: '1em' }}>Writers </span><span style={{ color: 'blue' }}> {props.data.Writer} </span>
                      </div>
                      <hr style={{ color: 'white', textDecoration: 'none' }}></hr>
                      <div style={{ color: 'white', textDecoration: 'none' }}>
                        <span style={{ textTransform: 'uppercase', fontSize: '1.2em' }}>Stars </span><span style={{ color: 'blue' }}> {props.data.Actors} </span>
                      </div>
                      <hr style={{ color: 'white', textDecoration: 'none' }}></hr>
                      <div style={{ color: 'white', textDecoration: 'none' }}>
                        <span style={{ textTransform: 'uppercase', fontSize: '1.5em' }}>IMDb </span>Pro See production info at IMDbPro
                      </div>
                      <hr style={{ color: 'white', textDecoration: 'none' }}></hr>
                      <div>
                        <a href="#" onClick={handleShowReviews} style={{ color: 'yellow', textDecoration: 'overline ' }}>See your reviews</a> <br/>
                        {showReviews && (
                          whatchReview.length > 0 ? (
                            whatchReview.map((review, index) => (
                              <>
                              <span key={index} style={{ color: 'white' }}>{review.review}  </span>
                               <br/>
                              </>
                            ))
                          ) : (
                            <p style={{ color: 'white' }}>No reviews yet.</p>
                          )
                        )}
                      </div>
                    </div>
            
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-12" style={{ marginLeft: 'auto', marginTop: '10px' }}>
                    <div>
                      {companies && companies.map((company, index) => (
                        company.logo_path ? (
                          <img key={index} src={`https://image.tmdb.org/t/p/w500${company.logo_path}`} alt={`Company Logo ${index}`} style={{
                            width: '100px',
                            height: 'auto',
                            margin: "5px",
                            marginBottom: '15px'
                          }} />
                        ) : null
                      ))}
                    </div>
                    <button className="watch-list-button" style={buttonStyle} onClick={handleWatchList}>
                      <FontAwesomeIcon icon={isAddedToList ? faMinus : faPlus} /> {isAddedToList ? "Remove from watch list" : 'Add to watch list'}
                    </button>
                  
                    <button style={{ ...buttonReviewStyle, marginTop: '20px' }} onClick={() => setShowReview(true)}>
                      Leave a Review
                    </button>
                    {showReview && (
                      <div style={{ marginTop: '20px', color: 'white' }}>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Write your review here..."
                          rows="4"
                          style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
                        />
                        <button style={{ ...buttonReviewStyle, marginTop: '10px' }} onClick={handleReviewSubmit}>
                          Submit Review
                        </button>
                      </div>
                    )}
                      <div style={{ marginTop: "22px" }}>
                      {props.data.Metascore !== 'N/A' && (
                        <>
                          <span style={{ color: 'white', padding: '3px', backgroundColor: 'orange' }}>{props.data.Metascore}</span>
                          <span style={{ color: 'blue', marginLeft: '12px' }}>Metascore</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
          </div>
        ) : (
          <p>No movie available</p>
        )}
      </section>
      <Footer />
    </>
  );
};

export default Movie;