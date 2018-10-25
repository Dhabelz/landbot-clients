const http = require('http');
const axios = require('axios');
const qs = require('querystring');

const hostname = '127.0.0.1';
const port = 3000;

/*
Es connecta a la API de landbot per actualitzar el camp indicat

id: identificar del client a editar
fd: camp que es vol editar
vl: nou valor del camp que es vol editar
*/
function APIUpdate(id, fd, vl){
  // direccio de la API
  let url = "https://api.landbot.io/v1/customers/" + id + "/fields/" + fd + "/";
  return (axios.put(url,
    JSON.stringify({
      "type": "string",
      "extra": {},
      "value": vl,
    }),
    {headers: {
      "Content-Type": "application/json",
      "Authorization": "Token 352476970f6e76b9913c8c09cf3618962e965465",
    }
  }));
}

//Creació del servidor
const server = http.createServer((req, res) => {
  //Capçaleres necessaries
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
  switch(req.url){
    case '/customers':                                                            //Gestionem la consulta de clients
      axios.get("https://api.landbot.io/v1/customers/", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Token 352476970f6e76b9913c8c09cf3618962e965465",
        }
      }).then( response => {                                                      //Comunicació amb exit
        res.statusCode = 200;
        const info = {total: response.data.total,                                 //Construim les dades
          customers: response.data.customers.map((element) => {
            return {id: element.id,
              name: element.name,
              email: element.email,
            }
          })};
        res.end(JSON.stringify(info));                                            //Enviem les dades
      }).catch( error => {                                                        //Error en la comunicació
        res.end(error.response.data.detail);                                      //Enviem els detalls de l'error
      });
      break;
    case '/update':                                                               //Gestionem l'actualització d'un registre
      if (req.method == 'PUT') {                                                  //Verifiquem el mètode
        var body = '';

        req.on('data', function (data) {                                          //Verifiquem que la mida de les dades
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
            //Comunicació amb exit
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
      //Gestionem acces a pàgines no existents
      res.statusCode = 404;
      res.end("Page not found");
  }

});

//Iniciem el servidor
server.listen(port, hostname, () => {
  console.log(`Server running at https://${hostname}:${port}/`);
});
