var fs=require('fs');
var _=require('../lib/array.js');

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
		this.loadModulesFromArray(files);
	},
	'loadModulesFromArray': function(files)
	{
		for(var i=0;i<files.length;i++)
		{
			var plugin=files[i];
			var pluginName=plugin.substr(0, plugin.length-3);
			if(this.isLoadEnabledForModule(pluginName))
			{
				this.logger.log('Plugin \''+pluginName+'\' will load.', 'ModuleManager.load');
				var module=require('./'+this.config.dir+'/'+plugin).module;
				this.modules.push(module);
				if(module.listeners)
				{
					var that=this;
					_.forEach(module.listeners,function(listeners, index)
					{
						that.logger.log('Plugin \''+pluginName+'\' has '+listeners.length+' listeners for the event \''+index+'\'', 'ModuleManager.registerEventListeners');
						_.forEach(listeners,function(listener)
						{
							that.eventHandler.on(index, listener);
						});
					});
				}
			}
			else
			{
				this.logger.log('Plugin \''+pluginName+'\' will NOT load.', 'ModuleManager.load');
			}
		}
	},
	'isLoadEnabledForModule': function(name)
	{
		var canLoad=this.enableAll;
		for(var j=0;j<this.blackList.length;j++)
		{
			if(this.blackList[j] == name)
			{
				canLoad=false;
				this.logger.log('Plugin \''+name+'\' blacklisted.', 'ModuleManager.permission');
			}
		}
		for(var j=0;j<this.whiteList.length;j++)
		{
			if(this.whiteList[j] == name)
			{
				canLoad=true;
				this.logger.log('Plugin \''+name+'\' whitelisted.', 'ModuleManager.permission');
			}
		}
		return canLoad;
	}
}

exports.manager=ModuleManager;