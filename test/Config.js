var testSuite=require('./testFramework/tester.js').testSuite;
var Config=require('../src/Config.js').Config;

var env=
{
	'setup':function()
	{
		this.config=new Config(require('./Config_config.json'));
	}
};

new testSuite('Config.hasValue', 2, env, function()
{
	this.equal(this.config.hasValue('test1'), true);
	this.equal(this.config.hasValue('test1.test2'), true);
});

new testSuite('Config.getValue', 1, env, function()
{
	this.equal(this.config.getValue('test1.test2'), 'a');
});

new testSuite('Config.setValue', 1, env, function()
{
	this.config.setValue('test.path.to.something', 'asd');
	this.equal(this.config.getValue('test.path.to.something'), 'asd');
});