var httpMod = require('http')
var bodyParser = require('body-parser')
var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 3000));

const r = require('request');
const url_head = 'http://blynk-cloud.com/'

// Configuration
const auth_token = 'project_auth_token';


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/', (req, res) => {
  res.send({ status: 'online' });
})

app.get('/api/v1/humidity', (req, res) => {
  r.get(`${url_head}${auth_token}/get/V7`, (err, httpResponse, body) => {
    r.send(body);
  });
});

app.get('/api/v1/temperature', (req, res) => {
  r.get(`${url_head}${auth_token}/get/V5`, (err, httpResponse, body) => {
    r.send(body);
  });
});

app.get('/api/v1/temperature/:type', (req, res) => {
  var pin = 'V5';
  if (req.params.type == 'f' || req.params.type == 'fahrenheit') {
    pin = 'V5';
  } else if(req.params.type == 'c' || req.params.type == 'celsius') {
    pin = 'V6';
  }
  r.get(`${url_head}${auth_token}/get/${pin}`, (err, httpResponse, body) => {
    r.send(body);
  });
});

httpMod.createServer(app).listen(process.env.PORT || 3000)
