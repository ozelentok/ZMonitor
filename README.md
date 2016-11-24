#ZMonitor - Pluggable Monitoring System 
Web app for monitoring your systems<br />
The goal of this project is to allow anyone to monitor anything they need<br />
Write your custom monitor class in python - allowing you to do anything you want<br />
- Monitor a database for changes and availability
- Monitor a connection to the internet
The app is always connected to the server using web sockets and can notifiy the user using the browser notifications api
In short, if you can code it, you can monitor it!<br />

###Existing Basic Monitors
- File existence monitor
- Log file monitor - show alert when defined keywords appear in line

###Made using the following technologies
- Django and DjangoChannels
- Backbone.js and Marionette.js
- Bootstrap
- Redis (for DjangoChannels)


##Screenshots

![01](https://cloud.githubusercontent.com/assets/1478966/20607739/6cb5cb62-b283-11e6-823c-4e12460b222a.png)
