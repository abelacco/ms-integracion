const express = require('express');
const router = express.Router();
const documentoController = require('../Controllers/documentoControllers');

router.get('/crone', documentoController.crone);
router.post('/pedidosya',documentoController.registrarPedido)
router.post('/Rappi',documentoController.registrarPedido)
router.post('/croneRappi',documentoController.croneRappi)
router.post('/crearintegracionpy',documentoController.crearIntegracion)
// router.post('/integracionpy',documentoController.registrarPedido)



module.exports = router;
