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
	'stderr':{'write':function(m){process.stdout.write(m)}},
	'stdout':{'write':function(m){process.stderr.write(m)}},
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
	'throws': function(callback)
	{
		try
		{
			callback();
			this.fail('Exception was not thrown.');
		}
		catch(e)
		{
			this.success();
		}
	},
	'run': function()
	{
		this.stdout.write('Test ('+this.name+'): ');
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
		this.stdout.write('\n');
		if(this.errorMessages.length)
		{
			for(var i=0;i<this.errorMessages.length;i++)
			{
				this.stdout.write(this.errorMessages[i]+'\n');
			}
			this.stderr.write('Test failed in '+this.name);
		}
		if(this.passed!=this.tests)
		{
			if(!this.failed)
			{
				this.stdout.write(this.tests+' test was expected to pass, '+this.passed+' passed.\n');
			}
		}
	},
	'fail': function(msg)
	{
		this.failed++;
		this.errorMessages.push(msg.replace(/\n/g, '\\n'));
		this.stdout.write('F');
	},
	'success': function()
	{
		this.passed++;
		this.stdout.write('.');
	},
	'error': function(e)
	{
		this.stdout.write('E');
		this.errorMessages.push(e.toString());
	}
};

exports.testSuite=testSuite;