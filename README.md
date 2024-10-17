
# Todo API Server

This is a simple Todo API server built using the [Hono](https://hono.dev) framework and the `@hono/node-server` module.

## Features

- Create a new todo for a user
- Retrieve all todos for a user
- Retrieve a specific todo by ID
- Update a todo's title and status
- Delete a specific todo by ID
- Delete all todos for a user
- Save and load todos from a file

## Endpoints

### 1. `GET /:userID/todos`
Retrieves all todos for a specific user.

### 2. `GET /:userID/todos/:id`
Retrieves a specific todo for a user by ID.

### 3. `POST /:userID/todos`
Creates a new todo for the user. Example request body:

```json
{
  "title": "Your Todo Title"
}
```

### 4. `PUT /:userID/todos/:id`
Updates an existing todo by ID. Example request body:

```json
{
  "title": "Updated Title",
  "status": "done"
}
```

### 5. `DELETE /:userID/todos/:id`
Deletes a specific todo for a user by ID.

### 6. `DELETE /:userID/todos`
Deletes all todos for a user.

## Environment Variables

You can specify the port the server runs on by setting the `PORT` environment variable. If not provided, the server defaults to port `3000`.

## How to Run

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
node server.mjs
```

The server will run on `http://localhost:3000` by default, or the port you set in the environment variable.
