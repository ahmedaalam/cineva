import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext";
import "./MovieCard.css";

const MovieCard = ({ movie }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isInWatchlist, toggleWatchlist, openTrailer } = useWatchlist();
  const navigate = useNavigate();

  if (!movie) return null;

  const handleClick = () => {
    navigate(`/moviepage/${movie.id}`);
  };

  const inList = isInWatchlist(movie.id);

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : movie.first_air_date
    ? new Date(movie.first_air_date).getFullYear()
    : null;

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60";

  return (
    <div className="netflix-card" onClick={handleClick}>
      <div className="card-media-box">
        {!imageLoaded && <div className="netflix-card-skeleton skeleton"></div>}

        <img
          className={`card-img ${imageLoaded ? "loaded" : "loading"}`}
          src={
            imageError
              ? "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60"
              : posterUrl
          }
          alt={movie.title || movie.name}
          loading="lazy"
          draggable="false"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />

        {/* Rating Badge */}
        {rating && (
          <div className="card-rating-pill">
            <i className="fa-solid fa-star"></i> {rating}
          </div>
        )}

        {/* Hover Mini Bar */}
        <div className="card-hover-box">
          <div className="card-hover-actions">
            <button
              className="card-action-btn play"
              onClick={(e) => {
                e.stopPropagation();
                openTrailer(movie);
              }}
              title="Play Trailer"
            >
              <i className="fa-solid fa-play"></i>
            </button>
            <button
              className={`card-action-btn list ${inList ? "in-list" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleWatchlist(movie);
              }}
              title={inList ? "Remove from My List" : "Add to My List"}
            >
              <i className={`fa-solid ${inList ? "fa-check" : "fa-plus"}`}></i>
            </button>
            <button
              className="card-action-btn info"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/moviepage/${movie.id}`);
              }}
              title="More Info"
            >
              <i className="fa-solid fa-chevron-down"></i>
            </button>
          </div>

          <div className="card-hover-details">
            <h4 className="card-hover-title">{movie.title || movie.name}</h4>
            <div className="card-hover-meta">
              <span className="match-score">98% Match</span>
              {releaseYear && <span className="meta-item">{releaseYear}</span>}
              <span className="hd-pill">HD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
