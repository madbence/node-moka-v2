var testSuite=function(name, expect, environment, callback)
{
	this.name=name;
	this.tests=expect;
	this.callback=callback;
	this.environment=environment;
	this.passed=0;
	this.failed=0;
	this.run();
}

testSuite.prototype=
{
	'ok': function(actual)
	{
		if(!actual)
		{
			this.fail();
		}
		else
		{
			this.success();
		}
	},
	'equal': function(actual, expected)
	{
		if(actual != expected)
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
		if(this.environment && this.environment['setup'])
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
		if(this.environment && this.environment['tearDown'])
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
	'error': function(e)
	{
		process.stdout.write('E');
		console.log(e);
	}
};

exports.testSuite=testSuite;