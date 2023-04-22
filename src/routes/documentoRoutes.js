const express = require('express');
const router = express.Router();
const documentoController = require('../Controllers/documentoControllers');

router.get('/crone', documentoController.cronePY);
router.post('/pedidosya',documentoController.registrarPedido)
router.post('/Rappi',documentoController.registrarPedido)
router.get('/croneRappi',documentoController.croneRappi)
router.post('/confirmarOrdenUnicaRappi',documentoController.confirmarOrdenUnicaRappi)



module.exports = router;


