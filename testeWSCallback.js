//process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  // An object of options to indicate where to post to
//   var post_options = {
//       host: 'https://srv-hu-mv01',
//       port: '3443',
//       path: '/mvagendaintegra/rest/itemAgendamento/consultas/00550200006770006',
//       method: 'GET',
//       headers: {
//         'Token': 'MV',
//       }
//   };
// No third party module required: https is part of the Node.js API
// var request = require("request");
// var options = {
//     url : "https://srv-hu-mv01:3443/mvagendaintegra/rest/itemAgendamento/consultas/00550200006770006",
//     headers : {'Token': 'MV'},
//     method: 'GET',
// };

// // request.get(url, (error, response, body) => {
// //     //let json = JSON.parse(body);
// //     console.log(body);
// // });

// function callback(error, response, body) {
//     if (!error && response.statusCode == 200) {
//         console.log("entrou");
//         console.log(body);
//         var info = JSON.parse(body);
//         console.log(info);
//     }
//   }
  
//   request(options, callback);
//   console.log(options);
//   console.log("*******************************************");
//   console.log(request);
//   console.log(response);




// const request = require('request');

// const options = {  
//     url: 'https://srv-hu-mv01:3443/mvagendaintegra/rest/itemAgendamento/consultas/00550200006770006',
//     method: 'GET',
//     headers: {
//         'Token': 'MV'
//     }
// };

// request(options, function(err, res, body) {
//     console.log(options.headers);
//     console.log(options.method);
//     console.log(options.url);
//     console.log("teste de ");
//     console.log(body);
//     //let json = JSON.parse(body);
//     //console.log(json);
// });

// var soap = require('soap');
// var url = 'http://172.22.0.218:85/ws/WSMOBILESAUDE_BOLETOS.apw?WSDL';
// var args = {BOLETO_CHAVE: 'NFF050008   TIT'};
// soap.createClient(url, function(err, client) {
//     client.MyFunction(args, function(err, result) {
//         console.log(result);
//     });
// });



// var Request = require("request");

// Request.get({
//     "headers": { "content-type": "application/json",
//                  "Token": "mv", },
//     "url": "https://srv-hu-mv01:3443/mvagendaintegra/rest/itemAgendamento/consultas/00550200006770006",
//     "body": JSON.stringify({
//         'Token': 'MV'
//     })
// }, (error, response, body) => {
//     if(error) {
//         return console.dir(error);
//     }
//     console.dir(JSON.parse(body));
// });


// var http = require("http");
// var https = require("https");

// /**
//  * getJSON:  REST get request returning JSON object(s)
//  * @param options: http options object
//  * @param callback: callback to pass the results JSON object(s) back
//  */
// exports.getJSON = function(options, onResult)
// {
//     console.log("rest::getJSON");

//     var port = options.port == 3443 ? https : http;
//     var req = port.request(options, function(res)
//     {
//         var output = '';
//         console.log(options.host + ':' + res.statusCode);
//         res.setEncoding('utf8');

//         res.on('data', function (chunk) {
//             output += chunk;
//         });

//         res.on('end', function() {
//             var obj = JSON.parse(output);
//             onResult(res.statusCode, obj);
//         });
//     });

//     req.on('error', function(err) {
//         //res.send('error: ' + err.message);
//     });

//     req.end();
// };
// //https://srv-hu-mv01:3443/mvagendaintegra/rest/itemAgendamento/consultas/00550200006770006
// var options = {
//     host: 'https://srv-hu-mv01',
//     port: 443,
//     path: '/mvagendaintegra/rest/itemAgendamento/consultas/00550200006770006',
//     method: 'GET',
//     headers: {
//         'Content-Type': 'application/json',
//         'Token': 'MV'
//     }
// };

//caso precise de HTTPS - e nao tem o certificado SSL
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//npm install request --save
//var request = require("request");
var request = require('request-promise');
var Promise = require('bluebird');

// request({
//     url: "https://srv-hu-mv01:3443/mvagendaintegra/rest/paciente/obterPorNroCarteira/00550200006770006",
//     method: "GET",
//     headers: {
//         Token: "MV"
//     }
// }, function (error, response, body) {
//     if (!error) {
//         try {
//             console.log(body);
//             json = JSON.parse(body);
//                 console.log(json.nome);
//         } catch (error) {
//             console.log(error);
//             console.log('não foi possivel localizar os seus dadados, por favor verifique as informações');
//         }

//     }
// });
function setNome(nome) {
    this.nome = nome;
    console.log("print dentro da funcao :"+this.nome);
}
function getNome() {
    return this.nome;
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
var nome;
buscaInformacoes(function (data){
    nome = data.nome;
    setNome(nome);
    console.log("dentro da func "+data.nome);
});

// //console.log(a.json.nome[0]);
// function Pessoa(){

//     this.nome = '';

//     this.getNome = function(){

//         return this.nome;

//     }


// }

// let objPessoa = new Pessoa();
// objPessoa.getNome();
// console.log(objPesoa);



