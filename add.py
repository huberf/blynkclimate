import requests as r

r.post('https://blynkweather.herokuapp.com/api/v1/alert/add', {'id': '4e73699dc4b643ddb9663295075d3534', 'threshold': 50, 'max': 1, 'pin': 'V5', 'alertUrl': 'https://noahcodes.com'})
