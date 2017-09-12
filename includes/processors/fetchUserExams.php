<?php
// This file will handle an AJAX request to get all of a users exams
require_once("../database.php");

if(isset($_SESSION["user_id"])){
  $exams = getUserExams($_SESSION["user_id"]);

  // $exams = [];
  // foreach ($dbExams as $exam) {
  //   $name = $exam["exam_name"];
  //   unset($exam["exam_name"]);
  //   $exams[$name] = $exam;
  // }
  echo json_encode(array(
    "status" => (sizeof($exams) ? "success" : "failed"),
    "data" => $exams
  ));
}
