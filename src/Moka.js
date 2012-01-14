/**
 * Creates a Moka according to the config file
 */
var Moka=function(config)
{
	
}

Moka.prototype=
{
	'setLogger': function(logger)
	{
		this.logger=logger;
	},
	'handle': function(message)
	{
		if(message.isNumericResponse())
		{
			return this.handleNumericResponse(message);
		}
		switch(message.getResponse())
		{
			case 'PRIVMSG':
				return this.handleMessage(message);
			default:
				return this.handleCommand(message);
		}
	},
	'handleNumericResponse': function(message)
	{
		switch(message.getNumericResponseType())
		{
			case 'RPL_WELCOME':
				this.logger.log('Welcome on the server', 'Moka.low');
				break;
			case 'RPL_MOTDSTART':
				this.logger.log('Recieving MOTD...', 'Moka.low');
				break;
			case 'RPL_ENDOFMOTD':
				this.logger.log('End of MOTD.', 'Moka.low');
				break;
			default:
				//Do something?
				break;
		}
	},
	'handleMessage': function(message)
	{
		this.logger.log('Incoming message: '+message.getTrail(), 'Moka.msg');
	},
	'handleCommand': function(message)
	{
		this.logger.info('Incoming command: '+message.getRaw(), 'Moka.cmd');
	}
}

exports.Moka=Moka;