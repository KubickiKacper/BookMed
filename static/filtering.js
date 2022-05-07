    // getting doctorList div
    let doctorList = document.getElementsByClassName("doctor_li");
    let specializationSearch = document.getElementById("specializationBrowser");
    let nameSearch = document.getElementById("specialistBrowser");
    specializationSearch.addEventListener("change",() => {
            //iterating over list and hiding elements which do not match
            for (var i = 0; i < doctorList.length;i++){
                let element2 = doctorList[i].getAttribute('data-doctor-spec');
                
                if (element2 === specializationSearch.value){
                doctorList[i].style.display = "flex";
                }
                if (element2 !== specializationSearch.value) {
                  doctorList[i].style.display = "none";
                }
                if (specializationSearch.value === "") {
                    for (var j = 0; j < doctorList.length;j++) doctorList[j].style.display = "flex";
                }
                

                
                // for (var j = 0; j < doctorList.length;j++) {
                //   if (specializationSearch.value === null) doctorList[j].style.display = "flex";
                // }
            };
    });
    nameSearch.addEventListener("change",() => {
      //iterating over list and hiding elements which do not match
      for (var i = 0; i < doctorList.length;i++){
          let element2 = doctorList[i].getAttribute('data-doctor-name');
          // show just the elements which do match
          if (element2 === nameSearch.value){
          doctorList[i].style.display = "flex";
          }
          // hide the elements which dont match
          if (element2 !== nameSearch.value) {
            doctorList[i].style.display = "none";
          }
          // if field is null get the whole list back
          if (nameSearch.value === "") {
              for (var j = 0; j < doctorList.length;j++) doctorList[j].style.display = "flex";
          }
      };
});