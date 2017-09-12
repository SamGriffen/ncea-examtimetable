// Store the last state of the search menu
var level = 1;

// Add an event listener to the load of the page
window.addEventListener("load", function(){
  loadExams(0, function(){homePopulateHook()});
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

  // Add a listener to the document to close all open exams
  document.addEventListener("click", function(event){
    // Close all the other exam blocks
    var openItems = document.querySelectorAll(".buttons-open");
    for (let item of openItems) {
      item.classList.remove("buttons-open");
    }
  })
})

// Function to update the exams that show in the add exam window
function populateAddModal(){
  var query = document.forms["search-menu"]["query"].value;

  var regstr = "^"+query+".*$";
  var regexp = new RegExp(regstr, "ig");

  // Clear the list of exams
  $("#modal-exam-list").innerHTML = "";

  // Store whether an exam has been printed to the screen or not
  let found = false;

  // Iterate over exams in the array for the selected level
  for(let exam of exams[level]){
    // console.log(exam);
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
  $("#modal-data h1").innerHTML = "Add Room for Level "+parameters.exam.exam_level+" "+parameters.exam.exam_name;
  document.forms["exam-room-form"].addEventListener("submit", function(event){
    event.preventDefault();
    var data = new FormData();
    data.append("exam_id", parameters.exam.exam_id);

    var room = document.forms["exam-room-form"]["exam_room"].value;

    if(room != ""){
      data.append("exam_room", room);
    }
    if(room == "" || validateForm(event.target)){
      // Send an AJAX query to the server
      var ajax = new AJAX();
      ajax.load("includes/processors/addExam.php", data, function(data){
        if(data.status == "success"){
          var exam = data.data.exam;
          // Remove the exam from the array that it is currently in
          removeExam(exam, exam.exam_level);
          data.data['confFunc'] = completeAddExam;
          loadUserExams(homePopulateHook);
          closeModal();
        }
        else{
          handleFormAJAX(data);
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
        populateModal("confirm", {exam:exam, heading:"Leave Level "+exam.exam_level+" "+exam.exam_name+"?", message:"You can always add this exam again later", yes:"Leave", no:"Stay", okfunc:function(params){
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
	var ajax = new AJAX();
	var data = new FormData();
	data.append("exam_id", exam.exam_id);
	ajax.load("includes/processors/leaveExam.php", data, function(data){
		if(data.status == "success"){
			closeModal();
			// Reload the users exams
			loadUserExams(homePopulateHook);

      // Once the user exams are reloaded, and all is well, reload the other exams in the background
      loadExams(1);
		}
	})
}

// Function to configure the edit exam data dialog
function editExamConf(parameters){
  var exam = parameters.exam;

  // Get the

  // Add the exam details to the modal
  var string = `
  <form id='exam-form'>
    <div class="input-group">
      <input type='date' name='userexam_date' id="datepicker" value="${exam.exam_date}">
      <label for="exam_room">Exam Date</label>
    </div>
    <div class="input-group">
      <input type='text' name='exam_room'>
      <label for="exam_room">Exam Room</label>
    </div>
    <div>
      <input type='submit' value='Done'>
    </div>
  </form>
  `;
  //value="${exam.exam_datetime}"
  $("#modal-data section").innerHTML += string;

  flatpickr("#datepicker", {});

  // Add a title to the modal
  $("#modal-data h1").innerHTML = `Level ${exam.exam_level} ${exam.exam_name} Details`;

  // Put the exam room into the edit field
  $("#modal-data #exam-form")["exam_room"].value = (exam.userexam_room ? exam.userexam_room : "");

  // Add an event listener to the form
  document.forms["exam-form"].addEventListener("submit", function(event){
    // Prevent the form from submitting
    event.preventDefault();

    // If the form is valid
    if(validateForm(event.target)){
      var room = event.target["exam_room"].value;
      var data = new FormData();
      data.append("exam_id", exam.exam_id);
      data.append("exam_room", room);

      // Send a request to the server to update the exam
      var ajax = new AJAX();
      ajax.load("includes/processors/editUserExam.php", data, function(data){
        if(data.status == "success"){
          // Update the exam on the screen
          exams[0][getExamId(exams[0], exam.exam_id, true)].userexam_room = room;
          homePopulateHook();
          closeModal();
        }
      })
    }
  })
}
