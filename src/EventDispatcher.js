var EventDispatcher=function(logger)
{
	logger=logger||console;
	this.logger=logger;
}

EventDispatcher.prototype=
{
	'listeners':{},
	'emit': function(label, args)
	{
		this.logger.log('Event \''+label+'\' emitted.', 'EventDispatcher.emit');
		if(this.listeners[label])
		{
			this.logger.log('Event \''+label+'\' has '+this.listeners[label].length+' listeners.', 'EventDispatcher.emit');
			for(var i=0;i<this.listeners[label].length;i++)
			{
				if(typeof this.listeners[label] === 'function')
				{
					this.listeners[label](args);
				}
			}
		}
		else
		{
			this.logger.log('Event \''+label+'\' has no listeners.', 'EventDispatcher.emit');
		}
	},
	'on':function(label, callback)
	{
		if(!this.listeners[label])
		{
			this.listeners[label]=[];
		}
		this.logger.log('Listener added to event \''+label+'\'', 'EventDispatcher.on');
		this.listeners[label].push(callback);
	}
}

exports.EventDispatcher=EventDispatcher;