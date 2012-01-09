var testSuite=require('./testFramework/tester.js').testSuite;
var IRC=require('../src/IRC.js').IRC;

new testSuite('IRC command', 2, null, function()
{
	this.equal(IRC.command('test'), 'test\n');
	this.equal(IRC.command('test', 'param'), 'test param\n');
});

new testSuite('IRC nick', 2, null, function()
{
	this.equal(IRC.nick('test'), 'NICK test\n');
	this.equal(IRC.nick('test'), IRC.command('NICK', 'test'));
});