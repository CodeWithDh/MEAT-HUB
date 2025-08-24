import express from "express";
const router = express.Router();

import loginCheck from "../controllers/login.js";
import data from "../config/login.js"
import orders from "../config/dashboard.js"

router.post("/",(req,res)=>{
    let {username,password}=req.body;
    
    let result=loginCheck(username,password,data);
    result.then(value => {
    if (value === true) {
        
        res.render("dashboard.ejs",{orders});
    } else {
        res.render("login.ejs",{msg:"Wrong Password"});
    }
    });
});
export default router;
