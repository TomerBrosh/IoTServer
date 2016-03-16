var influx = require('influx'),
express = require('express'),
bodyParser = require('body-parser')

var client = influx({

  //cluster configuration
  hosts : [
    {
      host : 'localhost',
      port : 8060, //optional. default 8086
      protocol : 'http' //optional. default 'http'
    }
  ],
  // or single-host configuration
  host : 'localhost',
  port : 8086, // optional, default 8086
  protocol : 'http', // optional, default 'http'
  username : 'root',
  password : 'root',
  database : 'IoTMetrics'
})

var app = express()

// create application/json parser
app.use(bodyParser.json())

// POST /api/users gets JSON bodies
app.post('/api/metrics', function (req, res) {
  if (!req.body) return res.status(400).end();
	  else
		  client.writePoint("Soldier", {time: new Date(),
	  "id": req.body.id, "heart_rate" : req.body.heart_rate, "vi" : req.body.vi, "activity": req.body.activity, "battery" : req.body.battery
	  }, null,  function(err, response) {
		if (err)
		 res.status(500).end();
		else {
			res.status(204).end();
		}
	  })
})

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});
