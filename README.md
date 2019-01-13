# Automated Wastewater Management and Irrigation System, Ionic App

# Screenshot

<img src="/screenshots/Splashscreen.jpg" alt="splashscreen" height="20%">

![Splashscreen](/screenshots/Splashscreen.jpg|width=50)
![Splashscreen](/screenshots/dashboard.jpeg | width=50)
![Splashscreen](/screenshots/greywater-rainwater-screen.jpeg | height=50)
![Splashscreen](/screenshots/irrigation-zoning.jpeg | height=50)
![Splashscreen](/screenshots/system-menu.jpeg | height=50)
![Splashscreen](/screenshots/system-settings.jpeg | height=50)
![Splashscreen](/screenshots/system-Andre-Van-Druten.jpg | height=50)
![Splashscreen](/screenshots/arduino-controller.jpg | height=50)


## Background: What was this project about?

This is part of a project that was a product of a company myself and a few friends started out of university. The project was an automated (Internet of Things) based Rainwater, Greywater and Irrigation Smart System. 

The system is able to smartly manage your house’s water supply by alternating between rainwater and municipal water – depending on the level of water in your tanks. It also smartly determines which water sources (Greywater, rainwater, municipal) will be used for irrigating your garden.

The system comes with a mobile app (available on iOS and android usng Ionic) that allows you to:

* Check your greywater and rainwater levels
* ‘Zone’ your garden, for irrigation
* Manage your system (backwashes, irrigation schedules etc.)

The system was also designed to be smart enough to make decisions based on the weather at your location (if it is raining, it will not irrigate). Unfortunately we never got around to fully implementing this functionality. 

Also (rather unfortunately), myself and my co-founder had a bit of a meltdown as he wanted to focus on 'non-smart' such systems, and I wanted to go ahead with this. Thus I was edged out and this smart system project left in the past. So, in short, I am open sourcing all of the code in the hope that someone may find it of interest if they are trying to do something similar - it is quite rusty as it was a version 1, but it worked well enough and we actually have 3 systems still up and running and working with the app at time of writing. 

## This Repo: Background on how the ionic app fits in 
• This repo is only one aspect of the project as a whole, it is the ionic app, which uses the MQTT protocol to communicate with various systems (depending on user) and with the Node JS backend, which is also an MQTT client 


## Other aspects to the project 
• Node backend which serves as another MQTT client to relay commands from the ionic clients to the systems themselves. The main business logic (scheduling for irrigation, backwashing etc.) is done here.
• MQTT broker, we used Amazon's CloudMQTT for this, but were in the process of writing our own broker using Mosca when myself and my co-founder had the meltdown. 
• C++ scripts that ran on Arduinos (micros I think they were). Each system was controlled by an Arduino with a connected GPRS chip, the chip allowed for the Arduino's to also be MQTT clients which could talk to the apps and backend over our local cellular networks (Vodacom).

