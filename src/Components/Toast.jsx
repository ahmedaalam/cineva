import { useWatchlist } from "../context/WatchlistContext";
import "./Toast.css";

const Toast = () => {
  const { toast } = useWatchlist();

  if (!toast.visible) return null;

  return (
    <div className={`cineva-toast ${toast.type}`}>
      <div className="toast-icon">
        {toast.type === "success" ? (
          <i className="fa-solid fa-circle-check"></i>
        ) : (
          <i className="fa-solid fa-circle-info"></i>
        )}
      </div>
      <span className="toast-message">{toast.message}</span>
    </div>
  );
};

export default Toast;
