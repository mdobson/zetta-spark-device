var Device = require('zetta-device');
var util = require('util');

var SparkDevice = module.exports = function(core, functions, variables){
  Device.call(this);
  this._core = core;
  this._functions = functions;
  this._variables = veriables;
  this.coreId = core._core.coreID;
};
util.inherits(SparkDevice, Device);

SparkDevice.prototype.init = function(config) {
  var self = this;
  config
    .name('sparkcore-'+this.coreID)
    .type('sparkcore')
    .state('online')
    .when('online', { allow: this._functions });

  this._functions.forEach(function(func) {
    config.map(func, function(inputs, cb) {
      self._core.callFunction(func, inputs, function(err, results){
        if(err) {
          if(cb) {
            cb(err);
          }
        } else {
          if(cb) {
            cb();
          }
        }
      });
    }, [{type: 'text', name: 'inputs'}]);
  });
};
