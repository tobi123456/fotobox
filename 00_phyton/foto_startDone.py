from gpiozero import LED
from gpiozero import PWMLED
from time import sleep

# fan = PWMLED(9) # old rapsbeery pi
# led = LED(11) # old raspberry

fan = PWMLED(19)
led = LED(26)
led.on()

fan.value = 0.4  # half speed
sleep(5) #5 seconds
fan.value = 0  # fan off
sleep(10800) # 3 hours


#while True:
#    fan.value = 0.4  # half speed
#    sleep(5) #5 seconds
#    fan.value = 0  # fan off
#    sleep(600) # 10 minutes


