var express = require('express')
var app = express()
var gpio = require('rpi-gpio');

var pin = 7;
var runInMinutes = 15;
var html = 
  `<html>
    <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body>
      <h1>Welcome to Garden Watering System</h1>
      <h2><a href=/on>On</a></h2>
      <h2><a href=/off>Off</a></h2>
      <h3><a href=/check>Check</a></h3>
    </body>
  </html>`;

gpio.setup(pin, gpio.DIR_OUT);

app.get('/', function(req, res) {
  res.send(html)
});

app.get('/on', function(req, res) {
  gpio.read(pin, function(err, value) {
    if(value) {
      res.send(html+'Water already on');
    } else {
      gpio.write(pin, true, function(err) {
        if (err) throw err;

        res.send('Starting Water');
        console.log('Written to pin');

        setTimeout(function() {
          gpio.write(pin, false, function(err) {
            console.log('Turning water off');
          });
        }, runInMinutes*60*1000);
      });
    }
  });
})

app.get('/off', function(req, res) {
    gpio.write(pin, false, function(err) {
      if (err) throw err;
      res.send(html+'Stopping Water')
      console.log('Written to pin');
    });
})

app.get('/check', function(req, res) {
    gpio.read(pin, function(err, value) {
      console.log('The value is ' + value);
      var message = value ? "On" : "Off";
      res.send(html + "Water is " + message);
    });
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
})
