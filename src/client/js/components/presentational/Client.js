/*
  Component que representa un dels clients de la llista
*/
import React from "react";
import PropTypes from "prop-types";
const Client = ({ name, email, union, idcli, onClick }) => (
  <li className="client-li" idcli={idcli} onClick={onClick}>
    {name}{union}{email}
  </li>
);
Client.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  union: PropTypes.string.isRequired,
  idcli: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
};
export default Client;
