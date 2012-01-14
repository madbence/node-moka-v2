var Message=function(string)
{
	var match=string.match(/^(:([^ ]+) |)([0-9]{3}|[A-Z]+) ([^:]*):(.*?)$/);
	if(!match)
	{
		throw new Error('\''+string.substr(0, 20)+'\' is a malformed message (?)');
	}
	this.origin=match[2];
	this.response=match[3];
	this.trail=match[5];
	this.raw=string;
}

Message.prototype=
{	
	'getOrigin': function()
	{
		return this.origin;
	},
	'getResponse': function()
	{
		return this.response;
	},
	'isNumericResponse': function()
	{
		return this.getResponse().search(/^\d{3}$/) != -1;
	},
	'getNumericResponse': function()
	{
		if(!this.isNumericResponse())
		{
			throw new Error('Response is not a numeric response');
		}
		return this.parseNumericResponse(this.getResponse());
	},
	'parseNumericResponse': function(string)
	{
		return parseInt(string.replace(/^0*/, ''));
	},
	'getTrail': function()
	{
		return this.trail;
	},
	'getRaw': function()
	{
		return this.raw;
	},
	'getNumericResponseType': function()
	{
		return MessageCodes[this.getNumericResponse()]?MessageCodes[this.getNumericResponse()]:0;
	},
}

var MessageCodes=
{
	1: 'RPL_WELCOME',
	375: 'RPL_MOTDSTART',
	376: 'RPL_ENDOFMOTD',
	372: 'RPL_MOTD',
}
	
	

exports.Message=Message;