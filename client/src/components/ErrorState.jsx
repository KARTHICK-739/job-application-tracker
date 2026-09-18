import React from "react";
const ErrorState = ({ message }) => (
  <div className="alert alert-error">
    <strong>Something went wrong</strong>
    <span>{message}</span>
  </div>
);

export default ErrorState;
