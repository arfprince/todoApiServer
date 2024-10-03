import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import  fs  from 'fs';
const app = new Hono();
app.use(prettyJSON());

const data = new Map();
function saveTodosToFile() {
  const todosArray = Array.from(data.entries()).map(([userID, todos]) => ({
    userID,
    todos,
  }));

  fs.writeFile('todos.txt', JSON.stringify(todosArray, null, 2), "utf8", (err) => {
    if (err) {
      console.error('Error saving todos to file:', err);
    } else {
      console.log('Todos saved to todos.txt');
    }
  });
}
app.get('/:userID/todos', (c) => {
  const userID = c.req.param('userID');

  if (!data.has(userID)) {
    return c.json({ message: "No todos found for this user" }, 404);
  }

  const todos = data.get(userID);
  return c.json(todos);
});

app.get('/:userID/todos/:id', (c) => {
  const userID = c.req.param('userID');
  const todoID = c.req.param('id');

  if (!data.has(userID)) {
    return c.json({ message: "No todos found for this user" }, 404);
  }

  const todos = data.get(userID);
  const todo = todos.find((todo) => todo.id === todoID);

  if (!todo) {
    return c.json({ message: "Todo not found" }, 404);
  }

  return c.json(todo);
});

app.post('/:userID/todos', async (c) => {
  const userID = c.req.param('userID');
  const body = await c.req.json();

  if (!body.title) {
    return c.json({ message: "Title is required" }, 400);
  }

  const newTodo = {
    id: crypto.randomUUID(),
    title: body.title,
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (!data.has(userID)) {
    data.set(userID, []);
  }

  data.get(userID).push(newTodo);
  saveTodosToFile();
  return c.json(newTodo, 201);
});

app.put('/:userID/todos/:id', async (c) => {
  const userID = c.req.param('userID');
  const todoID = c.req.param('id');
  const body = await c.req.json();

  if (!data.has(userID)) {
    return c.json({ message: "No todos found for this user" }, 404);
  }

  const todos = data.get(userID);
  const todo = todos.find((todo) => todo.id === todoID);

  if (!todo) {
    return c.json({ message: "Todo not found" }, 404);
  }

  todo.title = body.title || todo.title;
  todo.status = body.status || todo.status;
  todo.updatedAt = new Date().toISOString();
  saveTodosToFile();
  return c.json(todo);
});

app.delete('/:userID/todos/:id', (c) => {
  const userID = c.req.param('userID');
  const todoID = c.req.param('id');

  if (!data.has(userID)) {
    return c.json({ message: "No todos found for this user" }, 404);
  }

  let todos = data.get(userID);
  const initialLength = todos.length;

  todos = todos.filter((todo) => todo.id !== todoID);

  if (todos.length === initialLength) {
    return c.json({ message: "Todo not found" }, 404);
  }

  data.set(userID, todos);
  saveTodosToFile();
  return c.json({ message: "Todo deleted successfully" });
});

app.delete('/:userID/todos', (c) => {
  const userID = c.req.param('userID');

  if (!data.has(userID)) {
    return c.json({ message: "No todos found for this user" }, 404);
  }

  data.delete(userID);
  saveTodosToFile();
  return c.json({ message: "All todos deleted successfully" });
});

const port = 3000;
serve({ 
  fetch: app.fetch, 
  port 
});
