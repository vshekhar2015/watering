var express = require('express')
var app = express()
var gpio = require('rpi-gpio');
gpio.setup(7, gpio.DIR_OUT);

app.get('/', function(req, res) {
  res.send('Hello from Watering')
});

app.get('/on', function(req, res) {
  gpio.read(7, function(err, value) {
    if(value) {
      res.send('Water already on');
    } else {
      gpio.write(7, true, function(err) {
        if (err) throw err;

        res.send('Starting Water');
        console.log('Written to pin');

        setTimeout(function() {
          gpio.write(7, false, function(err) {
            console.log('Turning water off');
          });
        }, 15*60*1000);

      });
    }
  });
})

app.get('/off', function(req, res) {
    gpio.write(7, false, function(err) {
      if (err) throw err;

      res.send('Stopping Water')
      console.log('Written to pin');

    });
})

app.get('/check', function(req, res) {
    gpio.read(7, function(err, value) {
      console.log('The value is ' + value);
      res.send(value);
    });
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
})
