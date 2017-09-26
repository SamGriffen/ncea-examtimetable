// Tie functions to the window load
window.addEventListener("load", function(){
  loadExams(0, null, function(){adminPopulateHook()});
  $(".add-button").onclick = function(event){
    // Populate the modal asking an admin if they want to import exams from NZQA
    populateModal("confirm", {heading:"Import NZQA Exams", message:"Import this years NCEA exams? Any existing exams will remain, unless there is a duplicate being added, in which case the details will be set to the incoming details from NZQA.", yes:"Import",no:"Cancel", okfunc:function(data){
      // Change the modal data to show that the exams are being imported
      $("#modal-data").innerHTML = "<section><h2>Importing Exams...</h2><i class='icon-reload' id='load-spinner'></i><p>Please Wait. This can take a while.</p></section>";
      nzqaImport();
    }});
    openModal();
  }

  $("#search-menu").addEventListener("change", adminPopulateHook);
});

// Function to import all NZQA data
function nzqaImport(){
  // Send an ajax request to the server to import exams
  AJAX("includes/processors/nzqaImport.php", null, function(data){
    $("#modal-data").innerHTML = "<section><h2>Success!</h2><p>All NCEA exams for the current year have been imported.</p><button id='done-button' class='button green'>Done</button></section>";
    loadExams(0, null, function(){adminPopulateHook()});
    $("#done-button").addEventListener("click", closeModal);
  });
}

// Shortcut for populating exams
function adminPopulateHook(){
  // Get the currently selected level
  let level = document.forms["search-menu"]["level"].value;
  populateExams(exams[level], [], [{
      class:"icon-edit",
      callback:function(event){
        // Get the currently selected level
        let level = document.forms["search-menu"]["level"].value;

        // Get the targeted exam
        var id = getNearestElClass(event.target, "exam-buttons-cont").getAttribute("data-exam");
        var exam = getExamId(exams[level], id);

        // Populate the modal with the edit exam info dialog
        populateModal("editExam", {exam:exam, confFunc:adminEditExamConf});
        openModal();
      }
    },
    {
      class:"icon-trash",
      callback:function(event){
        // Get the currently selected level
        let level = document.forms["search-menu"]["level"].value;
        console.log(level);
        // Get the exam id
        var id = getNearestElClass(event.target, "exam-buttons-cont").getAttribute("data-exam");
        var exam = getExamId(exams[level], id);
        // Populate the modal with the confirm dialog
        populateModal("confirm", {exam:exam, heading:"Delete "+getLevelString(exam.exam_level)+" "+exam.exam_name+"?", message:"This action CANNOT be reversed. If you merely want to update the exams, it is best to re-import them, as this will not cause users to lose their exams. Are you really sure you want to remove this exam, and all data associated with it?", yes:"Delete", no:"Cancel", okfunc:deleteExam});
        openModal();
      }
    }
  ]);
}

// Function for an admin to edit an exam
function adminEditExamConf(parameters){
  var exam = parameters.exam;

  var date = procDATETIME(exam.exam_datetime);

  // Add the exam details to the modal
  var string = `
  <form id='exam-form'>
    <div class="input-group">
      <input type='text' name='exam_name'>
      <label for="exam_name" class="red">Exam Name</label>
    </div>
    <div id="date-input">
      <div class="input-group">
        <input type='date' name='exam_date' id="datepicker" value="${date.htmlDate}">
        <label for="exam_date" class="red">Exam Date</label>
        <div id="exam-time-select">
          <input type='time' name='exam_time' id="timepicker" value="${date.htmlTime}">
        </div>
      </div>
    </div>
    <div>
      <input type='submit' value='Save' class="red">
    </div>
  </form>
  `;
  //value="${exam.exam_datetime}"
  $("#modal-data section").innerHTML += string;

  // Create a datepicker
  var datePicker = flatpickr("#datepicker", {
    altInput: true
  });

  // Create the timepicker
  var timePicker = flatpickr("#timepicker", {
    altInput: true,
    enableTime: true,
    noCalendar: true,

    enableSeconds: false, // disabled by default

    time_24hr: false, // AM/PM time picker is used by default

    // default format
    dateFormat: "H:i",

    // initial values for time. don't use these to preload a date
    defaultHour: 12,
    defaultMinute: 0

    // Preload time with defaultDate instead:
    // defaultDate: "3:30"
  });

  // Add a title to the modal
  $("#modal-data h1").innerHTML = getLevelString(exam.exam_level)+` ${exam.exam_name} Details`;

  // Put the exam name into the edit field
  $("#modal-data #exam-form")["exam_name"].value = exam.exam_name;

  // Add an event listener to the form
  document.forms["exam-form"].addEventListener("submit", function(event){
    // Prevent the form from submitting
    event.preventDefault();

    // If the form is valid
    if(validateForm(["exam_name", "exam_date", "exam_time"], event.target)){
      let tar = event.target;
      var name = tar["exam_name"].value;

      // Create the date of the exam
      let date = `${tar["exam_date"].value} ${tar["exam_time"].value}`;

      var data = new FormData();
      data.append("exam_id", exam.exam_id);
      data.append("exam_name", name);
      data.append("exam_date", date);

      // Send a request to the server to update the exam
      AJAX("includes/processors/editExam.php", data, function(data){
        if(data.status == "success"){
          // Update the exam on the screen
          exam.exam_name = name;
          exam.exam_datetime = date;;
          adminPopulateHook();
          closeModal();
        }
        else{
          appendFormErrors(tar, data.errors);
        }
      })
    }
  })
}

// Function for an admin to delete an exam
function deleteExam(parameters){
  // Create the data to send
  let formData = new FormData();
  formData.append("exam_id", parameters.exam.exam_id);

  // Send an AJAX request to the server
  AJAX("includes/processors/deleteExam.php", formData, (data)=>{
    if(data.status == "success"){
      // Remove the exam from the user's array
      removeExam(parameters.exam);

      // Repopulate
      adminPopulateHook();

      // Alert the user that the exam has been removed Successfully
      modalSuccess("Successfully removed exam.");
    }
    else {
      modalFailed(data.server_errors);
    }
    openModal();
  })
}

// Function for an admin to edit an exam
function adminEditExam(){
  // Validate the data in the modal
}
