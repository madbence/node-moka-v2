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

new testSuite('IRC user', 2, null, function()
{
	this.equal(IRC.user('test'), 'USER test 0 * :...\n');
	this.equal(IRC.user('test'), IRC.command('USER', 'test 0 * :...'));
});

new testSuite('IRC connect', 2, null, function()
{
	this.equal(IRC.connect('test'), 'NICK test\nUSER test 0 * :...\n');
	this.equal(IRC.connect('test'), IRC.nick('test')+IRC.user('test'));
});

new testSuite('IRC mode', 2, null, function()
{
	this.equal(IRC.mode('testChannel', 'modeString', 'modeParam'), 'MODE testChannel modeString modeParam\n');
	this.equal(IRC.mode('testChannel', 'modeString', 'modeParam'), IRC.command('MODE', 'testChannel modeString modeParam'));
});