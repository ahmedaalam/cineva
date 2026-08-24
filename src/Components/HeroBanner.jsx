import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HeroBanner.css";

const HeroBanner = ({ movies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const featured = movies.slice(0, 5);

  useEffect(() => {
    if (featured.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (featured.length === 0) {
    return <div className="netflix-billboard-skeleton skeleton"></div>;
  }

  const currentMovie = featured[currentIndex] || featured[0];
  const backdropUrl = currentMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`
    : `https://image.tmdb.org/t/p/original${currentMovie.poster_path}`;

  return (
    <div className="netflix-billboard">
      {/* Edge-to-Edge Backdrop */}
      <div
        className="billboard-backdrop"
        style={{
          backgroundImage: `url(${backdropUrl})`,
        }}
      >
        <div className="billboard-vignette-left"></div>
        <div className="billboard-vignette-bottom"></div>
      </div>

      {/* Billboard Content */}
      <div className="billboard-content">
        {/* Original Badge */}
        <div className="billboard-badge">
          <span className="n-logo">C</span>
          <span className="badge-text">FILM</span>
        </div>

        {/* Title */}
        <h1 className="billboard-title">{currentMovie?.title}</h1>

        {/* Synopsis */}
        <p className="billboard-synopsis">
          {currentMovie?.overview ||
            "Watch this thrilling cinematic experience exclusively on Cineva."}
        </p>

        {/* Buttons */}
        <div className="billboard-actions">
          <button
            className="billboard-btn play-btn"
            onClick={() => navigate(`/moviepage/${currentMovie.id}`)}
          >
            <i className="fa-solid fa-play"></i>
            <span>Play</span>
          </button>

          <button
            className="billboard-btn info-btn"
            onClick={() => navigate(`/moviepage/${currentMovie.id}`)}
          >
            <i className="fa-solid fa-circle-info"></i>
            <span>More Info</span>
          </button>
        </div>
      </div>

      {/* Maturity Rating & Slide Indicators on the Right */}
      <div className="billboard-right-controls">
        <div className="maturity-tag">
          <span>16+</span>
        </div>
        <div className="billboard-slide-dots">
          {featured.map((m, idx) => (
            <span
              key={m.id || idx}
              className={`slide-dot ${idx === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
