var soap = require('soap');
//var url = 'https://portal.vs.unimed.com.br:9001/ws/WSINFORMACOESPLANO.apw?WSDL';
var url = 'http://srv-ti-dev01:9494/ws/WSINFORMACOESPLANO.apw?WSDL';
var args = {
    CCODIGOCLI: '0055000100000100',
    CTIPOCLI: 'F',
};            
soap.createClient(url, function(err, client) {
    console.log(err);
    client.COBRANCAS_CLI(args, function(err, result) {
        console.log(result);
        console.log("entrou");
        for (var i=0; i < result.COBRANCAS_CLIRESULT.LISTARETORNOCOB.length; i++){
            //console.log(JSON.stringify(result.COBRANCAS_CLIRESULT.LISTARETORNOCOB[i].CRECNOE1));
            if (result.COBRANCAS_CLIRESULT.LISTARETORNOCOB[i].CSTATUS=='EM ABERTO') {
                console.log(result.COBRANCAS_CLIRESULT.LISTARETORNOCOB[i].CRECNOE1);

            }
        }
    });
});