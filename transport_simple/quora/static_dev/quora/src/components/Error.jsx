import React from "react";

export default function Error({ error }) {
  return error ? (
    <div className="text-danger small mt-2">
      {Array.isArray(error) && error.length ? error.join(" ") : error}
    </div>
  ) : (
    <></>
  );
}
