import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import initRoutes from "./routes/api.js";
import { ValidationError } from "express-validation";

dotenv.config();
const app = express();

app.use("/assets", express.static("assets"));

app.use(cors());
app.use(express.json());

connectDB();
initRoutes(app);

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
