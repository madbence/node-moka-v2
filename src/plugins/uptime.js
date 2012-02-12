exports.module=
{
	'commands':
	[
		{
			'name': 'uptime',
			'man':
			[
				'"%c", megmondja miota fut a bot',
			],
			'callback': function(message, command, params)
			{
				var ut=process.uptime();
				utString=
					Math.floor(ut/3600/24)+':'+
					(((ut/3600)%3600)<10?'0':'')+Math.floor((ut/3600)%3600)+':'+
					(((ut/60)%60)<10?'0':'')+Math.floor((ut/60)%60)+':'+
					((ut%60)<10?'0':'')+Math.floor(ut%60);
				this.reply(message, 'moka-processz: '+utString);
				return true;
			}
		}
	]
}