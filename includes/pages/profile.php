<section>
  <header class="vert-align-cont">
    <h1 id="username-header"><?php echo $_SESSION["user_username"] ?></h1>
    </div>
  </header>
</section>
<div id="actions-container">
  <section class="profile-block border-orange">
    <header>
      <h4>Change Username</h4>
    </header>
    <form id="username-form" action="#">
      <div class="input-group">
        <input type='text' name='username' value="<?php echo $_SESSION["user_username"] ?>" required>
        <label for="user_username" class="orange">Username</label>
      </div>
      <div>
        <input type="submit" value="Change" class="orange">
      </div>
    </form>
  </section>

  <section class="profile-block border-green">
    <header>
      <h4>Change Password</h4>
    </header>
    <form id="password-form" action="#">
      <div class="input-group">
        <input type='password' name='current_password' required>
        <label for="current_password" class="green">Current Password</label>
      </div>
      <div class="input-group">
        <input type='password' name='password' required>
        <label for="password" class="green">New Password</label>
      </div>
      <div class="input-group">
        <input type='password' name='check_password' required>
        <label for="check_password" class="green">New Password Again</label>
      </div>
      <div>
        <input type="submit" value="Change" class="green">
      </div>
    </form>
  </section>
</div>
