import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Sign Up | Nabta Seniors";
  }, []);

  // ===============================
  // 🟢 Email/Password Signup
  // ===============================
  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAa5gqPTc9NKFe56ERU6dgs-f2mMBS7LDg",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error.message.replaceAll("_", " "));
      }

      const { idToken, localId } = data;

      // Save user in Firestore
      await fetch(
        `https://firestore.googleapis.com/v1/projects/gp-hu-42ca5/databases/(default)/documents/users?documentId=${localId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            fields: {
              name: { stringValue: name },
              email: { stringValue: email },
              createdAt: {
                timestampValue: new Date().toISOString(),
              },
            },
          }),
        }
      );

      localStorage.setItem("token", idToken);
      localStorage.setItem("email", email);

      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // 🔵 Google Signup
  // ===============================
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      await fetch(
        `https://firestore.googleapis.com/v1/projects/gp-hu-42ca5/databases/(default)/documents/users?documentId=${user.uid}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fields: {
              name: { stringValue: user.displayName || "Google User" },
              email: { stringValue: user.email },
              createdAt: {
                timestampValue: new Date().toISOString(),
              },
            },
          }),
        }
      );

      localStorage.setItem("token", token);
      localStorage.setItem("email", user.email);

      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <section className="signup-hero">
        <div className="signup-welcome">
          <h1>Welcome!</h1>
          <p>
          Register now to detect plant diseases quickly and accurately using our AI-powered system for healthier crops.
          </p>
        </div>
      </section>

      <div className="signup-layout">
        <div className="signup-card">
          <h2>Register with</h2>

          <div className="signup-social">
            <i className="fa-brands fa-facebook-f"></i>
            <i className="fa-brands fa-apple"></i>
            <i
              className="fa-brands fa-google"
              onClick={handleGoogleSignup}
              style={{ cursor: "pointer" }}
            ></i>
          </div>

          <div className="signup-divider">
            <span>Or</span>
          </div>

          <label>Name</label>
          <input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p style={{ color: "red", fontSize: "13px", marginTop: "10px" }}>
              {error}
            </p>
          )}

          <button
            className="signup-btn"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <div className="signup-footer">
            Already have an account?{" "}
            <span onClick={() => navigate("/")}>Sign In</span>
          </div>
        </div>
      </div>
    </>
  );
}
