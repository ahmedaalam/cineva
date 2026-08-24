import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import MoviePage from "./Pages/MoviePage";
import MyListPage from "./Pages/MyListPage";
import { WatchlistProvider } from "./context/WatchlistContext";
import TrailerModal from "./Components/TrailerModal";
import Toast from "./Components/Toast";
import "./App.css";

const App = () => {
  return (
    <WatchlistProvider>
      <div className="cineva-app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/moviepage/:id" element={<MoviePage />} />
          <Route path="/my-list" element={<MyListPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>

        {/* Global Instant Cinema Trailer Modal */}
        <TrailerModal />

        {/* Global Toast Notifications */}
        <Toast />
      </div>
    </WatchlistProvider>
  );
};

export default App;
