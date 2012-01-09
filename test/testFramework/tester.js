var testSuite=function(name, expect, environment, callback)
{
	this.name=name;
	this.tests=expect;
	this.callback=callback;
	this.environment=environment;
	this.passed=0;
	this.failed=0;
	this.errorMessages=[];
	this.run();
}

testSuite.prototype=
{
	'ok': function(actual)
	{
		if(!actual)
		{
			this.fail('\''+actual+'\' is not true.');
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
			this.fail('\''+actual+'\' is not the expected \''+expected+'\'.');
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
		if(this.errorMessages.length)
		{
			for(var i=0;i<this.errorMessages.length;i++)
			{
				process.stdout.write(this.errorMessages[i]+'\n');
			}
		}
	},
	'fail': function(msg)
	{
		this.fail++;
		this.errorMessages.push(msg);
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