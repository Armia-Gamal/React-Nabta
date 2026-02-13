import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import "./Login.css";
import image from "../assets/images/Image.png";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "firebase/auth";

import { auth, googleProvider } from "../firebase";

export default function Login() {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRemember, setLoginRemember] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  // Page title
  useEffect(() => {
    document.title = "Login | Nabta Seniors";
  }, []);

  // 🔥 تحميل بيانات Remember Me
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    const savedPassword = localStorage.getItem("rememberPassword");
    const savedRemember = localStorage.getItem("rememberMe");

    if (savedRemember === "true") {
      setLoginEmail(savedEmail || "");
      setLoginPassword(savedPassword || "");
      setLoginRemember(true);
    }
  }, []);

  // 🔐 لو المستخدم مسجل بالفعل
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // =========================
  // 🔵 Google Login
  // =========================
  const handleGoogleLogin = async () => {
    try {
      await setPersistence(
        auth,
        loginRemember
          ? browserLocalPersistence
          : browserSessionPersistence
      );

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const isNewUser = result._tokenResponse?.isNewUser;

      if (isNewUser) {
        await user.delete();
        await auth.signOut();
        setLoginError("This account is not registered. Please sign up first.");
        return;
      }

      // 🔥 تخزين Remember Me
      if (loginRemember) {
        localStorage.setItem("rememberEmail", user.email);
        localStorage.setItem("rememberPassword", loginPassword);
        localStorage.setItem("rememberMe", "true");
      }

      navigate("/dashboard");

    } catch (error) {
      setLoginError(error.message);
    }
  };

  // =========================
  // 🟢 Email Login
  // =========================
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter email and password");
      return;
    }

    setLoginLoading(true);
    setLoginError("");
    setResetMessage("");

    try {
      await setPersistence(
        auth,
        loginRemember
          ? browserLocalPersistence
          : browserSessionPersistence
      );

      await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );

      // 🔥 هنا تخزين Remember Me
      if (loginRemember) {
        localStorage.setItem("rememberEmail", loginEmail);
        localStorage.setItem("rememberPassword", loginPassword);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberEmail");
        localStorage.removeItem("rememberPassword");
        localStorage.setItem("rememberMe", "false");
      }

      navigate("/dashboard");

    } catch {
      setLoginError("Invalid email or password.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!loginEmail) {
      setLoginError("Please enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, loginEmail);
      setResetMessage("Password reset email sent successfully.");
      setLoginError("");
    } catch {
      setLoginError("Failed to send reset email.");
      setResetMessage("");
    }
  };

  return (
    <main className="login-layout">
      <section className="login-left">
        <div className="login-card-box">
          <h2>Welcome Back</h2>
          <p>Enter your email and password to sign in</p>

          <label>Email</label>
          <input
            type="email"
            placeholder="Your email address"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Your password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />

          <div style={{ textAlign: "right", marginBottom: "10px" }}>
            <span
              onClick={() => navigate("/reset-password")}
              style={{ cursor: "pointer", fontSize: "13px", color: "#fc0038" }}
            >
              Forgot password?
            </span>
          </div>

          <div className="login-remember">
            <label className="login-switch">
              <input
                type="checkbox"
                checked={loginRemember}
                onChange={(e) => setLoginRemember(e.target.checked)}
              />
              <span className="login-slider"></span>
            </label>
            <span>Remember me</span>
          </div>

          {loginError && (
            <p style={{ color: "red", fontSize: "13px", marginTop: "10px" }}>
              {loginError}
            </p>
          )}

          {resetMessage && (
            <p style={{ color: "green", fontSize: "13px", marginTop: "10px" }}>
              {resetMessage}
            </p>
          )}

          <button
            className="login-btn-main"
            onClick={handleLogin}
            disabled={loginLoading}
          >
            {loginLoading ? "Signing in..." : "Sign in"}
          </button>

          <p className="login-signup-link">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/signup")}>Sign up</span>
          </p>

          <div className="login-social">
            <i className="fa-brands fa-facebook-f"></i>
            <i className="fa-brands fa-apple"></i>
            <i
              className="fa-brands fa-google"
              onClick={handleGoogleLogin}
              style={{ cursor: "pointer" }}
            ></i>
          </div>
        </div>
      </section>

      <section className="login-right">
        <img src={image} alt="login" />
      </section>
    </main>
  );
}
