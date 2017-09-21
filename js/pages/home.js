// Store the last state of the search menu
var level = 1;

// Add an event listener to the load of the page
window.addEventListener("load", function(){
  loadExams(0, homePopulateHook);
  $(".add-button").addEventListener("click", function(event){
    populateModal("addExam", {confFunc:function(){
      // When a level is selected, modify the global variable
      $(`#search-menu input[value='${level}']`).setAttribute("checked", "checked");

      // When the search bar changes at all, redraw the add window
      document.forms["search-menu"].addEventListener("change", function(event){
        level = document.forms["search-menu"]["level"].value;
        populateAddModal();
      })
    }});

    document.forms["search-menu"].addEventListener("input", function(event){
      // Simulate change event on the form. This way it only gets updated once, and the list updates on input and on change
      var inputEvent = new Event('change', {
        'bubbles': true,
        'cancelable': true
      });
      event.target.dispatchEvent(inputEvent);
    })
    populateAddModal();
    openModal();
  });
})

// Function to update the exams that show in the add exam window
function populateAddModal(){
  var query = document.forms["search-menu"]["query"].value;

  var regstr = "^"+query+".*$";
  var regexp = new RegExp(regstr, "i");

  // Clear the list of exams
  $("#modal-exam-list").innerHTML = "";

  // Store whether an exam has been printed to the screen or not
  let found = false;

  // Iterate over exams in the array for the selected level
  for(let exam of exams[level]){
    // Get the exam time as human readable
    var date = procDATETIME(exam.exam_datetime);
    // If the exam matches the query entered, list it
    if(regexp.exec(exam.exam_name) && !checkUserExams(exam.exam_id)){
      $("#modal-exam-list").innerHTML += "<div class='exam-block exam-cont'><h4>"+exam.exam_name+"</h4><p>"+date.date+" "+date.time+"</p><i class='icon-add' data-exam='"+exam.exam_id+"'></i></div>";
      found = true;
    }
  }
  // Iterate over all the buttons just added. I tried doing this within the loop that adds buttons, to avoid an extra loop. However I could not for the life of me figure out why it would not work. Maybe my code was simply shit
  var buttons = document.querySelectorAll(".icon-add");
  for(let button of buttons){
      button.addEventListener("click", function(event){
        var id = event.target.getAttribute("data-exam");


        // Get the exam
        var exam = getExamId(exams[level], id);

        // See if the user has an exam room to add
        populateModal("addRoom", {exam:exam, confFunc:confExamAdd});
      })
  }

  // If an exam was not found, print a message to the screen
  if(!found){
    $("#modal-exam-list").innerHTML = "<p>No exams found.</p>";
  }
}

// Function for configuring the add exam room modal
function confExamAdd(parameters){
  $("#modal-data h1").innerHTML = "Add Room for "+getLevelString(parameters.exam.exam_level)+" "+parameters.exam.exam_name;
  document.forms["exam-room-form"].addEventListener("submit", function(event){
    event.preventDefault();
    var formData = new FormData();
    formData.append("exam_id", parameters.exam.exam_id);

    var room = document.forms["exam-room-form"]["exam_room"].value;

    if(room != ""){
      formData.append("exam_room", room);
    }
    if(room == "" || validateForm(["exam_room"], event.target)){
      // Send an AJAX query to the server
      AJAX("includes/processors/addExam.php", formData, function(data){
        if(data.status == "success"){
          var exam = data.data.exam;
          // Remove the exam from the array that it is currently in
          removeExam(exam);
          data.data['confFunc'] = completeAddExam;
          loadExams(0, homePopulateHook);
          closeModal();
        }
        else{
          handleFormAJAX(event.target, data);
        }
      })
    }
  })
}

// Function for completeing the addition of an exam
function completeAddExam(){
  $("#done-button").addEventListener("click", function(){closeModal()});
}

// Shortcut for populating exams
function homePopulateHook(){
  populateExams(exams[0], ["room"], [{
      class:"icon-edit",
      callback:function(event){
        // Get the targeted exam
        var id = getNearestElClass(event.target, "exam-buttons-cont").getAttribute("data-exam");
        var exam = getExamId(exams[0], id);

        // Populate the modal with the edit exam info dialog
        populateModal("editExam", {exam:exam, confFunc:editExamConf});
        openModal();
      }
    },
    {
      class:"icon-trash",
      callback:function(event){
        // Get the exam id
        var id = getNearestElClass(event.target, "exam-buttons-cont").getAttribute("data-exam");
        var exam = getExamId(exams[0], id);
        // Populate the modal with the confirm dialog
        populateModal("confirm", {exam:exam, heading:"Leave "+getLevelString(exam.exam_level)+" "+exam.exam_name+"?", message:"You can always add this exam again later", yes:"Leave", no:"Cancel", okfunc:function(params){
          leaveExam(params.exam);
        }});
        openModal();
      }
    }
  ]);
}

// Function to make a user leave an exam
function leaveExam(exam){
	// Set up an AJAX call to leave the exam
	var data = new FormData();
	data.append("exam_id", exam.exam_id);
	AJAX("includes/processors/leaveExam.php", data, function(data){
		if(data.status == "success"){
			closeModal();
			// Reload the users exams
      loadExams(0, homePopulateHook);
		}
	})
}

// Function to configure the edit exam data dialog
function editExamConf(parameters){
  var exam = parameters.exam;

  let clash = (exam.userexam_datetime?true:false);

  let exam_date = (clash?exam.userexam_datetime:exam.exam_datetime);
  var date = procDATETIME(exam_date);
  var realDate = procDATETIME(exam.exam_datetime);

  // Add the exam details to the modal
  var string = `
  <form id='exam-form'>
    <div class="input-group">
      <input type='text' name='exam_room' placeholder="Unknown">
      <label for="exam_room">Exam Room</label>
    </div>
    <div id="date-input">
      <div class="input-group">
        <input type='date' name='exam_date' id="datepicker" value="${date.htmlDate}" ${(clash?"":"disabled")}>
        <label for="exam_date">Exam Date</label>
        <div id="exam-time-select">
          <input type='time' name='exam_time' id="timepicker" value="${date.htmlTime}" ${(clash?"":"disabled")}>
        </div>
      </div>
    </div>
    <div>
      <input type="checkbox" value="clash" id="clash" ${(clash?"checked":"")}>
      <label for="clash"></label>
      <label for="clash">I have a clash</label>
    </div>
    <div>
      <input type='submit' value='Save'>
    </div>
  </form>
  `;
  //value="${exam.exam_datetime}"
  $("#modal-data section").innerHTML += string;

  // If the user has a clash, tell them they can edit the date
  if(clash)toggleMessage($("#date-input"), "You can edit the date", "dateedit", "okay");

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
})

  // On click of the "I have a clash" checkbox, enable the date field
  document.forms["exam-form"]["clash"].addEventListener("change", (event)=>{
    let dateEl = document.forms["exam-form"]["exam_date"].nextSibling;
    let timeEl = document.forms["exam-form"]["exam_time"].nextSibling;
    // Toggle whether the input is disabled
    dateEl.disabled = !dateEl.disabled;
    timeEl.disabled = !timeEl.disabled;

    // If it has been disabled, set the time to the exam default time
    if(dateEl.disabled){
      datePicker.setDate(realDate.htmlDate);
      timePicker.setDate(realDate.htmlTime);
    }

    // If a message exists, remove it, otherwise, add it
    // if(document.forms["exam-form"]["userexam_date"].querySelector())
    // Alert the user that they can now edit the date
    if(!clash)toggleMessage($("#date-input"), "You can now edit the date", "dateedit", "okay");
  })

  // Add a title to the modal
  $("#modal-data h1").innerHTML = getLevelString(exam.exam_level)+` ${exam.exam_name} Details`;

  // Put the exam room into the edit field
  $("#modal-data #exam-form")["exam_room"].value = (exam.userexam_room ? exam.userexam_room : "");

  // Add an event listener to the form
  document.forms["exam-form"].addEventListener("submit", function(event){
    // Prevent the form from submitting
    event.preventDefault();

    // If the form is valid
    if(validateForm(["exam_room", "exam_date", "exam_time"], event.target)){
      let tar = event.target;
      var room = tar["exam_room"].value;

      // Create the date of the exam
      let date = `${tar["exam_date"].value} ${tar["exam_time"].value}`;

      var data = new FormData();
      data.append("exam_id", exam.exam_id);
      data.append("exam_room", room);
      data.append("exam_date", date);

      // Send a request to the server to update the exam
      AJAX("includes/processors/editUserExam.php", data, function(data){
        if(data.status == "success"){
          // Update the exam on the screen
          exam.userexam_room = room;
          exam.userexam_datetime = (new Date(exam.exam_datetime).getTime() == new Date(date).getTime()?null:date);
          homePopulateHook();
          closeModal();
        }
        else{
          appendFormErrors(tar, data.errors);
        }
      })
    }
  })
}
