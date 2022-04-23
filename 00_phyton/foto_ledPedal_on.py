#!/usr/bin/env python

import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)

#old raspberry pi
# GPIO.setup(10, GPIO.OUT)
# GPIO.output(10, GPIO.HIGH)

GPIO.setup(13, GPIO.OUT)
GPIO.output(13, GPIO.HIGH)