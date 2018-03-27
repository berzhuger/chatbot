// Example 3: maintains state.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var prompt = require('prompt-sync')();
var request = require("request");
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
require('dotenv').config({silent: true});
// Set up Conversation service wrapper.
var conversation = new ConversationV1({
  username: process.env.CONVERSATION_USERNAME, // replace with service username
  password: process.env.CONVERSATION_PASSWORD, // replace with service password
  version_date: '2017-05-26'
});


global.respostaAlterada = '';

var workspace_id = '1ab364d9-778f-4036-9deb-1a5888ba8ebd'; // replace with workspace ID
//var workspace_id = '073b16c5-6446-439c-95f9-32e425b195c2'; // replace with workspace ID

// Start conversation with empty message.
conversation.message({
  workspace_id: workspace_id
  }, processResponse);

// Process the conversation response.
function processResponse(err, response) {
  if (err) {
    console.error(err); // something went wrong
    return;
  }
  // If an intent was detected, log it out to the console.
  if (response.intents.length > 0) {
    console.log('Detected intent: #' + response.intents[0].intent);
    console.log("variaveis response : "+response.context.conversation_id);
    if (response.intents[0].intent=='boleto' && response.context.hasOwnProperty('carteiraUnimed')) {
        console.log('essa intent é do boleto - fazer algo aqui');
        console.log('numero da carteira enviado pelo chat: '+response.context.carteiraUnimed);
        buscaInformacoes(function (data){
            if (data.hasOwnProperty('nome')) {
                console.log("nome encontrado: "+data.nome);
                response.output.text[0] = 'Olá '+data.nome+', em que posso ajudar?'
                console.log(response.output.text[0]);
                respostaAlterada = response.output.text[0];
                //parametros para a atualizacao do dialogo
                // var params = {
                //     workspace_id: '1ab364d9-778f-4036-9deb-1a5888ba8ebd',
                //     dialog_node: 'greeting',
                //     new_dialog_node: 'greeting',
                //     new_output: {
                //         text: 'Olá '+data.nome+', em que posso ajudar?'
                //     },
                //     context :{
                //         'nome':'teste de nome'
                //     }
                // };
                // //metodo para dar update no dialog
                // conversation.updateDialogNode(params, function(err, response) {
                //     if (err) {
                //         console.error(err);
                //     } else {
                //         console.log(JSON.stringify(response, null, 2));
                //     }
                // });
            } else {
                console.log("deu erro");
            }
        });
        //console.log(response);
        //console.log(JSON.stringify(response, null, 2));
    }
  }

  // Display the output from dialog, if any.
  if (response.output.text.length != 0) {
      if (respostaAlterada && response.intents[0].intent=='boleto'){
        console.log(respostaAlterada);
      } else {
        console.log(response.output.text[0]);
      }
  }

  // Prompt for the next round of input.
    var newMessageFromUser = prompt('>> ');
    // Send back the context to maintain state.
    conversation.message({
      workspace_id: workspace_id,
      input: { text: newMessageFromUser },
      context : response.context,
    }, processResponse)
}




  function buscaInformacoes(callback) {
    var options = {
        url: "https://srv-hu-mv01:3443/mvagendaintegra/rest/paciente/obterPorNroCarteira/00550200006770006",
        method: "GET",
        headers: {
            Token: "MV"
        }
    }
    request(options, function (error, response, body) {
        if (!error) {
            try {
                //console.log(body);
                json = JSON.parse(body);
                this.nome = json.nome;
                callback(json);
                //resolve(json);
                //console.log("fu nome "+fu.nome);
                //fu.nome = fu.json.nome;
                //console.log("fu nome depois da coisa "+fu.nome);
                //console.log(this.json.nome);
            } catch (error) {
                
                console.log('não foi possivel localizar os seus dadados, por favor verifique as informações');
                error = 'não foi possivel localizar os seus dadados, por favor verifique as informações'
                callback(error);
                //resolve(error);
            }

        }
    })
};
//Exemplo 4

// Start conversation with empty message.
// conversation.message({
//   workspace_id: workspace_id
//   }, processResponse);

// // Process the conversation response.
// function processResponse(err, response) {
//   if (err) {
//     console.error(err); // something went wrong
//     return;
//   }

//   var endConversation = false;
// console.log(response.output.action);
//   // Check for action flags.
//   if (response.output.action === 'boleto') {
//     console.log(response.output.action);
//     // User asked what time it is, so we output the local system time.
//     console.log('The current time is ' + new Date().toLocaleTimeString());
//   } else if (response.output.action === 'end_conversation') {
//     // User said goodbye, so we're done.
//     console.log(response.output.text[0]);
//     endConversation = true;
//   } else {
//     // Display the output from dialog, if any.
//     if (response.output.text.length != 0) {
//         console.log(response.output.text[0]);
//     }
//   }

//   // If we're not done, prompt for the next round of input.
//   if (!endConversation) {
//     var newMessageFromUser = prompt('>> ');
//     conversation.message({
//       workspace_id: workspace_id,
//       input: { text: newMessageFromUser },
//       // Send back the context to maintain state.
//       context : response.context,
//     }, processResponse)
//   }
// }


//parametros para a mudanca da mensagem via webservice
// var params = {
//     workspace_id: '9978a49e-ea89-4493-b33d-82298d3db20d',
//     dialog_node: 'greeting',
//     new_dialog_node: 'greeting',
//     new_output: {
//       text: 'Hello! What can I do for you?'
//     }
//   };
  
//   conversation.updateDialogNode(params, function(err, response) {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(JSON.stringify(response, null, 2));
//     }
  
//   });