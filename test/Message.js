var testSuite=require('./testFramework/tester.js').testSuite;
var Message=require('../src/Message.js').Message;

var env=
{
	'setup': function()
	{
		this.messages=[];
		this.messages.push(new Message(':server PRIVMSG user :message'));
		this.messages.push(new Message(':server 020 * :Please wait while we process your connection.'));
		this.messages.push(new Message(':server 001 node_bot :Welcome to the Internet Relay Network node_bot!~node@example.com'));
		this.messages.push(new Message('PING :server'));
		this.messages.push(new Message(':server 005 bot_nickname RFC2812 PREFIX=(ov)@+ CHANTYPES=#&!+ MODES=3 CHANLIMIT=#&!+:25 NICKLEN=15 TOPICLEN=160 KICKLEN=160 MAXLIST=beIR:42 CHANNELLEN=50 IDCHAN=!:5 CHANMODES=beIR,k,l,imnpstaqr'));
		this.messages.push(new Message(':server 005 bot_nickname PENALTY FNC EXCEPTS=e INVEX=I CASEMAPPING=ascii NETWORK=IRCnet :are supported by this server'));
		this.messages.push(new Message(':server 042 bot_nickname 348AAIKQB :your unique ID'));
		this.messages.push(new Message(':server 251 bot_nickname :There are 64338 users and 7 services on 29 servers'));
		this.messages.push(new Message(':server 252 bot_nickname 113 :operators online'));
		this.messages.push(new Message(':server 254 bot_nickname 35285 :channels formed'));
		this.messages.push(new Message(':server 255 bot_nickname :I have 1273 users, 0 services and 4 servers'));
		this.messages.push(new Message(':server 265 bot_nickname 1273 1477 :Current local users 1273, max 1477'));
		this.messages.push(new Message(':server 266 bot_nickname 64338 80253 :Current global users 64338, max 80253'));
		this.messages.push(new Message(':server 375 bot_nickname :- server Message of the Day -'));
		this.messages.push(new Message(':server 372 bot_nickname :- 16/1/2008 7:42'));
		this.messages.push(new Message(':nick!user@host PRIVMSG #channel :message'));
		this.messages.push(new Message(':nick!user@host PRIVMSG target :message'));
	}
}
new testSuite('Message.getOrigin', 2, env, function()
{
	this.equal(this.messages[0].getOrigin(), 'server');
	this.equal(this.messages[3].getOrigin(), null);
});

new testSuite('Message.getResponse', 4, env, function()
{
	this.equal(this.messages[0].getResponse(), 'PRIVMSG');
	this.equal(this.messages[1].getResponse(), '020');
	this.equal(this.messages[2].getResponse(), '001');
	this.equal(this.messages[3].getResponse(), 'PING');
});

new testSuite('Message.isNumericResponse', 4, env, function()
{
	this.equal(this.messages[0].isNumericResponse(),false);
	this.equal(this.messages[1].isNumericResponse(),true);
	this.equal(this.messages[3].isNumericResponse(),false);
	this.equal(this.messages[4].isNumericResponse(),true);
});

new testSuite('Message.getNumericResponse', 3, env, function()
{
	this.throws(function()
	{
		this.messages[0].getNumericResponse();
	});
	this.equal(this.messages[1].getNumericResponse(), 20);
	this.equal(this.messages[2].getNumericResponse(), 1);
});

new testSuite('Message.getTail', 3, env, function()
{
	this.equal(this.messages[0].getTail(), 'message');
	this.equal(this.messages[3].getTail(), 'server');
	this.equal(this.messages[5].getTail(), 'are supported by this server');
});

new testSuite('Message.getRaw', 1, env, function()
{
	this.equal(this.messages[0].getRaw(), ':server PRIVMSG user :message');
});

//new testSuite('Message.isServerMessage', 3, 