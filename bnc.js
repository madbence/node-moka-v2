var server=process.argv[2]||'atw.irc.hu';
var port=process.argv[3]||6669;
var net = require('net');
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdout.setEncoding('utf8');
process.stdin.on('data', function(data)
{
	f.write(data);
});
var f=net.connect(port, server);
f.on('data', function(data)
{
	process.stdout.write(data.toString());
});