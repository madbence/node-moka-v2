var IRC=require('../IRC.js').IRC;

exports.module=
{
	'listeners':
	{
		'Moka.cmd.ping': 
		[
			function(moka, server)
			{
				moka.response(IRC.pong(server));
			},
		],
	},
}