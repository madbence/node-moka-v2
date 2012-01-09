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
	'mode': function(channel, mode, params)
	{
		return this.command('MODE', channel+(mode?(' '+mode+(params?(' '+params):'')):''));
	},
	'directionStringToArray': function(direction)
	{
		if(!this.validDirectionString(direction))
		{
			throw new Error('Direction strings length must be 1, 2 or 3, and can contain only + and -');
		}
	},
	'isValidDirectionString': function(string)
	{
		return string.search(/^[\+-]{1,3}$/) != -1;
	},
	'op': function(channel, users)
	{
		if(users.length)
		{
			return this.opUsers(channel, users);
		}
		return this.mode(channel, '+o', users);
	},
	'opUsers': function(channel, users)
	{
		
	}
}

exports.IRC=IRC;