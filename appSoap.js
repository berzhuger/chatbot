process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
 var soap = require('soap');
// //var url = 'https://portal.vs.unimed.com.br:9001/ws/WSINFORMACOESPLANO.apw?WSDL';
// var url = 'http://srv-ti-dev01:9494/ws/WSINFORMACOESPLANO.apw?WSDL';
// var args = {
//     CCODIGOCLI: '0055000100000100',
//     CTIPOCLI: 'F',
// };            
// soap.createClient(url, function(err, client) {
//     console.log(err);
//     client.COBRANCAS_CLI(args, function(err, result) {
//         console.log(result);
//         console.log("entrou");
//         for (var i=0; i < result.COBRANCAS_CLIRESULT.LISTARETORNOCOB.length; i++){
//             //console.log(JSON.stringify(result.COBRANCAS_CLIRESULT.LISTARETORNOCOB[i].CRECNOE1));
//             if (result.COBRANCAS_CLIRESULT.LISTARETORNOCOB[i].CSTATUS=='EM ABERTO') {
//                 console.log(result.COBRANCAS_CLIRESULT.LISTARETORNOCOB[i].CRECNOE1);

//             }
//         }
//     });
// });
function teste() {
    var url = 'https://portal.vs.unimed.com.br:9001/ws/WSINFORMACOESPLANO.apw?WSDL';
    var args = {
        //00555300002052005
        //00556200100506000
        //00556200100506000
        //CCODIGOCLI: '0055000100000100',
        //codigo que tem dados em HML --> 0055000100000100
        CCODIGOCLI: '00556200100506000',
        CTIPOCLI: 'F',
    };            
    // var args = {
    //     StockSymbol: '00556200100506000',
    //     LicenseKey: 'F',
    //     };
    dados = [];
    soap.createClient(url, function(err, client) {
        client.COBRANCAS_CLI(args, function(err, result) {
            for (var i=0; i < result.COBRANCAS_CLIRESULT.LISTARETORNOCOB.length; i++){
                if (result.COBRANCAS_CLIRESULT.LISTARETORNOCOB[i].CSTATUS=='EM ABERTO') {
                    dados.push(result.COBRANCAS_CLIRESULT.LISTARETORNOCOB[i]);
                    console.log(JSON.stringify(result.COBRANCAS_CLIRESULT.LISTARETORNOCOB[i]));
                    console.log(dados[0].CDTEMISSAO);
                    console.log(dados[0].CVALOR);
                }
            }
        });        
            //console.log(result.COBRANCAS_CLIRESPONSE);
            //console.log("entrou");
            //for (var i=0; i < result.COBRANCAS_CLIRESULT.LISTARETORNOCOB.length; i++){
                //if (result.COBRANCAS_CLIRESULT.LISTARETORNOCOB[i].CSTATUS=='EM ABERTO') {
                    //dados.push(JSON.stringify(result.COBRANCAS_CLIRESULT.LISTARETORNOCOB[i].CRECNOE1));
                    //console.log(JSON.stringify(result));
                    //console.log(JSON.stringify(result.COBRANCAS_CLIRESULT.LISTARETORNOCOB[i].CRECNOE1));
                    //console.log(result.COBRANCAS_CLIRESULT.LISTARETORNOCOB[i].CRECNOE1);
                //}
            //}         
            //response.output.text[0].replace('__boleto__', dados);
        // for (i = 0; i < response.output.text.length; i++) {
            //    if (response.output.text.length != 0) {
            //       console.log(response.output.text[i]);
            //  }
            //}                    
            //console.log(dados);
            //response.output.text.push("Foi localizado " +dados.length + " boletos, qual gostaria de emitir a segunda via?")
            //console.log(response);
    });
    // });
 }
teste();