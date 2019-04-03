/* eslint "prefer-template": "off" */

var fs = require('fs');
var path = require('path');
var os = require('os');

var platform = os.platform();
var arch = os.arch();

function start() {
    var fn = platform === 'win32' ? getWin : getOther;
    fn();
}

function getOther() {
    throw new Error('OS / PLATFORM not yet supported! ' + platform + '_' + arch);
}

function getWin() {
    fs.copyFileSync(path.join(__dirname, 'tmp', 'headers', 'ChakraCore.dll'), path.join(__dirname, 'build', 'Release', 'ChakraCore.dll'));
    console.log('ChakraCore installed!');
}

start();
