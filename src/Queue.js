var Queue=function(name, callback)
{
	this.queue=[];
	this.name=name;
	this.callback=callback;
}

Queue.prototype=
{
	'tick': function()
	{
		if(this.queue.length)
			this.callback(this.queue.shift());
	},
	'add': function(message)
	{
		this.queue.push(message);
	},
	'clear': function()
	{
		this.queue=[];
	}
}

var QueueManager=function(callback)
{
	this.queues=[];
	this.callback=callback;
}
QueueManager.prototype=
{
	'add': function(message, queue)
	{
		queue=queue||'global';
		for(var i=0;i<this.queues.length;i++)
		{
			if(this.queues[i].name == queue)
			{
				this.queues[i].add(message);
				return;
			}
		}
		this.addQueue(queue, message);
	},
	'addQueue': function(name, message)
	{
		this.log('Adding new Queue to QueueManager ('+name+')', 'QueueManager.addQueue');
		this.queues.push(new Queue(name, this.callback));
		this.queues[this.queues.length-1].add(message);
	},
	'tick': function()
	{
		//this.log('Ticking '+this.queues.length+' queues', 'QueueManager.tick');
		for(var i=0;i<this.queues.length;i++)
		{
			this.queues[i].tick();
		}
	},
	'log':function(message, label)
	{
		if(!this.logger)
		{
			console.log('['+label+']'+message);
		}
		else
		{
			this.logger.log(message, label);
		}
	}
}
exports.QueueManager=QueueManager;