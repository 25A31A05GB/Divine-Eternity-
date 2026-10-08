import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

// Catch-all API dispatcher and separate Cron handlers
import apiDispatcher from './api/[[...route]]';
import abandonedCartsCronHandler from './api/cron/abandoned-carts';
import dailySummaryCronHandler from './api/cron/daily-summary';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// CORS configuration
const allowedOrigin = process.env.APP_URL || '*';
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigin === '*' || origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(null, true); // Allow dev previews
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// ===================== MOUNT SERVERLESS API HANDLERS =====================
// Separate cron endpoints (retained as distinct serverless functions on Vercel)
app.all('/api/cron/abandoned-carts', abandonedCartsCronHandler);
app.all('/api/cron/daily-summary', dailySummaryCronHandler);

// Single catch-all dispatcher for all other /api routes
app.all(['/api', '/api/*'], apiDispatcher);

// ===================== VITE MIDDLEWARE SETUP =====================
async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Divine's Eternity Server running at http://localhost:${PORT}`);
  });
}

startServer();
