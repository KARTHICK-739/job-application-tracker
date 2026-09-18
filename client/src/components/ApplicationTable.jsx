import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";
import { formatDate } from "../utils/formatters.js";

const ApplicationTable = ({ applications, onDelete }) => (
  <div className="table-wrap">
    <table className="app-table">
      <thead>
        <tr>
          <th>Company</th>
          <th>Position</th>
          <th>Location</th>
          <th>Status</th>
          <th>Type</th>
          <th>Applied</th>
          <th aria-label="Actions" />
        </tr>
      </thead>
      <tbody>
        {applications.map((application) => (
          <tr key={application._id}>
            <td>
              <strong>{application.company}</strong>
            </td>
            <td>{application.position}</td>
            <td>{application.location || "Remote / flexible"}</td>
            <td>
              <StatusBadge status={application.status} />
            </td>
            <td>{application.jobType}</td>
            <td>{formatDate(application.appliedDate)}</td>
            <td>
              <div className="row-actions">
                <Link
                  className="icon-button"
                  to={`/applications/${application._id}`}
                  title="View details"
                >
                  <Eye size={17} />
                </Link>
                <Link
                  className="icon-button"
                  to={`/applications/${application._id}/edit`}
                  title="Edit application"
                >
                  <Pencil size={17} />
                </Link>
                <button
                  className="icon-button danger"
                  type="button"
                  onClick={() => onDelete(application)}
                  title="Delete application"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ApplicationTable;
