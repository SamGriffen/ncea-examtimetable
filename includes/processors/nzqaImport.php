<?php
require_once("../database.php");
require("nzqa_script.php");

// Check that the user is an admin user
if(isset($_SESSION["user_status"]) && $_SESSION["user_status"] == "admin"){
  // Work through each year level
  for($level = 1; $level <= 4; $level++){
    // Get the exams from NZQA
    $exams = getExams($level);

    // Loop through each exam, and dump it into the database
    foreach ($exams as $exam) {
      // Forumlate a datetime for the database
      $datetime = $exam["date"]." ".$exam["time"];
      insertExam($exam["name"], $datetime, $level);
    }
  }
  echo json_encode(["status" => "success"]);
}
