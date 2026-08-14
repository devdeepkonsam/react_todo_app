import React, { useState } from 'react';
import axios from 'axios';

const backendurl = (import.meta.env.VITE_BACKEND_API || import.meta.env.VITE_SERVER_URL || "").replace(/\/$/, "");
const apiBase = backendurl.endsWith("/api") ? backendurl : `${backendurl}/api`;

function TodoForm({ onTodoAdded }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('todo_token');
      const response = await axios.post(`${apiBase}/todo`, { title }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.todo) {
        onTodoAdded(response.data.todo);
      }
      setTitle('');
    } catch (err) {
      console.error(err.response?.data?.message || 'Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-input-wrapper">
        <input 
          type="text" 
          className="todo-input" 
          placeholder="What needs to be done today?" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          disabled={loading} 
        />
      </div>
      <button type="submit" className="btn-add" disabled={loading}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        {loading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}

export default TodoForm;
