function handleReservationBtnClick(doctorImgSrc, doctorName, doctorSpec, doctorId) {
    // console.log("doctorImgSrc -> ", doctorImgSrc)
    // console.log("doctorName -> ", doctorName)
    // console.log("doctorSpec -> ", doctorSpec)
    // console.log("doctorId -> ", doctorId)

    let modal = document.getElementsByClassName("reservation-modal-container")[0];
    let modalDoctorImage = document.getElementById("modal-doctor-image");
    let modalDoctorName = document.getElementById("modal-doctor-name");
    let modalDoctorSpec = document.getElementById("modal-doctor-specialization");
    let dateInput = document.getElementById("dateInputReservationModal");
    let body = document.getElementsByTagName("body")[0];
    let dateFromLocalStorage = new Date(window.localStorage.getItem("dateSelected"));

    // set selected doctor id to local storage
    window.localStorage.setItem("doctorSelectedId", doctorId);

    const data = {doctorId: doctorId, date: formatDate(dateFromLocalStorage)};

    fetch('/get_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())

        //Then with the data from the response in JSON...
        .then((data) => {
            // console.log('Success:', data);
            let availableHours = data.availableHours;
            // console.log(availableHours.length);
            if (availableHours.length !== 0) {
                generateVisitHourDivs(availableHours);
            } else {
                genereateNoneVisitHoursError();
            }

            if (window.localStorage.getItem("hourSelected")) {
                let currentSelectedHour = window.localStorage.getItem("hourSelected");
                selectHourModal(currentSelectedHour);
            }
        })

        //Then with the error genereted...
        .catch((error) => {
            console.error('Error:', error);
        });

    // let availableHours=[
    //         "8:00-8:30", "8:30-9:00", "9:00-9:30", "9:30-10:00",
    //         "10:00-10:30", "10:30-11:00", "11:00-11:30", "11:30-12:00",
    //         "12:00-12:30", "12:30-13:00", "13:00-13:30", "13:30-14:00",
    //         "14:00-14:30", "14:30-15:00", "15:00-15:30", "15:30-16:00"]
    //
    // setTimeout(() => {
    //     generatevisitHourDivs(availableHours)
    // }, 1000);


    // change header info
    modalDoctorImage.src = doctorImgSrc;
    modalDoctorName.innerHTML = doctorName;
    modalDoctorSpec.innerHTML = doctorSpec;

    // change date input value
    dateInput.value = formatDate(dateFromLocalStorage);

    modal.style.display = "block";
    body.style.overflow = "hidden";
}

function genereateNoneVisitHoursError() {
    let visitHoursDiv = document.getElementById("visitHoursDivs");
    let loadingSpinner = document.getElementById("loadingSpinnerModal");
    let visitHoursErrorSpan = document.getElementById("visitHoursErrorSpan");

    loadingSpinner.style.display = "none";
    visitHoursDiv.innerHTML = "";
    visitHoursErrorSpan.style.display = "block";
}

function generateVisitHourDivs(availableHours) {
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
    let visitHoursErrorSpan = document.getElementById("visitHoursErrorSpan");

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
    visitHoursErrorSpan.style.removeProperty("display");
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

function selectHourModal(selectedHour) {
    let visitHours = document.getElementsByClassName("visitHour");
    // console.log("visitHours -> ", visitHours);

    for (let singleHourDiv of visitHours) {
        if (singleHourDiv.innerHTML === selectedHour) {
            singleHourDiv.classList.add("visitHourSelected");
        }
    }
}


function resetSelectedVisitHours() {
    // reset style of all visit hours to default
    let visitHours = document.getElementsByClassName("visitHour");
    for (let visitHour of visitHours) {
        visitHour.classList.remove("visitHourSelected");
    }
}

function handleDateInputChange() {
    let dateInput = document.getElementById("dateInputReservationModal");
    cal.setDate(new Date(dateInput.value));
}

function handleSubmitModal() {
    let modalTestType = document.getElementById("testTypesBrowserModal");
    let modalPatientName = document.getElementById("nameInputModal");
    let modalPatientPhone = document.getElementById("phoneInputModal");
    let modalInfoForDoctor = document.getElementById("infoForDoctorArea");
    let selectedDoctorId = window.localStorage.getItem("doctorSelectedId");
    let selectedDate = window.localStorage.getItem("dateSelected");
    let selectedHour = window.localStorage.getItem("hourSelected");

    if (modalPatientName.checkValidity() && modalPatientPhone.checkValidity() && selectedHour) {
        // console.log("validityCheck ok")

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
                headers: {"Content-Type": "application/json"}
            })
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                alert("Pomyślnie zarezerwowano wizytę!");

                if (window.location.pathname === "/doctor_list") {
                    updateAvailableHours()
                }

                // alert(JSON.stringify(data))
            })

        handleExitModal();

    } else {
        if (!modalPatientName.checkValidity()) {
            alert("Proszę podać prawidłowe Imię i Nazwisko")
        } else if (!modalPatientPhone.checkValidity()) {
            alert("Proszę podać telefon w formacie '123-123-123'")
        } else if (!selectedHour) {
            alert("Proszę wybrać godzinę")
        }
    }


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