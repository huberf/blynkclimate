var httpMod = require('http')
var bodyParser = require('body-parser')
var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 3000));

const r = require('request');
const url_head = 'http://blynk-cloud.com/'

// Configuration
const auth_token = process.env.BLYNK_AUTH;
// Put V5 to default to fahrenheit and V6 to default to Celsius
const default_temp = 'V5';
const db_on = true;

var grabData = (token, pin) => {
  return new Promise((fulfill, reject) => {
    r.get(`${url_head}${token}/get/${pin}`, (err, httpResponse, body) => {
      console.log(`Data about pin ${pin} has been received.`);
      if (!err) {
        fulfill(JSON.parse(body)[0]);
      } else {
        console.log('An error has occured');
        console.log(err);
        fulfill(null);
      }
    });
  });
}

// Setup optional database utilities
if (db_on) {
  var mongoose = require('mongoose');
  var alertSchema = new mongoose.Schema({
    id: String,
    maxVal: Number,
    pin: String,
    alertUrl: String,
  });
  const Alert = mongoose.model('Alert', alertSchema);
  const db = mongoose.connect(process.env.WEATHER_DB_URL);
  var checkAlerts = () => {
    Alert.find({}, (err, alerts) => {
      alerts.forEach((alert, index) => {
        grabData(alert.id, alert.pin).then((response) => {
          if(response > maxVal) {
            // Ping URL to notify
            r.get(alert.alertUrl);
          }
        });
      });
    });
    setTimeout(() => checkAlerts(), 5000);
  }
  checkAlerts();
}


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/', (req, res) => {
  res.send({ status: 'online' });
})

// Personal API

app.get('/api/v1/humidity', (req, res) => {
  console.log('Humidity request received');
  grabData(auth_token, 'V7').then((data) => {
    res.send(data);
  });
});

app.get('/api/v1/temperature', (req, res) => {
  console.log('Temperature request received');
  grabData(auth_token, default_temp).then((data) => {
    res.send(data);
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
  grabData(auth_token, pin).then((data) => {
    res.send(data);
  });
});

// Public API

app.get('/api/v1/:token/humidity', (req, res) => {
  console.log('Humidity request received');
  grabData(req.params.token, 'V7').then((data) => {
    res.send(data);
  });
});

app.get('/api/v1/:token/temperature', (req, res) => {
  console.log('Temperature request received');
  grabData(req.params.token, default_temp).then((data) => {
    res.send(data);
  });
});

app.get('/api/v1/:token/temperature/:type', (req, res) => {
  console.log('Temperature request received');
  var pin = 'V5';
  if (req.params.type == 'f' || req.params.type == 'fahrenheit') {
    pin = 'V5';
  } else if(req.params.type == 'c' || req.params.type == 'celsius') {
    pin = 'V6';
  }
  grabData(req.params.token, pin).then((data) => {
    res.send(data);
  });
});

app.post('/api/v1/alert/add', (req, res) => {
  if (db_on) {
    var alertObject = {
      id: req.body.id,
      maxVal: req.body.maxVal,
      pin: req.body.pin,
      alertUrl: req.body.alertUrl,
    };
    var newAlert = new Alert(alertObject);
    newAlert.save();
    res.send({ active: true, success: true });
  } else {
    res.send({ active: false });
  }
});

httpMod.createServer(app).listen(process.env.PORT || 3000)
console.log(`Weather server live at port ${process.env.PORT || 3000}`);
