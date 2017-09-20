<?php
// This is the file that handles database actions within the application. These functions are functions that need to be accessible by any page within the application

// Declare a database object
$dbc = mysqli_connect("localhost", "exam_user", "5Pzc0jB2i92h4rXc", "exams");

// Check the connection
if (mysqli_connect_errno()) {
    printf("Could not connect, error: %s\n", mysqli_connect_error());
    exit();
}

//Check if a session is set
if(!isset($_SESSION)){
  // If there is no session, create one
  session_start();
}

// Function to retrieve pages from the database. Get pages from the database. If the function is passed a pageName, get that pages information
function getPages($pageName = null){
  global $dbc;
  $data = preparedStmt("SELECT page_id, page_title, page_description, page_name, page_js FROM pages WHERE page_name = ?", ($pageName != null ? 's' : null), ($pageName != null ? [$pageName] : null));
  // Formulate query to send to the database to prepare
  return $data;
}

// Function for validating the POST array. There are only a few specific kinds of data that will be coming in, so a general validation function is the most effective way to do this.
function validatePOST(){
  $errors = [];
  // Check a username field
  if(isset($_POST["username"]) && (strlen($_POST["username"]) > 25 || $_POST["username"] == "")){
    $errors["username"] = "Please enter a username less than 25 characters";
  }

  // Check a password field
  if(isset($_POST["password"]) && strlen($_POST["password"]) < 5){
    $errors["password"] = "Please enter a password that is longer than 5 characters";

    // If a check password has been set
    if(isset($_POST["check_password"]) && $_POST["password"] != $_POST["check_password"]){
      $errors["check_password"] = "Passwords don't match!";
    }
  }
  if(isset($_POST["exam_room"]) && strlen($_POST["exam_room"]) > 20){
    $errors["exam_room"] = "Please no more than 20 characters";
  }

  // Validate a date
  if(isset($_POST["exam_date"])){
    // Form a new date object
    try{
      $date = new DateTime($_POST["exam_date"]);
    }
    catch (Exception $e) {
      $errors["date-input"] = "Please don't try to mess with me. (If this isn't what you were doing, please contact an admin)";
    }
  }

  $data = array(
    "errors" => $errors,
    "status" => (sizeof($errors) ? "failed" : "success")
  );

  return $data;
}

// Function for binding a statments results to an array. Works like mysqli_fetch_assoc($result). Builds an array of field names for mysqli_stmt_bind_result to bind the result to. From Amber: https://stackoverflow.com/questions/1290975/how-to-create-a-secure-mysql-prepared-statement-in-php
function stmt_bind_assoc (&$stmt, &$out) {
    $data = mysqli_stmt_result_metadata($stmt);
    $fields = array();
    $out = array();

    $fields[0] = $stmt;
    $count = 1;

    while($field = mysqli_fetch_field($data)) {
        $fields[$count] = &$out[$field->name];
        $count++;
    }
    call_user_func_array('mysqli_stmt_bind_result', $fields);
}

// Function to get a user out of the database by name or id
function getUser($userName = null, $userId = null){
  $user = preparedStmt("SELECT user_id, user_username, user_status, user_password FROM users ".($userName != null ? "WHERE user_username = ?":"WHERE user_id = ?"), ($userName != null ? "s" : "i"), ($userName != null ? [$userName] : [$userId]));
  $user = (sizeof($user) ? $user[0] : false);
  return $user;
}

/* Function to perform a prepared statement. Takes a statement, and an array of items to insert into it. The arry contains an array of items to insert into the query. It also takes a string of datatypes to expect
Returns an array of results*/
function preparedStmt($prestmt, $datTypes = null, $vars = null){
  global $dbc;
  // Attempt to prepare the statement
  if($stmt = mysqli_prepare($dbc, $prestmt)){
    // Create an array to insert data to the query
    $params = [$stmt];
    // If there are parameters to pass
    if($datTypes != null && $vars != null){
      $params[] = $datTypes;
      foreach ($vars as &$var) {
        $params[] = &$var;
      }
      // Bind parameters to use with markers
      call_user_func_array('mysqli_stmt_bind_param', $params);
    }

    // Execute the query
    mysqli_stmt_execute($stmt);

    // If the statement returned rows, return them as an array
    // affected_rows is -1 unless it was a statement that inserts, deletes, or updates rows. Hence, I am using this to detect if there are selected results to return
    if($stmt->affected_rows == -1){
      // Create an array for result data
      $resultData = [];

      // Create an array for storing the result data in
      $resultRow = [];
      stmt_bind_assoc($stmt, $resultRow);

      while(mysqli_stmt_fetch($stmt)){
        // Use the array copy function from php.net to copy the array without references.
        array_push($resultData, arrayCopy($resultRow));
      }

      // Return the data
      return $resultData;
    }
    return true;
  }
  return false;
}

/*
This function is 0% my own work, it is from: "kolkabes@googlemail.com". I found it in the comments on the php.net manual page for array functions: http://php.net/manual/en/ref.array.php#108546 This function saved my arse man. Thank you kind stranger.
*/
function arrayCopy( array $array ) {
        $result = array();
        foreach( $array as $key => $val ) {
            if( is_array( $val ) ) {
                $result[$key] = arrayCopy( $val );
            } elseif ( is_object( $val ) ) {
                $result[$key] = clone $val;
            } else {
                $result[$key] = $val;
            }
        }
        return $result;
}

// Function to get an exam from the database. Needs a name and level, or an id
function getExam($examName = null, $examLevel = null, $examId = null){
  $exam = preparedStmt("SELECT exam_id, exam_name, exam_datetime, exam_level FROM exams ".($examName != null ? "WHERE exam_name = ? AND exam_level = ?":"WHERE exam_id = ?")." ORDER BY exam_datetime ASC", ($examName != null ? "si" : "i"), ($examName != null ? [$examName, $examLevel] : [$examId]));
  $exam = (sizeof($exam) ? $exam[0] : false);
  return $exam;
}

// Function to place an exam into the database. Will check if the exam already exists, and if it has changed update it in the database. Otherwise it will leave it. If the exam doesn't exist already, it will insert it.
function insertExam($name, $datetime, $level){
  if($exam = getExam($name, $level)){
    $dbDate = new DateTime($exam["exam_datetime"]);
    $inDate = new DateTime($datetime);
    if($dbDate != $inDate){
      // Update the exam in the database
      preparedStmt("UPDATE exams SET exam_datetime = ? WHERE exam_id = ?", "si", [$datetime, $exam["exam_id"]]);
    }
  }
  // Else insert a new exam
  else {
    preparedStmt("INSERT INTO exams (exam_name, exam_datetime, exam_level) VALUES (?, ?, ?)", "ssi", [$name, $datetime, $level]);
  }
}

// Function to add a user to an exam
function addExam($examId, $room = null){
  return preparedStmt("INSERT INTO userexams (userexam_user, userexam_exam".($room?", userexam_room":"").") VALUES (?, ?".($room?", ?":"").")", "ii".($room?"s":""), ($room?[$_SESSION["user_id"], $examId, $room]:[$_SESSION["user_id"], $examId]));
}

// Function for getting user exams
function getUserExams($userId){
  return preparedStmt("SELECT exam_id, exam_name, exam_datetime, exam_level, userexam_room, userexam_datetime FROM exams, userexams WHERE userexam_user = ? AND userexam_exam = exam_id AND exam_id = userexam_exam ORDER BY exam_datetime ASC", "i", [$userId]);
}

// Function to check if a user is already in an exam
function inExam($examId){
  // Get all of the users exams
  $exams = getUserExams($_SESSION["user_id"]);
  foreach ($exams as $exam) {
    if($exam["exam_id"] == $examId){
      return true;
    }
  }
  return false;
}

// Function to get all exams from the database
function allExams($examLevel = null){
  return preparedStmt("SELECT exam_id, exam_name, exam_datetime, exam_level FROM exams".($examLevel != null ? " WHERE exam_level = ?" : null)." ORDER BY exam_datetime ASC", ($examLevel != null ? "i": null), [$examLevel]);
}

// Function for checking if an exam is in an array (By id)
function examInArray($inExam, $userExams){
  foreach ($userExams as $exam) {
    if($exam["exam_id"] == $inExam["exam_id"]){
      return true;
    }
  }
  return false;
}

// TEST FUNCTION FOR PRINTING AN Array
function print_a($ar){
  echo "<pre>";
  print_r($ar);
  echo "</pre>";
}
