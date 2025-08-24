import connectDb from "./db.js";
const q="Select * from orders;"

let orders=await connectDb(q);

export default orders;