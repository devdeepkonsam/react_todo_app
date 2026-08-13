import React, { useState } from 'react';

function TodoForm({ onAddTodo }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTodo(title);
    setTitle('');
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
        />
      </div>
      <button type="submit" className="btn-add">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Task
      </button>
    </form>
  );
}

export default TodoForm;
