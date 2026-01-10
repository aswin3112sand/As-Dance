// ACCESSIBILITY IMPROVEMENTS FOR App.jsx
// Add this code to your App.jsx file

// 1. Add skip-to-content link at the top of the JSX:
/*
<a href="#main-content" className="skip-to-content">
  Skip to main content
</a>
*/

// 2. Wrap main content in <main> element:
/*
<main id="main-content" role="main">
  <Routes>
    {/* routes */}
  </Routes>
</main>
*/

// 3. Add keyboard navigation support:
/*
useEffect(() => {
  const handleKeyDown = (e) => {
    // Skip to main content with Alt+M
    if (e.altKey && e.key === 'm') {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
*/

// COMPLETE UPDATED App.jsx:
/*
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Checkout from "./pages/Checkout.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentFailed from "./pages/PaymentFailed.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Admin from "./pages/Admin.jsx";
import Preview from "./pages/Preview.jsx";
import NotFound from "./pages/NotFound.jsx";

function ProtectedRoute({ children }) {
  const { loading, user } = useAuth();
  const loc = useLocation();
  const from = `${loc.pathname}${loc.search || ""}`;
  if (loading) return <div className="page-center text-white-50">Loading...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from }} />;
  return children;
}

function RootRoute() {
  return <Home />;
}

export default function App() {
  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === 'm') {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <main id="main-content" role="main" tabIndex="-1">
          <Routes>
            <Route path="/" element={<RootRoute />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dance" element={<Home />} />
            <Route path="/preview" element={<Preview />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-success"
              element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-failed"
              element={
                <ProtectedRoute>
                  <PaymentFailed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
*/
