import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

//Routes
import authRouter from "./routes/auth.route.js"

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
const corsOptions = { origin: process.env.URL, credentials: true };
app.use(cors(corsOptions));

app.use("/api/v1/auth", authRouter)

export default app;
