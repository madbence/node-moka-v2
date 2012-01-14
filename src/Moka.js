var PrivateMessage=require('./PrivateMessage.js').PrivateMessage;
var IRC=require('./IRC.js').IRC;

/**
 * Creates a Moka according to the config file
 */
var Moka=function(config)
{
	var that=this;
	this.config=config;
	if(config.hasValue('handlers.logger'))
	{
		this.setLogger(config.getValue('handlers.logger'));
	}
	if(config.hasValue('handlers.event'))
	{
		this.setEventDispatcher(config.getValue('handlers.event'));
	}
	if(config.hasValue('handlers.tcp'))
	{
		this.setResponseHandler(config.getValue('handlers.tcp'));
	}
	if(config.getValue('listeners.onConnect.autojoin.join'))
	{
		var autojoin=config.getValue('listeners.onConnect.autojoin.channels');
		this.on('welcome', function()
		{
			that.logger.log('Autojoining: '+autojoin.join(','), 'Moka.autojoin');
			for(var i=0;i<autojoin.length;i++)
			{
				that.response(IRC.join(autojoin[i]));
			}
		});
	}
	this.login();
}

Moka.prototype=
{
	'eventDispatcher':null,
	'setEventDispatcher': function(handler)
	{
		this.eventDispatcher=handler;
		this.eventDispatcher.logger=this.logger;
	},
	'emit': function(label)
	{
		this.eventDispatcher.emit(label, Array.prototype.slice.call(arguments, 1));
	},
	'on': function(label, callback)
	{
		this.eventDispatcher.on(label, callback);
	},
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
				this.emit('welcome');
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
		this.logger.log('Incoming message: '+message.getTail(), 'Moka.msg');
		var privmsg=new PrivateMessage(message);
	},
	'handleCommand': function(message)
	{
		this.logger.log('Incoming command: '+message.getRaw(), 'Moka.cmd');
	},
	'response': function(message, label)
	{
		this.responseHandler.send(message, label);
	},
	'setResponseHandler': function(handler)
	{
		this.responseHandler=handler;
	},
	'responseHandler': null,
	'login':function()
	{
		this.response(IRC.connect(this.getNickName(), {'realName':this.getRealName()}));
	},
	'getNickName': function()
	{
		return this.config.getValue('nick')||'node-moka';
	},
	'getRealName': function()
	{
		return this.config.getValue('realName')||'node-moka';
	}
}

exports.Moka=Moka;