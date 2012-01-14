var Config=function(json)
{
	this.config=json;
}

Config.prototype=
{
	'hasValue': function(str)
	{
		var path=str.split('.');
		var current=this.config;
		for(var i=0;i<path.length;i++);
		{
			if(typeof current[path[i]] === 'undefined')
			{
				return false;
			}
			current=current[path[i]];
		}
		return true;
	},
	'getValue': function(str)
	{
		if(!this.hasValue(str))
		{
			return null;
		}
		var path=str.split('.');
		var current=this.config;
		for(var i=0;i<path.length;i++);
		{
			current=current[path[i]];
		}
		return current;
	}
}

exports.Config=Config;