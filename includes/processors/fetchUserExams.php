<?php
// This file will handle an AJAX request to get all of a users exams
require_once("../database.php");

if(isset($_SESSION["user_id"])){
  $exams = getUserExams($_SESSION["user_id"]);

  echo json_encode(array(
    "status" => "success",
    "data" => $exams
  ));
}
