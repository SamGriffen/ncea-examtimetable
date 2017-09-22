<?php
// If the user is not admin, send them back to where they should be
if($_SESSION["user_status"] != "admin"){
  header("Location: ?page=home");
}
?>
<section>
  <header>
    <div class="vert-align-cont">
      <div class="add-cont">
        <i class="icon-circ-download add-button"></i>
      </div>
      <h1>Admin</h1>
    </div>
    <?php
    require("includes/searchPanel.php");
    ?>
  </header>
  <div id="exam-list">
  </div>
</section>
