import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./MoviePage.css";

const MoviePage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);

  useEffect(() => {
    // Fetch movie details
    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=a0294b1b936644853a15e61eebef38ae`
    )
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error("Movie fetch error:", err));

    // Fetch trailer
    fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=a0294b1b936644853a15e61eebef38ae`
    )
      .then((res) => res.json())
      .then((data) => {
        const trailer = data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        if (trailer) {
          setTrailerKey(trailer.key);
        }
      })
      .catch((err) => console.error("Trailer fetch error:", err));
  }, [id]);

  return (
    <div className="MoviePage">
      {movie ? (
        <>
          <div className="wrapper">
            <h1>{movie.title}</h1>
            <div className="elements">
              <p>
                <i className="fa-solid fa-star star-icon"></i>
                {movie.vote_average}/10
              </p>
              <p>
                <i className="fa-solid fa-arrow-trend-up"></i>
              </p>
            </div>
          </div>

          <div className="TrailerSection">
            <div className="Poster">
              <img
                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                alt="Poster"
              />
            </div>

            <div className="Backdrop">
              {trailerKey ? (
                isTrailerPlaying ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=1`}
                    title="Movie Trailer"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div
                    className="trailer-thumbnail"
                    onClick={() => setIsTrailerPlaying(true)}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${trailerKey}/maxresdefault.jpg`}
                      alt="Trailer Thumbnail"
                    />
                    <div className="play-icon">
                      <i className="fa-solid fa-circle-play fa-4x"></i>
                    </div>
                  </div>
                )
              ) : (
                <p>No trailer available.</p>
              )}
            </div>
          </div>

          <div className="MovieDetails">
            <div className="details">
              <p className="section-label">Genres</p>
              <div className="genres">
                {movie.genres?.map((g) => (
                  <p key={g.id}>{g.name}</p>
                ))}
              </div>
              <div className="homepage-button-container">
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="homepage-button"
                >
                  Visit Homepage <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>

            <div className="details">
              <p className="section-label">Overview</p>
              <p>{movie.overview}</p>
            </div>

            <div className="details">
              <p className="section-label">Release date</p>
              <p>{movie.release_date} (Worldwide)</p>
            </div>

            <div className="details">
              <p className="section-label">Countries</p>
              {movie.production_countries?.map((g, index) => (
                <p key={index}>{g.name}</p>
              ))}
            </div>

            <div className="details">
              <p className="section-label">Status</p>
              <p>{movie.status}</p>
            </div>

            <div className="details">
              <p className="section-label">Language</p>
              {movie.spoken_languages?.map((g, index) => (
                <p key={index}>{g.english_name}</p>
              ))}
            </div>

            <div className="details">
              <p className="section-label">Budget</p>
              <p>${movie.budget}</p>
            </div>

            <div className="details">
              <p className="section-label">Revenue</p>
              <p>${movie.revenue}</p>
            </div>

            <div className="details">
              <p className="section-label">Runtime</p>
              <p>{movie.runtime}m</p>
            </div>

            <div className="details">
              <p className="section-label">Tagline</p>
              <p>{movie.tagline}</p>
            </div>

            <div className="details">
              <p className="section-label">
                Production <br /> Companies
              </p>
              {movie.production_companies?.map((g) => (
                <p key={g.id}>{g.name}</p>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="loader">
          <div className="ring"></div>
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default MoviePage;
