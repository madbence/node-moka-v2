var testSuite=require('./test/testFramework/tester.js').testSuite;
var build=require('./build/build.js').build;
var testRunner=require('./test/run.js').testRunner;
var onTestComplete=require('./test/run.js').onComplete;
var fs=require('fs');
var bnc=require('./bnc.js').bnc;
var identServer=require('./bnc.js').identServer;
var Logger=require('./src/Logger.js').Logger;
var ConsoleLogger=require('./src/Logger/ConsoleLogger.js').handler;
var conlog=new Logger(ConsoleLogger);

var config=require('./config.json');

testSuite.prototype.stderr={'write':function(m){testFailed=true;console.log(':(')}};
testSuite.prototype.stdout={'write':function(m){}};

var filesChanged=true;

var fileChecker=function()
{
	if(!filesChanged)
	{
		return;
	}
	conlog.info('Files changed, running tests.', 'core');
	filesChanged=false;
	testFailed=false;
	testRunner(function()
	{
		if(testFailed)
		{
			conlog.error('Test failed, restart cancelled', 'core');
			return;
		}
		conlog.info('Tests passed, restarting...', 'core');
	});
	
}

fs.watch('./src', function(){filesChanged=true;});
setInterval(fileChecker, 1000);

bnc.onConnect=function()
{
	conlog.log('BNC connected', 'bnc');
	identServer.start(config.nick, config.connection.identServer.port, function()
	{
		conlog.log('IdentServer\'s got data!', 'bnc');
	}, function()
	{
		conlog.log('IdentServer closed!', 'bnc');
	});
};

bnc.onDisconnect=function()
{
	conlog.log('BNC disconnected', 'bnc');
};

bnc.dataHandler=function(data)
{
	conlog.log('Server sent: '+data.toString().replace('\r\n', ''));
}
bnc.connect(config.connection.server, config.connection.port);
