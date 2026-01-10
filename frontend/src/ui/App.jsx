import React from "react";
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
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dance" element={<Home />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/checkout"
            element={(
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/payment-success"
            element={(
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/payment-failed"
            element={(
              <ProtectedRoute>
                <PaymentFailed />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            )}
          />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
