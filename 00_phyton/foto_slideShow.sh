#!/bin/bash 
FOLDER="home/pi/fotoBoothImages/";
TEMPF="/home/pi/fotoBoothImagesThumbs";
export DISPLAY=":0"

if [ -d $FOLDER ]
then
MD5C=$(ls -al $FOLDER | md5sum | awk '{ print $1 }');
else
echo "Error: Folder does not exist";
fi

case $1 in
start)
feh --quiet -Z -F -Y --slideshow-delay 12 $FOLDER &
echo $MD5C > $TEMPF
;;
stop)
pgrep -f "feh" > /dev/null && kill `pgrep -f "feh"` && rm $TEMPF
;;
restart)
$0 stop && $0 start
;;
status)
if [ $(pgrep -f "feh") ]
then
echo "Slideshow running";
exit 0;
else
echo "Slideshow not running";
exit $?
fi
;;
cron)

if [ -e $TEMPF ]
then
MD5O=$(cat $TEMPF)
if [ $(pgrep -f "feh") ]
then
# Passt            
true
else
$0 start;
fi
else
echo "Slide show not started or $TEMPF vanished"
exit 0
fi

# Changes made = restart       
if [[ $MD5O != $MD5C ]]
then
echo $MD5C > $TEMPF
$0 stop
$0 start
exit 0
fi
;;
*)
echo "Usage: $0 {start|stop|reload|cron}";
exit 2
;;

esac