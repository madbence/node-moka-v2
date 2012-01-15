var PrivateMessage=require('./PrivateMessage.js').PrivateMessage;
var IRC=require('./IRC.js').IRC;
var Logger=require('./Logger.js').Logger;

/**
 * Creates a Moka according to the config file
 */
var Moka=function(config)
{
	var that=this;
	this.config=config;
	if(config.hasValue('logger.use'))
	{
		var loggerName=config.getValue('logger.use');
		var logHandler=require('./Logger/'+loggerName+'.js').handler;
		this.setLogger(new Logger(logHandler));
	}
	else
	{
		throw new Error('Logger not specified (logger.use)!');
	}
	if(config.hasValue('eventHandler.user'))
	{
		var eventHandlerName=config.getValue('eventHandler.use');
		var Handler=require('./'+eventHandlerName+'.js')[eventHandlerName];
		this.setEventHandler(new Handler(this.logger))
	}
	else
	{
		throw new Error('EventHandler not specified (eventHandler.use)!');
	}
	if(config.hasValue('connection.handler'))
	{
		this.setResponseHandler(config.getValue('connection.handler'));
	}
	else
	{
		throw new Error('ResponseHandler not specified (connection.handler)!');
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
	'init': function()
	{
		this.initLogger();
		this.initEventHandler();
		this.initResponseHandler();
	},
	'initLogger': function()
	{
		var config=this.config;
		if(config.hasValue('logger.use'))
		{
			var loggerName=config.getValue('logger.use');
			var logHandler=require('./Logger/'+loggerName+'.js').handler;
			this.setLogger(new Logger(logHandler));
		}
		else
		{
			throw new Error('Logger not specified (logger.use)!');
		}
	},
	'initEventHandler': function()
	{
		var config=this.config;
		if(config.hasValue('eventHandler.user'))
		{
			var eventHandlerName=config.getValue('eventHandler.use');
			var Handler=require('./'+eventHandlerName+'.js')[eventHandlerName];
			this.setEventHandler(new Handler(this.logger))
		}
		else
		{
			throw new Error('EventHandler not specified (eventHandler.use)!');
		}
	},
	'initResponseHandler': function()
	{
		var config=this.config;
		if(config.hasValue('connection.handler'))
		{
			this.setResponseHandler(config.getValue('connection.handler'));
		}
		else
		{
			throw new Error('ResponseHandler not specified (connection.handler)!');
		}
	},
	'eventDispatcher':null,
	'setEventDispatcher': function(handler)
	{
		this.eventDispatcher=handler;
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
		switch(message.getResponse())
		{
			case 'MODE':
				this.logger.log('Got MODE message ('
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