var IRC=require('./IRC.js').IRC;

var CommandLineParser=function(config)
{
	this.config=config;
}

CommandLineParser.prototype=
{
	'parse': function(data)
	{
		this.config.logger.log('Parsing \''+data+'\'.', 'CommandLineParser.parse');
		if(data.indexOf('/') === 0)
		{
			this.config.logger.log('\''+data+'\' is a command.', 'CommandLineParser.parse');
			return new Command(this.config,
			{
				'irc': data.substr(1)+'\r\n',
				'moka': null,
			});
		}
		else
		{
			var match=data.match(/^(.*?) (.*)$/);
			this.config.logger.log('Sending PRIVMSG to '+match[1]+' with the message: '+match[2], 'CommandLineParser.parse');
			return new Command(this.config, 
			{
				'irc': IRC.privmsg(match[1], match[2]),
				'moka': null,
			});
		}
	}
}

var Command=function(config, data)
{
	this.data=data;
	this.config=config;
}

Command.prototype=
{
	'process': function()
	{
		if(this.data.irc)
		{
			this.config.connection.write(this.data.irc);
		}
		if(this.data.moka)
		{
			this.config.moka.send(this.data.moka);
		}
	},
};

exports.CommandLineParser=CommandLineParser;