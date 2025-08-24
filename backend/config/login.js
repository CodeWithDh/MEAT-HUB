import connectDb from "./db.js";
const q="Select * from login;"

let data=await connectDb(q);


export default data;

