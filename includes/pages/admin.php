<?php
// If the user is not admin, send them back to where they should be
if($_SESSION["user_status"] != "admin"){
  header("Location: ?page=home");
}
?>
<section>
  <header>
    <h1>Admin</h1>
    <?php
    require("includes/searchPanel.php");
    ?>
  </header>
  <div id="exam-list">
  </div>
  <i class="icon-circ-download add-button"></i>
</section>
