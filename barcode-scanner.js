
var Emitter = require('extended-emitter');
var arrays = require('async-arrays');

var drivers = {};
var listers = {};

switch(process.platform){
    case 'darwin':
        if(!drivers.HID) drivers.HID = require('node-hid');
        if(!listers.HID) listers.HID = function(cb){
            //console.log('***', drivers.HID.devices())
            var devices = drivers.HID.devices().filter(function(device){
                    var isApple = device.product &&
                        (device.product.indexOf('Apple ') !== -1);
                    var isMikeyDriver = device.product === 'Apple Mikey HID Driver';
                return !(isMikeyDriver || isApple || device.product === 'Keyboard Backlight');
            });
            if(cb) cb(devices);
        };
        if(!drivers.serial) drivers.serial = {SerialPort:require('serialport')};
        if(!listers.serial) listers.serial = function(cb){
            drivers.serial.SerialPort.list().then(function(ports){
                //*
                ports = ports.filter(function(device){
                    var result = device.path === '/dev/cu.Bluetooth-Incoming-Port';
                    return result;
                }); // */
                cb(ports);
            }).catch(function(err){

            });
        }
        var SerialPort = drivers.serial.SerialPort;
        break;
    case 'linux':
        if(!drivers.HID) drivers.HID = require('node-hid');
        if(!listers.HID) listers.HID = function(cb){
            var devices = drivers.HID.devices();
            if(cb) cb(devices);
        };
        if(!drivers.serial) drivers.serial = {SerialPort:require('serialport')};
        if(!listers.serial) listers.serial = function(cb){
            drivers.serial.SerialPort.list().then(function(ports){
                /*
                ports = ports.filter(function(device){
                    var result = device.path !== '/dev/cu.Bluetooth-Incoming-Port';
                    return result;
                }); // */
                cb(ports);
            }).catch(function(err){

            });
        }
        var SerialPort = drivers.serial.SerialPort;
        break;
    default : throw new Error('Unsupported platform: '+process.platform);
}

module.exports.listen = function(device, handler){
    if(!!device.serial){
        var serialDevice = new drivers.serial.SerialPort(device.serial);
        serialDevice.on('data', function(data){
            handler(data.toString().trim());
        });
        return;
    }else{
        if(device.vendor && device.product){
            var HIDDevice = new drivers.HID.HID(device.vendor, device.product);
            HIDDevice.on('data', function(data){
                handler(data.toString());
            });
        }else{
            var HIDDevice = new drivers.HID.HID(device.hid || device.path);
            HIDDevice.on('data', function(data){
                handler(data.toString());
            });
        }
    }
}

module.exports.devices = function(type, callback){
    if(typeof type == 'function' && !callback){
        callback = type;
        var results = {};
        arrays.forEachEmission(Object.keys(drivers), function(key, index, done){
            listers[key](function(list){
                results[key] = list;
                done();
            });
        }, function(){
            callback(results);
        })
    }else{
        listers[type](function(list){
            callback(list);
        });
    }
};
