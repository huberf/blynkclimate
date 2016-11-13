var httpMod = require('http')
var bodyParser = require('body-parser')
var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 3000));

const r = require('request');
const url_head = 'http://blynk-cloud.com/'

// Configuration
const auth_token = 'project_auth_token';
// Put V5 to default to fahrenheit and V6 to default to Celsius
const default_temp = 'V5';


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/', (req, res) => {
  res.send({ status: 'online' });
})

app.get('/api/v1/humidity', (req, res) => {
  console.log('Humidity request received');
  r.get(`${url_head}${auth_token}/get/V7`, (err, httpResponse, body) => {
    console.log('Humidity data received');
    if (!err) {
      res.send(JSON.parse(body)[0]);
    } else {
      res.send({ status: 'offline' });
    }
  });
});

app.get('/api/v1/temperature', (req, res) => {
  console.log('Temperature request received');
  r.get(`${url_head}${auth_token}/get/${default_temp}`, (err, httpResponse, body) => {
    console.log('Temperature data received');
    if (!err) {
      res.send(JSON.parse(body)[0]);
    } else {
      res.send({ status: 'offline' });
    }
  });
});

app.get('/api/v1/temperature/:type', (req, res) => {
  console.log('Temperature request received');
  var pin = 'V5';
  if (req.params.type == 'f' || req.params.type == 'fahrenheit') {
    pin = 'V5';
  } else if(req.params.type == 'c' || req.params.type == 'celsius') {
    pin = 'V6';
  }
  r.get(`${url_head}${auth_token}/get/${pin}`, (err, httpResponse, body) => {
    console.log('Temperature data received');
    if (!err) {
      res.send(JSON.parse(body)[0]);
    } else {
      res.send({ status: 'offline' });
    }
  });
});

httpMod.createServer(app).listen(process.env.PORT || 3000)
console.log(`Weather server live at port ${process.env.PORT || 3000}`);
