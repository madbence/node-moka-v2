var server=process.argv[2]||'atw.irc.hu';
var port=process.argv[3]||6669;
var net = require('net');

var bnc=
{
	'connection': null,
	'connect':function(server, port)
	{
		if(this.hasActiveConnection())
		{
			return;
		}
		this.makeConnection(server||'atw.irc.hu', port||6669);
	},
	'makeConnection': function(server, port)
	{
		this.connection=net.connect(port, server, this.onConnect);
		this.connection.on('data', this.dataHandler);
		this.connection.on('close', this.onDisconnect);
	},
	'onConnect': function(){},
	'onDisconnect': function(){},
	'dataHandler': function(){},
	'disconnect':function(hard)
	{
		if(!this.hasActiveConnection())
		{
			return;
		}
		if(hard)
		{
			this.connection.destroy();
		}
		else
		{
			this.connection.destroySoon();
		}
	},
	'hasActiveConnection': function()
	{
		return this.connection != null &&
			this.connection.readable &&
			this.connection.writeable;
	}
};

var identServer=
{
	'start': function(name, port, dataclb, closeclb)
	{
		var server=identID=net.createServer(function (socket) {
			socket.on('data', function(data)
			{
				socket.write(data.toString().replace('\r\n', '')+' : USERID : '+name+'\r\n');
				if(dataclb && typeof dataclb === 'function')
				{
					dataclb();
				}
			});
			socket.on('close', function()
			{
				server.close();
				if(closeclb && typeof closeclb === 'function')
				{
					closeclb();
				}
			});
		}).listen(port||113);
	}
}

exports.bnc=bnc;
exports.identServer=identServer;