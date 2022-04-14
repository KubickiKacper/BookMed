function handleReservationBtnClick(doctorImgSrc, doctorName, doctorSpec) {
    // console.log("Clicked ", doctorName);
    let modal = document.getElementsByClassName("reservation-modal-container")[0];
    let modalDoctorImage = document.getElementById("modal-doctor-image");
    let modalDoctorName = document.getElementById("modal-doctor-name");
    let modalDoctorSpec = document.getElementById("modal-doctor-specialization");

    modalDoctorImage.src = doctorImgSrc;
    modalDoctorName.innerHTML = doctorName;
    modalDoctorSpec.innerHTML = doctorSpec;

    modal.style.display = "block";
}