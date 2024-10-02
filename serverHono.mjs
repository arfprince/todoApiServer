import { readFileSync, writeFile } from 'node:fs';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

// Handle root URL
app.get('/', (c) => {
  return c.json({ root: true });
});

// Handle file route with GET
app.get('/file', (c) => {
  try {
    const fileContent = readFileSync('content.txt', 'utf8');
    return c.text(fileContent);
  } catch (err) {
    return c.text('Error reading the file', 500);
  }
});

// Handle file route with POST
app.post('/file', async (c) => {
  try {
    const body = await c.req.text();
    await new Promise((resolve, reject) => {
      writeFile('content.txt', body, 'utf8', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    return c.text('Saved successfully');
  } catch (err) {
    return c.text('Error processing request', 500);
  }
});

// Handle 404 for undefined routes
app.notFound((c) => {
  return c.text('Not Found', 404);
});

// Start the server on port 3000
serve({
  fetch: app.fetch,
  port: 3000 // or whatever port you want to use
});
