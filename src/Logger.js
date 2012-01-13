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
	}
};

exports.Logger=Logger;