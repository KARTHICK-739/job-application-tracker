import React from "react";
const StatCard = ({ label, value, tone = "default" }) => (
  <div className={`stat-card stat-${tone}`}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

export default StatCard;
