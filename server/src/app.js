import express from "express";
import cors from "cors";
import { checkConnection } from "./db/connection.js";
import createAllTables from "./db/dbUtils.js";
import authRoutes from "./routes/authRoutes.js"
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import authUser from "./routes/userRoutes.js";


const app = express();
app.use(passport.initialize());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use(`/auth`, authRoutes);
app.use(`/user`, authUser);



const PORT = process.env.PORT;

app.listen(process.env.PORT, async () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
 
  try {
    await checkConnection();
    await createAllTables();
  } catch (error) {
    console.log("Failed to initialize the database", error);
  }
});
