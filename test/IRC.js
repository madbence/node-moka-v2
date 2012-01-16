var testSuite=require('./testFramework/tester.js').testSuite;
var IRC=require('../src/IRC.js').IRC;

new testSuite('IRC.command', 2, null, function()
{
	this.equal(IRC.command('test'), 'test\n');
	this.equal(IRC.command('test', 'param'), 'test param\n');
});

new testSuite('IRC.nick', 2, null, function()
{
	this.equal(IRC.nick('test'), 'NICK test\n');
	this.equal(IRC.nick('test'), IRC.command('NICK', 'test'));
});

new testSuite('IRC.user', 2, null, function()
{
	this.equal(IRC.user('test'), 'USER test 8 * :...\n');
	this.equal(IRC.user('test'), IRC.command('USER', 'test 8 * :...'));
});

new testSuite('IRC.connect', 2, null, function()
{
	this.equal(IRC.connect('test'), 'NICK test\nUSER test 8 * :...\n');
	this.equal(IRC.connect('test'), IRC.nick('test')+IRC.user('test'));
});

new testSuite('IRC.mode', 2, null, function()
{
	this.equal(IRC.mode('testChannel', 'modeString', 'modeParam'), 'MODE testChannel modeString modeParam\n');
	this.equal(IRC.mode('testChannel', 'modeString', 'modeParam'), IRC.command('MODE', 'testChannel modeString modeParam'));
});

new testSuite('IRC.isValidDirectionString', 14, null, function()
{
	this.ok(IRC.isValidDirectionString('+++'));
	this.ok(IRC.isValidDirectionString('++-'));
	this.ok(IRC.isValidDirectionString('+-+'));
	this.ok(IRC.isValidDirectionString('-++'));
	this.ok(IRC.isValidDirectionString('+--'));
	this.ok(IRC.isValidDirectionString('--+'));
	this.ok(IRC.isValidDirectionString('-+-'));
	this.ok(IRC.isValidDirectionString('---'));
	
	this.ok(IRC.isValidDirectionString('+'));
	this.ok(IRC.isValidDirectionString('-'));
	
	this.ok(IRC.isValidDirectionString('++'));
	this.ok(IRC.isValidDirectionString('+-'));
	this.ok(IRC.isValidDirectionString('-+'));
	this.ok(IRC.isValidDirectionString('--'));
});

new testSuite('IRC.directionStringToMode', 2, null, function()
{
	this.equal(IRC.directionStringToMode('o', '++-'), '+oo-o');
	this.equal(IRC.directionStringToMode('o', '+++'), '+ooo');
});

new testSuite('IRC.op', 1, null, function()
{
	this.equal(IRC.op('testChannel', 'testUser'), IRC.mode('testChannel', '+o', 'testUser'));
});

new testSuite('IRC.join', 4, null, function()
{
	this.equal(IRC.join('#testChannel'), IRC.command('JOIN', '#testChannel'));
	this.equal(IRC.join('#testChannel', 'password'), IRC.command('JOIN', '#testChannel password'));
	this.equal(IRC.join(['#ch1','#ch2','#ch3']), IRC.command('JOIN', '#ch1,#ch2,#ch3'));
	this.equal(IRC.join(['#ch1','#ch2','#ch3'], ['p1', 'p2']), IRC.command('JOIN', '#ch1,#ch2,#ch3 p1,p2'));
});

new testSuite('IRC.leave', 3, null, function()
{
	this.equal(IRC.leave('#channel'), IRC.command('PART', '#channel'));
	this.equal(IRC.leave('#channel', 'message'), IRC.command('PART', '#channel :message'));
	this.equal(IRC.leave(['#channel1', '&channel2']), IRC.command('PART', '#channel1,&channel2'));
});

new testSuite('IRC.quit', 2, null, function()
{
	this.equal(IRC.quit(), IRC.command('QUIT'));
	this.equal(IRC.quit('message'), IRC.command('QUIT', ':message'));
});

new testSuite('IRC.topic', 2, null, function()
{
	this.equal(IRC.topic('#channel', 'newTopic'), IRC.command('TOPIC', '#channel :newTopic'));
	this.equal(IRC.topic('#channel'), IRC.command('TOPIC', '#channel'));
});

new testSuite('IRC.privmsg', 2, null, function()
{
	this.equal(IRC.privmsg('#channel', 'message'), IRC.command('PRIVMSG', '#channel :message'));
	this.equal(IRC.privmsg('user', 'message'), IRC.command('PRIVMSG', 'user :message'));
});