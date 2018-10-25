/*
  Component que representa el popup que permet l'edició del client
*/
import React from "react";
import PropTypes from "prop-types";
const ClientPopUp = ({ name, email, display, onBlur, onClick, close }) => (
  <div className="edit-popup" data-open={display}>
    <div className="edit-body data-close" >
      <div className="edit-close" onClick={close}>X</div>
      <div className="edit-fields">
        <label>Nombre: <input type="text" id="edit-field-name" defaultValue={name} onBlur={(e) => {onBlur("name", e.target.value)}}/> </label>
        <label>EMail: <input type="email" id="edit-field-email" defaultValue={email} onBlur={(e) => {onBlur("email", e.target.value)}}/> </label>
        <button type="button" id="bUpdate" onClick={onClick}>Guardar</button>
      </div>
    </div>
  </div>
);

ClientPopUp.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  display: PropTypes.bool.isRequired,
  onBlur: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};
export default ClientPopUp;
