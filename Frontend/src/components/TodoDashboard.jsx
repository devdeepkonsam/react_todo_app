import React, { useState } from 'react';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';

function TodoDashboard({
  user,
  todos,
  todosLoading,
  onAddTodo,
  onToggleTodo,
  onSaveEdit,
  onDeleteTodo,
  onLogout
}) {
  const [filter, setFilter] = useState('all');

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
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
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

      <TodoForm onAddTodo={onAddTodo} />

      <div className="filters-bar">
        <div className="tabs">
          <button
            className={`tab-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`tab-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`tab-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
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
              onToggleTodo={onToggleTodo}
              onSaveEdit={onSaveEdit}
              onDeleteTodo={onDeleteTodo}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoDashboard;
