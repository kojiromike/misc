#!/usr/bin/env node

/**
 * The idea is to generate js code for testing over a large n.
 */
var i;
var size = 10e5;
var fs = require('fs');
var fname = 'tmp';
var fd = fs.openSync(fname, 'w');

function makeIf(fs, fd) {
	fs.writeSync(fd,'function(){if("item0');
	for (i=0;i<size;i++) fs.writeSync(fd,'"==test.type||"item'+i);
	fs.writeSync(fd, '"==test.type){return test.type}return "fail"}');
}
function makeSwitch(fs, fd) {
	fs.writeSync(fd,'function(){switch(test.type){');
	for (i=0;i<size;i++) fs.writeSync(fd, 'case "item' + i + '":');
	fs.writeSync(fd, 'return test.type;}return "fail"}');
}
function makeNotIndexOf() {
	var s='function(){';
	s+='if(~list.indexOf(test.type)){return test.type}';
	s+='return "fail"}';
	return s;
}
function makePropIn() {
	return 'function(){if(test.type in prop){return test.type}return "fail"}';
}
function makePropOf() {
	return 'function(){if(prop[test.type]){return test.type}return "fail"}';
}
function makeRegex() {
	return 'function(){if(re.test(test.type)){return test.type}return "fail"}';
}
fs.writeSync(fd, '#!/usr/bin/env node\n');
fs.writeSync(fd, 'var list=["item0"');for(i=1;i<size;i++)fs.writeSync(fd, ',"item'+i+'"');fs.writeSync(fd,'];');
fs.writeSync(fd, 'var prop={"item0":1');for(i=1;i<size;i++)fs.writeSync(fd, ',"item'+i+'":1');fs.writeSync(fd,'};');
fs.writeSync(fd, 'var re = /^item\d+$/;');
fs.writeSync(fd, 'var test = {"type": "item" + (('+size+' * Math.random()) >> 0)};');
fs.writeSync(fd, 'var ifFn=');makeIf(fs,fd);fs.writeSync(fd,';');
fs.writeSync(fd, 'var switchFn=');makeSwitch(fs,fd);fs.writeSync(fd,';');
fs.writeSync(fd, 'var notIdxFn=' + makeNotIndexOf() + ';');
fs.writeSync(fd, 'var propInFn=' + makePropIn() + ';');
fs.writeSync(fd, 'var propOfFn=' + makePropOf() + ';');
fs.writeSync(fd, 'var regexFn=' + makeRegex() + ';');
fs.writeSync(fd, 'var microtime=require("microtime");var start;');
//fs.writeSync(fd, 'start=microtime.now();ifFn();console.log("ifTime:",microtime.now()-start);');
fs.writeSync(fd, 'start=microtime.now();switchFn();console.log("switchTime:",microtime.now()-start);');
fs.writeSync(fd, 'start=microtime.now();notIdxFn();console.log("notIdxTime:",microtime.now()-start);');
fs.writeSync(fd, 'start=microtime.now();propInFn();console.log("propInTime:",microtime.now()-start);');
fs.writeSync(fd, 'start=microtime.now();propOfFn();console.log("propOfTime:",microtime.now()-start);');
fs.writeSync(fd, 'start=microtime.now();regexFn();console.log("regexTime:",microtime.now()-start);');
fs.closeSync(fd);
