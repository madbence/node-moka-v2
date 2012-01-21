var PrivateMessage=require('./PrivateMessage.js').PrivateMessage;
var Message=require('./Message.js').Message;
var IRC=require('./IRC.js').IRC;
var Logger=require('./Logger.js').Logger;

/**
 * Creates a Moka according to the config file
 */
var Moka=function(config)
{
	var that=this;
	this.config=config;
	this.init();
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
		this.initModules();
	},
	'initLogger': function()
	{
		var config=this.config;
		if(config.hasValue('logger.use'))
		{
			var loggerName=config.getValue('logger.use');
			var logHandler=require('./Logger/'+loggerName+'.js').handler;
			this.setLogger(new Logger(logHandler, config.getValue('logger.'+loggerName)));
		}
		else
		{
			throw new Error('Logger not specified (logger.use)!');
		}
	},
	'initEventHandler': function()
	{
		var config=this.config;
		if(config.hasValue('eventHandler.use'))
		{
			var eventHandlerName=config.getValue('eventHandler.use');
			var Handler=require('./'+eventHandlerName+'.js')[eventHandlerName];
			this.setEventHandler(new Handler(this, this.logger))
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
	'initModules': function()
	{
		var config=this.config;
		if(config.hasValue('moduleManager.use'))
		{
			this.modules=new (require('./'+config.getValue('moduleManager.use')+'.js').manager)(config.getValue('moduleManager.'+config.getValue('moduleManager.use')), this.eventHandler, this.logger);
		}
		else
		{
			throw new Error('ModuleManager not specified (moduleManager.use)!');
		}
	},
	'eventDispatcher':null,
	'setEventHandler': function(handler)
	{
		this.eventHandler=handler;
	},
	'emit': function(label)
	{
		this.eventHandler.emit(label, Array.prototype.slice.call(arguments, 1));
	},
	'on': function(label, callback)
	{
		this.eventHandler.on(label, callback);
	},
	'setLogger': function(logger)
	{
		this.logger=logger;
	},
	'handle': function(message)
	{
		try
		{
			message=new Message(message);
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
		}
		catch(exception)
		{
			this.logger.warn(exception.toString(), 'Moka.handle');
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
				this.logger.log(message.getResponse()+': '+message.getTail(), 'Moka.low');
				this.emit('RPL_'+message.getResponse());
				break;
		}
	},
	'handleMessage': function(message)
	{
		var privmsg=new PrivateMessage(message);
		this.eventHandler.emit('message', privmsg);
		this.logger.log('Message from '+privmsg.getSender()+' to '+privmsg.getTarget()+': '+privmsg.getRawMessage(), 'Moka.msg');
	},
	'handleCommand': function(message)
	{
		this.logger.log('Incoming command: '+message.getRaw(), 'Moka.cmd');
		switch(message.getResponse())
		{
			case 'PING':
				this.logger.log('PONG to '+message.getTail(), 'pong');
				this.response('PONG :'+message.getTail());
		}
	},
	'response': function(message, label)
	{
		this.responseHandler(message, label);
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