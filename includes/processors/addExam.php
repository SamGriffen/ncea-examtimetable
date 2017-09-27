<?php
require("../database.php");

if(isset($_POST["exam_id"]) && isset($_SESSION["user_id"])){
  $validation = validatePOST();

  if($validation["status"] == "success"){
    // Check that the user is not already in this exam
    if(inExam($_POST["exam_id"])){
        echo json_encode(["status"=>"failed", "server-errors"=>["You're already in that exam"]]);
        exit();
    }

    // Add exam to the users user_exams
    $success = addExam($_POST["exam_id"], (isset($_POST["exam_room"])?$_POST["exam_room"]:null), (isset($_POST["exam_date"])?$_POST["exam_date"]:null));

    // Get the inserted exam to send back to AJAX
    $exam = getExam(null, null, $_POST["exam_id"]);
    if(isset($_POST["exam_room"])){
      $exam["exam_room"] = $_POST["exam_room"];
    }

    echo json_encode(array(
      "status" => ($success ? "success" : "failed"),
      "data" => ["exam" => $exam]
    ));
    exit();
  }
  else{
    echo json_encode($validation);
    exit();
  }
}
