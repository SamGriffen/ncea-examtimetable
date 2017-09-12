<?php
require("../database.php");

if(isset($_POST["exam_id"]) && isset($_SESSION["user_id"])){
  $validation = validatePOST();

  if($validation["status"] == "success"){
    $success = addExam($_POST["exam_id"], (isset($_POST["exam_room"])?$_POST["exam_room"]:null));
    $exam = getExam(null, null, $_POST["exam_id"]);
    if(isset($_POST["exam_room"])){
      $exam["exam_room"] = $_POST["exam_room"];
    }

    echo json_encode(array(
      "status" => ($success ? "success" : "failed"),
      "data" => ["exam" => $exam]
    ));
  }
  else{
    echo json_encode($validation);
  }
}
