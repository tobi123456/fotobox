<?php




//header('Content-Type: application/octet-stream');
header('Content-Type: text/plain');
header('Content-Disposition: attachment; filename="pedalStatus.txt"');
//if (0 == strcmp($type, 'image')) {
	echo file_get_contents('/var/www/html/buttonFile.txt');
//}
//else {
//	echo file_get_contents('/home/pi/fotoBoothImagesThumbs/'.$file);
//}

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