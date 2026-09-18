import React from "react";
import { statusTone } from "../utils/constants.js";

const StatusBadge = ({ status }) => (
  <span className={`status-badge status-${statusTone[status] || "blue"}`}>
    {status}
  </span>
);

export default StatusBadge;
