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
var Moka=require('./src/Moka.js').Moka;
var EventDispatcher=require('./src/EventDispatcher.js').EventDispatcher;
var moka=null;

var Message=require('./src/Message.js').Message;

var config=require('./config.json');
var Config=require('./src/Config.js').Config;
var configObject=new Config(config);
configObject.setValue('handlers.logger', conlog);
configObject.setValue('handlers.event', new EventDispatcher());
configObject.setValue('handlers.tcp', {'send':function(m){bnc.connection.write(m)}});
ConsoleLogger.setConfig(config.logger.consoleLogger);

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
	moka=new Moka(configObject);
}

fs.watch('./src', function(){filesChanged=true;});
setInterval(fileChecker, 1000);

bnc.onConnect=function()
{
	conlog.log('BNC connected', 'bnc');
	conlog.log('Starting identServer on port '+config.connection.identServer.port, 'bnc');
	identServer.start(config.connection.identServer.name, config.connection.identServer.port, function(data)
	{
		conlog.log('IdentServer\'s got data! ('+data+')', 'bnc');
	}, function()
	{
		conlog.log('IdentServer closed!', 'bnc');
	});
};

bnc.onDisconnect=function()
{
	conlog.log('BNC disconnected', 'bnc');
	fd.end();
};
var fd=fs.createWriteStream('./debug.txt', {'encoding':'utf8','flags':'a','mode':0666})

bnc.dataHandler=function(data)
{
	data=data.toString();
	fd.write(data);
	var messages=data.split('\r\n');
	for(var i=0;i<messages.length-1;i++)
	{
		try
		{
			var message=new Message(messages[i]);
			//conlog.log('Response: '+message.getResponse()+', trail: '+message.getTrail(), 'IRC');
			if(moka)
				moka.handle(message);
		}
		catch(e)
		{
			conlog.warn(e.toString(), 'IRC');
		}
	}
}
bnc.connect(config.connection.server, config.connection.port);

process.stdin.resume();
process.stdin.on('data', function(data)
{
	bnc.connection.write(data);
});