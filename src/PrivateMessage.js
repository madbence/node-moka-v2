var PrivateMessage=function(message)
{
	this.sender=message.getOrigin();
	this.rawMessage=message.getTail();
	this.target=message.getParameters()[0];
}

PrivateMessage.prototype=
{
	'isCommand': function(regexp)
	{
		return this.rawMessage.search(regexp) !== -1;
	},
	'getSender': function()
	{
		return this.sender;
	},
	'getTarget': function()
	{
		return this.target;
	}
}

exports.PrivateMessage=PrivateMessage;