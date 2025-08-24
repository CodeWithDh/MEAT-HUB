import data from "./login.js";

import connectDb from "./db.js";

export async function updatePass(newPass) {
    const q = "UPDATE login SET password = ? WHERE username = 'admin'";

    try {
        let res = await connectDb(q, [newPass]);
        console.log("Update Response:", res);
        return true;  // ✅ Return true on success
    } catch (err) {
        console.error("Database Error:", err);
        return false; // ✅ Return false on failure
    }
}





export let Remail=data[0].email;

export let Rphone=data[0].phone;


