var MetricClient = require('./index.js').MetricClient;
var net = require('net');

var server;
var serverLog = '';
var port = 9001;

module.exports.setUp = function(callback) {
    serverLog = '';
    server = net.createServer(function(c) {
        console.log('connected');
        c.on('end', function() {
            console.log('disconnected');
        });
    });

    server.listen(port, function() {
       callback();
    });
};

module.exports.tearDown = function(callback) {
    server.close();
    callback();
};

module.exports.checkBasicMetricReporting = function(test) {

    metricClient = new MetricClient('localhost', port);
    metricClient.report({applicationName: 'testApp', metricName: 'testMetric', value: 0}, function (err) {
        if(err) {
            test.fail();
            return;
        }
        test.done();
    });
};