import React, { useState, useEffect } from 'react';
import './App.css';
import LoginCard from './components/LoginCard';
import RegisterCard from './components/RegisterCard';
import TodoDashboard from './components/TodoDashboard';

function App() {
  const [view, setView] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('todo_token') || null);
  const [user, setUser] = useState(null);

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

  const handleLogout = () => {
    localStorage.removeItem('todo_token');
    localStorage.removeItem('todo_user');
    setToken(null);
  };

  return (
    <div className="app-container">
      {view === 'login' && (
        <LoginCard
          onLoginSuccess={(loggedInUser, userToken) => {
            setToken(userToken);
            setUser(loggedInUser);
          }}
          onSwitchToRegister={() => setView('register')}
        />
      )}

      {view === 'register' && (
        <RegisterCard
          onRegisterSuccess={() => {
            setView('login');
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
