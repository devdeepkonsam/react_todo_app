import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';

const backendUrl = import.meta.env.VITE_BACKEND_API;

function TodoDashboard({ user, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [todosLoading, setTodosLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    setTodosLoading(true);
    try {
      const token = localStorage.getItem('todo_token');
      const response = await axios.get(`${backendUrl}/todo`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(response.data.todos || []);
    } catch (err) {
      console.error('Failed to load todos:', err);
    } finally {
      setTodosLoading(false);
    }
  };

  const handleTodoAdded = (newTodo) => {
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleTodoToggle = (id, updatedTodo) => {
    setTodos((prev) => prev.map((t) => t._id === id ? updatedTodo : t));
  };

  const handleTodoSaveEdit = (id, updatedTodo) => {
    setTodos((prev) => prev.map((t) => t._id === id ? updatedTodo : t));
  };

  const handleTodoDelete = (id) => {
    setTodos((prev) => prev.filter((t) => t._id !== id));
  };

  const totalTasks = todos.length;
  const completedTasks = todos.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-user">
          <div className="user-avatar">
            {user?.username ? user.username.substring(0, 2).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <h2>Hello, {user?.username || 'User'}!</h2>
            <p>{user?.email}</p>
          </div>
        </div>
        <button className="btn-logout" onClick={onLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-val">{totalTasks}</div>
          <div className="stat-lbl">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-val" style={{ color: '#10b981' }}>{completedTasks}</div>
          <div className="stat-lbl">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-val" style={{ color: 'var(--accent)' }}>{pendingTasks}</div>
          <div className="stat-lbl">Pending</div>
        </div>
      </section>

      <TodoForm onTodoAdded={handleTodoAdded} />

      <div className="filters-bar">
        <div className="tabs">
          <button className={`tab-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`tab-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Active</button>
          <button className={`tab-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
        </div>
      </div>

      {todosLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <div className="spinner" style={{ borderTopColor: 'var(--accent)', width: '32px', height: '32px' }}></div>
        </div>
      ) : filteredTodos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <p>No tasks found. Get started by adding a task above!</p>
        </div>
      ) : (
        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onToggleTodo={handleTodoToggle}
              onSaveEdit={handleTodoSaveEdit}
              onDeleteTodo={handleTodoDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoDashboard;
