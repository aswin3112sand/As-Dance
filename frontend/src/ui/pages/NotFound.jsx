import React from "react";
import { Link } from "react-router-dom";

export default function NotFound(){
  return (
    <div className="container-max section">
      <div className="card-glass p-4">
        <h2 className="fw-bold">Page not found</h2>
        <p className="subtle">This route is handled by React Router. Ensure Spring Boot SPA forward is enabled.</p>
        <Link to="/" className="btn btn-neon">Go Home</Link>
      </div>
    </div>
  );
}
