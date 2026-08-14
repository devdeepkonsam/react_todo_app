import React, { useState } from 'react';
import axios from 'axios';

const backendurl = (import.meta.env.VITE_BACKEND_API || import.meta.env.VITE_SERVER_URL || "").replace(/\/$/, "");
const apiBase = backendurl.endsWith("/api") ? backendurl : `${backendurl}/api`;

function TodoItem({ todo, onToggleTodo, onSaveEdit, onDeleteTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(todo.title);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('todo_token');
      const response = await axios.put(`${apiBase}/todo/${todo._id}`, { completed: !todo.completed }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data?.todo) {
        onToggleTodo(todo._id, response.data.todo);
      }
    } catch (err) {
      console.error(err.response?.data?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingTitle.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('todo_token');
      const response = await axios.put(`${apiBase}/todo/${todo._id}`, { title: editingTitle }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data?.todo) {
        onSaveEdit(todo._id, response.data.todo);
      }
      setIsEditing(false);
    } catch (err) {
      console.error(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('todo_token');
      await axios.delete(`${apiBase}/todo/${todo._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onDeleteTodo(todo._id);
    } catch (err) {
      console.error(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditingTitle(todo.title);
    }
  };

  return (
    <li className="todo-item">
      <div className="todo-item-left">
        <button className={`custom-checkbox ${todo.completed ? 'checked' : ''}`} onClick={handleToggle} disabled={loading} type="button">
          <svg width="12" height="12" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>

        <div className="todo-text-wrapper">
          {isEditing ? (
            <input
              type="text"
              className="todo-input"
              style={{ padding: '6px 12px', fontSize: '15px' }}
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              autoFocus
              disabled={loading}
            />
          ) : (
            <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
              {todo.title}
            </span>
          )}
          <span className="todo-time">
            {todo.timestamp ? new Date(todo.timestamp).toLocaleDateString(undefined, {
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            }) : ''}
          </span>
        </div>
      </div>

      <div className="todo-actions">
        {isEditing ? (
          <button className="action-btn edit" onClick={handleSave} title="Save" disabled={loading}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        ) : (
          <button className="action-btn edit" onClick={() => { setIsEditing(true); setEditingTitle(todo.title); }} title="Edit" disabled={todo.completed || loading}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}
        <button className="action-btn delete" onClick={handleDelete} title="Delete" disabled={loading}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
    </li>
  );
}

export default TodoItem;
