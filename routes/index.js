import express from "express";
import { saveUser } from "../controller/userDataController.js";
import { handleWebHook } from "../controller/webHookController.js";

const router = express.Router();


router.get("/", (req, res)=>{
    res.send("Hellow Charlie");
 })

 router.post("/shopify-notify-me/customer-details",saveUser)
 
 
 
 
 
 router.post('/webhook', handleWebHook);

export default router;