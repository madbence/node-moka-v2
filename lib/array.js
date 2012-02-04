exports.forEach=function(arr, callback)
{
	if(Array.prototype.forEach && arr instanceof Array)
	{
		return Array.prototype.forEach.call(arr, callback);
	}
	else
	{
		for(var prop in arr)
		{
			callback(arr[prop], prop, arr);
		}
	}
};

exports.map=function(arr, callback)
{
	if(Array.prototype.flatten)
	{
		return arr.flatten(callback);
	}
	var result=[];
	exports.forEach(arr, function(val, index, arr)
	{
		result.push(callback(val, index, arr));
	});
	return result;
}

exports.any=function(arr, callback)
{
	for(var prop in arr)
	{
		if(callback(arr[prop], prop, arr))
		{
			return true;
		}
	}
	return false;
}

exports.pluck=function(arr, name)
{
	var res=[];
	for(var prop in arr)
	{
		res.push(arr[prop][name]);
	}
	return res;
}