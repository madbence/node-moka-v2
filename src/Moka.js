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
		this.initPermissionManager();
	},
	'initDevice': function(type, name)
	{
		if(this.logger)
		{
			this.logger.log('Initialising device \''+type+'/'+name+'\'', 'Moka.init');
		}
		if(config.hasValue(type+'.use'))
		{
			var deviceName=config.getValue(type+'.use');
			var deviceClass=require('./'+type+'/'+deviceName+'.js').handler;
			this[type]=new deviceClass();
		}
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
			this.modules=new (require('./'+config.getValue('moduleManager.use')+'.js').manager)
				(config.getValue('moduleManager.'+config.getValue('moduleManager.use')), this.eventHandler, this.logger);
		}
		else
		{
			throw new Error('ModuleManager not specified (moduleManager.use)!');
		}
	},
	'initPermissionManager': function()
	{
		var config=this.config;
		if(config.hasValue('permissionManager.use'))
		{
			this.permissionManager=new (require('./'+config.getValue('permissionManager.use')+'.js').manager)
				(config.getValue('permissionManager.'+config.getValue('permissionManager.use')), this)
		}
		else
		{
			throw new Error('PermissionManager not specified (permissionManager.use)!');
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
			console.log(exception.stack);
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
		this.logger.log('Message from '+privmsg.getNick()+' to '+privmsg.getTarget()+': '+privmsg.getRawMessage(), 'Moka.msg');
		privmsg.process(this);
	},
	'handleCommand': function(message)
	{
		this.logger.log('Incoming command: '+message.getRaw(), 'Moka.cmd');
		switch(message.getResponse())
		{
			case 'PING':
				this.logger.log('PING from '+message.getTail(), 'Moka.cmd.ping');
				this.eventHandler.emit('Moka.cmd.ping', message.getTail());
		}
	},
	'response': function(message, label)
	{
		this.logger.warn('moka.response is old, use moka.respond instead');
		this.emit('response', message, label);
		this.responseHandler(message, label);
	},
	'respond': function(message, label)
	{
		this.emit('response', message, label);
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
	},
	'commands': [],
	'runCommand': function(message, name, params)
	{
		for(var i=0;i<this.modules.commands.length;i++)
		{
			if(this.modules.commands[i].name == name && this.permissionManager.hasPermission(message.getSender(), this.modules.commands[i]))
			{
				this.modules.commands[i].callback.call(this, message, this.commands[i], params);
				return;
			}
		}
		this.logger.warn('Command not found. (\''+name+'\' from '+message.getNick()+')', 'Moka.command');
	},
	'reply': function(message, reply)
	{
		var namePrefix='';
		if(message.isPrivate())
		{
			namePrefix=message.getNick()+': ';
		}
		this.respond(IRC.privmsg(message.getTarget(), namePrefix+reply));
	}
}

exports.Moka=Moka;