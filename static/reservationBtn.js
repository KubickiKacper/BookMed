function handleReservationBtnClick(doctorImgSrc, doctorName, doctorSpec, doctorId) {
    // console.log("Clicked ", doctorName);
    let modal = document.getElementsByClassName("reservation-modal-container")[0];
    let modalDoctorImage = document.getElementById("modal-doctor-image");
    let modalDoctorName = document.getElementById("modal-doctor-name");
    let modalDoctorSpec = document.getElementById("modal-doctor-specialization");
    let dateInput = document.getElementById("dateInputReservationModal");
    let body = document.getElementsByTagName("body")[0];

    // set selected doctor id to local storage
    window.localStorage.setItem("doctorSelectedId", doctorId);


    // TODO: fetch availableHours from database, for now only static
    let availableHours=[
            "8:00-8:30", "8:30-9:00", "9:00-9:30", "9:30-10:00",
            "10:00-10:30", "10:30-11:00", "11:00-11:30", "11:30-12:00",
            "12:00-12:30", "12:30-13:00", "13:00-13:30", "13:30-14:00",
            "14:00-14:30", "14:30-15:00", "15:00-15:30", "15:30-16:00"]

    setTimeout(() => {
        generatevisitHourDivs(availableHours)
    }, 1000);


    // change header info
    modalDoctorImage.src = doctorImgSrc;
    modalDoctorName.innerHTML = doctorName;
    modalDoctorSpec.innerHTML = doctorSpec;

    // change date input value
    let dateFromLocalStorage = new Date(window.localStorage.getItem("dateSelected"));
    dateInput.value = formatDate(dateFromLocalStorage);

    modal.style.display = "block";
    body.style.overflow = "hidden";
}

function generatevisitHourDivs(availableHours) {
    let visitHoursDiv = document.getElementById("visitHoursDivs");
    let loadingSpinner = document.getElementById("loadingSpinnerModal");

    loadingSpinner.style.display = "none";
        visitHoursDiv.innerHTML = "";

        for (let availableHour of availableHours) {
            // console.log("availableHour -> ", availableHour)
            let div = document.createElement("div");
            div.className = "visitHour";
            div.innerHTML = availableHour;
            div.onclick = handleHourSelect;

            visitHoursDiv.appendChild(div);
        }
}

function handleExitModal() {
        let reservationModal = document.getElementsByClassName("reservation-modal-container")[0];
        let body = document.getElementsByTagName("body")[0];
        let loadingSpinner = document.getElementById("loadingSpinnerModal");
        let modalTestType = document.getElementById("testTypesBrowserModal");

        // reset inputs
        modalTestType.value = "";

        // reset style of all visit hours to default
        resetSelectedVisitHours();

        // delete visitHour divs
        let visitHoursDiv = document.getElementById("visitHoursDivs");
        visitHoursDiv.innerHTML = "";

        // remove items from local storage
        window.localStorage.removeItem('hourSelected');
        window.localStorage.removeItem("doctorSelectedId");

        loadingSpinner.style.display = "flex";
        reservationModal.style.display = "none";
        body.style.overflow = "auto";
    }

function handleHourSelect(event) {
    // reset style of all visit hours to default
    resetSelectedVisitHours();

    // change style of selected hour only
    let selectedHour = event.target.innerHTML;
    // console.log(selectedHour);
    event.target.classList.add("visitHourSelected");

    // set selectedHour in local storage
    window.localStorage.setItem('hourSelected', selectedHour);
}

function resetSelectedVisitHours() {
    // reset style of all visit hours to default
    let visitHours = document.getElementsByClassName("visitHour");
    for (let visitHour of visitHours) {
        visitHour.classList.remove("visitHourSelected");
    }
}

function handleSubmitModal() {
    let modalTestType = document.getElementById("testTypesBrowserModal");
    let modalPatientName = document.getElementById("nameInputModal");
    let modalPatientPhone = document.getElementById("phoneInputModal");
    let modalInfoForDoctor = document.getElementById("infoForDoctorArea");
    let selectedDoctorId = window.localStorage.getItem("doctorSelectedId");
    let selectedDate = window.localStorage.getItem("dateSelected");
    let selectedHour = window.localStorage.getItem("hourSelected");

    let hours = selectedHour.split('-');
    let hourFrom = hours[0];
    let hourTo = hours[1];

    let submitObject = {
        doctorId: selectedDoctorId,
        testType: modalTestType.value,
        selectedDate: selectedDate,
        hourFrom: hourFrom,
        hourTo: hourTo,
        patientName: modalPatientName.value,
        patientPhone: modalPatientPhone.value,
        infoForDoctor: modalInfoForDoctor.value
    };

    console.log(submitObject);
    
    fetch("/add_reservation",
    {
        method: "POST",
        body: JSON.stringify(submitObject), 
        headers: {"Content-Type" : "application/json"}
    })
    .then(function(res){ return res.json(); })
    .then(function(data){ alert( JSON.stringify( data ) ) })

    handleExitModal();
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}