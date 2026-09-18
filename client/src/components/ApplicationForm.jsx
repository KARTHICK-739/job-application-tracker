import React, { useState } from "react";
import { JOB_TYPES, STATUSES } from "../utils/constants.js";
import { toInputDate } from "../utils/formatters.js";

const defaultValues = {
  company: "",
  position: "",
  location: "",
  jobType: "Full-time",
  status: "Applied",
  appliedDate: toInputDate(),
  salary: "",
  jobUrl: "",
  notes: "",
};

const ApplicationForm = ({
  initialValues,
  onSubmit,
  submitLabel = "Save application",
  loading = false,
}) => {
  const [form, setForm] = useState({
    ...defaultValues,
    ...initialValues,
    appliedDate: toInputDate(initialValues?.appliedDate),
  });

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        Company
        <input
          name="company"
          value={form.company}
          onChange={updateField}
          required
          maxLength="120"
        />
      </label>
      <label>
        Position
        <input
          name="position"
          value={form.position}
          onChange={updateField}
          required
          maxLength="120"
        />
      </label>
      <label>
        Location
        <input
          name="location"
          value={form.location}
          onChange={updateField}
          maxLength="120"
        />
      </label>
      <label>
        Salary
        <input
          name="salary"
          value={form.salary}
          onChange={updateField}
          placeholder="$90k - $110k"
          maxLength="80"
        />
      </label>
      <label>
        Job Type
        <select name="jobType" value={form.jobType} onChange={updateField}>
          {JOB_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <label>
        Status
        <select name="status" value={form.status} onChange={updateField}>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
      <label>
        Applied Date
        <input
          name="appliedDate"
          type="date"
          value={form.appliedDate}
          onChange={updateField}
        />
      </label>
      <label>
        Job URL
        <input
          name="jobUrl"
          type="url"
          value={form.jobUrl}
          onChange={updateField}
          placeholder="https://example.com/job"
          maxLength="500"
        />
      </label>
      <label className="full-span">
        Notes
        <textarea
          name="notes"
          value={form.notes}
          onChange={updateField}
          rows="5"
          maxLength="2000"
        />
      </label>
      <div className="form-actions full-span">
        <button
          className="button button-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ApplicationForm;
