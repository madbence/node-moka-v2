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
	'log': function(message, label)
	{
		if(!label)
		{
			this.history.log['default'].push(message);
		}
		else
		{
			if(!this.history.log[label])
			{
				this.history.log[label]=[];
			}
			this.history.log[label].push(message);
		}
	},
	'info': function(message, label)
	{
		if(!label)
		{
			this.history.info['default'].push(message);
		}
		else
		{
			if(!this.history.info[label])
			{
				this.history.info[label]=[];
			}
			this.history.info[label].push(message);
		}
	},
	'warn': function(message, label)
	{
		if(!label)
		{
			this.history.warn['default'].push(message);
		}
		else
		{
			if(!this.history.warn[label])
			{
				this.history.warn[label]=[];
			}
			this.history.warn[label].push(message);
		}
	},
	'error': function(message, label)
	{
		if(!label)
		{
			this.history.error['default'].push(message);
		}
		else
		{
			if(!this.history.error[label])
			{
				this.history.error[label]=[];
			}
			this.history.error[label].push(message);
		}
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
	this.equal(new Logger(testHandler).logHandler, testHandler);
	var l=new Logger();
	l.setLogHandler(testHandler);
	this.equal(l.logHandler, testHandler);
});

new testSuite('Logger.isValidLogHandler', 12, env, function()
{
	this.equal(Logger.prototype.isValidLogHandler.call(this, 'foo'), false);
	this.equal(Logger.prototype.isValidLogHandler.call(this, false), false);
	this.equal(Logger.prototype.isValidLogHandler.call(this, []), false);
	this.equal(Logger.prototype.isValidLogHandler.call(this, {}), false);
	this.equal(Logger.prototype.isValidLogHandler.call(this, null), false);
	this.equal(Logger.prototype.isValidLogHandler.call(this, 3), false);
	this.equal(Logger.prototype.isValidLogHandler.call(this, {'log':true}), false);
	this.equal(Logger.prototype.isValidLogHandler.call(this, {'log':4}), false);
	this.equal(Logger.prototype.isValidLogHandler.call(this, {'log':[]}), false);
	this.equal(Logger.prototype.isValidLogHandler.call(this, {'log':{}}), false);
	this.equal(Logger.prototype.isValidLogHandler.call(this, {'log':function(){}}), false);
	this.equal(Logger.prototype.isValidLogHandler.call(this, 
		{
			'log':function(){},
			'info':function(){},
			'warn':function(){},
			'error':function(){},
		}), true);
});

new testSuite('Logger.log', 24, env, function()
{
	var logObj={'a':1};
	
	this.logger.log('message');
	this.logger.info('message');
	this.logger.warn('message');
	this.logger.error('message');
	
	this.logger.log(logObj);
	this.logger.info(logObj);
	this.logger.warn(logObj);
	this.logger.error(logObj);
	
	this.logger.log('message', 'label');
	this.logger.info('message', 'label');
	this.logger.warn('message', 'label');
	this.logger.error('message', 'label');
	
	this.logger.log(logObj, 'label');
	this.logger.info(logObj, 'label');
	this.logger.warn(logObj, 'label');
	this.logger.error(logObj, 'label');
	
	this.equal(this.logger.logHandler.history.log.default.length, 2);
	this.equal(this.logger.logHandler.history.info.default.length, 2);
	this.equal(this.logger.logHandler.history.warn.default.length, 2);
	this.equal(this.logger.logHandler.history.error.default.length, 2);
	
	this.equal(this.logger.logHandler.history.log.default[0], 'message')
	this.equal(this.logger.logHandler.history.log.default[1], logObj);
	this.equal(this.logger.logHandler.history.info.default[0], 'message')
	this.equal(this.logger.logHandler.history.info.default[1], logObj);
	this.equal(this.logger.logHandler.history.warn.default[0], 'message')
	this.equal(this.logger.logHandler.history.warn.default[1], logObj);
	this.equal(this.logger.logHandler.history.error.default[0], 'message')
	this.equal(this.logger.logHandler.history.error.default[1], logObj);
	
	this.equal(this.logger.logHandler.history.log.label.length, 2);
	this.equal(this.logger.logHandler.history.info.label.length, 2);
	this.equal(this.logger.logHandler.history.warn.label.length, 2);
	this.equal(this.logger.logHandler.history.error.label.length, 2);
	
	this.equal(this.logger.logHandler.history.log.label[0], 'message')
	this.equal(this.logger.logHandler.history.log.label[1], logObj);
	this.equal(this.logger.logHandler.history.info.label[0], 'message')
	this.equal(this.logger.logHandler.history.info.label[1], logObj);
	this.equal(this.logger.logHandler.history.warn.label[0], 'message')
	this.equal(this.logger.logHandler.history.warn.label[1], logObj);
	this.equal(this.logger.logHandler.history.error.label[0], 'message')
	this.equal(this.logger.logHandler.history.error.label[1], logObj);
});