async function loginCheck(username,pass,data=data[0]){
    data=data[0];
    if(!username || !pass){
        console.log("No credentials found")
        return false;
    }else if(username==data.username && pass==data.password){
            return true;
        }else{
            console.log("wrong credentials")
            return false;
        }
    
}

export default loginCheck;
