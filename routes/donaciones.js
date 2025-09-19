const express = require('express');
const router = express.Router();
const donacionesController = require('../controllers/donacionesController');

router.get('/', donacionesController.getDonaciones);
router.post('/', donacionesController.createDonacion);
router.post('/pedir', donacionesController.asignarQuienPide);
router.post('/entregardonacion', donacionesController.asignarQuienRecibe);
router.post('/entregado', donacionesController.actualizarEntregado);

module.exports = router;