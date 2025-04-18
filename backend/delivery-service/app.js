import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/delivery', deliveryRoutes);

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`Delivery service running on port ${PORT}`);
});
