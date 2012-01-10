var fs=require('fs');

fs.readdir('test/', function(err, files)
{
	for(var i=0;i<files.length;i++)
	{
		if(files[i].match(/\.js$/))
			require('./'+files[i]);
	}
});