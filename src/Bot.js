/**
 * Application entry point
 *
 * Bot recieves the IRC messages via process.on('message', callback)
 * And sends back the answer via process.send({'message':reply})
 * It communicates with its parent on the same channel
 */

/**
 * Reads the application config
 */
var configData=require('../config.json');

/**
 * Config object can wrap a JSON object
 *
 * It provides safe access to the config
 * It can extend the config with Objects
 */
var Config=require('./Config.js').Config;

/**
 * Creating the application config object
 */
var config=new Config(configData);

/**
 * Moka is the soul of the bot
 *
 * It parses the messages, do clever stuff
 */
var Moka=require('./Moka.js').Moka;

/**
 * Creating the application instance, based on the config
 */
var app=new Moka(config);

/**
 * Recieving a message
 *
 * Moka handles it, and sends a response
 * This is an asynch process!
 */
process.on('message', function(message)
{
	if(message['message'])
	{
		app.handle(message['message']);
	}
	else
	{
		//What if this is not an IRC message?
	}
});

/**
 * Sending the given message back to the parent
 *
 * If message is provided, it sends back a {'message':message}
 * object, otherwise the 'other' object
 * @param {string} message IRC message
 * @param {object} other Other command to the parent
 */
var sendBack=function(message, other)
{
	if(message)
	{
		process.send('message':message);
	}
	else
	{
		process.send(other);
	}
}

/**
 * On SIGTERM, we commit suicide
 */
process.on('SIGTERM', function()
{
	process.exit(0);
});