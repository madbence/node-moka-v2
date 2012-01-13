var testSuite=require('./testFramework/tester.js').testSuite;
var Logger=require('../src/Logger.js').Logger;

var env=
{
	'startup': function()
	{
		this.logger=new Logger(testHandler);
	},
}

new testSuite('Logger.setLogHandler', 2, null, function()
{
	this.equal(new Logger('foo').logHandler, 'foo');
	var l=new Logger();
	l.setLogHandler('foo');
	this.equal(l.logHandler, 'foo');
});