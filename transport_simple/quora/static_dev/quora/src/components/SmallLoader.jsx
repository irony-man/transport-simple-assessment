import React from "react";

export default function SmallLoader() {
  return (
      <div className="spinner-border spinner-border-sm text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
  );
}
