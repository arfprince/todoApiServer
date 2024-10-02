import { readFileSync, writeFileSync } from 'node:fs';
import { Hono } from 'hono';

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
    writeFileSync('content.txt', body, 'utf8');
    return c.text('Saved successfully');
  } catch (err) {
    return c.text('Error processing request', 500);
  }
});

// Handle 404 for undefined routes
app.notFound((c) => {
  return c.text('Not Found', 404);
});

export default {
  port: 3000,
  fetch: app.fetch
};