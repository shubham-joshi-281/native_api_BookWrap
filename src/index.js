import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 5001;
app.listen(port, () => {
  connectDB();
  console.log(`server running on port ${port}`);
});
