// Import required modules
dotenv.config();
import { faker } from "@faker-js/faker";
import methodOverride from "method-override";
import express from "express";
const app = express();
import path from "path";
import dotenv from "dotenv";
const port = 8080;
// Database
import db from "./config/db.js"

// Middleware
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(import.meta.dirname, "../frontend/public")));
app.use(express.static(path.join(import.meta.dirname, "../frontend/include")));


// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "../frontend/views"));

// Routes import
import login from "./routes/login.js";
import dashboard from "./routes/dashboard.js";
import logout from "./routes/logout.js";
import auth from "./routes/auth.js"
import orders from "./routes/orders.js"

app.use("/",login);

app.use("/auth",auth);

app.use("/dashboard",dashboard);

app.use("/logout",logout);

app.use("/orders",orders);

// Server Listening
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});