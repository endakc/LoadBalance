var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');



module.exports = function(port) {

    router.post('/allocateStream', function(req,res,next){

        var token = Math.floor(Math.random() * (999 - 101) + 101);

            res.json({
                url: "http://video1.neti.systems/"+req.body.channelId+"?token="+token,
                secret: "mno",
                servingPort: port
            });



    });
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use("/",router);

    var serverPort2 = port || 3200;

    var server = app.listen(serverPort2, function () {
        console.log('Video Server-2 listening on port ' + server.address().port);
    });
}
