var fs=require('fs');

var ModuleManager=function(config, eventHandler, logger)
{
	this.logger=logger;
	this.eventHandler=eventHandler;
	this.init(config);
	this.loadModules();
}

ModuleManager.prototype=
{
	'modules':[],
	'init': function(config)
	{
		this.config=config;
		this.enableAll=config.enableAll;
		this.whiteList=config.whiteList;
		this.blackList=config.blackList;
		this.logConfig()
	},
	'logConfig': function()
	{
		this.logger.log('Plugins are '+(this.enableAll?'ENABLED':'DISABLED')+' by default', 'ModuleManager.debug');
		if(this.blackList.length)
		{
			this.logger.log('Plugin blacklist has '+this.blackList.length+' items.', 'ModuleManager.debug');
		}
		else
		{
			this.logger.log('Plugin blacklist is empty.', 'ModuleManager.debug');
		}
		if(this.whiteList.length)
		{
			this.logger.log('Plugin whitelist has '+this.whiteList.length+' items.', 'ModuleManager.debug');
		}
		else
		{
			this.logger.log('Plugin whitelist is empty.', 'ModuleManager.debug');
		}
	},
	/**
	 * Trying to load the modules (async!)
	 */
	'loadModules': function()
	{
		this.logger.log('Loading plugin modules', 'ModuleManager.loadModules');
		//Notice the tricky way
		fs.readdir('./src/'+this.config.dir, this.loadModulesCallback.bind(this));
	},
	/**
	 * After directory parsing, this method is invoked
	 * @param error Error, if any
	 * @param {array} files List of files in the plugin directory
	 */
	'loadModulesCallback': function(error, files)
	{
		if(error)
		{
			this.logger.warn('Error: '+err.toString(), 'ModuleManager.loadModules');
			return;
		}
		this.logger.log(files.length+' files found in '+this.config.dir, 'ModuleManager.loadModules');
		for(var i=0;i<files.length;i++)
		{
			var load=enableAll;
			var plugin=files[i];
			var pluginName=plugin.substr(0, plugin.length-3);
			
			this.logger.log('Plugin \''+pluginName+'\' will '+(load?'':'NOT ')+'load.', 'ModuleManager.blackListSearch');
			if(load)
			{
				var module=require('./'+this.config.dir+'/'+plugin).module;
				this.modules.push(module);
			}
		}
	},
	'isLoadEnabledForModule': function(name)
	{
		var canLoad=this.enableAll;
		for(var j=0;j<this.blackList.length;j++)
		{
			if(this.blackList[j] == pluginName)
			{
				canLoad=false;
				this.logger.log('Plugin \''+pluginName+'\' blacklisted.', 'ModuleManager.permission');
			}
		}
		for(var j=0;j<this.whiteList.length;j++)
		{
			if(whiteList[j] == pluginName)
			{
				canLoad=true;
				this.logger.log('Plugin \''+pluginName+'\' whitelisted.', 'ModuleManager.permission');
			}
		}
	}
}

exports.manager=ModuleManager;