<?php
require_once("../database.php");
// This file handles an AJAX request to update a userexams details
if(isset($_POST["exam_id"]) && isset($_POST["exam_room"])){
  $validation = validatePOST();

  if($validation["status"] == "success"){
    // If the user has changed the date, then set the userexam date. This requires the exam from the databsae
    $exam = getExam(null, null, $_POST["exam_id"]);

    // Convert to DateTime obejects in order to ensure that even if they are not equal strings, but the times are equivalent, it works as expected.
    $date = (new DateTime($exam["exam_datetime"]) == new DateTime($_POST["exam_date"]) ? null : $_POST["exam_date"]);

    $datArray = [$_POST["exam_room"], $date, $_POST["exam_id"], $_SESSION["user_id"]];

    $sql = "UPDATE userexams SET userexam_room = ?, userexam_datetime = ? WHERE userexam_exam = ? AND userexam_user = ?";

    $datTypes = "s".($date?"s":"i")."ii";

    // Send a request to update the userexam Details
    $success = preparedStmt($sql, $datTypes ,$datArray);

    echo json_encode(array(
      "status" => ($success?"success":"failed"),
      "errors" => ($success?"":["server-error"])
    ));
  }
  else{
    echo json_encode($validation);
  }
}
