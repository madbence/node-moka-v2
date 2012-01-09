var fs=require('fs');
var u=require('../lib/array.js');
var e=require('events').EventEmitter;

var filesList=[];
var proc=1;
var l=new e();
var collectFiles=function(dir)
{
	dir=dir||'src/';
	//console.log('.a');
	fs.readdir(dir, function(err, files)
	{
		//console.log('.b', files);
		if(files)
		{
			//console.log('.c');
			u.forEach(files, function(v,i,a)
			{
				proc++;
				fs.stat(dir+v, function(err, s)
				{
					if(err)
					{
						console.log(err);
						return;
					}
					if(s.isFile())
					{
						proc--;
						filesList.push(dir+v);
						l.emit('data');
					}
					else if(s.isDirectory())
					{
						collectFiles(dir+v+'/');
					}
				});
			});
		}
		proc--;
	});
}
l.on('data', function()
{
	if(proc==0)
	{
		console.log('Merging files:');
		console.log(filesList);
		var merged=[];
		var mergedCount=0;
		u.forEach(filesList, function(v,i,a)
		{
			fs.readFile(v, 'utf8', function(err, data)
			{
				merged.push(data);
				mergedCount++;
				if(mergedCount == filesList.length)
				{
					fs.writeFile('moka.js', merged.join('\r\n'), 'utf8', function(err)
					{
						if(!err)
						{
							console.log('Build was successful!');
						}
						else
						{
							console.log('ERROR');
						}
					});
				}
			});
		});
	}
});

collectFiles();
