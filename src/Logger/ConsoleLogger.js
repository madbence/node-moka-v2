var util=require('../Util.js');
var arrayUtil=require('../../lib/array.js');
var handler=
{
	'formatMessage': function(type, message, label, location)
	{
		var date=new Date();
		var dateFormat=util.dateFormatter(date, '[%H:%i:%s]');
		var message=dateFormat+' '+type+(label?'('+label+')':'')+': '+message+(location?'('+location+')':'');
		return message;
	},
	'log': function(message, label)
	{
		this.doLog('LOG', message, label);
	},
	'info': function(message, label)
	{
		this.doLog('INFO', message, label);
	},
	'warn': function(message, label)
	{
		this.doLog('WARN', message, label);
	},
	'error': function(message, label)
	{
		this.doLog('ERROR', message, label);
	},
	'config': null,
	'setConfig': function(config)
	{
		this.config=config;
	},
	'doLog': function(type, message, label)
	{
		if(this.canLog(type, label))
		{
			//var location=e.stack.match(/at ((.*?) )\((.*?)\)/g)[3];
			console.log(this.formatMessage(type, message, label));
		}
	},
	'canLog': function(type, label)
	{
		if(!this.config)
		{
			return true;
		}
		var configEntry=this.config[type.toLowerCase()];
		if(configEntry['all'])
		{
			if(configEntry['blackList'] && 
				configEntry['blackList'] instanceof Array &&
				arrayUtil.any(configEntry['blackList'], function(v,i,a)
				{
					return v==label;
				}))
			{
				if(configEntry['whiteList'] && 
					configEntry['whiteList'] instanceof Array &&
					arrayUtil.any(configEntry['whiteList'], function(v,i,a)
					{
						return v==label;
					}))
				{
					return true;
				}
				return false;
			}
			return true;
		}
		return false;
	}
}

exports.handler=handler;
	