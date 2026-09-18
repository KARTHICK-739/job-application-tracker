import React from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import StatCard from "../components/StatCard.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EmptyState from "../components/EmptyState.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { getErrorMessage } from "../services/api.js";
import { getApplicationStats } from "../services/applicationService.js";
import { STATUSES } from "../utils/constants.js";
import { formatDate } from "../utils/formatters.js";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await getApplicationStats();
        setData(response);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) return <LoadingState message="Loading dashboard..." />;
  if (error) return <ErrorState message={error} />;

  const chartData = STATUSES.map((status) => ({
    status,
    count: data.stats.byStatus[status] || 0,
  }));

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>Application overview</h1>
        </div>
        <Link className="button button-primary" to="/applications/new">
          <Plus size={18} />
          Add Application
        </Link>
      </div>

      <section className="stat-grid">
        <StatCard label="Total" value={data.stats.total} />
        <StatCard
          label="Applied"
          value={data.stats.byStatus.Applied}
          tone="blue"
        />
        <StatCard
          label="Screening"
          value={data.stats.byStatus.Screening}
          tone="violet"
        />
        <StatCard
          label="Interviews"
          value={data.stats.byStatus.Interview}
          tone="amber"
        />
        <StatCard
          label="Offers"
          value={data.stats.byStatus.Offer}
          tone="green"
        />
        <StatCard
          label="Rejected"
          value={data.stats.byStatus.Rejected}
          tone="red"
        />
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Status breakdown</h2>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Recent applications</h2>
            <Link to="/applications">View all</Link>
          </div>
          {data.recentApplications.length ? (
            <div className="recent-list">
              {data.recentApplications.map((application) => (
                <Link
                  key={application._id}
                  to={`/applications/${application._id}`}
                  className="recent-item"
                >
                  <div>
                    <strong>{application.position}</strong>
                    <span>
                      {application.company} •{" "}
                      {formatDate(application.appliedDate)}
                    </span>
                  </div>
                  <StatusBadge status={application.status} />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No applications yet"
              message="Add your first role to start seeing dashboard activity."
              actionLabel="Add Application"
              actionTo="/applications/new"
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
