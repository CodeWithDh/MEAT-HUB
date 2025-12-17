import express from "express";
import {mData,rData} from "../config/orders.js";
let router=express.Router();

router.get("/",(req,res)=>{
    res.render("orders.ejs",{rData,mData});
})
router.post("/placeOrder",(req,res)=>{
    console.log("orders.js file")
})

export default router;