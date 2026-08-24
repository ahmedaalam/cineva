import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import MovieCard from "../Components/MovieCard";
import "./MoviePage.css";

const API_KEY = "a0294b1b936644853a15e61eebef38ae";
const BASE_URL = "https://api.themoviedb.org/3";

const MoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsLoading(true);
    setIsTrailerPlaying(false);

    // Fetch movie details
    fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Movie fetch error:", err);
        setIsLoading(false);
      });

    // Fetch trailer
    fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        const trailer = data.results?.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        ) || data.results?.[0];
        if (trailer) {
          setTrailerKey(trailer.key);
        } else {
          setTrailerKey(null);
        }
      })
      .catch((err) => console.error("Trailer fetch error:", err));

    // Fetch Cast & Crew
    fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.cast) setCredits(data.cast.slice(0, 12));
      })
      .catch((err) => console.error("Credits fetch error:", err));

    // Fetch Similar / Recommended Movies
    fetch(`${BASE_URL}/movie/${id}/recommendations?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          setRecommendations(data.results.slice(0, 10));
        } else {
          // Fallback to similar
          fetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`)
            .then((r) => r.json())
            .then((sim) => {
              if (sim.results) setRecommendations(sim.results.slice(0, 10));
            });
        }
      })
      .catch((err) => console.error("Recommendations error:", err));
  }, [id]);

  if (isLoading || !movie) {
    return (
      <div className="movie-page-loading">
        <Header />
        <div className="loading-spinner-box">
          <div className="cineva-spinner"></div>
          <p>Loading cinematic experience...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : `https://image.tmdb.org/t/p/original${movie.poster_path}`;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60";

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs}h ` : ""}${mins}m`;
  };

  return (
    <div className="movie-detail-page">
      <Header />

      {/* Cinematic Hero Backdrop Banner */}
      <section className="detail-hero">
        <div
          className="detail-hero-backdrop"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        >
          <div className="detail-hero-gradient-overlay"></div>
        </div>

        <div className="detail-hero-container">
          {/* Poster Card */}
          <div className="detail-poster-box">
            <img src={posterUrl} alt={movie.title} className="detail-poster-img" />
            {movie.vote_average && (
              <div className="poster-floating-rating">
                <i className="fa-solid fa-star"></i>
                <span>{movie.vote_average.toFixed(1)}</span>
                <span className="rating-max">/10</span>
              </div>
            )}
          </div>

          {/* Main Info */}
          <div className="detail-main-info">
            {/* Back Button */}
            <button className="back-btn" onClick={() => navigate(-1)}>
              <i className="fa-solid fa-arrow-left"></i> Back
            </button>

            <div className="detail-meta-tags">
              <span className="meta-tag year">{releaseYear}</span>
              <span className="meta-tag runtime">
                <i className="fa-regular fa-clock"></i> {formatRuntime(movie.runtime)}
              </span>
              <span className="meta-tag status">{movie.status}</span>
              <span className="meta-tag hd">4K ULTRA HD</span>
            </div>

            <h1 className="detail-title">{movie.title}</h1>
            {movie.tagline && <p className="detail-tagline">"{movie.tagline}"</p>}

            {/* Genre Pills */}
            <div className="detail-genres">
              {movie.genres?.map((g) => (
                <span key={g.id} className="detail-genre-pill">
                  {g.name}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="detail-actions">
              {trailerKey && (
                <a
                  href="#trailer-section"
                  className="action-btn primary"
                  onClick={() => setIsTrailerPlaying(true)}
                >
                  <i className="fa-solid fa-play"></i> Watch Trailer
                </a>
              )}
              {movie.homepage && (
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn secondary"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square"></i> Official Site
                </a>
              )}
            </div>

            {/* Overview */}
            <div className="detail-overview-block">
              <h3>Storyline</h3>
              <p>{movie.overview || "No plot summary available."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trailer Video Section */}
      <section className="trailer-media-section" id="trailer-section">
        <div className="section-inner">
          <div className="media-section-header">
            <h2>
              <i className="fa-solid fa-film"></i> Official Trailer
            </h2>
          </div>

          <div className="trailer-player-card">
            {trailerKey ? (
              isTrailerPlaying ? (
                <iframe
                  className="trailer-iframe"
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                  title={`${movie.title} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div
                  className="trailer-custom-thumbnail"
                  onClick={() => setIsTrailerPlaying(true)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${trailerKey}/maxresdefault.jpg`}
                    alt="Play Trailer"
                    onError={(e) => {
                      e.target.src = backdropUrl;
                    }}
                  />
                  <div className="trailer-play-overlay">
                    <div className="trailer-play-circle">
                      <i className="fa-solid fa-play"></i>
                    </div>
                    <span>Click to Play Official Trailer</span>
                  </div>
                </div>
              )
            ) : (
              <div className="no-trailer-box">
                <i className="fa-solid fa-video-slash"></i>
                <p>No video trailer currently available for this title.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Top Billed Cast */}
      {credits.length > 0 && (
        <section className="cast-section">
          <div className="section-inner">
            <h2 className="section-title">
              <i className="fa-solid fa-users"></i> Top Billed Cast
            </h2>
            <div className="cast-scroll-row">
              {credits.map((actor) => {
                const profileImg = actor.profile_path
                  ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                  : "https://via.placeholder.com/185x278?text=No+Photo";
                return (
                  <div key={actor.id} className="cast-card">
                    <div className="cast-img-box">
                      <img src={profileImg} alt={actor.name} loading="lazy" />
                    </div>
                    <div className="cast-info">
                      <h4 className="actor-name">{actor.name}</h4>
                      <p className="character-name">{actor.character}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Metadata Facts Grid */}
      <section className="meta-facts-section">
        <div className="section-inner">
          <h2 className="section-title">
            <i className="fa-solid fa-circle-info"></i> Movie Information
          </h2>
          <div className="facts-grid">
            <div className="fact-card">
              <span className="fact-label">Release Date</span>
              <span className="fact-value">{movie.release_date || "N/A"}</span>
            </div>
            <div className="fact-card">
              <span className="fact-label">Budget</span>
              <span className="fact-value">{formatCurrency(movie.budget)}</span>
            </div>
            <div className="fact-card">
              <span className="fact-label">Revenue</span>
              <span className="fact-value">{formatCurrency(movie.revenue)}</span>
            </div>
            <div className="fact-card">
              <span className="fact-label">Original Language</span>
              <span className="fact-value">
                {movie.spoken_languages?.[0]?.english_name || movie.original_language?.toUpperCase() || "N/A"}
              </span>
            </div>
            <div className="fact-card">
              <span className="fact-label">Production Countries</span>
              <span className="fact-value">
                {movie.production_countries?.map((c) => c.name).join(", ") || "N/A"}
              </span>
            </div>
            <div className="fact-card">
              <span className="fact-label">Production Studios</span>
              <span className="fact-value">
                {movie.production_companies?.map((c) => c.name).join(", ") || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Similar & Recommended Movies */}
      {recommendations.length > 0 && (
        <section className="recommendations-section">
          <div className="section-inner">
            <h2 className="section-title">
              <i className="fa-solid fa-sparkles"></i> More Like This
            </h2>
            <div className="recommendations-grid">
              {recommendations.map((rec) => (
                <MovieCard key={rec.id} movie={rec} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default MoviePage;
