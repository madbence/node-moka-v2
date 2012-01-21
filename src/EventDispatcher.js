var EventDispatcher=function(moka,logger)
{
	logger=logger||console;
	this.logger=logger;
	this.mokaInstanc=moka;
}

EventDispatcher.prototype=
{
	'listeners':{},
	'mokaInstance':null,
	'emit': function(label, args)
	{
		this.logger.log('Event \''+label+'\' emitted.', 'EventDispatcher.emit');
		if(this.listeners[label])
		{
			this.logger.log('Event \''+label+'\' has '+this.listeners[label].length+' listeners.', 'EventDispatcher.emit');
			for(var i=0;i<this.listeners[label].length;i++)
			{
				if(typeof this.listeners[label][i] === 'function')
				{
					this.listeners[label][i]([this.mokaInstance].concat(args));
				}
				else
				{
					this.logger.warn('Listener for event \''+label+'\' is not a function!', 'EventDispatcher.emit');
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