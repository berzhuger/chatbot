// Example 3: maintains state.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var prompt = require('prompt-sync')();
var request = require("request");
var soap = require('soap');
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
require('dotenv').config({silent: true});
// Set up Conversation service wrapper.
var conversation = new ConversationV1({
  username: process.env.CONVERSATION_USERNAME, // replace with service username
  password: process.env.CONVERSATION_PASSWORD, // replace with service password
  version_date: '2017-05-26'
});

//declaracao da linguagem natural
// var NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
// var natural_language_understanding = new NaturalLanguageUnderstandingV1({
//   'username': '{username}',
//   'password': '{password}',
//   'version': '2018-03-16'
// });

global.respostaAlterada = '';
global.dados = [];
global.entrou = false;
var workspace_id = '1ab364d9-778f-4036-9deb-1a5888ba8ebd'; // replace with workspace ID
//var workspace_id = '073b16c5-6446-439c-95f9-32e425b195c2'; // replace with workspace ID

// Start conversation with empty message.
conversation.message({
  workspace_id: workspace_id,
  }, processResponse);

// Process the conversation response.
function processResponse(err, response) {
    if (err) {
        console.error(err); // something went wrong
        return;
    }

    if(response.context.acao=='buscaBoletos' && response.context.hasOwnProperty('carteiraUnimed') && entrou==false) {
        entrou = true;
        console.log(response.context);        
        //buscaBoletos(response).then()
        var dataPromise = getData(response.context.carteiraUnimed);
        //.then(JSON.parse, errHandler)
        dataPromise.then(function(result) {
            response.context.rectoArray = result;
                console.log("result: "+result);
                return response;
            }, errHandler)
        .then(mostraResposta(response))
        .then(w_conversation(response, newMessageFromUser), errHandler)
    } else {
        mostraResposta(response);
    // Prompt for the next round of input.
    var newMessageFromUser = prompt('>> ');
    // Send back the context to maintain state.
    w_conversation(response, newMessageFromUser);
    }

}

function mostraResposta(response) {
    // Display the output from dialog, if any.
    for (i = 0; i < response.output.text.length; i++) {
        if (response.output.text.length != 0) {
            console.log(response.output.text[i]);
        }
    }       
}
function w_conversation(response, newMessageFromUser) {
    conversation.message({
        workspace_id: workspace_id,
        input: { text: newMessageFromUser },
        context : response.context,
        }, processResponse)
}

// function w_conversation(response, newMessageFromUser) {
//     conversation.message({
//         workspace_id: workspace_id,
//         input: { text: newMessageFromUser },
//         context : response.context,
//         }, processResponse)
// }

// var buscaBoletos = function(response) {
//     return new Promise(function (resolve, reject) {
//         soap.createClient(url, function(err, client) {
//             client.COBRANCAS_CLI(args, function(err, result) {
//                 for (var i=0; i < result.COBRANCAS_CLIRESULT.LISTARETORNOCOB.length; i++){
//                     if (result.COBRANCAS_CLIRESULT.LISTARETORNOCOB[i].CSTATUS=='EM ABERTO') {
//                         dados.push(JSON.stringify(result.COBRANCAS_CLIRESULT.LISTARETORNOCOB[i].CRECNOE1));
//                         console.log(JSON.stringify(result.COBRANCAS_CLIRESULT.LISTARETORNOCOB[i].CRECNOE1));
//                     }
//                 }
//                 resolve(dados);
//             });
//         })
//     })
// }





var userDetails;

function getData(numeroCarteira) {
    var dados = [];
    // Setting URL and headers for request
    var url = 'https://portal.vs.unimed.com.br:9001/ws/WSINFORMACOESPLANO.apw?WSDL';
    var args = {
        CCODIGOCLI: numeroCarteira,
        CTIPOCLI: 'F',
        };  
    // Return new promise 
    return new Promise(function(resolve, reject) {
        soap.createClient(url, function(err, client) {
            client.COBRANCAS_CLI(args, function(err, result) {
                for (var i=0; i < result.COBRANCAS_CLIRESULT.LISTARETORNOCOB.length; i++){
                    if (result.COBRANCAS_CLIRESULT.LISTARETORNOCOB[i].CSTATUS=='EM ABERTO') {
                        dados.push(JSON.stringify(result.COBRANCAS_CLIRESULT.LISTARETORNOCOB[i].CRECNOE1));
                        console.log(JSON.stringify(result.COBRANCAS_CLIRESULT.LISTARETORNOCOB[i].CRECNOE1));
                    }
                }
            });
            if (err) {
                reject(err);
            } else {
                resolve(dados);
            }
        })
    })
}

var errHandler = function(err) {
    console.log(err);
}

// function main() {
//     var userProfileURL = "https://api.github.com/users/narenaryan";
//     var dataPromise = getData(userProfileURL);
//     // Get user details after that get followers from URL
//     dataPromise.then(JSON.parse, errHandler)
//                .then(function(result) {
//                     userDetails = result;
//                     // Do one more async operation here
//                     var anotherPromise = getData(userDetails.followers_url).then(JSON.parse);
//                     return anotherPromise;
//                 }, errHandler)
//                 .then(function(data) {
//                     console.log(data)
//                 }, errHandler);
// }


// main();

