import React, { useState, useEffect } from 'react';
import './App.css';
import Alert from './components/Alert';
import LoginCard from './components/LoginCard';
import RegisterCard from './components/RegisterCard';
import TodoDashboard from './components/TodoDashboard';

function App() {
  const [view, setView] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('todo_token') || null);
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  useEffect(() => {
    if (token) {
      const cachedUser = localStorage.getItem('todo_user');
      if (cachedUser) setUser(JSON.parse(cachedUser));
      setView('dashboard');
    } else {
      setUser(null);
      setView('login');
    }
  }, [token]);

  const showAlert = (type, message) => setAlert({ type, message });

  const handleLogout = () => {
    localStorage.removeItem('todo_token');
    localStorage.removeItem('todo_user');
    setToken(null);
    showAlert('success', 'Logged out successfully');
  };

  return (
    <div className="app-container">
      <Alert alert={alert} />

      {view === 'login' && (
        <LoginCard
          onLoginSuccess={(loggedInUser, userToken) => {
            setToken(userToken);
            setUser(loggedInUser);
            showAlert('success', 'Welcome back!');
          }}
          onSwitchToRegister={() => setView('register')}
        />
      )}

      {view === 'register' && (
        <RegisterCard
          onRegisterSuccess={() => {
            setView('login');
            showAlert('success', 'Registration successful! Please login.');
          }}
          onSwitchToLogin={() => setView('login')}
        />
      )}

      {view === 'dashboard' && (
        <TodoDashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
