var influx = require('influx'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors')

var client = influx({

    host: 'iotservices.westeurope.cloudapp.azure.com',
    port: 8086, // optional, default 8086
    protocol: 'http', // optional, default 'http'
    username: 'root',
    password: 'root',
    database: 'IoTMetrics'
})

var app = express();

// create application/json parser
app.use(bodyParser.json())
app.use(cors())

// POST /api/users gets JSON bodies
app.post('/api/metrics', function (req, res) {
    if (!req.body) {
        console.log(req.error);
        return res.status(400).end();
    }
    else {
        console.log(req.body);
        client.writePoint("Soldier", {
            time: new Date(),
            "heart_rate": req.body.sensor.heart_rate,
            "vi": req.body.sensor.vi,
            "status": req.body.sensor.status,
            "activity": req.body.sensor.activity,
            "battery": req.body.sensor.battery,
            "name": req.body.name,
            "hulia_number": req.body.hulia_number,
            "iron_number": req.body.iron_number

        }, {id: req.body.id}, function (err, response) {
            if (err) {
                console.log(err);
                res.status(500).end(err);
            }
            else {
                res.status(204).end();
            }
        })
    }
})

app.get('/api/metrics', function (req, res) {
    var query = 'SELECT id, name, hulia_number, iron_number, vi, activity, status, battery,Last(vi) FROM Soldier group by id;'
    client.query(query, function (err, results) {
        if (err)
            res.status(500).end(err.message);
        else {
            res.status(200).json(results[0]);
        }

    })

});

app.listen(5000, function () {
    console.log('InfluxApp listening on port 5000!');
});
