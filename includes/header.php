<!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8">
  <title>MyExams | <?php echo $pageData["page_title"]; ?></title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="<?php echo $pageData["page_description"]; ?>">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
  <link rel="stylesheet" href="fonts/icomoon/style.css"></head>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <?php
  if($pageData["page_name"] != "login"){
    include("menu.php");
  }
  ?>
  <main>
