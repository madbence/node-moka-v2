var test=function(name, expect, environment, callback)
{
	this.name=name;
	this.tests=expect;
	this.callback;
	this.environment=environment;
	this.run();
	this.passed=0;
	this.failed=0;
}

test.prototype=
{
	'ok': function(actual, expected)
	{
		if(actual!=expected)
		{
			this.fail();
		}
		else
		{
			this.success();
		}
	},
	'run': function()
	{
		process.stdout.write('Test ('+this.name+'): ');
		if(this.environment['setup'])
		{
			this.environment['setup'].call(this);
		}
		try
		{
			this.callback.call(this);
		}
		catch(e)
		{
			this.error(e);
		}
		if(this.environment['tearDown'])
		{
			this.environment['tearDown'].call(this);
		}
		process.stdout.write('\n');
	},
	'fail': function()
	{
		this.fail++;
		process.stdout.write('F');
	},
	'success': function()
	{
		this.passed++;
		process.stdout.write('.');
	},
	'error': function()
	{
		process.stdout.write('E');
	}
};

exports.test=test;