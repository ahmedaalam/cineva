import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import MovieCard from "../Components/MovieCard";
import { useWatchlist } from "../context/WatchlistContext";
import "./MyListPage.css";

const MyListPage = () => {
  const { watchlist } = useWatchlist();

  return (
    <div className="my-list-page">
      <Header />

      <main className="my-list-container">
        <div className="my-list-header">
          <h1 className="my-list-title">My List</h1>
          <span className="my-list-count">
            {watchlist.length} {watchlist.length === 1 ? "Title" : "Titles"}
          </span>
        </div>

        {watchlist.length > 0 ? (
          <div className="my-list-grid">
            {watchlist.map((movie) => (
              <div key={movie.id} className="my-list-card-wrapper">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        ) : (
          <div className="my-list-empty">
            <div className="empty-icon-box">
              <i className="fa-solid fa-layer-group"></i>
            </div>
            <h2>You haven't added any titles to your list yet.</h2>
            <p>
              Explore movies and click the <strong>+</strong> icon on any poster to save them to your personal watchlist.
            </p>
            <Link to="/" className="browse-movies-btn">
              <i className="fa-solid fa-compass"></i>
              <span>Browse Movies</span>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyListPage;
