// Tie functions to the window load
window.addEventListener("load", ()=>{
  // Add event listener to the username change form
  document.forms["username-form"].addEventListener("submit", (event)=>{
    event.preventDefault();

    // Check that the form is valid
    if(validateForm(["username"], document.forms["username-form"])){
      // Send an AJAX request
      let formData = new FormData(document.forms["username-form"]);

      AJAX("includes/processors/changeUsername.php", formData, (data)=>{
        if(data.status == "success"){
          $("#username-header").innerHTML = data.username;
          modalSuccess(`Successfully changed username to "${data.username}"!`);
          openModal();
        }
        else{
          appendFormErrors(document.forms["username-form"], data.errors);
        }
      })
    }
  })
  document.forms["username-form"].addEventListener("change", (event)=>{
    validateForm(["username"], document.forms["username-form"]);
  })

  document.forms["password-form"].addEventListener("submit", (event)=>{
    event.preventDefault();

    // Check that the form is valid
    if(validateForm(["password", "check_password"], document.forms["password-form"])){
      // Send an AJAX request
      let formData = new FormData(document.forms["password-form"]);

      AJAX("includes/processors/changePassword.php", formData, (data)=>{
        if(data.status == "success"){
          modalSuccess(`Successfully changed password!`);
          openModal();
          document.forms["password-form"].reset();
        }
        else{
          appendFormErrors(document.forms["password-form"], data.errors);
        }
      })
    }
  })
  document.forms["password-form"].addEventListener("change", (event)=>{
    validateForm(["password", "check_password"], document.forms["password-form"]);
  })
})
