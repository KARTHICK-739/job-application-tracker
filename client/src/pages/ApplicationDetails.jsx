import React from "react";
import { ArrowLeft, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { getErrorMessage } from "../services/api.js";
import {
  deleteApplication,
  getApplication,
} from "../services/applicationService.js";
import { formatDate } from "../utils/formatters.js";

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplication = async () => {
      try {
        const data = await getApplication(id);
        setApplication(data.application);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete ${application.position} at ${application.company}? This cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      await deleteApplication(application._id);
      navigate("/applications");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <LoadingState message="Loading application..." />;
  if (error) return <ErrorState message={error} />;
  if (!application) return null;

  return (
    <div className="page-stack narrow-page">
      <Link className="back-link" to="/applications">
        <ArrowLeft size={17} />
        Back to applications
      </Link>
      <div className="details-header">
        <div>
          <span className="eyebrow">{application.company}</span>
          <h1>{application.position}</h1>
          <StatusBadge status={application.status} />
        </div>
        <div className="details-actions">
          <Link
            className="button button-secondary"
            to={`/applications/${application._id}/edit`}
          >
            <Pencil size={17} />
            Edit
          </Link>
          <button
            className="button button-danger"
            type="button"
            onClick={handleDelete}
          >
            <Trash2 size={17} />
            Delete
          </button>
        </div>
      </div>
      <section className="detail-grid">
        <div>
          <span>Location</span>
          <strong>{application.location || "Remote / flexible"}</strong>
        </div>
        <div>
          <span>Job type</span>
          <strong>{application.jobType}</strong>
        </div>
        <div>
          <span>Applied date</span>
          <strong>{formatDate(application.appliedDate)}</strong>
        </div>
        <div>
          <span>Salary</span>
          <strong>{application.salary || "Not listed"}</strong>
        </div>
      </section>
      <section className="panel">
        <div className="panel-header">
          <h2>Notes</h2>
          {application.jobUrl ? (
            <a href={application.jobUrl} target="_blank" rel="noreferrer">
              Job post <ExternalLink size={15} />
            </a>
          ) : null}
        </div>
        <p className="notes-text">
          {application.notes || "No notes added yet."}
        </p>
      </section>
    </div>
  );
};

export default ApplicationDetails;
