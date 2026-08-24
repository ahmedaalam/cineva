import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext";
import "./TrailerModal.css";

const API_KEY = "a0294b1b936644853a15e61eebef38ae";
const BASE_URL = "https://api.themoviedb.org/3";

const TrailerModal = () => {
  const { activeTrailerMovie, closeTrailer, toggleWatchlist, isInWatchlist } = useWatchlist();
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!activeTrailerMovie || !activeTrailerMovie.id) return;

    setIsLoading(true);
    setTrailerKey(null);

    fetch(`${BASE_URL}/movie/${activeTrailerMovie.id}/videos?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        const trailer =
          data.results?.find(
            (vid) => vid.type === "Trailer" && vid.site === "YouTube"
          ) ||
          data.results?.find((vid) => vid.site === "YouTube") ||
          data.results?.[0];

        if (trailer) {
          setTrailerKey(trailer.key);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching modal trailer:", err);
        setIsLoading(false);
      });
  }, [activeTrailerMovie]);

  if (!activeTrailerMovie) return null;

  const inList = isInWatchlist(activeTrailerMovie.id);

  const handleGoToDetails = () => {
    closeTrailer();
    navigate(`/moviepage/${activeTrailerMovie.id}`);
  };

  return (
    <div className="trailer-modal-backdrop" onClick={closeTrailer}>
      <div className="trailer-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={closeTrailer} aria-label="Close">
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Video Player Frame */}
        <div className="modal-player-container">
          {isLoading ? (
            <div className="modal-loading-box">
              <div className="modal-spinner"></div>
              <span>Loading Official Trailer...</span>
            </div>
          ) : trailerKey ? (
            <iframe
              className="modal-video-frame"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
              title={`${activeTrailerMovie.title || activeTrailerMovie.name} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="modal-no-video">
              <i className="fa-solid fa-video-slash"></i>
              <p>Official video trailer unavailable for this title.</p>
            </div>
          )}
        </div>

        {/* Modal Info Bar */}
        <div className="modal-info-bar">
          <div className="modal-info-left">
            <h3 className="modal-title">{activeTrailerMovie.title || activeTrailerMovie.name}</h3>
            <p className="modal-overview">{activeTrailerMovie.overview}</p>
          </div>

          <div className="modal-info-actions">
            <button
              className={`modal-btn list-btn ${inList ? "in-list" : ""}`}
              onClick={() => toggleWatchlist(activeTrailerMovie)}
            >
              <i className={`fa-solid ${inList ? "fa-check" : "fa-plus"}`}></i>
              <span>{inList ? "In My List" : "Add to My List"}</span>
            </button>

            <button className="modal-btn details-btn" onClick={handleGoToDetails}>
              <i className="fa-solid fa-circle-info"></i>
              <span>Full Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
