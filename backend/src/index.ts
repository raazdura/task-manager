import mongoose from "mongoose";
import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { notFound, errorHandler } from "./middlewares/index.middleware";
import userRoutes from './routes/users';
import taskRoutes from './routes/tasks';

import dotenv from 'dotenv';
dotenv.config();
 
import { protect } from "./middlewares/auth";

console.log(process.env.MONGO_URI); // Should print the MongoDB URI
console.log(process.env.PORT);     // Should print 7000 
console.log(process.env.JWT_SECRET); // Should print the MongoDB URI
console.log(process.env.JWT_EXPIRE);     // Should print 7000 
console.log(process.env.SECRET);     // Should print 7000 

if (!process.env.MONGO_URI) {
  throw new Error("Missing required environment variables (MONGO_URI or PORT).");
}

const app: Express = express();

app.use(morgan("dev"));
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors({
  origin: '*', // or specify a domain, e.g., 'http://localhost:3000'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/api/", api);


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});



app.use('/api/user', userRoutes);
app.use('/api/tasks', protect, taskRoutes);


app.use(notFound);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to the database");
    app.listen(process.env.PORT || 7000, () => {
      console.log(`[server]: Server is running at http://localhost:${process.env.PORT || 7000}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

process.on("SIGINT", async () => {
  console.log("Closing database connection...");
  await mongoose.connection.close();
  process.exit(0);
});
