import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Applications from './pages/Applications.jsx';
import ApplicationFormPage from './pages/ApplicationFormPage.jsx';
import ApplicationDetails from './pages/ApplicationDetails.jsx';
import NotFound from './pages/NotFound.jsx';

const App = () => (
  <Routes>
    <Route path="/" element={<AuthPage mode="login" />} />
    <Route path="/register" element={<AuthPage mode="register" />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/applications/new" element={<ApplicationFormPage />} />
        <Route path="/applications/:id" element={<ApplicationDetails />} />
        <Route path="/applications/:id/edit" element={<ApplicationFormPage />} />
      </Route>
    </Route>
    <Route path="/home" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;

