import React from "react";

export default function Loading() {
  return (
    <div className="app-loading" role="status" aria-live="polite">
      <span className="spinner-dot" aria-hidden="true" />
      Loading...
    </div>
  );
}
