import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Footer from "./components/Footer";

import Dashboard from "./pages/Dashboard";
import Signup from "./pages/signup.jsx";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      {/* Navbar ثابت */}
      <Navbar />

      <Routes>

        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Signup Page */}
        <Route path="/signup" element={<Signup />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

      {/* Footer ثابت */}
      <Footer />

    </BrowserRouter>
  );
}

export default App;
