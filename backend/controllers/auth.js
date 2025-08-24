import {Remail,Rphone,updatePass} from "../config/auth.js";

import {createOtp,sendCustomOtp,sendEmail} from "./sendOtp.js";

export async function authCheck (email,phone){
    if (email === Remail && phone === String(Rphone)) {
        let otp = createOtp();
        await sendEmail(Remail, otp);

        const phoneNumber = '+91' + phone; 
        sendCustomOtp(phoneNumber, otp)
            .then(sid => console.log('Custom OTP sent successfully! Message SID:', sid))
            .catch(error => console.error('Failed to send custom OTP:', error));

        return { message: "clear", otpMsg: 'null' , otp };
    } else {
        return { message: 'incorrect', otpMsg: 'NotNull' };
    }
}

export async function authVerify(providedOtp,sentOtp){
    if (providedOtp === sentOtp) {
        return { message: "verified" , otpMsg:"null"};
    } else {
        return{ message: 'clear', otpMsg: 'Wrong Otp' };
    }
}

export async function setNewPass(newPass,confirmPass){
    if (newPass === confirmPass) {
        let result=await updatePass(newPass);
        console.log(result);
        if(result===true){
            return true;
        }else{
            console.log("Password changing error");
        }
    } else {
        
        return false;
    }
}

