import React, { Suspense, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth.jsx";
import { LazyMotion, domAnimation } from "framer-motion";
import { scheduleAnalytics, trackPageView } from "./analytics.js";

// Lazy load pages
const Home = React.lazy(() => import("./pages/Home.jsx"));
const Login = React.lazy(() => import("./pages/Login.jsx"));
const Register = React.lazy(() => import("./pages/Register.jsx"));
const Checkout = React.lazy(() => import("./pages/Checkout.jsx"));
const PaymentSuccess = React.lazy(() => import("./pages/PaymentSuccess.jsx"));
const PaymentFailed = React.lazy(() => import("./pages/PaymentFailed.jsx"));
const Dashboard = React.lazy(() => import("./pages/Dashboard.jsx"));
const Admin = React.lazy(() => import("./pages/Admin.jsx"));
const Preview = React.lazy(() => import("./pages/Preview.jsx"));
const ServicePage = React.lazy(() => import("./pages/ServicePage.jsx"));
const LandingPromo = React.lazy(() => import("./pages/LandingPromo.jsx"));
const NotFound = React.lazy(() => import("./pages/NotFound.jsx"));

function ProtectedRoute({ children }) {
  const { loading, user } = useAuth();
  const loc = useLocation();
  const from = `${loc.pathname}${loc.search || ""}`;
  if (loading) {
    return (
      <div className="app-loading-inline">
        <span className="spinner-dot" aria-hidden="true" />
        Loading...
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace state={{ from }} />;
  return children;
}

function RootRoute() {
  return <Home />;
}

import Loading from "./components/Loading";
import OfferPopup from "./components/OfferPopup.jsx";

function RevealObserver() {
  const location = useLocation();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".reveal"));
    if (!elements.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      elements.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname]);

  return null;
}

function MetaPixelPageTracker() {
  const location = useLocation();
  const initialRouteRef = useRef(`${location.pathname}${location.search || ""}`);

  useEffect(() => {
    scheduleAnalytics();
  }, []);

  useEffect(() => {
    const path = `${location.pathname}${location.search || ""}`;
    trackPageView(path, path === initialRouteRef.current);
  }, [location.pathname, location.search]);

  return null;
}

function OfferPopupMount() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, user } = useAuth();

  const isOfferRoute =
    location.pathname === "/landing" ||
    location.pathname === "/offer";

  const handlePrimaryCta = () => {
    const target = "/checkout?pay=1";
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }
    navigate(target);
  };

  return (
    <OfferPopup
      isActive={isOfferRoute && !loading}
      hasPurchased={Boolean(user?.unlocked)}
      onPrimaryCta={handlePrimaryCta}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <RevealObserver />
        <MetaPixelPageTracker />
        <OfferPopupMount />
        <LazyMotion features={domAnimation}>
          <main id="main-content" role="main" tabIndex="-1">
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<RootRoute />} />
                <Route path="/home" element={<Home />} />
                <Route path="/dance" element={<Home />} />
                <Route path="/landing" element={<LandingPromo />} />
                <Route path="/offer" element={<LandingPromo />} />
                <Route path="/services" element={<ServicePage />} />
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
            </Suspense>
          </main>
        </LazyMotion>
      </BrowserRouter>
    </AuthProvider>
  );
}
