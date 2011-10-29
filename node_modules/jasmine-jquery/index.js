var fs = require('fs');
var sys = require('sys');
var path = require('path');

var filename = __dirname + '/lib/jasmine-jquery.js';
var src = fs.readFileSync(filename);
var minorVersion = process.version.match(/\d\.(\d)\.\d/)[1];
switch (minorVersion) {
  case "1":
  case "2":
    process.compile(src + '\njasmine;', filename);
    break;
  default:
    require('vm').runInThisContext(src + "\njasmine;", filename);
}
