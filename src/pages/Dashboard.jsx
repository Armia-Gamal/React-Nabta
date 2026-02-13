import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    document.title = "Dashboard | Nabta Seniors";
  }, []);

  // 🔔 نوتيفكيشن بس لو كان مسجل قبل كده
  useEffect(() => {
    const alreadyLogged = localStorage.getItem("alreadyLogged");

    if (alreadyLogged === "true") {
      setShowNotification(true);
      localStorage.removeItem("alreadyLogged");

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <>
      {/* 🔔 Notification */}
      {showNotification && (
        <div className="notification info">
          You are already logged in 
        </div>
      )}

      {/* ✅ Dashboard simple view */}
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <h1> You are logged in</h1>

        <button
          onClick={logout}
          style={{
            padding: "10px 24px",
            borderRadius: "10px",
            border: "none",
            background: "#ef4444",
            color: "#fff",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Logout
        </button>
      </div>
    </>
  );
}
