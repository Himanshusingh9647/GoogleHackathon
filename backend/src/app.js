import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { generalApiLimiter } from './middleware/rateLimiter.js';
import mealPlanRoutes from './routes/mealPlanRoutes.js';

const app = express();

// Enable Cross-Origin Resource Sharing for the React frontend
app.use(cors());

// Configure JSON body parser
app.use(bodyParser.json());

// Apply basic rate limiting globally to prevent script abuse
app.use(generalApiLimiter);

// Register routes
app.use('/api/meal-plans', mealPlanRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', database: 'sqlite' });
});

// Catch-all route for unmatched paths
app.use((req, res) => {
  res.status(404).json({ error: 'Requested API endpoint not found.' });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled API server error:', err);
  res.status(err.status || 500).json({
    error: 'An unexpected internal error occurred on the server.',
    message: err.message,
  });
});

export default app;
