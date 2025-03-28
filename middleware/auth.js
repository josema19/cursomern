const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Leer el token del Header
    const token = req.header('x-auth-token');

    // Revisar si no hay Token
    if (!token) {
        res.status(401).json({msg: 'No hay token, permiso no válido'});
    }

    // Validar el Token
    try {
        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario;
        next();
    } catch (error) {
        res.status(401).json({msg: 'Token no válido'})
    }

};