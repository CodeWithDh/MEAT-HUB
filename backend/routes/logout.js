import express from "express";
const router=express.Router();

router.get("/",(req,res)=>{
    req.session.user.username=""
    console.log(req.session.user)
    res.render("login.ejs",{msg:"You're logged Out"})
})

export default router;