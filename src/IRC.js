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
	'directionStringToMode': function(mode, direction)
	{
		if(!this.isValidDirectionString(direction))
		{
			throw new Error('Direction strings length must be 1, 2 or 3, and can contain only + and -');
		}
		if(!this.isValidMode(mode))
		{
			throw new Error('Invalid mode');
		}
		var modeString='';
		for(var i=0;i<direction.length;i++)
		{
			if(!i || (i && direction.charAt(i)!=direction.charAt(i-1)))
			{
				modeString+=direction.charAt(i);
			}
			modeString+=mode;
		}
		return modeString;
	},
	'isValidDirectionString': function(string)
	{
		return string.search(/^[\+-]{1,3}$/) != -1;
	},
	'isValidMode': function(string)
	{
		return string.length==1;
	},
	'op': function(channel, user)
	{
		return this.mode(channel, '+o', user);
	},
}

exports.IRC=IRC;