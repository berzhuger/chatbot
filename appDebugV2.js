'use strict';
var soap = require('soap');
var prompt = require('prompt-sync')();
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
require('dotenv').config({silent: true});
var conversation = new ConversationV1({
  username: process.env.CONVERSATION_USERNAME, 
  password: process.env.CONVERSATION_PASSWORD, 
  version_date: '2017-05-26'
});


var message = function(text, context) {
  var payload = {
    workspace_id: process.env.WORKSPACE_ID || '<workspace_id>',
    input: {
      text: text
    },
    context: context
  };
  return new Promise((resolve, reject) =>
    conversation.message(payload, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  );
};


message('gostaria de um boleto', undefined)
  .then(response1 => {
    console.log("***************************************************\n");
    console.log("PRIMEIRA MENSAGEM\n");
    // APPLICATION-SPECIFIC CODE TO PROCESS THE DATA
    // FROM CONVERSATION SERVICE
    console.log(JSON.stringify(response1, null, 2), '\n--------');

    // invoke a second call to conversation
    return message('0 055 000100000100 1', response1.context);
  })
  .then(response2 => {
    console.log("***************************************************\n");
    console.log("SEGUNDA MENSAGEM \n");

    if (response2.context.hasOwnProperty('carteiraUnimed')) {
      response2.context.recnoArray = [];
      var url = 'https://portal.vs.unimed.com.br:9001/ws/WSINFORMACOESPLANO.apw?WSDL';
      var args = {
      CCODIGOCLI: '0055000100000100',
      //CCODIGOCLI: response2.context.carteiraUnimed,
      CTIPOCLI: 'F',
      };
      soap.createClient(url, function(err, client) {
        client.COBRANCAS_CLI(args, function(err, result) {
          for (var i = 0; i < result.COBRANCAS_CLIRESULT.LISTARETORNOCOB.length; i++) {
            if (result.COBRANCAS_CLIRESULT.LISTARETORNOCOB[i].CSTATUS=='EM ABERTO') {
              response2.context.recnoArray.push(result.COBRANCAS_CLIRESULT.LISTARETORNOCOB[i].CRECNOE1);
            }        
          }
        });
      });
    }    
    console.log(JSON.stringify(response2, null, 2), '\n--------');
  })
  .catch(err => {
    // APPLICATION-SPECIFIC CODE TO PROCESS THE ERROR
    // FROM CONVERSATION SERVICE
    console.error(JSON.stringify(err, null, 2));
  });