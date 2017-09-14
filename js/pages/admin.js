// Tie functions to the window load
window.addEventListener("load", function(){
  loadExams(0, null, function(){adminPopulateHook()});
  $(".add-button").onclick = function(event){
    // Populate the modal asking an admin if they want to import exams from NZQA
    populateModal("confirm", {heading:"Import NZQA Exams", message:"Import this years NCEA exams? This will update all exams in the database. If you have corrected any NZQA data, this will override your correction. Any exams that have not changed since the last import will remain untouched, and will not be duplicated.", yes:"Import",no:"Cancel", okfunc:function(data){
      // Change the modal data to show that the exams are being imported
      $("#modal-data").innerHTML = "<section><h2>Importing Exams...</h2><i class='icon-reload' id='load-spinner'></i><p>Please Wait</p></section>";
      nzqaImport();
    }});
    openModal();
  }

  $("#search-menu").addEventListener("change", adminPopulateHook);
});

// Function to import all NZQA data
function nzqaImport(){
  // Send an ajax request to the server to import exams
  var ajax = new AJAX();

  ajax.load("includes/processors/nzqaImport.php", null, function(data){
    $("#modal-data").innerHTML = "<section><h2>Success!</h2><p>All NCEA exams for the current year have been imported.</p><button id='done-button'>Done</button></section>";
    loadExams(0, null, function(){adminPopulateHook()});
    $("#done-button").addEventListener("click", closeModal);
  });
}

// Shortcut for populating exams
function adminPopulateHook(){
  populateExams(exams[document.forms["search-menu"]["level"].value], [], [{
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
        populateModal("confirm", {exam:exam, heading:"Leave Level "+exam.exam_level+" "+exam.exam_name+"?", message:"You can always add this exam again later", okfunc:function(params){
        }});
        openModal();
      }
    }
  ]);
}
