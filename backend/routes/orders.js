import express from "express";
import {mData,rData} from "../config/orders.js";
let router=express.Router();

router.get("/",(req,res)=>{
    res.render("orders.ejs",{rData,mData});
})
router.post("/placeOrder",(req,res)=>{
    
})

export default router;