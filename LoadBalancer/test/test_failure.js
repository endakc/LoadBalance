var request = require('supertest');
var url = require('url');
var should = require("should");

describe('load balancer round robin  ', function () {
    var server;
    server = require('./loadbalancer');

    require('./server2')(3200);
    require('./server3')(3300);


    it('1st request to allocateStream should be served by localhost:3200 as 3100 is down ', function testLoadbBalance(done) {
        request(server)
            .post('/allocateStream')
            .send({channelId:'svt1'})
            .expect(200)
            .end(function(err,res){
                res.body.servingPort.should.equal(3200);
                done();
            });
    });

    it('2nd request to allocateStream should be served by localhost:3200 as per round robin  ', function testLoadbBalance(done) {
        request(server)
            .post('/allocateStream')
            .send({channelId:'svt1'})
            .expect(200)
            .end(function(err,res){
                res.body.servingPort.should.equal(3200);
                done();
            });
    });

    it('3rd request to allocateStream should be served by localhost:3300 as per round robin  ', function testLoadbBalance(done) {
        request(server)
            .post('/allocateStream')
            .send({channelId:'svt1'})
            .expect(200)
            .end(function(err,res){
                res.body.servingPort.should.equal(3300);
                done();
            });
    });



});

