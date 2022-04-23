<?php
require('db.php');
//echo "data ist gut";
///media/usb/photoboxImages
$folder = '/home/pi/fotoBoothImages/';
//$folder = '/media/usb0/photoboxImages/';
$folderThumbs = '/home/pi/fotoBoothImagesThumbs/';
//$file = md5(time()).'.jpg';
$file = date("Y-m-d_H:i:s",time()).'.jpg';
//$file = 'fileName.jpg';
$filename = $folder.$file;
$filenameThumbs = $folderThumbs.$file;
//echo $filename;
//$shootimage = shell_exec('sudo gphoto2 --capture-image-and-download --filename='.$filename.' images');
$shootimage = shell_exec('sudo gphoto2 --capture-image-and-download --filename='.$filename);

//echo $shootimage

if(strpos($shootimage, 'New file is in location') === false) {
	echo json_encode(array('error' => truef));	
} else {
	// Scale with avconv
//disabled
//	$scaleimage = shell_exec('sudo avconv -i '.$filename.' -vf scale=500:-1 '.$filenameThumbs);
	
	// Insert into DB file
//disabled	
//	$data[] = $file;
//	file_put_contents('data.txt', implode(PHP_EOL,$data));
	
	// Echo Imagename for Result Page
	echo json_encode(array('success' => true, 'img' => $file));
}
?>