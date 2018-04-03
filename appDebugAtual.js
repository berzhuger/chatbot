process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const { promisify } = require('util');
const request = promisify(require('request'));

async function main(params) {
  var options = {
        url: "https://201.20.146.14:3443/mvagendaintegra/rest/paciente/obterPorNroCarteira/00550200006770006",
        method: "GET",
        headers: {
            Token: "MV"
        }
    }
  let response;
  //const url = 'https://query.yahooapis.com/v1/public/yql?q=select item.condition from weather.forecast \
  //where woeid in (select woeid from geo.places(1) where text="' + location + '")&format=json'
    try {
        console.log("entrou");
        response = request({
            url: "https://201.20.146.14:3443/mvagendaintegra/rest/paciente/obterPorNroCarteira/00550200006770006",
            method: "GET",
            headers: {
                Token: "MV"
            }
        })
        //response = await request(url);
    } catch (error) {
        return Promise.reject({
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: { message: 'Error processing your request' },
        });
    }
  /** The response body contains temperature data in the following format
   *    { code: '28',
   *    date: 'Tue, 26 Dec 2017 12:00 PM EST',
   *    temp: '18',
   *    text: 'Mostly Cloudy' } }
   */
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.parse(response.body).query.results.channel.item.condition,
  };
}
exports.main = main;
main();