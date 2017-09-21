<?php
require_once("../database.php");

// This file handles an AJAX request to edit an exams details

// Check that the user is an admin before allowing them to perform this action
if($_SESSION["user_status"] == "admin"){
  // Validate the POST array
  $data = validatePOST();

  // If valid, continue
  if($data["status"] == "success"){
    // Execute a query
    $result = preparedStmt("UPDATE exams SET exam_name = ?, exam_datetime = ? WHERE exam_id = ?", "ssi", [$_POST["exam_name"], $_POST["exam_date"], $_POST["exam_id"]]);

    $data["status"] = ($result ? "success" : "failed");
  }
  echo json_encode($data);
}
