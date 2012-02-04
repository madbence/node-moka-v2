exports.module=
{
	'commands':
	[
		{
			name: 'cica',
			man:
			[
				'"%c", megmondja mennyi ido mulva valtozik at _VauViktor',
				'_VauViktor hasznalhatja l.me formaban is!',
			],
			callback: function(message, command, params)
			{
				var target=new Date();
				target.setHours(1);
				target.setMinutes(8);
				target.setSeconds(0);
				if(new Date().getHours()>1||(new Date().getHours()==target.getHours()&&new Date().getMinutes()>target.getMinutes()))
				{
					target.setTime(target.getTime()+3600*24*1000);
				}
				var diff=(target-new Date().getTime())/1000
				var targetString=
					diff>3600?
						(Math.floor(diff/3600)+' ora, '+(Math.floor(diff/60)%60)+' perc'):
						(diff>60?
							((Math.floor(diff/60)%60)+' perc, '+Math.floor(diff)%60+' masodperc!'):
							((Math.floor(diff))+' masodperc!!!'));
				var targetHint=(target.getHours()<10?'0'+target.getHours():target.getHours())+':'+(target.getMinutes()<10?'0'+target.getMinutes():target.getMinutes());
				this.reply(message, 'Cicafoldig ('+targetHint+') meg '+targetString);
				return true;
			}
		},
		/*{
			name: 'me',
			man:
			[
				'"%c", megmondja mennyi ido mulva valtozik at _VauViktor',
			],
			callback: function(message, command, params)
			{
				if(message.getNick() == '_VV' || message.getNick() == 'CatLand')
				{
					exports.commands[0].func.call(this, params);
				}
			}
		}*/
	],
}