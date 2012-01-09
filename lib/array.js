exports.forEach=function(arr, callback)
{
	if(Array.prototype.forEach)
	{
		return arr.forEach(callback);
	}
	else
	{
		for(var prop in arr)
		{
			callback(arr[prop], prop, arr);
		}
	}
};

exports.flatten=function(arr, callback)
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

/*
var a=[{'a':1},{'a':1},{'a':1},{'a':1},{'a':1}];
console.log(exports.flatten(a, function(v,i,a){return v['a'];}));
/**/