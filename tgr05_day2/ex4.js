const express = require('express')
const app = express()
const port = 80

app.get('/:sensor_id', function (req, res) {
    res.send(req.params.sensor_id);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
