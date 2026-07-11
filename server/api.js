import { Router } from "express";

const router = Router();

router.get("/hello", (req, res) => {
  res.json({ message: "Backend is working" });
});

export default router;
