const express = require('express');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const db = new sqlite3.Database('todo.db');


// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());


// Serve static files from the 'public' directory (optional)
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Define a route to serve the todoApp.html file as the default page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'todoApp.html'));
});


// Create a table for tasks
db.run('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, completed BOOLEAN)');

// Get tasks
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add a task
app.post('/tasks', (req, res) => {
  const { title, completed } = req.body;
  db.run('INSERT INTO tasks (title, completed) VALUES (?, ?)', [title, completed], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// Update a task
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  db.run('UPDATE tasks SET title = ?, completed = ? WHERE id = ?', [title, completed, id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Task updated successfully' });
  });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

