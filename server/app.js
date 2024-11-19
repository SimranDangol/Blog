import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

//Routes
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
const corsOptions = { origin: process.env.URL, credentials: true };
app.use(cors(corsOptions));
app.use(express.static("public"));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

//Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);

// // Serve static files from client/dist
app.use(express.static(path.join(__dirname, "../client/dist")));

// // Catch-all handler for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

export default app;
