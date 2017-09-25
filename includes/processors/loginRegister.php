<?php
require_once("../database.php");

// This page handles an AJAX request to login to the site
if(isset($_POST["action"])){
  switch($_POST["action"]){
    case "register":
      register();
      break;
    case "login":
      login();
      break;
  }
}

// Function to log a user into the system
function login(){
  // Check that there is a username and password set in the POST array
  if(isset($_POST["username"]) && isset($_POST["password"])){
    $data = [];

    // Check if the user exists. 0 index to select the first item
    $user = getUser($_POST["username"]);

    // Check that the user bot exists, and the password is correct. Otherwise reject the login.
    if(!$user || !password_verify($_POST["password"], $user["user_password"])){
      $data["status"] = "failed";
      $data["errors"]["password"] = "Incorrect username or password";
    }
    else {
      array_pop($user);
      $_SESSION = $user;
      $data["status"] = "success";
    }
    echo json_encode($data);
  }

}

// Function to register a user to the system
function register(){
  // Check that all the data has been set
  $data = array(
    "status" => "failed",
    "errors" => array(
        "function" => "Expected values not set"
    )
  );
  if(isset($_POST["username"]) && isset($_POST["password"]) && isset($_POST["check_password"])){
    // Validate the $_POST array
    $data = validatePOST();
    // If valid, continue registration
    if($data["status"] == "success"){
      // print_r(getUser($_POST["username"]));
      // Check that the user does not already exist in the system
      if(getUser($_POST["username"])){
        $data["status"] = "failed";
        $data["errors"]["username"] = "Username is taken";
      }
      else{
        // Hash the users password
        $hash = password_hash($_POST["password"], PASSWORD_DEFAULT);
        // The user does not already exist. So insert them
        $success = preparedStmt("INSERT INTO users (user_username, user_password) VALUES (?, ?)", "ss", array($_POST["username"], $hash));
        if($success){
          // Log the user into the system
          login($_POST);
          exit();
        }
        else{
          $data["status"] = "failed";
          $data["errors"]["server-error"] = "Could not insert into database";
        }
      }
    }
  }
  echo json_encode($data);
}
