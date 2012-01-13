var Logger=function(handler)
{
	this.logHandler=handler;
};

Logger.prototype=
{
	'logHandler': null,
	'setLogHandler': function(handler)
	{
		this.logHandler=handler
	},
	'isValidLogHandler': function(handler)
	{
		return handler !== null &&
			typeof handler.log === 'function' &&
			typeof handler.warn === 'function' &&
			typeof handler.info === 'function' &&
			typeof handler.error === 'function';
	},
};

exports.Logger=Logger;