
const form = document.getElementById("clalit-details-form");

const idInputElement = form[0];
const userCodeElement = form[1];
const passwordElement = form[2];

form.addEventListener("submit",(ev)=>{
	console.log("listener called");
    ev.preventDefault();
    
    const id = idInputElement.value;
    const userCode = userCodeElement.value;
    const password = passwordElement.value;
	
	SendHttpGetRequestAndUpdateUi(id, userCode, password);
	
	form.style.display = "none";
	document.getElementById("appointment-details-div").style.display = "block";
	
	
});


function SendHttpGetRequestAndUpdateUi(id, userCode, password){
	var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
			console.log(xmlhttp.status);
		   if (xmlhttp.status == 200) {
			   UpdateAppointmentDetails(JSON.parse(xmlhttp.responseText));
		   }
		   else if (xmlhttp.status == 400) {
			  alert('There was an error 400');
		   }
		   else {
			   alert('something else other than 200 was returned');
		   }
		}
	};
	
	xmlhttp.open("GET", "http://192.168.1.43:3000/GetAppointmentDetails?id=" + id + "&userCode=" + userCode + "&password=" + password, true);
    xmlhttp.send();
}

function UpdateAppointmentDetails(appointmentDetails){
	document.getElementById("current-appointment-date").innerText = "- " + appointmentDetails.currentAppointmentDate;
	document.getElementById("next-free-appointment-date").innerText = "- " + appointmentDetails.nextFree + (appointmentDetails.canReschedule ? " (you can rechedule)" : "");
	document.getElementById("last-updated-on").innerText = " " + GetCurrentDateAsString();
	
	if (appointmentDetails.canReschedule){
		document.body.classList.add("can-reschedule");
		document.getElementById("next-free-appointment-date").classList.add("can-reschedule");
	}
	else {
		document.body.classList.remove("can-reschedule");
		document.getElementById("next-free-appointment-date").classList.remove("can-reschedule");
	}
}

function GetCurrentDateAsString(){
	const currentDate = new Date();
	
	const year = currentDate.getFullYear();
	const day = currentDate.getDate();

	const currentMonth = currentDate.getMonth() + 1;
	const month = currentMonth < 10 ? "0" + currentMonth : currentMonth;
	
	return day + "." + month + "." + year + "  " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
}



