var fs=require('fs');

var ModuleManager=function(config, eventHandler, logger)
{
	this.logger=logger;
	this.eventHandler=eventHandler;
	this.config=config;
	this.loadModules();
}

ModuleManager.prototype=
{
	'modules':[],
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
		var enableAll=this.config.enableAll;
		var whiteList=this.config.whiteList;
		var blackList=this.config.blackList;
		this.logger.log('Plugins are '+(enableAll?'ENABLED':'DISABLED')+' by default', 'ModuleManager.loadModules');
		if(blackList.length)
		{
			this.logger.log('Plugin blacklist has '+blackList.length+' items.', 'ModuleManager.loadModules');
		}
		else
		{
			this.logger.log('Plugin blacklist is empty.', 'ModuleManager.loadModules');
		}
		if(whiteList.length)
		{
			this.logger.log('Plugin whitelist has '+whiteList.length+' items.', 'ModuleManager.loadModules');
		}
		else
		{
			this.logger.log('Plugin whitelist is empty.', 'ModuleManager.loadModules');
		}
		for(var i=0;i<files.length;i++)
		{
			var load=enableAll;
			var plugin=files[i];
			var pluginName=plugin.substr(0, plugin.length-3);
			for(var j=0;j<blackList.length;j++)
			{
				if(blackList[j] == pluginName)
				{
					load=false;
					this.logger.log('Plugin \''+pluginName+'\' blacklisted.', 'ModuleManager.blackListSearch');
				}
			}
			for(var j=0;j<whiteList.length;j++)
			{
				if(whiteList[j] == pluginName)
				{
					load=true;
					this.logger.log('Plugin \''+pluginName+'\' whitelisted.', 'ModuleManager.whiteListSearch');
				}
			}
			this.logger.log('Plugin \''+pluginName+'\' will '+(load?'':'NOT ')+'load.', 'ModuleManager.blackListSearch');
			if(load)
			{
				var module=require('./'+this.config.dir+'/'+plugin).module;
				this.modules.push(module);
			}
		}
	}
}

exports.manager=ModuleManager;