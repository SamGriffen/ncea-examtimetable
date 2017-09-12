<?php
require_once("../database.php");

// Check that the exam id to remove the user from has been set
if(isset($_POST["exam_id"])){
  // Execute statement to leave the exam
  $success = preparedStmt("DELETE FROM userexams WHERE userexam_user = ? AND userexam_exam = ?", "ii", [$_SESSION["user_id"], $_POST["exam_id"]]);

  echo json_encode(array(
    "status" => ($success?"success":"failed"),
    "errors" => ($success?"":"Could not insert into database")
  ));
}
