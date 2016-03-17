var influx = require('influx'),
    express = require('express'),
    bodyParser = require('body-parser')

var client = influx({

    host: 'iotservices.westeurope.cloudapp.azure.com',
    port: 8086, // optional, default 8086
    protocol: 'http', // optional, default 'http'
    username: 'root',
    password: 'root',
    database: 'IoTMetrics'
})

var app = express()

// create application/json parser
app.use(bodyParser.json())

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
            /*"id": req.body.id, */
            "heart_rate": req.body.heart_rate,
            "vi": req.body.vi,
            "status": req.body.status,
            "activity": req.body.activity,
            "battery": req.body.battery,
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        }, {/*tag_*/id: req.body.id}, function (err, response) {
            if (err)
                res.status(500).end(err.message);
            else {
                res.status(204).end();
            }
        })
    }
})

app.get('/api/metrics', function (req, res) {
    var query = 'SELECT id, firstname, lastname, heart_rate, vi, activity, status, battery,Last(vi) FROM Soldier group by id;'
    client.query(query, function (err, results) {
        if (err)
            res.status(500).end(err.message);
        else {
            res.status(200).json(results);
        }

    })

});

app.listen(5000, function () {
    console.log('InfluxApp listening on port 5000!');
});
