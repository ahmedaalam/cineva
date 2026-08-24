import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import MoviePage from "./Pages/MoviePage";
import "./App.css";

const App = () => {
  return (
    <div className="cineva-app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/moviepage/:id" element={<MoviePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
};

export default App;
