// Vercel Serverless Function — catch-all for /api/* requests
// This file imports the Express app from the backend and exports it
// so that Vercel's @vercel/node runtime can handle every API request.

import app from '../backend/src/app.js';

export default app;
