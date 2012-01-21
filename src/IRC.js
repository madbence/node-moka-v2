var IRC=
{
	/**
	 * Produces the given IRC command with the given parameters
	 * @param {string} command Name of the command
	 * @param {string} params Optional parameters
	 * @return {string} Syntactically valid IRC command
	 */
	'command': function(command, params)
	{
		if(!params)
		{
			return command+'\n';
		}
		return command+' '+params+'\n';
	},
	/**
	 * Produces a nick change command
	 * @param {string} newNick New nickname
	 * @return {string} NICK command
	 */
	'nick': function(newNick)
	{
		return IRC.command('NICK', newNick);
	},
	/**
	 * Produces a user command
	 * @param {string} name Username
	 * @return {string} USER command
	 */
	'user': function(name, options)
	{
		options=options||{};
		var mode=options['mode']||8;
		var realName=options['realName']||'...';
		return IRC.command('USER', name+' '+mode+' * :'+realName);
	},
	/**
	 * Produces a typical connection message
	 * @param {string} name Nickname
	 * @param options Optional paramters
	 * @return {string} A NICK and a USER command
	 */
	'connect': function(name, options)
	{
		return this.nick(name)+this.user(name, options);
	},
	/**
	 * Produces a MODE command, according to the parameters
	 * @param {string} channel Affected channel
	 * @param {string} mode Mode to set (see RFC1459)
	 * @param {string} params Parameters (targets)
	 * @return {string} A MODE command
	 */
	'mode': function(channel, mode, params)
	{
		return this.command('MODE', channel+(mode?(' '+mode+(params?(' '+params):'')):''));
	},
	/**
	 *
	 */
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
	/**
	 * 
	 */
	'isValidDirectionString': function(string)
	{
		return string.search(/^[\+-]{1,3}$/) != -1;
	},
	/**
	 *
	 */
	'isValidMode': function(string)
	{
		return string.length==1;
	},
	/**
	 * Produces an IRC command that gives the given user channel operator privileges
	 * @param {string} channel Affected users channel
	 * @param {string} user Affected user
	 * @return {string} A MODE message
	 */
	'op': function(channel, user)
	{
		return this.mode(channel, '+o', user);
	},
	/**
	 * Convert it's parameter to (comma separated) string
	 * @param a String or Array instance
	 * @return {string} Comma separated string
	 */
	'paramToString': function(a)
	{
		if(a instanceof Array)
		{
			return a.join(',');
		}
		return a;
	},
	/**
	 * Produces a JOIN message to the given channel(s) with the given key(s)
	 * @param channels Channel(s) to join
	 * @param keys Passwords to join on the channel(s)
	 * @return {string} JOIN message
	 */
	'join': function(channels, keys)
	{
		channels=this.paramToString(channels);
		keys=this.paramToString(keys);
		return this.command('JOIN', channels+(keys?' '+keys:''));
	},
	/**
	 * Produces a PART message to the given channel(s) with the given message (if specified)
	 * @param channels Channel(s) to leave
	 * @param {string} message Cause of PART (optional)
	 * @return {string} PART message
	 */
	'leave': function(channels, message)
	{
		channels=this.paramToString(channels);
		return this.command('PART', channels+(message?' :'+message:''));
	},
	/**
	 * Produces a QUIT message with the given message (if specified)
	 * @param {string} message Optional message
	 * @return {string} QUIT message
	 */
	'quit': function(message)
	{
		return this.command('QUIT', message?':'+message:null);
	},
	/**
	 * Produces a TOPIC message with the given topic (if specified)
	 *
	 * If newTopic is not set, the serves should return the current topic
	 * @param {string} channel Target channel
	 * @param {string} newTopic New topic for the channel (optional)
	 */
	'topic': function(channel, newTopic)
	{
		return this.command('TOPIC', channel+(newTopic?' :'+newTopic:''));
	},
	/**
	 * Produces a PRIVMSG message
	 * @param {string} channel Channel or user
	 * @param {string} message Message
	 */
	'privmsg': function(channel, message)
	{
		return this.command('PRIVMSG', channel+' :'+message);
	},
	/**
	 * Produces a PONG message
	 * @param {string} target Address of the targer
	 * @return {string} PONG message
	 */
	'pong': function(target)
	{
		return this.command('PONG', ':'+target);
	},
}

exports.IRC=IRC;