<?php
$action = $_GET['action']; // don't forget to sanitize this!
$command = $_GET['command']; // don't forget to sanitize this!

if (0 == strcmp($command, 'get')) {
	header('Content-Type: text/plain');
	header('Content-Disposition: attachment; filename="pedalStatus.txt"');
//if (0 == strcmp($type, 'image')) {
	echo file_get_contents('/var/www/html/GebJenny/picNumber.txt');
}
else {
	if (0 == strcmp($action, 'run')) {
		file_put_contents('/var/www/html/GebJenny/picNumber.txt', '1');
		echo "run";
	}
	else {
		file_put_contents('/var/www/html/GebJenny/picNumber.txt', '');
		echo "stopp";
	}
}

?>