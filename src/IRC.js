var IRC=
{
	'IO': null,
	'setIO': function(writer)
	{
		this.IO=writer;
	},
	'command': function(command, params)
	{
		IO.write(command+' '+params+'\n');
	},
	'nick': function(newNick)
	{
		IRC.command('NICK', newNick);
	},
	'user': function(name, options)
	{
		IRC.command('USER', name+' 0 * :...');
	},
	'connect': function(name, options)
	{
		this.nick(name);
		this.user(name);
	},
}

exports.IRC=IRC;