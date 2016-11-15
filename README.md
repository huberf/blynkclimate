## Blynk Climate Station API

### Overview

The Blynk Board is a powerful device for home automation, and this project
allows you to build a powerful API for accessing the current status of the
climate around your Blynk board.

### Setup
#### Local
1. git clone https://github.com/huberf/blynkclimate
2. cd blynkclimate
3. Modify your environment variables (e.g. ~/.bash_profile for Mac users)
4. npm install && npm start
#### Heroku
1. git clone https://github.com/huberf/blynkclimate
2. cd blynkclimate
3. heroku create
4. git push heroku master
5. Go into Heroku dashboard and configure environment variables

### Endpoints
* /api/v1/humidity - Get the current humidity value
* /api/v1/temperature - Get the current temperature in Celsius or Fahrenheit
  depending upon the default value.
* /api/v1/temperature/:type - Replace type with 'c', 'f', 'celsius', or
  'fahrenheit' depending upon the format you want.
