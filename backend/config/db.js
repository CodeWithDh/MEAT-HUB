import dotenv from "dotenv"
dotenv.config();

import mysql from "mysql2";
import express from "express";

const connection = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: 'Shivam.123',
    database: 'meat_hub_db',
    waitForConnections: true,
    connectionLimit: 10
  });

// Convert connection to use promises
const db = connection.promise();

// Reusable Database Query Function
async function connectDb(q, params = []) {
    try {
        const [result] = await db.execute(q, params);
        return result;
    } catch (error) {
        console.error("Database Query Error:", error);
        throw error;
    }
}

export default connectDb;