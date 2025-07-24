import { Routes, Route } from "react-router-dom";
import "./App.css";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import MovieCard from "./Components/MovieCard";
import { useState, useEffect } from "react";
import MoviePage from "./Pages/MoviePage";
import TrendingRow from "./Components/TrendingRow";

const App = () => {
  const [movieList, setMovieList] = useState([]);
  const [searchTerm, setSearchTerm] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);

  const Movies = () => {
    fetch(
      "https://api.themoviedb.org/3/discover/movie?api_key=a0294b1b936644853a15e61eebef38ae"
    )
      .then((res) => res.json())
      .then((json) => setMovieList(json.results));
  };

  useEffect(() => {
    Movies();
  }, []);

  const searchMovies = (query) => {
    if (!query.trim()) return;

    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=a0294b1b936644853a15e61eebef38ae&query=${query}`
    )
      .then((res) => res.json())
      .then((json) => setSearchResults(json.results))
      .catch((err) => console.error("Search Error:", err));
  };

  const getTrendingMovies = () => {
    fetch(
      "https://api.themoviedb.org/3/trending/movie/week?api_key=a0294b1b936644853a15e61eebef38ae"
    )
      .then((res) => res.json())
      .then((json) => setTrendingMovies(json.results));
  };

  useEffect(() => {
    Movies();
    getTrendingMovies();
  }, []);
  return (
    <Routes>
      {/* Movie Page */}
      <Route path="/moviepage/:id" element={<MoviePage />} />

      {/* Home Page */}
      <Route
        path="/"
        element={
          <>
            <Header />

            <div className="Content">
              <p>Unlimited Movies, TV</p>
              <p>Shows, and More</p>
              <p className="Tag-1">Starts at Rs 250. Cancel anytime.</p>
              <p className="Tag-2">
                Ready to watch? Enter your email to create or restart your
                membership.
              </p>

              <div className="Info">
                <input type="text" placeholder="Email address" />
                <button>
                  Get Started<i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>

            <TrendingRow movies={trendingMovies} />

            <div className="Section-1">
              <div className="Container">
                <h2>Popular</h2>
              </div>
              <div className="Cards">
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>

            <div className="Section-2">
              <img src="./src/assets/hero-img.png" alt="Hero" />
              <p>
                Find <span>Movies</span> You'll Enjoy
              </p>
              <p>Without the Hassle</p>

              <div className="Search">
                <input
                  placeholder="Search through 300+ movies online"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchMovies(searchTerm);
                    }
                  }}
                />
                <i
                  className="fa-solid fa-magnifying-glass"
                  onClick={() => searchMovies(searchTerm)}
                ></i>
              </div>

              {searchResults.length > 0 && (
                <>
                  <h2>All Movies</h2>
                  <div className="Cards">
                    {searchResults.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>
                </>
              )}
            </div>

            <Footer />
          </>
        }
      />
    </Routes>
  );
};

export default App;
