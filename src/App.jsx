import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import MoviePage from "./Pages/MoviePage";
import MyListPage from "./Pages/MyListPage";
import PersonPage from "./Pages/PersonPage";
import { WatchlistProvider } from "./context/WatchlistContext";
import TrailerModal from "./Components/TrailerModal";
import SurpriseModal from "./Components/SurpriseModal";
import Toast from "./Components/Toast";
import "./App.css";

const App = () => {
  return (
    <WatchlistProvider>
      <div className="cineva-app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/moviepage/:id" element={<MoviePage />} />
          <Route path="/person/:id" element={<PersonPage />} />
          <Route path="/my-list" element={<MyListPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>

        {/* Global Instant Cinema Trailer Modal */}
        <TrailerModal />

        {/* Global Play Something Surprise Roulette Modal */}
        <SurpriseModal />

        {/* Global Toast Notifications */}
        <Toast />
      </div>
    </WatchlistProvider>
  );
};

export default App;
