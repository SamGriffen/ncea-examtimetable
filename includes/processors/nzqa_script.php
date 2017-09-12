<?php
function getExams($level){
  $url = sprintf("http://timetable.nzqa.govt.nz/mobile-timetable/timetable-%s.html", $level);

  $dom = new DOMDocument();

  $html = file_get_contents($url);

  $doc = $dom->loadHTML($html);

  // Get the first table on the page
  $table = $dom->getElementsByTagName("table")[0];

  // Get all the tr elements out of the table
  $trs = $table->getElementsByTagName("tr");

  // Create a variable to store the current exam data. This data must be stored in a spcific way:
  /*
  Array (
  	[date] => Y-m-d (This is what SQL expects)
  	[time] => H:i:s
  	[subject] => 'Physics'
  )
  */
  $exam = [];

  // Create an array for storing the exam data in
  $exams = [];

  // Iterate over the tr elements
  foreach ($trs as $tr) {
  	// If this tr is a heading, ignore it
  	if(!($tr->getElementsByTagName("th")->length)){
  		// Get all of the td elements inside the tr
  		$tds = $tr->getElementsByTagName("td");
  		foreach ($tds as $td) {
  			// Check if the td has the rowspan attribute. This makes it a date. Process the data and get the date from it. $data ends up in format [day, month]
  			if($td->getAttribute("rowspan")){
  				$data = [];
  				preg_match("/[0-9]{1,2}.*/" ,$td->textContent, $data);
  				$data = explode(" ", $data[0]);
  				$data[1] = getMonthNo($data[1]);

  				// Save the exam date. This will remain constant until next date is found
  				$exam["date"] = sprintf("%d-%d-%d", date("Y"), $data[1], $data[0]);
  			}
  			else if(preg_match("/[0-9]{1,2}\.[0-9]{1,2} .{1}[m]/" ,$td->textContent)){
  				$time = str_replace(" ", "", $td->textContent);
  				date_default_timezone_set("UTC");
  				$time = date('H:i:s', strtotime($time));
  				$exam["time"] = $time;
  			}
  			else{
          $names = explode("/", $td->textContent);
          foreach ($names as $name) {
            $exam["name"] = trim($name);
            $exams[] = $exam;
          }
  			}
  		}
  	}
  }
  return $exams;
}

function getMonthNo($month_code){
	$months = ["November"=> 11, "December"=>12];
	foreach ($months as $month_name => $month_num) {
		if(strpos($month_name, $month_code) !== false){
			return $month_num;
		}
	}
}
