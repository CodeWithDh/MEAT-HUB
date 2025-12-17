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

// Orders route
app.get("/orders", async (req, res) => {
    try {
        let rData = await connectDb("SELECT * FROM restaurentMenu");
        let mData = await connectDb("SELECT * FROM meatShopMenu");
        res.render("orders", { rData, mData });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Server Error");
    }
});


import fs from "fs"
import QRCode from "qrcode"
import pdf from "html-pdf"
import ejs from "ejs"

// ================== CORE IMPORTS ==================

import { fileURLToPath } from "url";

// ================== THIRD-PARTY ==================
import session from "express-session";
import flash from "connect-flash";
import bodyParser from "body-parser";


// ================== DB FUNCTION (ASSUMED EXISTING) ==================
import connectDb from "./config/db.js"; 

// ================== __DIRNAME FIX FOR ES MODULE ==================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// ================== MIDDLEWARE ==================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: "meathub_secret",
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

// ================== STATIC FILES ==================
app.use("/Invoices", express.static(path.join(__dirname, "..", "Invoices")));
app.use(express.static(path.join(__dirname, "..", "frontend", "public")));

// ================== VIEW ENGINE ==================
app.set("views", path.join(__dirname, "..", "frontend", "views"));
app.set("view engine", "ejs");

// ================== INVOICE NUMBER ==================
function generateInvoiceNumber(prefix = "INV", length = 6) {
    const randomNumber = Math.floor(Math.random() * Math.pow(10, length))
        .toString()
        .padStart(length, "0");
    return `${prefix}-${randomNumber}`;
}

// ================== PDF GENERATION ==================
async function generateInvoicePDF(invoiceData, outputFilePath) {
    console.log("I am here at generateInvoicePDF")
    const invoiceTemplatePath = path.join(
        __dirname,
        "..",
        "frontend",
        "views",
        "invoice.ejs"
    );

    try {
        const upiId = "codewithdh@okicici";
        const upiQrData = `upi://pay?pa=${upiId}&pn=Merchant&am=${invoiceData.grandTotal}&cu=INR`;

        const qrCodePath = path.join(
            __dirname,
            "..",
            "Invoices",
            `qr_${invoiceData.invoiceNumber}.png`
        );

        await QRCode.toFile(qrCodePath, upiQrData);

        const qrBase64 = fs.readFileSync(qrCodePath, { encoding: "base64" });
        const qrDataUrl = `data:image/png;base64,${qrBase64}`;

        const template = fs.readFileSync(invoiceTemplatePath, "utf8");

        const html = ejs.render(template, {
            data: invoiceData,
            QRCodePath: qrDataUrl
        });

        const options = {
            format: "A4",
            orientation: "portrait",
            border: "10mm"
        };

        await new Promise((resolve, reject) => {
            pdf.create(html, options).toFile(outputFilePath, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

    } catch (err) {
        console.error("PDF Error:", err);
        throw err;
    }
}

// ================== PLACE ORDER ==================

app.post("/placeOrder", async (req, res) => {
    try {
        console.log("here");
        await connectDb(`
            CREATE TABLE IF NOT EXISTS placeOrder (
                id VARCHAR(30),
                itemName VARCHAR(30),
                itemPrice INT,
                quantity INT
            );`
        );
        const items = req.body.items;
        const invoiceItems = [];

        for (const item of items) {
            invoiceItems.push(item);

            await connectDb(
                "INSERT INTO placeOrder VALUES (?, ?, ?, ?)",
                [item.itemId, item.itemName, item.itemPrice, item.quantity]
            );
        }

        const orderId = faker.string.uuid();
        const total = req.body.total;

        const invoiceData = {
            invoiceNumber: generateInvoiceNumber("INV", 8),
            date: new Date().toLocaleDateString(),
            items: invoiceItems,
            grandTotal: total
        };

        const invoicesDir = path.join(__dirname, "..", "Invoices");
        if (!fs.existsSync(invoicesDir)) {
            fs.mkdirSync(invoicesDir, { recursive: true });
        }

        const pdfPath = path.join(invoicesDir, `invoice_${orderId}.pdf`);
        await generateInvoicePDF(invoiceData, pdfPath);

        await connectDb(
    "INSERT INTO orders (orderId, orderList, total, status) VALUES (?, ?, ?, ?)",
    [
        orderId,
        JSON.stringify(invoiceItems),
        total,
        "pending"
    ]
);


        res.json({
            success: true,
            invoiceUrl: `/Invoices/invoice_${orderId}.pdf`
        });

        setTimeout(async () => {
            await connectDb("DROP TABLE IF EXISTS placeOrder");
        }, 5000);

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

// ================== EDIT PAGE ==================
app.get("/edit/meatShopMenu", async (req, res) => {
    const data = await connectDb("SELECT * FROM meatShopMenu");
    res.render("editMenu", { data });
});

// Server Listening
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});