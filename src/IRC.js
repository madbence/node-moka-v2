var IRC=
{
	'command': function(command, params)
	{
		if(!params)
		{
			return command+'\n';
		}
		return command+' '+params+'\n';
	},
	'nick': function(newNick)
	{
		return IRC.command('NICK', newNick);
	},
	'user': function(name, options)
	{
		return IRC.command('USER', name+' 0 * :...');
	},
	'connect': function(name, options)
	{
		return this.nick(name)+this.user(name);
	},
}

exports.IRC=IRC;