import express, { Router } from "express";
import serverless from "serverless-http";

const app = express();
const router = Router();

router.get("/hello", (req, res) => {
  res.json({ message: "Backend is working" });
});

app.use("/api", router);

export const handler = serverless(app);
