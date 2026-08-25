import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext";
import "./SurpriseModal.css";

const API_KEY = "a0294b1b936644853a15e61eebef38ae";
const BASE_URL = "https://api.themoviedb.org/3";

const SAMPLE_TITLES = [
  "Interstellar",
  "The Dark Knight",
  "Spirited Away",
  "Inception",
  "Pulp Fiction",
  "Parasite",
  "Whiplash",
  "Spider-Man: Across the Spider-Verse",
  "Fight Club",
  "Gladiator",
  "Dune: Part Two",
  "Oppenheimer",
];

const SurpriseModal = () => {
  const { isSurpriseOpen, closeSurprise, openTrailer, toggleWatchlist, isInWatchlist } = useWatchlist();
  const [isShuffling, setIsShuffling] = useState(false);
  const [shufflingTitle, setShufflingTitle] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const navigate = useNavigate();

  const rollMovie = () => {
    setIsShuffling(true);
    setSelectedMovie(null);

    // Dynamic title cycle during shuffle
    let counter = 0;
    const interval = setInterval(() => {
      setShufflingTitle(SAMPLE_TITLES[counter % SAMPLE_TITLES.length]);
      counter++;
    }, 90);

    // Random page between 1 and 5
    const randomPage = Math.floor(Math.random() * 5) + 1;

    fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${randomPage}`)
      .then((res) => res.json())
      .then((data) => {
        const movies = data.results || [];
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];

        setTimeout(() => {
          clearInterval(interval);
          setSelectedMovie(randomMovie);
          setIsShuffling(false);
        }, 1400);
      })
      .catch((err) => {
        console.error("Error fetching surprise movie:", err);
        clearInterval(interval);
        setIsShuffling(false);
      });
  };

  useEffect(() => {
    if (isSurpriseOpen) {
      rollMovie();
    }
  }, [isSurpriseOpen]);

  if (!isSurpriseOpen) return null;

  const inList = selectedMovie ? isInWatchlist(selectedMovie.id) : false;
  const backdropUrl = selectedMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`
    : selectedMovie?.poster_path
    ? `https://image.tmdb.org/t/p/original${selectedMovie.poster_path}`
    : "";

  const releaseYear = selectedMovie?.release_date
    ? new Date(selectedMovie.release_date).getFullYear()
    : "";

  return (
    <div className="surprise-modal-backdrop" onClick={closeSurprise}>
      <div className="surprise-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="surprise-close-btn" onClick={closeSurprise} aria-label="Close">
          <i className="fa-solid fa-xmark"></i>
        </button>

        {isShuffling ? (
          <div className="surprise-shuffling-box">
            <div className="roulette-dice-icon">
              <i className="fa-solid fa-dice fa-bounce"></i>
            </div>
            <h2 className="shuffling-badge">PICKING YOUR MOVIE...</h2>
            <div className="shuffling-title-reel">
              <span>{shufflingTitle}</span>
            </div>
            <p className="shuffling-sub">Cineva is finding the perfect match for you</p>
          </div>
        ) : selectedMovie ? (
          <div className="surprise-result-box">
            {/* Backdrop Header */}
            <div
              className="surprise-backdrop-header"
              style={{ backgroundImage: `url(${backdropUrl})` }}
            >
              <div className="surprise-vignette"></div>
              <div className="surprise-top-tag">
                <i className="fa-solid fa-sparkles"></i> Hand-Picked For You
              </div>
            </div>

            {/* Content Details */}
            <div className="surprise-content-body">
              <div className="surprise-meta-row">
                <span className="surprise-match">99% Match</span>
                {releaseYear && <span className="surprise-year">{releaseYear}</span>}
                <span className="surprise-rating">
                  <i className="fa-solid fa-star"></i> {selectedMovie.vote_average?.toFixed(1)}
                </span>
                <span className="surprise-hd">4K UHD</span>
              </div>

              <h2 className="surprise-title">{selectedMovie.title}</h2>

              <p className="surprise-overview">
                {selectedMovie.overview || "An exceptional cinematic journey waiting for you."}
              </p>

              {/* Action Buttons */}
              <div className="surprise-actions-row">
                <button
                  className="surprise-btn play-btn"
                  onClick={() => {
                    closeSurprise();
                    openTrailer(selectedMovie);
                  }}
                >
                  <i className="fa-solid fa-play"></i>
                  <span>Play Trailer</span>
                </button>

                <button
                  className={`surprise-btn list-btn ${inList ? "in-list" : ""}`}
                  onClick={() => toggleWatchlist(selectedMovie)}
                >
                  <i className={`fa-solid ${inList ? "fa-check" : "fa-plus"}`}></i>
                  <span>{inList ? "In My List" : "My List"}</span>
                </button>

                <button
                  className="surprise-btn details-btn"
                  onClick={() => {
                    closeSurprise();
                    navigate(`/moviepage/${selectedMovie.id}`);
                  }}
                >
                  <i className="fa-solid fa-circle-info"></i>
                  <span>Details</span>
                </button>

                <button className="surprise-btn reroll-btn" onClick={rollMovie} title="Roll Again">
                  <i className="fa-solid fa-rotate-right"></i>
                  <span>Roll Again</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SurpriseModal;
