const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const cors = require('cors');
app.use(cors());

server.listen(3000, () => {
  console.log('listening on *:3000');
});

app.get('/GetAppointmentDetails', (req, res) => {
  console.log(req.url);
	const id = req.query.id;
	const userCode = req.query.userCode;
	const password = req.query.password;
	
	printRequestDetails(id, userCode, password);

	GetAppointmentDetails(id, userCode, password).then(appointmentDetails => res.status(200).send(appointmentDetails));
});

function printRequestDetails(id, userCode, password){
	console.log("got a request:");
	console.log("  id:       " + id);
	console.log("  userCode: " + userCode);
	console.log("  password: " + password);
	console.log();
}



const puppeteer = require('puppeteer');

const idNumberElementId = "#ctl00_cphBody__loginView_tbUserId";
const UserCodeElementId = "#ctl00_cphBody__loginView_tbUserName";
const PasswordElementId = "#ctl00_cphBody__loginView_tbPassword";
const loginButtonElementId = "#ctl00_cphBody__loginView_btnSend";

async function GetAppointmentDetails(id, userCode, password){
	console.log("Starting...");
    const browser = await puppeteer.launch({/* headless: false */});
    const page = await browser.newPage();
    await page.goto('https://e-services.clalit.co.il/OnlineWeb/General/Login.aspx');

    await Login(page, id, userCode, password);
    await page.goto('https://e-services.clalit.co.il/OnlineWeb/Services/Tamuz/TamuzTransfer.aspx');
    await new Promise(r => setTimeout(r, 500));

    let elementHandle = await page.waitForSelector('#ifrmMainTamuz');
    let frame = await elementHandle.contentFrame();

    // get the current visit date
    await frame.waitForSelector("#patientLastDoctors + #visits span.visitDateTime");
    const currentVisitDateElement = await frame.$("#patientLastDoctors + #visits span.visitDateTime");
    const innerHtmlProperty = await currentVisitDateElement.getProperty('innerText');
    const currentVisitDate = await innerHtmlProperty.jsonValue();
    
    // get the update button and click it
    await frame.waitForSelector("#patientLastDoctors + #visits a.updateVisitButton");
    const updateVisitButtonElement = await frame.$("#patientLastDoctors + #visits a.updateVisitButton");
    await updateVisitButtonElement.click();
    await updateVisitButtonElement.click();

    // get the next free date
    elementHandle = await page.waitForSelector('#ifrmMainTamuz');
    frame = await elementHandle.contentFrame();

    await frame.waitForSelector("header.margin-right");
    const headerElement = await frame.$("header.margin-right");
    const headerInnerTextProperty = await headerElement.getProperty('innerText');
    const headerText = await headerInnerTextProperty.jsonValue();
    const splittedHeader = headerText.split(" ");
    const nextFreeDate = splittedHeader[splittedHeader.length - 1];

    console.log("current visit date: " + currentVisitDate);
    console.log("next free date: " + nextFreeDate);

    console.log("done");
    console.log();
    console.log();
	
	await browser.close();
	return { currentAppointmentDate: currentVisitDate, nextFree: nextFreeDate, canReschedule: getDateFromString(currentVisitDate) > getDateFromString(nextFreeDate) }	
}



async function Login(page, id, userCode, password) {
    await page.waitForSelector(idNumberElementId);
    await page.waitForSelector(UserCodeElementId);
    await page.waitForSelector(PasswordElementId);
    await page.waitForSelector(loginButtonElementId);

    await page.$eval(idNumberElementId, (el, value) => el.value = value, id);
    await page.$eval(UserCodeElementId, (el, value) => el.value = value, userCode);
    await page.$eval(PasswordElementId, (el, value) => el.value = value, password);

    await new Promise(r => setTimeout(r, 500));

    await page.$eval(loginButtonElementId, el => el.click());
    await new Promise(r => setTimeout(r, 3000));
    console.log("login done");
}

function getDateFromString(dateString) {
    const splitted = dateString.split(".");
    return new Date(splitted[2], splitted[1] - 1, splitted[0]);
}
