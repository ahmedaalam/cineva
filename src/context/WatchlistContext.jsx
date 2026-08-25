import { createContext, useContext, useState, useEffect } from "react";

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem("cineva_watchlist");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error reading watchlist from localStorage:", e);
      return [];
    }
  });

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const [activeTrailerMovie, setActiveTrailerMovie] = useState(null);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cineva_watchlist", JSON.stringify(watchlist));
    } catch (e) {
      console.error("Error saving watchlist to localStorage:", e);
    }
  }, [watchlist]);

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some((item) => item.id === movieId);
  };

  const toggleWatchlist = (movie) => {
    if (!movie || !movie.id) return;
    const exists = isInWatchlist(movie.id);

    if (exists) {
      setWatchlist((prev) => prev.filter((item) => item.id !== movie.id));
      showToast(`Removed "${movie.title || movie.name}" from My List`, "info");
    } else {
      setWatchlist((prev) => [movie, ...prev]);
      showToast(`Added "${movie.title || movie.name}" to My List`, "success");
    }
  };

  const openTrailer = (movie) => {
    if (movie) setActiveTrailerMovie(movie);
  };

  const closeTrailer = () => {
    setActiveTrailerMovie(null);
  };

  const openSurprise = () => {
    setIsSurpriseOpen(true);
  };

  const closeSurprise = () => {
    setIsSurpriseOpen(false);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        isInWatchlist,
        toggleWatchlist,
        toast,
        showToast,
        activeTrailerMovie,
        openTrailer,
        closeTrailer,
        isSurpriseOpen,
        openSurprise,
        closeSurprise,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
};
