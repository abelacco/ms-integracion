const express = require('express');
const router = express.Router();
const datosController = require('../Controllers/datos.Controller');

router.get('/listaInfoLocal', datosController.obtenerListaInfoLocal);
router.post('/busquedaPedidos', datosController.obtenerPedidos);


module.exports = router;