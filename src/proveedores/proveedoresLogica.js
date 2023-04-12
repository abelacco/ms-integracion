const axios = require("axios");
const URL_RAPPI = require("../config/constantes").URL_RAPPI;

async function obtenerStoreId (json,proveedor)  {

    switch (proveedor) {
        case 'pedidosya':
          console.log("Proveedor --> Se utiliza pedidosya");
          const storeIdPY = json.platformRestaurant.id
          return  storeIdPY
        case 'Rappi':
          console.log("Se utiliza rappi");
          const storeIdRappi = json.store.internal_id
          return  storeIdRappi
        default:
          console.log(" no reconocido");
          break;
      }
}

async function getToken(infoLocal) {
  let payload = {
    client_id: infoLocal.clave_publica,
    client_secret: infoLocal.clave_privada,
    audience: infoLocal.audience,
    grant_type: "client_credentials"
  };

  // if (infoLocal.desarrollo && infoLocal.desarrollo == '1') {
  //       payload.client_id = "sh6ZWwaPAvsWoZcAHKbEXZPuAw6jcSaI",
  //       payload.client_secret = "YchhrRsRQxoA0KWA447j8p-6Ls5BHcWkqaIzGdP96AJ0v1YWVQLBKlQhmTs6HHpq",
  //       payload.audience = "https://int-public-api-v2/api"
  // }  

  let urlAuth = getAuthDomain(infoLocal)

  try {
      const response = await axios.post(`https://${urlAuth}/oauth/token`, payload, {
          headers: {
              'Content-Type': 'application/json'
          }
      });
      return response.data;
  } catch (error) {

      // Aquí puedes manejar el error, por ejemplo, enviando un mensaje de error.
      console.error('Error al obtener el token:', error.message);
  }

  return null;
}

 function getDomain(infoLocal) {

  if (infoLocal.desarrollo && infoLocal.desarrollo == '1') {
    return URL_RAPPI.API_RAPPI_DEV;
  }
  return URL_RAPPI.API_RAPPI_PROD;
}

 function getAuthDomain(infoLocal) {
  if (infoLocal.desarrollo && infoLocal.desarrollo == '1') {
    return URL_RAPPI.API_RAPPI_AUTH_DEV;
  } else {
    return URL_RAPPI.API_RAPPI_AUTH_PROD;
  }
}




module.exports = {
  obtenerStoreId,
  getToken,
  getDomain,
  getAuthDomain
}

