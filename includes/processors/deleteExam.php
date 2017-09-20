<?php
require_once("../database.php");

// This file handles a request to delete an exam via AJAX

// Check that the user has passed both an ID and is an admin
if(isset($_POST["exam_id"]) && $_SESSION["user_status"] == "admin"){
  // Run query to remove exam
  $success = preparedStmt("DELETE FROM exams WHERE exam_id = ?", "i", [$_POST["exam_id"]]);

  echo json_encode([
    "status" => ($success?"success":"failed"),
    "server_errors" => ($success?"":["Could not delete exam. Please contact an admin."])
  ]);
  exit();
}
echo json_encode([
  "status" => "failed",
  "server_errors" => "Either you did not set the required variables, or you are not an admin."
]);
