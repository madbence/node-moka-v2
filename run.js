var testSuite=require('./test/testFramework/tester.js').testSuite;
//var build=require('./build/build.js').build;
var testRunner=require('./test/run.js').testRunner;
//var onTestComplete=require('./test/run.js').onComplete;
var fs=require('fs');
var cp=require('child_process');
var bnc=require('./bnc.js').bnc;
var identServer=require('./bnc.js').identServer;
var CommandLineParser=require('./src/CommandLineParser.js').CommandLineParser;
var Logger=require('./src/Logger.js').Logger;
var ConsoleLogger=require('./src/Logger/ConsoleLogger.js').handler;
var conlog=new Logger(ConsoleLogger);
var moka=null;

//var Message=require('./src/Message.js').Message;

var configData=require('./config.json');
var Config=require('./src/Config.js').Config;
var config=new Config(configData);

testSuite.prototype.stderr={'write':function(m){testFailed=true;console.log(m)}};
testSuite.prototype.stdout={'write':function(m){}};

var filesChanged=true;
var firstRun=true;

var fileChecker=function()
{
	if(!filesChanged)
	{
		return;
	}
	if(firstRun)
	{
		conlog.info('Node-Moka started, running tests...', 'core');
		firstRun=false;
	}
	else
	{
		conlog.info('Files changed, running tests...', 'core');
	}
	filesChanged=false;
	testFailed=false;
	testRunner(function()
	{
		if(testFailed)
		{
			conlog.error('Test failed, restart cancelled', 'core');
			return;
		}
		conlog.info('Tests passed, (re)starting...', 'core');
		if(moka)
		{
			conlog.info('Killing bot instance...', 'core');
			moka.kill();
		}
		conlog.info('Starting Moka instance...', 'core');
		moka=cp.fork('./src/Bot.js');
		moka.on('message', function(message)
		{
			if(message['message'])
			{
				bnc.connection.write(message['message']);
			}
		});
	});
}

fs.watch('./src', function(){filesChanged=true;});
setInterval(fileChecker, 1000);

bnc.onConnect=function()
{
	conlog.log('TCP connection established with '+config.getValue('connection.server')+' on port '+config.getValue('connection.port'), 'bnc');
	conlog.log('Starting identServer on port '+config.getValue('connection.identServer.port'), 'bnc');
	identServer.start(config.getValue('connection.identServer.name'), config.getValue('connection.identServer.port'), function(data)
	{
		conlog.log('IdentServer\'s got data! ('+data+')', 'bnc');
	}, function()
	{
		conlog.log('IdentServer closed!', 'bnc');
	});
};

bnc.onDisconnect=function()
{
	conlog.log('TCP connection closed', 'bnc');
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
		if(moka)
		{
			moka.send({'message':messages[i]});
		}
	}
}
bnc.connect(config.getValue('connection.server'), config.getValue('connection.port'));

var cliParser=new CommandLineParser(
{
	'logger': conlog,
	'moka': moka,
	'connection': bnc.connection
});
process.stdin.resume();
process.stdin.on('data', function(data)
{
	var command=cliParser.parse(data.toString().replace('\r\n', ''));
	command.process();
});