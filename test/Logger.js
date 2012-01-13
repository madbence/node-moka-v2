var testSuite=require('./testFramework/tester.js').testSuite;
var Logger=require('../src/Logger.js').Logger;

var testHandler=
{
	'history':
	{
		'log':
		{
			'default': [],
		},
		'info':
		{
			'default': [],
		},
		'warn':
		{
			'default': [],
		},
		'error':
		{
			'default': [],
		}
	},
	'log': function(message)
	{
		this.history.log['default'].push(message);
	},
	'info': function(message)
	{
		this.history.info['default'].push(message);
	},
	'warn': function(message)
	{
		this.history.warn['default'].push(message);
	},
	'error': function(message)
	{
		this.history.error['default'].push(message);
	},
}

var env=
{
	'setup': function()
	{
		this.logger=new Logger(testHandler);
	},
}

new testSuite('Logger.setLogHandler', 2, null, function()
{
	this.equal(new Logger('foo').logHandler, 'foo');
	var l=new Logger();
	l.setLogHandler('foo');
	this.equal(l.logHandler, 'foo');
});

new testSuite('Logger.isValidLogHandler', 12, env, function()
{
	this.equal(this.logger.isValidLogHandler('foo'), false);
	this.equal(this.logger.isValidLogHandler(false), false);
	this.equal(this.logger.isValidLogHandler([]), false);
	this.equal(this.logger.isValidLogHandler({}), false);
	this.equal(this.logger.isValidLogHandler(null), false);
	this.equal(this.logger.isValidLogHandler(3), false);
	this.equal(this.logger.isValidLogHandler({'log':true}), false);
	this.equal(this.logger.isValidLogHandler({'log':4}), false);
	this.equal(this.logger.isValidLogHandler({'log':[]}), false);
	this.equal(this.logger.isValidLogHandler({'log':{}}), false);
	this.equal(this.logger.isValidLogHandler({'log':function(){}}), false);
	this.equal(this.logger.isValidLogHandler(
		{
			'log':function(){},
			'info':function(){},
			'warn':function(){},
			'error':function(){},
		}), true);
});