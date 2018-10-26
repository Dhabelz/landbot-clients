const http = require('http');
const axios = require('axios');

const hostname = '127.0.0.1';
const port = 3000;

const apibase = "https://api.landbot.io/v1/customers/";
const apitoken = "Token 352476970f6e76b9913c8c09cf3618962e965465";

/*
Es connecta a l'API de landbot per actualitzar el camp indicat

id: identificar del client a editar
fd: camp que es vol editar
vl: nou valor del camp que es vol editar
*/
function APIUpdate(id, fd, vl){
  // Direcció de l'API
  let url = apibase + id + "/fields/" + fd + "/";
  return (axios.put(url,
    JSON.stringify({
      "type": "string",
      "extra": {},
      "value": vl,
    }),
    {headers: {
      "Content-Type": "application/json",
      "Authorization": apitoken,
    }
  }));
}

//Creació del servidor
const server = http.createServer((req, res) => {
  //Capçaleres necessàries
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
  switch(req.url){
    case '/customers':     //Gestionem la consulta de clients
      axios.get(apibase, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": apitoken,
        }
      }).then( response => {      //Comunicació amb èxit
        res.statusCode = 200;
        //Construïm les dades
        const info = {total: response.data.total,
          customers: response.data.customers.map((element) => {  //Per cada client recollim només les dades necessàries
            return {id: element.id,
              name: element.name,
              email: element.email,
            }
          })};
        res.end(JSON.stringify(info));       //Enviem les dades
      }).catch( error => {        //Error en la comunicació
        res.end(error.response.data.detail);     //Enviem els detalls de l'error
      });
      break;
    case '/update':       //Gestionem l'actualització d'un registre
      //Verifiquem el mètode
      if (req.method == 'PUT') {
        var body = '';
        //Verifiquem que la mida de les dades no sigui excessiva
        req.on('data', function (data) {
          body += data;
          if (body.length > 1e6)
            req.connection.destroy();
        });

        //Iniciem la modificació
        req.on('end', function () {
          //Preparem les dades
          let put = JSON.parse(body);
          //Cridem a la funció per actualitzar
          APIUpdate(put.id, put.fld, put.val)
          .then( response => {
            //Comunicació amb èxit
            res.statusCode = 200;
            res.end(JSON.stringify(response));
          }).catch( error => {
            //Error en la comunicació
            res.end(JSON.stringify(error));
          });
        });
      }
      break;
    default:
      //Gestionem accés a pàgines no existents
      res.statusCode = 404;
      res.end("Page not found");
  }

});

//Iniciem el servidor
server.listen(port, hostname, () => {
  console.log(`Servidor funcionant en https://${hostname}:${port}/`);
});
