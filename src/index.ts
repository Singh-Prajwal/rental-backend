import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import bookingRoutes from './routes/bookingRoutes';
import aiRoutes from './routes/aiRoutes';
import supportRoutes from './routes/supportRoutes';
import authRoutes from './routes/authRoutes';
import propertyRoutes from "./routes/propertyRoutes";
dotenv.config();
connectDB();

const app = express();
const allowedOrigins = [
  'http://localhost:3000', // Your local frontend for development
  'https://rental-frontend-3irp.vercel.app' // Your deployed Vercel frontend
];
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
// Middleware
app.use(cors(corsOptions)); // Allow requests from our frontend
app.use(express.json()); // To parse JSON bodies
app.use('/api/bookings', bookingRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/support-requests', supportRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', authRoutes);

app.get("/api/health", (req, res) => {
  res.send("Server is healthy and running!");
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
