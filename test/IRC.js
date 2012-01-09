var testSuite=require('./testFramework/tester.js').testSuite;
var IRC=require('../src/IRC.js').IRC;

var env=
{
	'setup': function()
	{
		IRC.setIO(new Buffer('', 'utf8'));
	},
	'tearDown': function()
	{
		IRC.setIO(null);
	}
};

new testSuite('IRC IO setting', 2, null, function()
{
	this.equal(IRC.IO, null);
	IRC.setIO(true);
	this.equal(IRC.IO, true);
});

