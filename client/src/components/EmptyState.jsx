import { Link } from 'react-router-dom';

const EmptyState = ({ title, message, actionLabel, actionTo }) => (
  <div className="empty-state">
    <h3>{title}</h3>
    <p>{message}</p>
    {actionLabel && actionTo ? (
      <Link className="button button-primary" to={actionTo}>
        {actionLabel}
      </Link>
    ) : null}
  </div>
);

export default EmptyState;

