import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes/index.js";
import connectMongoDB from "./connectMongo/connectMongoDB.js";

import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.use("/", routes);

connectMongoDB();

app.listen(PORT, () => console.log("App is running port: ", PORT));
