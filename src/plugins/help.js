var _=require('../../lib/array.js');

exports.module=
{
	'commands':
	[
		{
			'name': 'help',
			'callback': function(message, command, params)
			{
				var res=[];
				for(var i=0;i<this.modules.commands.length;i++)
				{
					if(this.permissionManager.hasPermission(message.getSender(), this.modules.commands[i]))
					{
						res.push(this.modules.commands[i].name);
					}
				}
				this.reply(message, 'jelenleg '+res.length+' parancs erheto el ('+res.join(', ')+')');
			}
		}
	]
}