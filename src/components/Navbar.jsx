import "../index.css";
import "./Navbar.css";
import logo from "../assets/images/Logo.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="logo" />
      </div>

      <ul className="nav-links">
        <li><i className="fa-solid fa-cube"></i> Dashboard</li>
        <li><i className="fa-solid fa-user"></i> Profile</li>
        <li><i className="fa-solid fa-user-plus"></i> Sign Up</li>
        <li><i className="fa-solid fa-key"></i> Sign In</li>
      </ul>

      <button className="nav-btn">Free Test</button>
    </nav>
  );
}
