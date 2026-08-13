import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Alert from './components/Alert';
import LoginCard from './components/LoginCard';
import RegisterCard from './components/RegisterCard';
import TodoDashboard from './components/TodoDashboard';

const Backend_Url = import.meta.env.VITE_BACKEND_API;

const getHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`
    }
});

function App() {
    const [view, setView] = useState('login');
    const [token, setToken] = useState(localStorage.getItem('todo_token') || null);
    const [user, setUser] = useState(null);
    const [todos, setTodos] = useState([]);
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    const [todosLoading, setTodosLoading] = useState(false);

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => setAlert(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('todo_token', token);
            const cachedUser = localStorage.getItem('todo_user');
            if (cachedUser) {
                setUser(JSON.parse(cachedUser));
            }
            setView('dashboard');
            loadTodos(token);
        } else {
            localStorage.removeItem('todo_token');
            localStorage.removeItem('todo_user');
            setUser(null);
            setTodos([]);
            setView('login');
        }
    }, [token]);

    const showAlert = (type, message) => {
        setAlert({ type, message });
    };

    const loadTodos = async (authToken) => {
        setTodosLoading(true);
        try {
            const response = await axios.get(`${Backend_Url}/todo`, getHeaders(authToken));
            setTodos(response.data.todos || []);
        } catch (err) {
            showAlert('error', err.response?.data?.message || err.message);
        } finally {
            setTodosLoading(false);
        }
    };

    const handleRegister = async (username, email, password) => {
        setLoading(true);
        try {
            await axios.post(`${Backend_Url}/auth/register`, { username, email, password });
            showAlert('success', 'Registration successful! Please login.');
            setView('login');
        } catch (err) {
            showAlert('error', err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (identifier, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${Backend_Url}/auth/login`, { email: identifier, password });
            localStorage.setItem('todo_user', JSON.stringify(response.data.user));
            setUser(response.data.user);
            setToken(response.data.token);
            showAlert('success', 'Welcome back!');
        } catch (err) {
            showAlert('error', err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTodo = async (title) => {
        try {
            const response = await axios.post(`${Backend_Url}/todo`, { title }, getHeaders(token));
            setTodos((prev) => [response.data.todo, ...prev]);
        } catch (err) {
            showAlert('error', err.response?.data?.message || err.message);
        }
    };

    const handleToggleTodo = async (id, currentCompleted) => {
        try {
            const response = await axios.put(`${Backend_Url}/todo/${id}`, { completed: !currentCompleted }, getHeaders(token));
            setTodos((prev) =>
                prev.map((todo) => (todo._id === id ? response.data.todo : todo))
            );
        } catch (err) {
            showAlert('error', err.response?.data?.message || err.message);
        }
    };

    const handleSaveEdit = async (id, newTitle) => {
        try {
            const response = await axios.put(`${Backend_Url}/todo/${id}`, { title: newTitle }, getHeaders(token));
            setTodos((prev) =>
                prev.map((todo) => (todo._id === id ? response.data.todo : todo))
            );
        } catch (err) {
            showAlert('error', err.response?.data?.message || err.message);
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            await axios.delete(`${Backend_Url}/todo/${id}`, getHeaders(token));
            setTodos((prev) => prev.filter((todo) => todo._id !== id));
        } catch (err) {
            showAlert('error', err.response?.data?.message || err.message);
        }
    };

    const handleLogout = () => {
        setToken(null);
        showAlert('success', 'Logged out successfully');
    };

    return (
        <div className="app-container">
            <Alert alert={alert} />

            {view === 'login' && (
                <LoginCard
                    onLogin={handleLogin}
                    onSwitchToRegister={() => setView('register')}
                    loading={loading}
                />
            )}

            {view === 'register' && (
                <RegisterCard
                    onRegister={handleRegister}
                    onSwitchToLogin={() => setView('login')}
                    loading={loading}
                />
            )}

            {view === 'dashboard' && (
                <TodoDashboard
                    user={user}
                    todos={todos}
                    todosLoading={todosLoading}
                    onAddTodo={handleAddTodo}
                    onToggleTodo={handleToggleTodo}
                    onSaveEdit={handleSaveEdit}
                    onDeleteTodo={handleDeleteTodo}
                    onLogout={handleLogout}
                />
            )}
        </div>
    );
}

export default App;
