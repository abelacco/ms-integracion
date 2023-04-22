const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require("cors");


// Conexion DB
require('./src/config/db')

// Configuración del middleware body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Utilizar morgan para registrar las solicitudes
app.use(morgan('tiny'));

// Configuración cors
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//     next();
//   });

app.use(cors());

// Importación de las rutas
require('./src/routes/routes')(app);

module.exports = app;
