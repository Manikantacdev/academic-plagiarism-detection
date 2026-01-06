import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Report } from './pages/Report';
import MyReports from './pages/MyReports';
import { LandingPage } from './pages/LandingPage';
import { Analytics } from './pages/Analytics';
import { AnalysisProvider } from './context/AnalysisContext';
import { UserContext, type UserInfo } from './context/UserContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const navigate = useNavigate();

  const handleLogin = (user: UserInfo) => {
    setUserInfo(user);
    setIsAuthenticated(true);
    navigate('/');
  };

  const handleLogout = () => {
    setUserInfo(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <UserContext.Provider value={userInfo}>
      <AnalysisProvider>
        <Layout onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/report/:id" element={<Report />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AnalysisProvider>
    </UserContext.Provider>
  )
}

export default App
