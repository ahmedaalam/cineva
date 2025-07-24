import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./TrendingRow.css";

const TrendingRow = ({ movies }) => {
  const rowRef = useRef();
  const navigate = useNavigate();

  const scroll = (direction) => {
    if (direction === "left") {
      rowRef.current.scrollBy({ left: -400, behavior: "smooth" });
    } else {
      rowRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <div className="trending-wrapper">
      <h2 className="trending-title">Trending Now</h2>

      <div className="scroll-btn left" onClick={() => scroll("left")}>
        &lt;
      </div>
      <div className="scroll-btn right" onClick={() => scroll("right")}>
        &gt;
      </div>

      <div className="trending-row" ref={rowRef}>
        {movies.slice(0, 10).map((movie, index) => (
          <div
            className="trending-card"
            key={movie.id}
            onClick={() => navigate(`/moviepage/${movie.id}`)}
          >
            <div className="ranking">{index + 1}</div>
            <img
              className="poster"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingRow;
