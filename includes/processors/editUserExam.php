<?php
require_once("../database.php");
// This file handles an AJAX request to update a userexams details
if(isset($_POST["exam_id"]) && isset($_POST["exam_room"])){
  $validation = validatePOST();

  if($validation["status"] == "success"){
    // Send a request to update the userexam Details
    $success = preparedStmt("UPDATE userexams SET userexam_room = ? WHERE userexam_exam = ? AND userexam_user = ?", "sii", [$_POST["exam_room"], $_POST["exam_id"], $_SESSION["user_id"]]);

    echo json_encode(array(
      "status" => ($success?"success":"failed"),
      "errors" => ($success?"":["server-error"])
    ));
  }
  else{
    echo json_encode($validation);
  }
}
