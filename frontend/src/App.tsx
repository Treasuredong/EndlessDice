import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GamePage from './pages/GamePage';
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';
import LeaderboardPage from './pages/LeaderboardPage';
import GameRulesPage from './pages/GameRulesPage';
import AdminDashboard from './pages/AdminDashboard';
import Header from './components/Header';
import './App.css';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <div className="main-app">
                  <Header />
                  <GamePage />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/deposit" 
            element={
              <ProtectedRoute>
                <div className="main-app">
                  <Header />
                  <DepositPage />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/withdraw" 
            element={
              <ProtectedRoute>
                <div className="main-app">
                  <Header />
                  <WithdrawPage />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leaderboard" 
            element={
              <ProtectedRoute>
                <div className="main-app">
                  <Header />
                  <LeaderboardPage />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/rules" 
            element={
              <ProtectedRoute>
                <div className="main-app">
                  <Header />
                  <GameRulesPage />
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* Admin route */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <div className="main-app">
                  <Header />
                  <AdminDashboard />
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
