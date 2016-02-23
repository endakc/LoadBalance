var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var request = require('request');
var url = require('url');
var videoPort =3000;
var videoUrl = 'http://localhost';
var roundRobinCounter = 0;

router.post('/allocateStream', function(req,res,next){

    console.log(req.body);

    var nextOption = getVideoUrl("/allocateStream");

    callNextVideo(req,res, nextOption,0);



});

router.get('/', function (req, res) {
    res.status(200).send('ok');
});

var callNextVideo = function(req, res, nextOption, attempt){
    console.log('calling '+nextOption.url );
    var timedOut = false;
    var t = setTimeout(function(){
        console.log(nextOption.url + " timed out");
        timedOut=true;
        clearTimeout(t);
        if(attempt ==videoPort.length-1){
            res.status(err.status || 500);
            return res.json({message:'All servers are down'});

        }
        nextOption = getNextVideoUrl("/allocateStream",nextOption.usedIndex);
        return callNextVideo(req,res, nextOption,++attempt);

    },1000);

    request.post({url:nextOption.url, form: req.body}, function(err,httpResponse,body){
        clearTimeout(t);

        if(err){

            if(attempt ==videoPort.length-1){
                res.status(err.status || 500);
                return res.json({message:'All servers are down'});

            }
            nextOption = getNextVideoUrl("/allocateStream",nextOption.usedIndex);
            return callNextVideo(req,res, nextOption,++attempt);
        }

        if(!timedOut){
            var resObj = JSON.parse(body);
            return res.json({url: resObj.url,servingPort: resObj.servingPort});
        }


    });
}


var getVideoUrl = function(api){
    var url =  videoUrl+':'+videoPort[roundRobinCounter]+api;
    var returnObj = {
        url:url,
        usedIndex: roundRobinCounter
    }
    roundRobinCounter = ++roundRobinCounter% videoPort.length;
    return returnObj;

}

var getNextVideoUrl = function(api, index){
    index = ++index%videoPort.length;

    var url =  videoUrl+':'+videoPort[index]+api;
    var returnObj = {
        url:url,
        usedIndex: index
    }

    return returnObj;

}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/",router);

var loadBalancerPort = process.env.PORT_LOADBALANCER || 3000;

var server = app.listen(loadBalancerPort, function() {
    console.log('Load Balancer Express server listening on port ' + server.address().port);
});



module.exports = server;