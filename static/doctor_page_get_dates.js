updateAvailableHours()
function updateAvailableHours() {
    let dateFromLocalStorage = new Date(window.localStorage.getItem("dateSelected"));
    let availableHoursDivs = document.getElementsByClassName("availableHoursDoctorList");

    for (let singleHourDiv of availableHoursDivs) {
        let currentDoctorId = singleHourDiv.attributes["data-doctor-id"].value;

        singleHourDiv.innerHTML = "";
        singleHourDiv.appendChild(generateLoadingSpinner(currentDoctorId));

        const data = {doctorId: currentDoctorId, date: formatDate(dateFromLocalStorage)};

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
                singleHourDiv.innerHTML = "";
                // console.log('Success:', data);
                let availableHours = data.availableHours;
                // console.log(availableHours.length);
                if (availableHours.length !== 0) {
                    // console.log("dostępne godziny -> ", availableHours);
                    let generatedButtons = generateVisitHourButtons(availableHours, currentDoctorId);
                    for (let button of generatedButtons) {
                        singleHourDiv.appendChild(button);
                    }
                } else {
                    console.log("nie ma dostępnych godzin");
                }
            })

            //Then with the error genereted...
            .catch((error) => {
                console.error('Error:', error);
            });
    }

}

function generateLoadingSpinner(currentDoctorId) {
    let spinner = document.createElement('div');
    spinner.className = "loadingSpinnerDoctorList";
    spinner.dataset.doctorid = currentDoctorId;
    let spinnerBorder = document.createElement("div");
    spinnerBorder.className = "spinner-border";
    spinnerBorder.role = "status";
    let span = document.createElement("span");
    span.className = "visually-hidden";
    span.innerHTML = "Loading...";
    spinnerBorder.appendChild(span);
    spinner.appendChild(spinnerBorder);

    return spinner;
}


// let calendar = document.getElementById("calendar");
// calendar.addEventListener("click", () => {
//     // console.log("click calendar");
//     let newDateFromLocalStorage = new Date(window.localStorage.getItem("dateSelected"));
//     console.log("dateFromLocalStorage -> ", dateFromLocalStorage);
//     console.log("newDateFromLocalStorage -> ", newDateFromLocalStorage);
//
//     if (dateFromLocalStorage === newDateFromLocalStorage) {
//         console.log("nic się nie zmieniło");
//     } else {
//         console.log("data się zmieniła");
//     }
// })

function generateVisitHourButtons(availableHours, currentDoctorId) {
    let loadingSpinners = document.getElementsByClassName("loadingSpinnerDoctorList");
    let reservationButtons = document.getElementsByClassName("res_btn_doctor_list");

    // find spinner to hide by currentDoctorId
    for (let singleSpinner of loadingSpinners) {
        if (singleSpinner.attributes["data-doctorid"].value === currentDoctorId) {
            singleSpinner.style.display = "none";
        }
    }

    // find button to show by currentDoctorId
    for (let reservationButton of reservationButtons) {
        if (reservationButton.attributes["data-doctor-id"].value === currentDoctorId) {
            reservationButton.classList.remove("hiddenBtn");
        }
    }

    let buttonsArray = [];

    for (let availableHour of availableHours) {
        // console.log("availableHour -> ", availableHour)
        let div = document.createElement("button");
        div.className = "dateButton";
        div.innerHTML = availableHour;
        // div.onclick = handleHourSelect;

        buttonsArray.push(div);
    }

    return buttonsArray;
}



