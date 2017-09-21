// Once the document is ready, attach event listners and so on
window.addEventListener("DOMContentLoaded", function(event){
  // Attach an onsubmit listener to the login form
  $("#login-form").addEventListener("submit", function(event){
    // Prevent the form from submitting
    event.preventDefault();

    // Only validate if the user is registering
    var valid = (event.target["submit"].value == "Register" ? validateForm(["username", "password", "check_password"],$("#login-form")) : true);
    if(valid){
      // Make a formdata element of all the data in the form
      var formData = new FormData(event.target);

      // Get the action to take
      formData.append("action", ($("#login-form > #register").getAttribute("data-state") == "invisible" ? "login" : "register"));

      // Create an AJAX query
      AJAX("includes/processors/loginRegister.php", formData, function(data){
        handleFormAJAX(event.target, data, function(event){
          window.location.href = "?page=home";
        });
      }, true);
    }
  })

  // Attach a listener to the register link so that a user can register for an account
  $("#register-link").addEventListener("click", function(event){
    // Make a registration field variable
    var rField = $("#login-form > #register");
    var submit = $("#login-form input[type='submit']");

    // If the registration field is invisible, toggle it visible
    if(rField.getAttribute("data-state") == "invisible"){
      rField.setAttribute("data-state", "visible");
      rField.innerHTML = "<input type='password' name='check_password' required><label for='check_password'>Password Again</label>";
      event.target.innerHTML = "Login";
      submit.setAttribute("value", "Register");
    }
    // Otherwise, toggle it invisible
    else {
      rField.setAttribute("data-state", "invisible");
      rField.innerHTML = "";
      event.target.innerHTML = "Register";
      submit.setAttribute("value", "Login");
    }
  })

  $("#login-form").addEventListener("change", function(event){
    if($("#login-form > #register").getAttribute("data-state") == "visible"){
      validateForm(["username", "password", "check_password"],$("#login-form"));
    }
  })
})
