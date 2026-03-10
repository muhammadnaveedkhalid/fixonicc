import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import path from 'path';
import connectDB, { ensureDb } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import { approveVendor, rejectVendor } from './controllers/authController.js';
import contactRoutes from './routes/contactRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import repairRoutes from './routes/repairRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import accessoryRoutes from './routes/accessoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

connectDB();

const app = express();

const server = http.createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://fixonic.vercel.app",
  "https://fixonic.vercel.app/",
  "https://fixonicc.vercel.app",
  "https://fixonicc.vercel.app/",
].filter(Boolean);

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"]
}));

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
});

app.use((req, res, next) => {
  req.io = io;
  if (typeof next === 'function') next();
  else res.status(500).json({ message: 'Server error' });
});

// Manual CORS middleware (kept from previous version style)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin) {
    if (typeof next === 'function') next();
    else res.status(500).json({ message: 'Server error' });
    return;
  }

  const isAllowed =
    allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production";

  if (!isAllowed) {
    if (typeof next === 'function') next();
    else res.status(500).json({ message: 'Server error' });
    return;
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  if (typeof next === 'function') next();
  else res.status(500).json({ message: 'Server error' });
});

app.use(express.json());

// Ensure MongoDB is connected before any API route (fixes serverless cold-start timeout)
app.use('/api/', async (req, res, next) => {
  try {
    await ensureDb();
    if (typeof next === 'function') next();
    else res.status(500).json({ message: 'Server error' });
  } catch (err) {
    console.error('DB not ready:', err?.message || err);
    res.status(503).json({ message: 'Service temporarily unavailable. Please try again.' });
  }
});

// Approve/reject vendors – mounted on app so no auth router middleware runs (avoids serverless "next is not a function")
app.post('/api/auth/users/:id/approve', approveVendor);
app.post('/api/auth/users/:id/reject', rejectVendor);

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/accessories', accessoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Backend is running successfully...');
});

// Global error handler – never send raw "next is not a function" to client; log real error for debugging
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const rawMessage = err.message || String(err);
  const isNextError = /next is not a function/i.test(rawMessage);

  // Log full error and stack so you can fix from Vercel/server logs
  console.error('[Server Error]', rawMessage);
  if (err.stack) console.error(err.stack);

  // Send a proper message to the client so you know what to do
  const clientMessage = isNextError
    ? 'Vendor action failed: server middleware issue. Redeploy the backend (latest code) and do a hard refresh (Ctrl+Shift+R) on the dashboard.'
    : (rawMessage || 'Server error');

  res.status(status).json({ message: clientMessage });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
