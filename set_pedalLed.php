<?php
$action = $_GET['action']; // don't forget to sanitize this!


if (0 == strcmp($action, 'on')) {
	shell_exec('sudo python /home/pi/foto_ledPedal_on.py');
	echo 'ok=on';
}
else {
	shell_exec('sudo python /home/pi/foto_ledPedal_off.py');
	echo 'ok=off';
}

?>