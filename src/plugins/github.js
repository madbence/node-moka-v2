var https=require('https');
var util=require('../../lib/util.js');

var templates=
{
	'user': ':user:fullname: :repos public repo, :followers koveto, :following kovetett, :gists gist.',
	'repos': ':user public repoi: :repos',
	'repos_': ':name(:lang,:ownership)',
	'repo': ':name(:lang, owner: :owner, letrehozva: :created, frissitve: :lastupdate, :forks fork, :watchers watcher): :description'
}

var githubAPI=
{
	_apiCall: function(path, clb)
	{
		https.get(
		{
			'host': 'api.github.com',
			'path': path
		}, function(res)
		{
			this.remaining=res.headers['x-ratelimit-remaining'];
			var responseData='';
			res.on('data', function(data)
			{
				responseData+=data;
			});
			res.on('end', function()
			{
				clb(JSON.parse(responseData));
			});
		});
	},
	getUser: function(name, clb)
	{
		this._apiCall('/users/'+name, clb);
	},
	getRepos: function(name, clb)
	{
		this._apiCall('/users/'+name+'/repos?per_page=100', clb);
	},
	getFollowers: function(name, clb)
	{
		this._apiCall('/users/'+name+'/followers', clb);
	},
	getFollowings: function(name, clb)
	{
		this._apiCall('/users/'+name+'/following', clb);
	},
	getRepo: function(user, repo, clb)
	{
		this._apiCall('/repos/'+user+'/'+repo, clb);
	}
}

exports.module=
{
	'commands':
	[
		{
			'name': 'github',
			'callback': function(message, command, params)
			{
				var that=this;
				if(params[0] == 'u' || params[0] == 'user')
				{
					if(params.length>2 && params[1] == 'r' || params[1] == 'repos')
					{
						var userName=util.escape(params[2]);
						var repoName=util.escape(params[3]?params[3]:'');
						if(!repoName.length)
						{
							githubAPI.getRepos(userName, function(repos)
							{
								try
								{
									if(repos['message'] == 'Not Found')
									{
										that.reply(message, 'Nincs \''+userName+'\' juzer :c');
										return;
									}
									var reposArray=[];
									for(var i=0;i<repos.length;i++)
									{
										if(!reposArray[Math.floor(i/15)])
										{
											reposArray[Math.floor(i/15)]=[];
										}
										reposArray[Math.floor(i/15)][i%15]=template(templates['repos_'],
										{
											'name': repos[i]['name'],
											'lang': repos[i]['language']?repos[i]['language']:'ismeretlen',
											'ownership': repos[i]['owner']['login']==userName?'o':'m',
											'fork': repos[i]['fork']?'f':'nf',
											'forks': repos[i]['forks'],
											'watchers': repos[i]['watchers'],
										});
									}
									that.reply(message, util.template(templates['repos'],
									{
										'user': userName,
										'repos': reposArray[0].join(', ')+(reposArray.length>1?' ...':'')
									}));
									for(var i=1;i<reposArray.length;i++)
									{
										that.say('... '+reposArray[i].join(', ')+(i+1<reposArray.length?' ...':''));
									}
								}
								catch(e)
								{
									//that.reply(e);
									console.log(e);
								}
							});
						}
					}
					else if(params.length == 4 && params[2] == 'followers')
					{
						var userName=util.escape(params[3]);
						githubAPI.getFollowers(userName, function(followers)
						{
							var followersList=[];
							for(var i=0;i<followers.length;i++)
							{
								followersList.push(followers[i]['login']);
							}
							that.reply(message, userName+' kovetoi ('+followersList.length+'): '+followersList.join(', '));
						});
					}
					else if(params.length == 4 && params[2] == 'followings')
					{
						var userName=util.escape(params[3]);
						githubAPI.getFollowings(userName, function(followings)
						{
							var followingsList=[];
							for(var i=0;i<followings.length;i++)
							{
								followingsList.push(followings[i]['login']);
							}
							that.reply(message, userName+' oket koveti ('+followingsList.length+'): '+followingsList.join(', '));
						});
					}
					else
					{
						var userName=util.escape(params[1]);
						if(!userName.length)
						{
							return;
						}
						githubAPI.getUser(userName, function(user)
						{
							try
							{
								if(user['message'] == 'Not Found')
								{
									that.reply(message, 'Nincs \''+userName+'\' juzer :c');
								}
								else
								{
									that.reply(message, util.template(templates['user'], 
									{
										'user': userName,
										'fullname': user['name']?('('+user['name']+')'):'',
										'repos': user['public_repos'],
										'followers': user['followers'],
										'following': user['following'],
										'gists': user['public_gists']
									}));
								}
							}
							catch(e)
							{
								console.log(e);
							}
						});
					}
				}
			}
		}
	]
}