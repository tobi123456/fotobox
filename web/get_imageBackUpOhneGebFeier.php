<?php
$file = $_GET['name']; // don't forget to sanitize this!
$type = $_GET['type'];
//echo $file;

//header('Content-Type: application/octet-stream');
header('Content-Type: image/jpg');
header('Content-Disposition: attachment; filename="photobooth-'.$file.'.jpg"');
if (0 == strcmp($type, 'image')) {
	echo file_get_contents('/home/pi/fotoBoothImages/'.$file);
	//echo file_get_contents('/media/usb0/photoboxImages/'.$file);
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