import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { protectedAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [profile, dashboard] = await Promise.all([
        protectedAPI.getProfile().catch(() => null),
        protectedAPI.getDashboard().catch(() => null),
      ]);
      setProfileData(profile);
      setDashboardData(dashboard);

      if (isAdmin()) {
        try {
          const admin = await protectedAPI.getAdminData();
          setAdminData(admin);
        } catch (err) {
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name} ({user?.role})</span>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Profile Information</h2>
          {loading ? (
            <p>Loading...</p>
          ) : profileData ? (
            <div className="info-section">
              <p><strong>ID:</strong> {profileData.user.id}</p>
              <p><strong>Email:</strong> {profileData.user.email}</p>
              <p><strong>Role:</strong> {profileData.user.role}</p>
            </div>
          ) : (
            <p>No profile data available</p>
          )}
        </div>

        <div className="dashboard-card">
          <h2>Dashboard Data</h2>
          {loading ? (
            <p>Loading...</p>
          ) : dashboardData ? (
            <div className="info-section">
              <p><strong>Status:</strong> {dashboardData.message}</p>
              <p><strong>Your Role:</strong> {dashboardData.role}</p>
            </div>
          ) : (
            <p>No dashboard data available</p>
          )}
        </div>

        {isAdmin() && (
          <div className="dashboard-card admin-card">
            <h2>Admin Panel</h2>
            {loading ? (
              <p>Loading...</p>
            ) : adminData ? (
              <div className="info-section">
                <p><strong>Status:</strong> {adminData.message}</p>
                <p><strong>Admin Access:</strong> Granted</p>
                <p className="admin-note">
                  This section is only visible to admin users.
                </p>
              </div>
            ) : (
              <p>No admin data available</p>
            )}
          </div>
        )}

        {!isAdmin() && (
          <div className="dashboard-card">
            <h2>User Information</h2>
            <p>You are logged in as a regular user. Admin features are not available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

