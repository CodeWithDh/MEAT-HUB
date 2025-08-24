import dotenv from "dotenv"
dotenv.config();

import mysql from "mysql2";
import express from "express";

const connection = mysql.createConnection({
    host: process.env.DB_HOST ,
    user: process.env.DB_USER , 
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME ,
    port: process.env.DB_PORT 
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