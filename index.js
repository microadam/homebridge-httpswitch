module.exports = init;

var request = require("request");
var Service = null;
var Characteristic = null;

function init(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('homebridge-httpswitch', 'HttpSwitch', HttpSwitch);
}

function HttpSwitch(log, config) {
  this.log = log;

  this.name = config.name;
  // url info
  this.onUrl = config.onUrl;
  this.offUrl = config.offUrl;
  this.statusUrl = config.statusUrl;
  this.statusOnResponse = config.statusOnResponse || 'true';
}

HttpSwitch.prototype = {

  httpRequest: function(url, method, callback) {
    request({
      url: url,
      method: method
    },
    function (error, response, body) {
      callback(error, response, body);
    });
  },

  setPowerState: function(powerOn, callback) {
    var url;

    if (powerOn) {
      url = this.onUrl;
      this.log("Setting power state to on");
    }
    else {
      url = this.offUrl;
      this.log("Setting power state to off");
    }

    this.httpRequest(url, 'GET', function(error, response, body) {
      if (error) {
        this.log('HTTP power function failed: %s', error.message);
        callback(error);
      }
      else {
        this.log('HTTP power function succeeded!');
        this.log(response);
        this.log(body);
        callback();
      }
    }.bind(this));
  },

  getPowerState: function(callback) {
    var url = this.statusUrl;

    this.httpRequest(url, 'GET', function(error, response, body) {
      if (error) {
        callback(error);
      }
      else {
        var powerState = 0;
        if (body === this.statusOnResponse) {
          powerState = 1;
        }
        callback(null, powerState);
      }
    }.bind(this));
  },

  identify: function(callback) {
    this.log("Identify requested!");
    callback(); // success
  },

  getServices: function() {

    // you can OPTIONALLY create an information service if you wish to override
    // the default values for things like serial number, model, etc.
    var informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Manufacturer, "HTTP Manufacturer")
      .setCharacteristic(Characteristic.Model, "HTTP Model")
      .setCharacteristic(Characteristic.SerialNumber, "HTTP Serial Number");

    var switchService = new Service.Switch(this.name);

    switchService
      .getCharacteristic(Characteristic.On)
      .on('set', this.setPowerState.bind(this));

    if (this.statusUrl) {
      switchService
      .getCharacteristic(Characteristic.On)
      .on('get', this.getPowerState.bind(this));
    }

    return [informationService, switchService];
  }
};
