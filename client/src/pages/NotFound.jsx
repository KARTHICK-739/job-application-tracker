import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <main className="not-found">
    <h1>Page not found</h1>
    <p>The page you are looking for does not exist.</p>
    <Link className="button button-primary" to="/dashboard">
      Back to dashboard
    </Link>
  </main>
);

export default NotFound;
