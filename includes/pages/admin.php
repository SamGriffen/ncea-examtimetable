<?php
// If the user is not admin, send them back to where they should be
if($_SESSION["user_status"] != "admin"){
  header("Location: ?page=home");
}
?>
<section>
  <header>
    <h1>Admin</h1>
    <form id='search-menu'>
      <div id='searchtop'>
        <div>
          <input type='radio' name='level' value='1' id='levelButton1' checked>
          <label for='levelButton1'>Level 1</label>
        </div>
        <div>
          <input type='radio' name='level' value='2' id='levelButton2'>
          <label for='levelButton2'>Level 2</label>
        </div>
        <div>
          <input type='radio' name='level' value='3' id='levelButton3'>
          <label for='levelButton3'>Level 3</label>
        </div>
      </div>
      <div id='search-bar-cont'>
        <input type='text' name='query' placeholder='Search Exams...' autocomplete='off'>
      </div>
    </form>
  </header>
  <div id="exam-list">
  </div>
  <i class="icon-circ-download add-button"></i>
</section>
<script src="js/pages/admin.js"></script>
