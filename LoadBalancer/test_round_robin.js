var request = require('supertest');
var url = require('url');
var should = require("should");

describe('load balancer round robin  ', function () {
    var server;
    server = require('./loadbalancer');
    require('./server1')(3100);
    require('./server2')(3200);
    require('./server3')(3300);

    it('responds to /', function testSlash(done) {
        request(server)
            .get('/')
            .expect(200, done);
    });
    it('1st request to allocateStream should be served by localhost:3100  ', function testLoadbBalance(done) {
        request(server)
            .post('/allocateStream')
            .send({channelId:'svt1'})
            .expect(200)
            .end(function(err,res){
                res.body.servingPort.should.equal(3100);
                done();
            });
    });
    it('2nd request to allocateStream should be served by localhost:3200  ', function testLoadbBalance(done) {
        request(server)
            .post('/allocateStream')
            .send({channelId:'svt1'})
            .expect(200)
            .end(function(err,res){
                res.body.servingPort.should.equal(3200);
                done();
            });
    });
    it('3rd request to allocateStream should be served by localhost:3300  ', function testLoadbBalance(done) {
        request(server)
            .post('/allocateStream')
            .send({channelId:'svt1'})
            .expect(200)
            .end(function(err,res){
                res.body.servingPort.should.equal(3300);
                done();
            });
    });
    it('4th request to allocateStream should be served by localhost:3100  ', function testLoadbBalance(done) {
        request(server)
            .post('/allocateStream')
            .send({channelId:'svt1'})
            .expect(200)
            .end(function(err,res){
                res.body.servingPort.should.equal(3100);
                done();
            });
    });


});

