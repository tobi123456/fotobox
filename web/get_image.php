<?php
$file = $_GET['name']; // don't forget to sanitize this!
$type = $_GET['type'];
//echo $file;

//header('Content-Type: application/octet-stream');
header('Content-Type: image/jpg');
header('Content-Disposition: attachment; filename="photobooth-'.$file.'.jpg"');
if (0 == strcmp($type, 'image')) {
	
	//check geb mode
	$gebMode = file_get_contents('/var/www/html/GebJenny/picNumber.txt');
	if (0 == strlen($gebMode)) {
		echo file_get_contents('/home/pi/fotoBoothImages/'.$file);
	}
	else {
		//echo file
		echo file_get_contents('/var/www/html/GebJenny/'.$gebMode.'.jpg');
		//increment counter value by one and check upper limit
		$gebModeInt = intval($gebMode);
		$gebModeIntNew = $gebModeInt + 1;
		if (4 == $gebModeIntNew) {
			$gebModeIntNew = 1;
		}
		//write value into file
		file_put_contents('/var/www/html/GebJenny/picNumber.txt', $gebModeIntNew);
	}

}
else {
	echo file_get_contents('/home/pi/fotoBoothImagesThumbs/'.$file);
}

//readfile($file);
/*
header('Content-type: image/png');
if (user_is_allowed_to_access($file)) {
    readfile($file);
}
else {
	echo "no file";
    //readfile('/somedefault/file.png');
}
*/
?>