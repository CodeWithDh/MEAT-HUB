import express from "express";
import data from "../config/login.js";

async function loginCheck(username,pass,data=data){
    data=data[0];
    if(username===data.username && pass===data.password){
        return true;
    }else{
        return false;
    }
}

export default loginCheck;
