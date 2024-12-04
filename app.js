import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes/index.js";
import connectMongoDB from "./connectMongo/connectMongoDB.js";
const app = express();
const PORT = 8000;

app.use(bodyParser.json());
app.use(cors());

app.use("/", routes);

connectMongoDB();

app.listen(8000, () => console.log("App is running port: ", PORT));
