#### Blynk Climate Station API

## Overview

The Blynk Board is a powerful device for home automation, and this project
allows you to build a powerful API for accessing the current status of the
climate around your Blynk board.

## Setup
1. git clone https://github.com/huberf/blynkclimate
2. cd blynkclimate
3. npm install && npm start
4. Modify the auth_token variable to that for your Blynk project

## Endpoints
* /api/v1/humidity - Get the current humidity value
* /api/v1/temperature - Get the current temperature in Celsius or Fahrenheit
  depending upon the default value.
* /api/v1/temperature/:type - Replace type with 'c', 'f', 'celsius', or
  'fahrenheit' depending upon the format you want.
