var IRC=require('../IRC.js').IRC;

exports.module=
{
	'listeners':
	{
		'welcome': 
		[
			function(moka)
			{
				if(moka.config.getValue('listeners.onConnect.autojoin.join'))
				{
					var autojoin=moka.config.getValue('listeners.onConnect.autojoin.channels');
					moka.logger.log('Autojoining: '+autojoin.join(','), 'Moka.autojoin');
					for(var i=0;i<autojoin.length;i++)
					{
						moka.response(IRC.join(autojoin[i]));
					}
				}
			},
		],
	},
}