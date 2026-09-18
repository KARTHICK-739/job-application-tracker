import React from "react";
const LoadingState = ({ message = "Loading..." }) => (
  <div className="state-panel">
    <div className="spinner" aria-hidden="true" />
    <p>{message}</p>
  </div>
);

export default LoadingState;
