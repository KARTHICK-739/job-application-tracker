import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ApplicationForm from "../components/ApplicationForm.jsx";
import ErrorState from "../components/ErrorState.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { getErrorMessage } from "../services/api.js";
import {
  createApplication,
  getApplication,
  updateApplication,
} from "../services/applicationService.js";

const ApplicationFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;

    const loadApplication = async () => {
      try {
        const data = await getApplication(id);
        setInitialValues(data.application);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [id, isEditing]);

  const handleSubmit = async (payload) => {
    setSaving(true);
    setError("");
    try {
      const data = isEditing
        ? await updateApplication(id, payload)
        : await createApplication(payload);
      navigate(`/applications/${data.application._id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState message="Loading application..." />;

  return (
    <div className="page-stack narrow-page">
      <Link
        className="back-link"
        to={isEditing ? `/applications/${id}` : "/applications"}
      >
        <ArrowLeft size={17} />
        Back
      </Link>
      <div className="page-header">
        <div>
          <span className="eyebrow">{isEditing ? "Edit" : "Add"}</span>
          <h1>{isEditing ? "Update application" : "New application"}</h1>
        </div>
      </div>
      {error ? <ErrorState message={error} /> : null}
      <div className="panel">
        <ApplicationForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel={isEditing ? "Update application" : "Create application"}
          loading={saving}
        />
      </div>
    </div>
  );
};

export default ApplicationFormPage;
