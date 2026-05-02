import express from "express";
const router = express.Router();

import loginCheck from "../controllers/login.js";
import connectDb from "../config/db.js";

router.post("/", async (req, res) => {
    let { username, password } = req.body;
    
    if (!req.session.user) {
        console.log("login check");
        let result = await loginCheck(username, password);
        
        if (result === true) {
            req.session.user = { username };
            console.log(req.session.user);
            const orders = await connectDb("SELECT * FROM orders;");
            res.render("dashboard.ejs", { orders });
        } else {
            res.render("login.ejs", { msg: "Wrong Password or Username" });
        }
    } else {
        console.log(req.session.user);
        const orders = await connectDb("SELECT * FROM orders;");
        res.render("dashboard.ejs", { orders });
    }
});

router.get("/", async (req, res) => {
    if (!req.session.user) {
        return res.redirect("/");
    }
    
    try {
        const orders = await connectDb("SELECT * FROM orders;");
        res.render("dashboard.ejs", { orders });
    } catch (error) {
        console.error("Dashboard GET Error:", error);
        res.status(500).send("Error loading dashboard");
    }
});

export default router;
