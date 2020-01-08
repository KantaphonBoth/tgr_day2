var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://202.139.192.75', {clientId:"tgr05"})

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/tgr2020"

client.on('connect', function() {
    console.log("MQTT connection")
    client.subscribe('tgr2020/pm25/data/#')
})

client.on('message', function(topic, message) {
    // console.log("data" + topic.toString() + "=>" + message.toString())

    MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("tgr");
        var doc = JSON.parse(message);

        let timeStamp = doc.DevEUI_uplink.Time
        let payload = doc.DevEUI_uplink.payload_hex
        let LAT = doc.DevEUI_uplink.LrrLAT
        let LON = doc.DevEUI_uplink.LrrLON
        var mon_data = {DevEUI_uplink: {
            Time : timeStamp,
            data : payload,
            Latitude : LAT,
            Longitude : LON
        }}
        console.log(mon_data)
        dbo.collection("Dev_data").insertOne(mon_data, function(err, res) {
            if (err) throw err;
        console.log("1 document inserted");
        db.close();


        });
    })
})