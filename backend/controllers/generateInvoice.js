import fs from "fs";
import qrCode from "qrcode";
import path from "path";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";


const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

const invoicesDir=path.join(__dirname,"../../Invoices");

async function checkInvoices(){
    return new Promise((resolve,reject)=>{

        fs.readdir(invoicesDir,(err,files)=>{
    if(err){
        console.log("Invoice Searching Error:",err);
        return reject({status:false});
    }
    const pdfFiles=files.filter(file=>path.extname(file).toLowerCase()==='.pdf');
    if(pdfFiles.length===0){
        console.log("No pdf files found in Invoices folder.")
        return resolve({status:true , value:"000001"});
    }
    else{
        let lastFile=null;
        let lastTime=0;
        
        
        pdfFiles.forEach(file=>{
            const filePath=path.join(invoicesDir,file);
            const stats=fs.statSync(filePath);

            if(stats.ctimeMs>lastTime){
                lastTime=stats.ctimeMs;
                lastFile=file;
            }
                })

                let nextNum=(parseInt(lastFile.slice(4,-4),10)+1).toString().padStart(6,'0');
                console.log("Next Number: ",nextNum);
                return resolve({status:true , value:nextNum});
            }
        })
    }) 
}


async function generateInvoiceNumber(){

    let prefix="INV-";
    let number="";

    let check=await checkInvoices();
    // console.log(check);
    if(check.status){
        number=check.value;
    }else{
        console.log("Reflect Error Page")
    }

    let invoiceNumber=prefix+number;
    // console.log(number);
    return {invoiceNumber,number};
}

async function generateQrcode(number,amount){
    // console.log("Number",number);
    const upi=`upi://pay?pa=codewithdh@okicici&pn=Merchant&am=${amount}&cu=INR`;
    const qrCodePath=path.join(__dirname,"..","..","QrCodes",`${number}_qr.png`);
    console.log("here",qrCodePath);

    await qrCode.toFile(qrCodePath,upi);

    return qrCodePath;
}

// async function generateInvoice(invoiceNumber,qrCodePath){
    
// }
import ejs from "ejs";

const invoiceTemplatePath = path.resolve(__dirname, "../../frontend/views/templates/invoice.ejs");


async function generateInvoicePDF(invoiceNumber, qrCodePath, amount=500) {
    const date = new Date().toLocaleDateString();

    // Example item list — replace with dynamic input if needed
    const items = [
        { itemName: "Chicken Curry Cut", quantity: 2, itemPrice: 250 },
        { itemName: "Mutton Kebab", quantity: 1, itemPrice: 400 },
        { itemName: "Fish Fry", quantity: 3, itemPrice: 180 }
    ];

    const grandTotal = items.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);
const fixedQRCodePath = `file:///${qrCodePath.replace(/\\/g, '/')}`;
    const html = await ejs.renderFile(invoiceTemplatePath, {
        data: {
            invoiceNumber: invoiceNumber,
            date,
            items,
            grandTotal
        },
        QRCodePath: `file://${fixedQRCodePath}`
    });

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfPath = path.join(invoicesDir, `${invoiceNumber}.pdf`);
    await page.pdf({ path: pdfPath, format: 'A4' });

    await browser.close();
    return pdfPath;
}


// 🔁 Run everything
const { invoiceNumber, number } = await generateInvoiceNumber();
const qrCodePath = await generateQrcode(number, 500);
await generateInvoicePDF(invoiceNumber, qrCodePath, 500);