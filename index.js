var Scout = require('zetta-scout');
var util = require('util');
var ProtocolServer = require('spark-protocol-server');
var Spark = require('./spark_driver');
var WrappedCore = require('spark-coap-js-client').Spark;

var SparkScout = module.exports = function() {
  Scout.call(this);
  this.protocolServer = new ProtocolServer();
};
util.inherits(SparkScout, Scout);

SparkScout.prototype.init = function(next) {
  var self = this;
  this.protocolServer.on('device', function(device){
    var hexId = device.coreID;
    var coreQuery = self.server.where({type: 'sparkcore', coreId: hexId});
    self.server.find(coreQuery, function(err, results){
      var result = results[0];
      if(err) {
        self.server.log(err);
      }
      var Core = new WrappedCore(device);
      Core.describe(function(err, results) {
        if(result) {
          self.provision(result, Spark, Core, results.functions, results.variables);
        } else {
          self.discover(Spark, Core, results.functions, results.variables);
        }
      });
    });
  });

  this.protocolServer.start();
  next();
};
