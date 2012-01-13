var Logger=function(handler)
{
	if(handler)
	{
		this.setLogHandler(handler);
	}
};

Logger.prototype=
{
	'logHandler': null,
	'setLogHandler': function(handler)
	{
		if(this.isValidLogHandler(handler))
		{
			this.logHandler=handler
		}
		else
		{
			throw new Error('The provided handler is not a valid logHandler.');
		}
	},
	'isValidLogHandler': function(handler)
	{
		return handler !== null &&
			typeof handler.log === 'function' &&
			typeof handler.warn === 'function' &&
			typeof handler.info === 'function' &&
			typeof handler.error === 'function';
	},
	'log': function(message, label)
	{
		this.logHandler.log(message, label);
	},
	'info': function(message, label)
	{
		this.logHandler.info(message, label);
	},
	'warn': function(message, label)
	{
		this.logHandler.warn(message, label);
	},
	'error': function(message, label)
	{
		this.logHandler.error(message, label);
	},
	
};

exports.Logger=Logger;