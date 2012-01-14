var util=require('../Util.js');
var handler=
{
	'formatMessage': function(type, message, label)
	{
		var date=new Date();
		var dateFormat=util.dateFormatter(date, '[%H:%i:%s]');
		var message=dateFormat+' '+type+(label?'('+label+')':'')+': '+message;
		return message;
	},
	'log': function(message, label)
	{
		console.log(this.formatMessage('LOG', message, label));
	},
	'info': function(message, label)
	{
		console.log(this.formatMessage('INFO', message, label));
	},
	'warn': function(message, label)
	{
		console.log(this.formatMessage('WARN', message, label));
	},
	'error': function(message, label)
	{
		console.log(this.formatMessage('ERROR', message, label));
	}
}

exports.handler=handler;
	