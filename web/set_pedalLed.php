<?php
$action = $_GET['action']; // don't forget to sanitize this!

echo $action;

if (0 == strcmp($action, 'on')) {
	echo shell_exec('sudo python /home/pi/fotobox/foto_ledPedal_on.py');
	echo 'ok=on';
}
else {
	echo shell_exec('sudo python /home/pi/fotobox/foto_ledPedal_off.py');
	echo 'ok=off';
}

?>