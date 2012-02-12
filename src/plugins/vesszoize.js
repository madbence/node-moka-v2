exports.module=
{
	'commands':
	[
		{
			'name': 'vesszoize',
			'callback': function(message, command, params)
			{
				var res=[];
				for(var i=0;i<params.length;i++)
				{
					if(params[i].length)
					{
						res.push(params[i]);
					}
				}
				this.reply(message, res.join(', '));
			}
		}
	]
}