import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import MovieCard from "../Components/MovieCard";
import "./PersonPage.css";

const API_KEY = "a0294b1b936644853a15e61eebef38ae";
const BASE_URL = "https://api.themoviedb.org/3";

const PersonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsLoading(true);

    // Fetch Person Details
    fetch(`${BASE_URL}/person/${id}?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        setPerson(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching person details:", err);
        setIsLoading(false);
      });

    // Fetch Person Movie Credits
    fetch(`${BASE_URL}/person/${id}/movie_credits?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.cast) {
          // Sort by popularity and filter valid posters
          const sorted = data.cast
            .filter((m) => m.poster_path)
            .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
          setCredits(sorted);
        }
      })
      .catch((err) => console.error("Error fetching person credits:", err));
  }, [id]);

  if (isLoading || !person) {
    return (
      <div className="person-page-loading">
        <Header />
        <div className="person-spinner-box">
          <div className="cineva-spinner"></div>
          <p>Loading actor profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const profileImg = person.profile_path
    ? `https://image.tmdb.org/t/p/h632${person.profile_path}`
    : "https://via.placeholder.com/300x450?text=No+Photo";

  const calculateAge = (birthday, deathday) => {
    if (!birthday) return null;
    const birthYear = new Date(birthday).getFullYear();
    const endYear = deathday ? new Date(deathday).getFullYear() : new Date().getFullYear();
    return endYear - birthYear;
  };

  const age = calculateAge(person.birthday, person.deathday);

  return (
    <div className="person-page">
      <Header />

      <main className="person-container">
        {/* Back Button */}
        <button className="person-back-btn" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>

        <div className="person-layout">
          {/* Left Column: Profile Photo & Personal Info */}
          <aside className="person-sidebar">
            <div className="person-photo-box">
              <img src={profileImg} alt={person.name} className="person-photo" />
            </div>

            <div className="personal-info-card">
              <h3>Personal Info</h3>

              <div className="info-item">
                <span className="info-label">Known For</span>
                <span className="info-val">{person.known_for_department || "Acting"}</span>
              </div>

              {person.birthday && (
                <div className="info-item">
                  <span className="info-label">Birthday</span>
                  <span className="info-val">
                    {person.birthday} {age && `(${age} years old)`}
                  </span>
                </div>
              )}

              {person.deathday && (
                <div className="info-item">
                  <span className="info-label">Died</span>
                  <span className="info-val">{person.deathday}</span>
                </div>
              )}

              {person.place_of_birth && (
                <div className="info-item">
                  <span className="info-label">Place of Birth</span>
                  <span className="info-val">{person.place_of_birth}</span>
                </div>
              )}

              <div className="info-item">
                <span className="info-label">Total Credits</span>
                <span className="info-val">{credits.length} Titles</span>
              </div>
            </div>
          </aside>

          {/* Right Column: Bio & Filmography */}
          <section className="person-main-content">
            <h1 className="person-name">{person.name}</h1>

            {/* Biography */}
            <div className="biography-section">
              <h3>Biography</h3>
              {person.biography ? (
                <div>
                  <p className={`biography-text ${isBioExpanded ? "expanded" : ""}`}>
                    {person.biography}
                  </p>
                  {person.biography.length > 400 && (
                    <button
                      className="read-more-btn"
                      onClick={() => setIsBioExpanded(!isBioExpanded)}
                    >
                      {isBioExpanded ? "Read Less" : "Read Full Biography"}
                    </button>
                  )}
                </div>
              ) : (
                <p className="no-bio">We don't have a biography for {person.name} yet.</p>
              )}
            </div>

            {/* Filmography Grid */}
            <div className="filmography-section">
              <div className="filmography-header">
                <h3>
                  <i className="fa-solid fa-film"></i> Known For & Filmography
                </h3>
                <span className="filmography-count">{credits.length} Movies</span>
              </div>

              {credits.length > 0 ? (
                <div className="filmography-grid">
                  {credits.map((movie) => (
                    <div key={movie.id} className="filmography-card-wrapper">
                      <MovieCard movie={movie} />
                      {movie.character && (
                        <p className="credit-character-role">as {movie.character}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-credits">No movie credits found.</p>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PersonPage;
