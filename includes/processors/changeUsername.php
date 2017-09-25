<?php
require_once("../database.php");

// This file handles an AJAX request to change a users username

// First, check that the user is in facr signed in
if(isset($_SESSION["user_id"]) && isset($_POST["username"])){
  // Validate the POST array
  $data = validate($_POST, ["username"]);

  // Check that the user does not already exist
  if(getUser($_POST["username"])){
    $data["status"] = "failed";
    $data["errors"]["username"] = "Username is taken";
  }

  if($data["status"] == "success"){
    // If it is valid, replace the user's username
    $result = preparedStmt("UPDATE users SET user_username = ? WHERE user_id = ?", "si", [$_POST["username"], $_SESSION["user_id"]]);

    if($result){
      $_SESSION["user_username"] = $_POST["username"];
      $data["username"] = $_POST["username"];
    }

    $data["status"] = ($result?"success":"failed");
  }
  echo json_encode($data);
}
