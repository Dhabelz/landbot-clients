import React, { Component } from "react";
import ReactDOM from "react-dom";
import Client from "../presentational/Client";
import ClientPopUp from "../presentational/ClientPopUp";
const axios = require('axios');
class ClientList extends Component {
  constructor() {
    super();
    /*
      total: nombre de clients
      customers: taula de clients
      selected: client seleccionat en el popup
      edit: indica si el popup esta actiu
      changes: modificacions realitzades
    */
    this.state = {total: 0, customers: [], selected: 0, edit: false, changes: {}};
    fetch("http://127.0.0.1:3000/customers", { // Crida API
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        mode: "cors",
    }).then((response) => { // Convertim la resposta en objecte
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Could not reach the API: " + response.statusText);
        }
    }).then((data) => { // tractem les dades retornades
      let newState = this.state;
      newState.total = data.total;
      newState.customers = data.customers;
      this.setState(newState);
    }).catch((error) => {
        console.log(error);
    });
  }
  render() {
    // Dades del client seleccionat
    const name = this.state.selected<this.state.total?this.state.customers[this.state.selected].name:"";
    const email = this.state.selected<this.state.total?this.state.customers[this.state.selected].email:"";
    return (
      <div>
        <h1>Listado clientes ({this.state.total})</h1>
        <ul>
          {this.state.customers.map((elem, i) => {
            return <Client name={elem.name} email={elem.email } union=": " idcli={i} key={i} onClick={(e) => this.editClient(i,e)}/>;
          })}
        </ul>
        <ClientPopUp name={name} email={email} display={this.state.edit}
          onBlur={(f, v) => this.changeField(f, v)}  onClick={(e) => this.updateClient()}
          close={this.closeClient.bind(this)}
        />
      </div>
    );
  }

  /*
    Obre el popup per editar el client
    i: index del client que es vol editar
    e: informació de l'esdeveniment
  */
  editClient (i,e){
    //verifiquem
    const sel = i<this.state.total?i:0;

    this.setState({selected: sel, edit: true});
  }

  /*
    Tanquem el popup
  */
  closeClient (){
    this.setState({edit: false});
  }

  /*
    Elimina a afegeix canvis a realitzar segons sigui necessari
    field: camp modificat
    value: nou valor del camp
  */
  changeField (field, value){
    const customers = this.state.customers;
    const changes = this.state.changes;


    if (customers[this.state.selected][field] === value){
      delete changes[field];
    }else{
      changes[field] = value;
      this.setState({changes: changes});
    }
  }

  /*
    Guarda els canvis realitzats a l'API de landbot
  */
  updateClient (){
    const state = this.state;
    const changes = state.changes;
    const i = state.selected;

    // recorrem tots els canvis fets
    for (let field in changes) {
      if (changes.hasOwnProperty(field)) {
        //Cridem la API
        this.APIUpdate(state.customers[i].id, field, changes[field])
        .then((response) => {
          //Actualitzem les dades del component amb les dades guardades
          let customers = this.state.customers;
          customers[i][field] = changes[field];
          // Eliminem el canvi guardat
          delete changes[field];
          this.setState({customers: customers, changes: changes});
        }).catch(function(error){
          console.log(error);
        });;
      }
    }
  }

  /*
    Crida a la API per actualitzar el camp

    id: identificar del client a editar
    fd: camp que es vol editar
    vl: nou valor del camp que es vol editar
  */
  APIUpdate(id, fd, vl){
    let url = "http://127.0.0.1:3000/update";
    return fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "id": id,
        "fld": fd,
        "val": vl
      }),
      mode: "cors",
    });
  }
}
export default ClientList;
const wrapper = document.getElementById("client-list");
wrapper ? ReactDOM.render(<ClientList />, wrapper) : false;
