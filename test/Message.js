var testSuite=require('./testFramework/tester.js').testSuite;
var Message=require('../src/Message.js').Message;

var env=
{
	'setup': function()
	{
		this.messages=[];
		this.messages.push(new Message(':server PRIVMSG user :message'));
		this.messages.push(new Message(':atw.irc.hu 020 * :Please wait while we process your connection.'));
		this.messages.push(new Message(':atw.irc.hu 001 node_bot :Welcome to the Internet Relay Network node_bot!~node@example.com'));
		this.messages.push(new Message('PING :atw.irc.hu'));
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