import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.listen(3001, () => console.log("Server running on http://localhost:3001"));
