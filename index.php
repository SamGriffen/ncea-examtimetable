<?php
// Index page. This handles what page the user sees

require_once("includes/database.php");

if(isset($_GET["page"])){
  if(!isset($_SESSION["user_id"]) && $_GET["page"] != "login"){
    header("Location: ?page=login");
  }
  if($pageData = getPages($_GET["page"])[0]){
    //Include the header template
    include("includes/header.php");
    // Get the pagename for string
    $pageName = $pageData["page_name"];
    include("includes/pages/$pageName.php");
    //Include the footer template
    include("includes/footer.php");
  }
  else{
    header("location: ?page=404");
  }
}
else {
  header("location: ?page=".(isset($_SESSION["user_id"]) ? "home" : "login")."");
}
