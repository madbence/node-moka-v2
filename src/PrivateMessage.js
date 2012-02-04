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
	},
	'getRawMessage': function()
	{
		return this.rawMessage;
	},
	'process': function(moka)
	{
		var prefix=moka.config.getValue('commands.prefix');
		if(prefix && this.rawMessage.indexOf(prefix) === 0)
		{
			moka.runCommand(this.rawMessage.substr(prefix.length), this.rawMessage.split(' ').slice(1));
		}
	}
}

exports.PrivateMessage=PrivateMessage;