var net = require('net');
var util = require('util');

var MetricClient = function (host, port) {
    this.visorHost = host;
    this.visorPort = port;
};

MetricClient.prototype.report = function (metric) {
    var client = net.connect({host: this.visorHost, port: this.visorPort}, function () {
        if (!metric.hasOwnProperty('timestamp')) {
            metric['timestamp'] = parseInt(Date.now() / 1000);
        }

        var metricText = util.format('%s %s %s %s\r\n', metric.applicationName, metric.metricName, metric.value, metric.timestamp);
        client.destroy();
    });
};

module.exports.MetricClient = MetricClient;