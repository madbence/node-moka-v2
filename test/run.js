var fs=require('fs');

var testRunner=function(clb)
{
	fs.readdir('test/', function(err, files)
	{
		for(var i=0;i<files.length;i++)
		{
			if(files[i].match(/\.js$/))
				require('./'+files[i]);
		};
		clb();
	});
}
if(require.main === module)
{
	testRunner(function(){console.log('DONE');});
}

exports.testRunner=testRunner;