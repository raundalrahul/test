const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_PATH = path.join(__dirname, "todos.json");

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// Read all todos
app.get("/todos", (req, res) => {
  fs.readFile(DATA_PATH, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading data");
    }
    res.json(JSON.parse(data));
  });
});

// Create a new todo
app.post("/todos", (req, res) => {
  fs.readFile(DATA_PATH, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading data");
    }
    const todos = JSON.parse(data);
    const newTodo = {
      id: todos.length + 1,
      ...req.body,
    };
    todos.push(newTodo);
    fs.writeFile(DATA_PATH, JSON.stringify(todos, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Error writing data");
      }
      res.status(201).json(newTodo);
    });
  });
});

// Update a todo
app.put("/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id, 10);
  fs.readFile(DATA_PATH, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading data");
    }
    const todos = JSON.parse(data);
    const todoIndex = todos.findIndex((t) => t.id === todoId);
    if (todoIndex === -1) {
      return res.status(404).send("Todo not found");
    }
    todos[todoIndex] = { id: todoId, ...req.body };
    fs.writeFile(DATA_PATH, JSON.stringify(todos, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Error writing data");
      }
      res.json(todos[todoIndex]);
    });
  });
});

// Delete a todo
app.delete("/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id, 10);
  fs.readFile(DATA_PATH, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading data");
    }
    let todos = JSON.parse(data);
    const todoIndex = todos.findIndex((t) => t.id === todoId);
    if (todoIndex === -1) {
      return res.status(404).send("Todo not found");
    }
    todos = todos.filter((t) => t.id !== todoId);
    fs.writeFile(DATA_PATH, JSON.stringify(todos, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Error writing data");
      }
      res.status(204).send();
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
