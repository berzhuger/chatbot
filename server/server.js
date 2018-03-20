// Uncomment following to enable zipkin tracing, tailor to fit your network configuration:
// var appzip = require('appmetrics-zipkin')({
//     host: 'localhost',
//     port: 9411,
//     serviceName:'frontend'
// });

require('appmetrics-dash').attach();
require('appmetrics-prometheus').attach();

const appName = require('./../package').name;
const express = require('express');
const log4js = require('log4js');
const localConfig = require('./config/local.json');
const path = require('path');

var request = require('request');
var bodyParser = require('body-parser');
var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk


const logger = log4js.getLogger(appName);
const app = express().use(bodyParser.json());
app.use(log4js.connectLogger(logger, { level: process.env.LOG_LEVEL || 'info' }));
const serviceManager = require('./services/service-manager');
require('./services/index')(app);
require('./routers/index')(app);

require('dotenv').config({silent: true});
var contexto_atual = null;

var w_conversation = new Conversation({
  url: 'https://gateway.watsonplatform.net/conversation/api',
  version_date: '2017-04-21',
  username: process.env.CONVERSATION_USERNAME,
  password: process.env.CONVERSATION_PASSWORD,
  version: 'v1'
});

//CODIGO TESTE FACEBOOK APLICATION

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

	// Your verify token. Should be a random string.
	let VERIFY_TOKEN = "EAAC3hL7BjZAMBANP3OzX7AZCn7UhZAKG4LynnWNgIEvNxF9oxZC7Sdv29grmSkFv52hGCjpByXOCcs9SZA2DDtG4JFsdVrkvSc12SYZCJEQdEaZAbZAAjkVrw6ZBkJUOIqF1ZATwpjfTL8GIDSpv3BJCiTlzADJpiNqRsHZBBZAswihGVQZDZD"
	  
	// Parse the query params
	let mode = req.query['hub.mode'];
	let token = req.query['hub.verify_token'];
	let challenge = req.query['hub.challenge'];
	  
	// Checks if a token and mode is in the query string of the request
	if (mode && token) {
	
	  // Checks the mode and token sent is correct
	  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
		
		// Responds with the challenge token from the request
		console.log('WEBHOOK_VERIFIED');
		res.status(200).send(challenge);
	  
	  } else {
		// Responds with '403 Forbidden' if verify tokens do not match
		res.sendStatus(403);      
	  }
	}
  });


//FIM DO CODIGO TESTE FACEBOOK APLICATION


//app.get('/webhook', function (req, res) {
	
	//if (req.query['hub.verify_token'] === 'EAAC3hL7BjZAMBANP3OzX7AZCn7UhZAKG4LynnWNgIEvNxF9oxZC7Sdv29grmSkFv52hGCjpByXOCcs9SZA2DDtG4JFsdVrkvSc12SYZCJEQdEaZAbZAAjkVrw6ZBkJUOIqF1ZATwpjfTL8GIDSpv3BJCiTlzADJpiNqRsHZBBZAswihGVQZDZD') {
//		res.send(req.query['hub.challenge']);
	//}
//
	//res.send('Erro de validação no token.');
//});

app.post('/webhook', function (req, res) {
	var text = null;
	
	messaging_events = req.body.entry[0].messaging;
	for (i = 0; i < messaging_events.length; i++) {	
		event = req.body.entry[0].messaging[i];
        sender = event.sender.id;

        if (event.message && event.message.text) text = event.message.text;
		else if (event.postback && !text) text = event.postback.payload;
		else break;

		 var payload = {
    		workspace_id: process.env.WORKSPACE_ID,
    		context: contexto_atual || {},
    		input: { "text": text },
			alternate_intents: true
  		};

		callWatson(payload, sender);
    }
    res.sendStatus(200);
});

function callWatson(payload, sender) {
	w_conversation.message(payload, function (err, results) {
    	if (err) return responseToRequest.send("Erro > " + JSON.stringify(err));

		if(results.context != null) contexto_atual = results.context;
		
        if(results != null && results.output != null){
			var i = 0;
			while(i < results.output.text.length){
				sendMessage(sender, results.output.text[i++]);
			}
		}
            
    });
}

function sendMessage(sender, text_) {
	text_ = text_.substring(0, 319);
	messageData = {	text: text_ };

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.FB_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
        	console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

//app.listen(process.env.PORT || 3000);

const port = process.env.PORT || localConfig.port;
app.listen(port, function(){
  logger.info(`CreateProjectVDKKI listening on http://localhost:${port}/appmetrics-dash`);
  
  logger.info(`CreateProjectVDKKI listening on http://localhost:${port}`);
  
  
});

app.use(function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/assets', '404.html'));
})

app.use(function (err, req, res, next) {
  res.sendFile(path.join(__dirname, '../public/assets', '500.html'));
})
