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
	'getNick': function()
	{
		return this.sender.substr(0, this.sender.indexOf('!'));
	},
	'getTarget': function()
	{
		return this.target;
	},
	'getRawMessage': function()
	{
		return this.rawMessage;
	},
	'isPrivate': function()
	{
		return this.getTarget().indexOf('#') !== 0;
	},
	'process': function(moka)
	{
		var prefix=moka.config.getValue('commands.prefix');
		if(prefix && this.rawMessage.indexOf(prefix) === 0)
		{
			moka.runCommand(this, this.rawMessage.split(' ')[0].substr(prefix.length), this.rawMessage.split(' ').slice(1));
		}
	}
}

exports.PrivateMessage=PrivateMessage;