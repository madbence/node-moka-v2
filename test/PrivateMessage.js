var testSuite=require('./testFramework/tester.js').testSuite;
var Message=require('../src/Message.js').Message;
var PrivateMessage=require('../src/PrivateMessage.js').PrivateMessage;

var env=
{
	'setup': function()
	{
		this.messages=[];
		this.messages.push(new PrivateMessage(new Message(':server PRIVMSG user :message')));
		this.messages.push(new PrivateMessage(new Message(':nick!user@host PRIVMSG #channel :l.command')));
	}
};

new testSuite('PrivateMessage.isCommand', 2, env, function()
{
	this.equal(this.messages[0].isCommand(/^l\./), false);
	this.equal(this.messages[1].isCommand(/^l\./), true);
});

new testSuite('PrivateMessage.getSender', 2, env, function()
{
	this.equal(this.messages[0].getSender(), 'server');
	this.equal(this.messages[1].getSender(), 'nick!user@host');
});

new testSuite('PrivateMessage.getTarget', 2, env, function()
{
	this.equal(this.messages[0].getTarget(), 'user');
	this.equal(this.messages[1].getTarget(), '#channel');
});