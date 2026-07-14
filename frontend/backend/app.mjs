import express from "express";
import routes from "./routes/index.mjs";
import errorHandler from "./middleware/errorHandler.mjs";

const app = express();

app.use(express.json());
app.use("/", routes);
app.use(errorHandler);

export default app;
