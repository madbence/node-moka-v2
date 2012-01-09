var server=process.argv[1]||'atw.irc.hu';
var port=process.argv[2]||6669;
var listen=process.argv[3]||1337;

var net = require('net');

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdout.setEncoding('utf8');

process.stdin.on('data', function(data)
{
	f.write(data);
}

var f=net.connect(port, server, function(succ)
{
	console.log('BNC connected');
});
f.on('data', function(data)
{
	process.stdout.write(data.toString());
});