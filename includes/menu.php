<nav id="header-cont" class="menu-cont">
  <div id="header">
    <div id="hamburger">
      <div id="bar-cont">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
  <ul id="menu">
    <li><a href="?page=home">My Exams</a></li>
    <li><a href="?page=profile">Profile</a></li>
    <?php
    if($_SESSION["user_status"] == "admin"){
    ?>
    <li><a href="?page=admin">Admin</a></li>
    <?php
    }
    ?>
    <li><a href="#" id="logout">Logout</a></li>
  </ul>
</nav>
