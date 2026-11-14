import { useEffect, useState } from 'react';

// Relative URL: works in dev (Vite proxy) and in production (vercel.json routes).
const API = '/api/todos';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  // Load todos once when the page opens.
  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then(setTodos)
      .catch(() => setError('Could not load todos'));
  }, []);

  async function addTodo(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    const todo = await res.json();
    setTodos([todo, ...todos]);
    setTitle('');
  }

  async function toggleTodo(todo) {
    const res = await fetch(`${API}/${todo._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    const updated = await res.json();
    setTodos(todos.map((t) => (t._id === updated._id ? updated : t)));
  }

  async function deleteTodo(id) {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    setTodos(todos.filter((t) => t._id !== id));
  }

  return (
    <main style={{ maxWidth: 480, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>My Todos</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={addTodo} style={{ display: 'flex', gap: 8 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit">Add</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo._id} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '12px 0' }}>
            <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo)} />
            <span style={{ flex: 1, textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
