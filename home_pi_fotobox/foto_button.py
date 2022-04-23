from gpiozero import Button
from signal import pause
import RPi.GPIO as GPIO
import os

#set led in pedal
GPIO.setmode(GPIO.BCM)
# old routine
GPIO.setup(10, GPIO.OUT)
GPIO.output(10, GPIO.HIGH)

#new rapsberry pi 
#GPIO.setup(13, GPIO.OUT)
#GPIO.output(13, GPIO.HIGH)

def say_hello():
    print("press button")
    file = open("/var/www/html/buttonFile.txt","w")  
    file.write("true") 
    file.close() 
#def say_goodbye():
#    print("Goodbye!")

button = Button(24) #old raspberry pi
# button = Button(12) # new raspberry pi 

button.when_pressed = say_hello
#button.when_released = say_goodbye

pause()