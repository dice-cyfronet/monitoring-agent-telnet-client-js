var net = require('net');
var util = require('util');

var MetricClient = function (host, port) {
    this.visorHost = host;
    this.visorPort = port;
};

MetricClient.prototype.report = function (metric, cb) {

    var hasErrors = false;
    ['applicationName', 'metricName', 'value'].forEach(function (attr) {
        if (!metric.hasOwnProperty(attr)) {
            hasErrors = true;
            cb(new Error('Missing ' + attr + ' attribute in metric object'));
        }
    });

    if (hasErrors) {
        return;
    }

    var client = net.connect({host: this.visorHost, port: this.visorPort}, function () {
        if (!metric.hasOwnProperty('timestamp')) {
            metric['timestamp'] = parseInt(Date.now() / 1000);
        }

        var metricText = util.format('%s %s %s %s\r\n', metric.applicationName, metric.metricName, metric.value, metric.timestamp);
        client.write(metricText);
        client.destroy();
        cb();
    });
};

module.exports.MetricClient = MetricClient;