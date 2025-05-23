const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');

router.get('/', cursoController.getAllCursos);
router.delete('/:id', cursoController.deleteCurso);

module.exports = router; 