import { useState, useEffect } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import HeroBanner from "../Components/HeroBanner";
import TrendingRow from "../Components/TrendingRow";
import MovieRow from "../Components/MovieRow";
import MovieCard from "../Components/MovieCard";
import "./HomePage.css";

const API_KEY = "a0294b1b936644853a15e61eebef38ae";
const BASE_URL = "https://api.themoviedb.org/3";

const HomePage = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [sciFiMovies, setSciFiMovies] = useState([]);
  const [animationMovies, setAnimationMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Fetch Trending
    fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results) setTrendingMovies(data.results);
      })
      .catch((err) => console.error("Trending error:", err));

    // Fetch Popular
    fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results) setPopularMovies(data.results);
      })
      .catch((err) => console.error("Popular error:", err));

    // Fetch Top Rated
    fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results) setTopRatedMovies(data.results);
      })
      .catch((err) => console.error("Top rated error:", err));

    // Fetch Action (Genre 28)
    fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28&sort_by=popularity.desc`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results) setActionMovies(data.results);
      })
      .catch((err) => console.error("Action error:", err));

    // Fetch Sci-Fi (Genre 878)
    fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=878&sort_by=popularity.desc`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results) setSciFiMovies(data.results);
      })
      .catch((err) => console.error("SciFi error:", err));

    // Fetch Animation (Genre 16)
    fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=16&sort_by=popularity.desc`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results) setAnimationMovies(data.results);
      })
      .catch((err) => console.error("Animation error:", err));
  }, []);

  const handleSearch = (query) => {
    setSearchTerm(query);
    if (!query || !query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.results) setSearchResults(data.results);
      })
      .catch((err) => console.error("Search error:", err));
  };

  return (
    <div className="netflix-homepage">
      <Header onSearch={handleSearch} searchValue={searchTerm} />

      {isSearching && searchTerm ? (
        <main className="netflix-search-results">
          <div className="search-meta-header">
            <h3>
              Explore titles related to: <span>"{searchTerm}"</span>
            </h3>
          </div>

          {searchResults.length > 0 ? (
            <div className="search-grid">
              {searchResults.map((movie) => (
                <div key={movie.id} className="search-card-wrap">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          ) : (
            <div className="search-empty">
              <p>Your search for "{searchTerm}" did not find any matches.</p>
              <span>Suggestions:</span>
              <ul>
                <li>Try different keywords</li>
                <li>Looking for a movie? Try searching for the title</li>
                <li>Try a genre like comedy, romance, sports, or drama</li>
              </ul>
            </div>
          )}
        </main>
      ) : (
        <main className="netflix-main-feed">
          {/* Billboard / Hero */}
          <HeroBanner movies={trendingMovies} />

          {/* Clean Content Rows Section */}
          <div className="netflix-rows-container">
            {/* Top 10 Today */}
            <TrendingRow movies={trendingMovies} />

            {/* Trending Now */}
            <MovieRow title="Trending Now" movies={trendingMovies} id="trending-row" />

            {/* Popular on Cineva */}
            <MovieRow title="Popular on Cineva" movies={popularMovies} id="popular-row" />

            {/* Action & Thrillers */}
            <MovieRow title="Action Thrillers & Blockbusters" movies={actionMovies} id="action-row" />

            {/* Top Rated */}
            <MovieRow title="Top Rated & Award Winners" movies={topRatedMovies} id="top-rated-row" />

            {/* Sci-Fi */}
            <MovieRow title="Sci-Fi & Fantasy Movies" movies={sciFiMovies} id="sci-fi-row" />

            {/* Animation */}
            <MovieRow title="Animation & Family Night" movies={animationMovies} id="animation-row" />
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
};

export default HomePage;
