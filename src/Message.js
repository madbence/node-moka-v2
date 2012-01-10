var Message=function(string)
{
	var match=string.match(/^(:([^ ]+) |)([0-9]{3}|[A-Z]+) (\S+)/);
	//console.log(match);
	if(!match)
	{
		throw new Error('\''+string+'\' is a malformed message (?)');
	}
	this.origin=match[2];
	this.response=match[3];
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
	}
}

exports.Message=Message;