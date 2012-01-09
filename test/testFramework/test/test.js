var testSuite=require('../tester.js').testSuite;

new testSuite('Basic functionality', 1, null, function()
{
	this.ok(true);
	this.equal(true, true);
});