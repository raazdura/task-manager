import mongoose from "mongoose";
import express, { Express, Request, Response } from "express";
import { config } from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { notFound, errorHandler } from "./middlewares/index.middleware";
import userRoutes from './routes/users';
import taskRoutes from './routes/tasks';

config();

// if (!process.env.MONGO_URI || !process.env.PORT) {
//   throw new Error("Missing required environment variables (MONGO_URI or PORT).");
// }

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

app.use('/api/tasks', taskRoutes);


app.use(notFound);
app.use(errorHandler);

mongoose
  .connect("mongodb+srv://raazdura:duraaz1234@raazdura.lmpiqa6.mongodb.net/task-manager?retryWrites=true&w=majority")
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
