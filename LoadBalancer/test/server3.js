var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');



module.exports = function(port) {

    router.post('/allocateStream', function(req,res,next){

        var token = Math.floor(Math.random() * (999 - 101) + 101);

        res.json({
            url: "http://video1.neti.systems/"+req.body.channelId+"?token="+token,
            secret: "xyz",
            servingPort: port
        });


    });
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use("/",router);

    var serverPort3 = port || 3300;

    var server = app.listen(serverPort3, function () {
        console.log('Video Server-3 listening on port ' + server.address().port);
    });
}
