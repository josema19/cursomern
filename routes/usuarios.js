// Rutas para crear usuarios
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator');

// Crear un usuario
router.post('/',
    // Agregar validaciones usando express-validator
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe ser mínimo de 6 caracteres').isLength({ min: 6 })
    ],
    usuarioController.crearUsuario
);

// Exportar rutas
module.exports = router;
