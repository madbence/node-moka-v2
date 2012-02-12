var Manager=function(config, moka)
{
	this.moka=moka;
	this.config=config;
	this.init();
}

Manager.prototype=
{
	'init': function()
	{
	
	},
	'hasPermission': function(user, command)
	{
		var permission=command.permission;
		if(!permission)
		{
			return true;
		}
		var groups=['guest'];
		if(!this.moka.config.hasValue('permissions'))
		{
			this.moka.logger.warn('Permission config is missing...');
			return false;
		}
		if(this.moka.config.hasValue('permissions.users'))
		{
			var users=this.moka.config.getValue('permissions.users');
			for(var i=0;i<users.length;i++)
			{
				if(users[i].host == user)
				{
					groups=groups.concat(users[i].groups);
				}
			}
		}
		var groupList=this.moka.config.getValue('permissions.groups')||[];
		for(var i=0;i<groupList.length;i++)
		{
			for(var j=0;j<groups.length;j++)
			{
				if(groups[j] == groupList[i].name)
				{
					if(!groupList[i].allow)
					{
						continue;
					}
					for(var k=0;k<groupList[i].allow.length;k++)
					{
						if(groupList[i].allow[k] == permission)
						{
							return true;
						}
					}
				}
			}
		}
		return false;
	}
}

exports.manager=Manager;