<?php
require("../database.php");


if(isset($_SESSION["user_id"])){
  $userExams = getUserExams($_SESSION["user_id"]);
  $exams = [];

  // Loop over every exam level, and for each exam check that the user is not in the exam
  for($exNum = 1; $exNum < 5; $exNum++){
    // Get all the exams for this level
    $tempExams = allExams($exNum);

    // For each exam in this level, if the user is in it, delete it from the array
    foreach ($tempExams as $exam) {
      if(examInArray($exam, $userExams)){
        $examInd = array_search($exam, $tempExams);
        array_splice($tempExams, $examInd, 1);
        array_values($tempExams);
      }
    }
    $exams[] = $tempExams;
  }
  echo json_encode(array(
    "status" => (sizeof($exams) ? "success" : "failed"),
    "data" => $exams
  ));
}
