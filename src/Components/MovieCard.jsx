import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/moviepage/${movie.id}`); 
  };

  return (
    <div className="Movie" onClick={handleClick}>
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/400"
        }
        alt={movie.title}
      />
    </div>
  );
};

export default MovieCard;

