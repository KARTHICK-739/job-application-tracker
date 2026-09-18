import React from "react";
import { BriefcaseBusiness } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../services/api.js";

const AuthPage = ({ mode }) => {
  const isRegister = mode === "register";
  const { isAuthenticated, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await register(form);
      } else {
        await login({ email: form.email, password: form.password });
      }
      navigate(location.state?.from?.pathname || "/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="brand auth-brand">
          <BriefcaseBusiness size={28} />
          <span>JobTrack</span>
        </div>
        <h1>
          {isRegister
            ? "Create your tracker account"
            : "Manage every application in one place"}
        </h1>
        <p>
          Track roles, statuses, notes, dates, and interview progress with a
          private dashboard backed by your own database.
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister ? (
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                required
                minLength="2"
              />
            </label>
          ) : null}
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              required
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={updateField}
              required
              minLength="6"
            />
          </label>
          {error ? <div className="alert alert-error">{error}</div> : null}
          <button
            className="button button-primary"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create account"
                : "Log in"}
          </button>
        </form>
        <p className="auth-switch">
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <Link to={isRegister ? "/" : "/register"}>
            {isRegister ? "Log in" : "Create an account"}
          </Link>
        </p>
      </section>
      <section className="auth-aside" aria-label="Product preview">
        <div className="preview-board">
          <div>
            <span>Total applications</span>
            <strong>24</strong>
          </div>
          <div>
            <span>Interviews</span>
            <strong>6</strong>
          </div>
          <div>
            <span>Offers</span>
            <strong>2</strong>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AuthPage;
