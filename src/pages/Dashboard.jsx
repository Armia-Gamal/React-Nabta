import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    document.title = "Dashboard | Nabta Seniors";
  }, []);

  const logout = async () => {
    try {
      await signOut(auth); // بس كده
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {showNotification && (
        <div className="notification info">
          You are already logged in
        </div>
      )}

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
        <h1>You are logged in</h1>

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
