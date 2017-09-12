<?php
require_once("../database.php");
if(isset($_SESSION["user_id"])){
  session_destroy();
  echo json_encode(["status" => "success"]);
}
?>
