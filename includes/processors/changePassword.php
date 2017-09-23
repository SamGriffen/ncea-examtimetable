<?php
require_once("../database.php");

// This file handles an AJAX request to change a users password

if(isset($_SESSION["user_id"]) && isset($_POST["password"]) && isset($_POST["check_password"]) && isset($_POST["current_password"])){
  // Validate the post array
  $data = validate($_POST, ["password", "check_password"]);

  // Check that the entered password matches the users password
  $user = getUser(null, $_SESSION["user_id"]);

  if(!password_verify($_POST["current_password"], $user["user_password"])){
    $data["status"] = "failed";
    $data["errors"]["current_password"] = "Password Incorrect";
  }

  // If the information is incorrect, or invalid, echo the errors and exit
  if($data["status"] == "failed"){
    echo json_encode($data);
    exit();
  }

  // The data is okay, so continue

  // Hash the new password
  $hashed = password_hash($_POST["password"], PASSWORD_DEFAULT);

  $result = preparedStmt("UPDATE users SET user_password = ? WHERE user_id = ?", "si", [$hashed, $_SESSION["user_id"]]);

  $data["status"] = ($result?"success":"failed");

  echo json_encode($data);
  exit();
}
