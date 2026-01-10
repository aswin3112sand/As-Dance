// EXACT CODE TO ADD TO App.jsx FOR ACCESSIBILITY

// ============================================
// STEP 1: Add this import at the top
// ============================================
// (Already in your file, just verify)
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth.jsx";
// ... rest of imports


// ============================================
// STEP 2: Replace the entire App.jsx with this:
// ============================================

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
  // Keyboard navigation support (Alt+M to skip to main content)
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
        {/* Skip to main content link - visible on focus */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        {/* Main content landmark for accessibility */}
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


// ============================================
// WHAT CHANGED:
// ============================================
// 1. Added useEffect hook for keyboard navigation
// 2. Added skip-to-content link (styled in responsive-fixes.css)
// 3. Wrapped Routes in <main> element with id="main-content"
// 4. Added role="main" for semantic HTML
// 5. Added tabIndex="-1" to allow focus management
// 6. Added keyboard shortcut: Alt+M to skip to main content


// ============================================
// CSS ALREADY ADDED (in responsive-fixes.css):
// ============================================
/*
.skip-to-content {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--neon-blue);
  color: #000;
  padding: 8px 16px;
  text-decoration: none;
  z-index: 100;
  border-radius: 0 0 8px 0;
  font-weight: 600;
}

.skip-to-content:focus {
  top: 0;
}
*/


// ============================================
// TESTING:
// ============================================
// 1. Press Tab key - skip-to-content link should appear
// 2. Press Enter - should scroll to main content
// 3. Press Alt+M - should also skip to main content
// 4. Run Lighthouse - Accessibility score should be 100
