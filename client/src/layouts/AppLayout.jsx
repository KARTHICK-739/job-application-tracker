import { BriefcaseBusiness, LayoutDashboard, LogOut, Menu, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/applications', label: 'Applications', icon: BriefcaseBusiness },
  { to: '/applications/new', label: 'Add Application', icon: Plus }
];

const AppLayout = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <BriefcaseBusiness size={26} />
          <span>JobTrack</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <div>
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>
          <button className="icon-button" type="button" onClick={handleLogout} title="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>
      <div className="content-area">
        <header className="topbar">
          <button className="icon-button mobile-only" type="button" onClick={() => setOpen((value) => !value)} title="Toggle menu">
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
          <div>
            <span className="eyebrow">Workspace</span>
            <strong>Job Application Tracker</strong>
          </div>
          <button className="button button-ghost" type="button" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

