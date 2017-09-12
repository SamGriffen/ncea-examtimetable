/* THIS IS THE ONLY GLOBAL VARIABLE. THIS STORES ALL OF THE USERS EXAMS, IT IS INTENDED TO REDUCE LOAD ON THE SERVER BY STORING EXAMS LOCALLY AND ONLY REFRESHING EXAMS WHEN ABSOLUTELY NECCESSARY (ON PAGE LOAD)
Contains all exams that a user is part of in userExams, and every exam in levels 1, 2, and 3
*/
var exams = [];

/* GENERAL FUNCTIONS FOR ALL PAGES */
// Shorthand for document.querySelector. Acts like jQuery $
function $(query){
	return document.querySelector(query);
}

// To run on page load
window.addEventListener("load", function(){
	if(GET("page") != "login"){
		$("#hamburger").addEventListener("touchstart", function(event){
			event.preventDefault();
			var inputEvent = new Event('click', {
        'bubbles': true,
        'cancelable': true
      });
      event.target.dispatchEvent(inputEvent);
		})
		$("#hamburger").addEventListener("click", function(event){
			toggleMenu();
		})

		$("#logout").addEventListener("click", function(event){
			event.preventDefault();
			var ajax = new AJAX();
			ajax.load("includes/processors/logout.php", null, function(data){
				if(data.status == "success"){
					window.location.href = "?page=login";
				}
			});
		});

		// Add an event listener to the document. If the user clicks anywhere but the menu when the menu is open, then close the menu
		document.addEventListener("click", function(event){
			if(!getNearestElClass(event.target, "menu-cont") && $("#hamburger").classList.contains("open")){
				toggleMenu();
			}
		})
	}
	// Attach click listeners to the modal dialogs
	$("#modal-exit").onclick = function(){closeModal();};
	$("#modal-back").onclick = function(){closeModal();};

	// Stop the dialog from closing if the user clicks within the box. This stops the click event from bubbling back up to the modal-back div
	$("#modal-cont").onclick = function(event){event.stopPropagation();};
});

// Function to close the menu
function toggleMenu(){
	$("#hamburger").classList.toggle("open");
	var menu = $("#menu");
	var numItems = document.querySelectorAll("#menu a").length;
	menu.style.maxHeight = (menu.style.maxHeight == "0px" || menu.style.maxHeight == 0 ? numItems*3.188+"em" : 0);
}

/* Declare an object for AJAX requests
Very simplistic, takes a FormData object and transmists it to the server, passing the resulting data from the server into a callback.
*/
function AJAX(){
	this.load = function(url, formData, callback, print = false){
		// Declare the XMLHttpRequest object
		this.xhr = new XMLHttpRequest();

    // Declare what to do on a readystate change
		this.xhr.onreadystatechange = function(){
      // When the request is done, parse the JSON data, and send it through to the callback. If the JSON cannot be parsed due to it not being JSON, throw an error to the console.
			if(this.status == 200 && this.readyState == 4){
				// If the dev print has been set to true, log the response.
				if(print){
					// Print the entire reponse
					console.log(this);
				}
        // Try to encode the data
        try{
	        callback(JSON.parse(this.responseText));
					if(print){console.log(JSON.parse(this.responseText))};
        }
        // If encoding failed, log to the console either the PHP error, or the general error.
        catch(e){
          if(e.name =="SyntaxError"){
            console.log(this.responseText);
          }
          else {
            console.log(e);
          }
        }
			}
		}
    // Open the requested URL
		this.xhr.open("POST", url);

    // Send the formdata to the page
		this.xhr.send(formData);
	}
}

// Function to use the GET array
function GET(key = null){
  // Get the url, and split it into get variables
  var url = window.location.search.substr(1).replace("+", " ").split("&");

  // Create a dictionary for storing the result in
  var dict = {};
  for (var param in url) {
    // Split the variable into it's key/value pair
    var keyvalue = url[param].split("=");

    // If this is key, then return it
    if(keyvalue[0] == key){return keyvalue[1]};
    dict[keyvalue[0]] = keyvalue[1];
  }
  return dict;
}

// Function for handling form AJAX
function handleFormAJAX(form, data, success){
	if(data.status == "success"){
		removeFormErrors(form);
		success();
	}
	else {
		appendFormErrors(form, data.errors);
	}
}

// Function to clear a form of errors, and append a new set of errors to the form
function appendFormErrors(form, errors){
	// Remove the errors from the form
	removeFormErrors(form);

	// Iterate over the errors object passed in
	for (var error in errors) {
		if(errors.hasOwnProperty(error)){
			// Create an error node
			var errorNode = document.createElement("div");
			errorNode.setAttribute("class", "error");
			errorNode.innerHTML = errors[error];

			// If the target input exists, throw an error
			if(form[error]){
				insertAfter(form[error], errorNode);
			}
			// If PHP has cucked us, throw a hissy fit
			else {
				console.log("Server Error: Field '"+error+"' does not exist in form. Server threw: '"+errors[error]+"'. Please contact administrator");
			}
		}
	}
}

// Function to remove errors from a form
function removeFormErrors(form){
	// Get all the current errors in the form as a nodelist
	var errorEls = form.querySelectorAll(".error");

	// Iterate over the nodelist, removing all the errors
	for (var error in errorEls) {
		if (errorEls.hasOwnProperty(error)) {
			removeElement(errorEls[error]);
		}
	}
}

// Function to remove an element from the DOM. Goes up to the parent element and removes it as a child
function removeElement(node) {
    node.parentNode.removeChild(node);
}

// Function to insert an element after another element
function insertAfter(targetEl, newEl){
	var parent = targetEl.parentNode;

	// Check if the last node in the parent node is the target
	if(parent.lastChild == targetEl){
		// I can directly append the new element to the parent element
		parent.appendChild(newEl);
	}
	else {
		// Otherwise insert the new element between the target and it's next sibling
		parent.insertBefore(newEl, targetEl.nextSibling);
	}
}

// Function to check if an element has a parent with a given class
function getNearestElClass(element, className){
	if(element == document) return false;
	if(element.classList.contains(className)) return element;
	return element.parentNode && getNearestElClass(element.parentNode, className);
}

// General form validation function
function validateForm(form){
	// Declare an errors dict
	var errors = {};
	// Validate a username field
	if(form["username"] && (form["username"].value.length > 25 && form["username"].value != "")){
		errors["username"] = "Please enter a username that is shorter than 25 characters";
	}

	// Validate a password field
	if(form["password"] && (form["password"].value.length < 6 && form["password"].value != "")){
		errors["password"] = "Please enter a password that is greater than 6 characters";
	}

	if(form["check_password"] && (form["check_password"].value != form["password"].value) && form["check_password"].value != ""){
		errors["check_password"] = "Passwords don't match";
	}

	if(form["exam_room"] && (form["exam_room"].value == "" || form["exam_room"].length > 20)){
		errors["exam_room"] = "Please enter a room, less than 20 characters";
	}
	// Print the errors out to the form
	if(Object.keys(errors).length){
		appendFormErrors(form, errors);
		return false;
	}
	else {
		removeFormErrors(form);
		return true;
	}
}

// Function to populate modal. Takes optional parameters argument to be passed into a function
function populateModal(action, parameters = {}){
  // dictionary that contains all information about data to put inside a modal, based on the action input. Also a function to call on setup of the dialog
  var modals = {
		confirm : {
			data: "<section></section><div class='button-cont confirm-cont'><button class='button' id='modal-confirm'>Do It!</button><button class='button' id='modal-deny'>Cancel</button></div>",
			function: confirmConfigure,
		},
		addExam : {
			data:
			`<section>
		 		<header>
					<h1>Add Exam</h1>
					<form id='search-menu'>
						<div id='searchtop'>
							<div>
								<input type='radio' name='level' value='1' id='levelButton1'>
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
				<div id="modal-exam-list-wrap">
					<div id='modal-exam-list'>
					</div>
				</div>
			</section>`,
			function:parameters.confFunc
		},
		addRoom : {
			data : "<section><header><h1></h1><p>If you know the room that your exam will be in, add it here. If you don&apos;t, just leave this field blank</p></header><form id='exam-room-form'><div><input type='text' name='exam_room' placeholder='Exam Room'></div><div><input type='submit' value='Done'</input></form></section>",
			function:parameters.confFunc,
		},
		editExam : {
			data : "<section><header><h1></h1></header></section>",
			function:parameters.confFunc,
		}
  };
  // Put the selected data into the modal, then call the associated function
  $("#modal-data").innerHTML = modals[action]["data"];
  if(modals[action]["function"]){
    modals[action]["function"](parameters);
  }

}

// Function to show a success tick on the modal dialog
function modalSuccess(message){
  $("#modal-data").innerHTML = "<span class='icon-tick modal-success'></span><p>"+message+"</p><button id='modal-success-button' class='button'>Ok</button>";
  $("#modal-success-button").addEventListener("click", function(){closeModal()});
}

// Function to show a modal error message
function modalFailed(message){
  $("#modal-data").html("<span class='icon-cross modal-failed'></span><p>"+message+"</p><button id='modal-success-button' class='red button'>Ok</button>");
  $("#modal-success-button").click(closeModal);
}
// Function to close modal on a click of no
function confirmConfigure(parameters){
  if(parameters.heading){
		var html = "<h1>"+parameters.heading+"</h1>";
		html += (parameters.message ? "<p>"+parameters.message+"</p>" : "");

    $("#modal-data section").innerHTML = html;
  }
	if(parameters.yes){
		$(".confirm-cont button#modal-confirm").innerHTML = parameters.yes;
	}
	if(parameters.no){
		$(".confirm-cont button#modal-deny").innerHTML = parameters.no;
	}
  $(".confirm-cont button#modal-deny").addEventListener("click", function(){
    closeModal();
  })
  $(".confirm-cont button#modal-confirm").addEventListener("click", function(){
    parameters.okfunc(parameters);
  })
}

// Function to show the modal. Assumes that it has been populated with content before opening
function openModal(){
  // Display the modal
  $("#modal-back").className = "modal-back-show";
  $("#modal-cont").className = "modal-show";
}

// Function to close the modal window
function closeModal(){
  // Set the background of the modal to fade out
  $("#modal-back").className = "modal-back-fadeout";
  $("#modal-cont").className = "modal-fadeout";
  setTimeout(function(){
    $("#modal-back").classList.remove("modal-back-fadeout");
    $("#modal-cont").classList.remove("modal-fadeout");
  }, 250);
}

// Function to load exams from the database
function loadExams(level, userExamsCallback = null, doneCallback = null){
	// Initiate an AJAX call
	var ajax = new AJAX();
	ajax.load("includes/processors/"+((level?"fetchExams":"fetchUserExams"))+".php", null, function(data){
		data = data.data;

		// If this loop was fetching user exams, fetch everything else
		if(!level){
			exams[0] = data;
			loadExams(1, null, doneCallback);
		}
		else {
			exams.splice(1, 3);
			exams = exams.concat(data);
		}

		if(userExamsCallback){
			userExamsCallback();
		}

		if(level && doneCallback){
			doneCallback();
		}
	})
}

function loadUserExams(callback){
	var ajax = new AJAX();
	ajax.load("includes/processors/fetchUserExams.php", null, function(data){
		exams[0] = data.data;
		callback();
	});
}

// Function to turn a DATETIME into "date at time"
function procDATETIME(datetime){
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var days = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"]
  datetime = new Date(datetime);
  return {
    date: days[datetime.getDay()-1] + " " + datetime.getDate() + " " + monthNames[datetime.getMonth()],
    time: twentyFourToTwelve(datetime.getHours(), ("0"+datetime.getMinutes()).slice(-2))
  }
}

// Function to turn 24 hour time into 12 hour time string (Hours and minutes)
function twentyFourToTwelve(hours, minutes){
  // Set the suffix
  var suff = (hours >= 12 ? "pm" : "am");

  // Reset the hours
  hours = (hours > 12 ? hours-12 : hours);

  return hours + ":" + minutes + " " + suff;
}

// Function to check if an exam exists in the user exams array
function checkUserExams(checkId){
	for (let exam of exams[0]) {
		if (exam.exam_id == checkId) {
			return true;
		}
	}
	return false;
}

// Function for checking if two exams are equal
function objectsEqual(e1, e2){
	if(Object.keys(e1).length != Object.keys(e2).length){
		return false;
	}
	for(var key in e1){
		if(!((e1.hasOwnProperty(key) && e2.hasOwnProperty(key)) && (e1[key] == e2[key]))){
			return false;
		}
	}
	return true;
}

// Function to remove an exam from the exams array
function removeExam(delExam, level){
	for (var exam in exams[level]) {
		if(exams[level].hasOwnProperty(exam) && exams[level][exam].exam_id == delExam.exam_id){
			exams[level].splice(exam, 1);
		}
	}
}

// Function to add exams onto the page. Takes a maximum of two buttons to put on the block
function populateExams(inExams, fields, buttons = null){
	$("#exam-list").innerHTML = "";
	// Iterate over the exams passed in, and put them into the #exam-list div
	var parser = new DOMParser();
	for (let exam of inExams) {
		// Get the exam time as human readable
    var date = procDATETIME(exam.exam_datetime);

		// Create a string for parsing into a DOM object
		var string = "<div class='exam-cont'><div class='exam-block main-list'><h4>Level "+exam.exam_level+" "+exam.exam_name+"</h4><p>"+date.date+" "+date.time+"</p>"+(fields.includes("room")? "<p>"+(exam.userexam_room?"In Room: "+exam.userexam_room:"Room Unknown")+"</p>":"")+(buttons?"<i class='icon-dropdown right-button'></i>":"")+"</div>"+(buttons?"<div class='exam-buttons-cont' data-exam='"+exam.exam_id+"'><button><i class='"+buttons[0].class+"'></i></button><button><i class='"+buttons[1].class+"'></i></button></div>":"")+"</div>";

		// Parse the string
		var domObj = parser.parseFromString(string, "text/html").body.firstChild;

		// Add an event listener here, if buttons were added
		if(buttons){
			// Tie event listeners to the two buttons that have been added
			domObj.querySelector(".exam-buttons-cont button:first-child").addEventListener("click", function(event){
				buttons[0].callback(event);
			})
			domObj.querySelector(".exam-buttons-cont button:last-child").addEventListener("click", function(event){
				buttons[1].callback(event);
			})

			// Add an event listener to the exam block button
			domObj.querySelector(".exam-block.main-list").addEventListener("click", function(event){
				event.stopPropagation();

				// Get the root element of this exam to work with
				var el = (event.target.classList.contains("main-list") ? event.target : getNearestElClass(event.target, "main-list"));
				el.classList.toggle("buttons-open");

				// Close all the other exam blocks
				var openItems = document.querySelectorAll(".buttons-open");
				for (let item of openItems) {
					if(!(item == el)) item.classList.remove("buttons-open");
				}
			})
		}
		$("#exam-list").appendChild(domObj);
	}

	// Loop over every button on the screen and add eventlistener. Again, for some reason I can't do this in the initial loop

}

// Function to get an exam based on id. Given the array that it is in
function getExamId(array, id, index = false){
	for (var exam in array) {
		if (array.hasOwnProperty(exam) && array[exam].exam_id == id) {
			return (index?exam:array[exam]);
		}
	}
}
