import React from "react";
import { Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ApplicationTable from "../components/ApplicationTable.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { getErrorMessage } from "../services/api.js";
import {
  deleteApplication,
  getApplications,
} from "../services/applicationService.js";
import { JOB_TYPES, STATUSES } from "../utils/constants.js";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    jobType: "All",
    sort: "newest",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getApplications(filters);
      setApplications(data.applications);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(loadApplications, 250);
    return () => clearTimeout(timeout);
  }, [filters]);

  const updateFilter = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleDelete = async (application) => {
    const confirmed = window.confirm(
      `Delete ${application.position} at ${application.company}? This cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      await deleteApplication(application._id);
      setNotice("Application deleted successfully.");
      await loadApplications();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <span className="eyebrow">Applications</span>
          <h1>Your job pipeline</h1>
        </div>
        <Link className="button button-primary" to="/applications/new">
          <Plus size={18} />
          Add Application
        </Link>
      </div>

      <section className="filters-panel">
        <label className="search-field">
          <Search size={18} />
          <input
            name="search"
            value={filters.search}
            onChange={updateFilter}
            placeholder="Search company, role, location..."
          />
        </label>
        <select
          name="status"
          value={filters.status}
          onChange={updateFilter}
          aria-label="Filter by status"
        >
          <option>All</option>
          {STATUSES.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <select
          name="jobType"
          value={filters.jobType}
          onChange={updateFilter}
          aria-label="Filter by job type"
        >
          <option>All</option>
          {JOB_TYPES.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
        <select
          name="sort"
          value={filters.sort}
          onChange={updateFilter}
          aria-label="Sort applications"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="company">Company A-Z</option>
          <option value="status">Status A-Z</option>
        </select>
      </section>

      {notice ? <div className="alert alert-success">{notice}</div> : null}
      {error ? <ErrorState message={error} /> : null}
      {loading ? (
        <LoadingState message="Loading applications..." />
      ) : applications.length ? (
        <ApplicationTable applications={applications} onDelete={handleDelete} />
      ) : (
        <EmptyState
          title="No matching applications"
          message="Adjust the filters or add a new job application."
          actionLabel="Add Application"
          actionTo="/applications/new"
        />
      )}
    </div>
  );
};

export default Applications;
