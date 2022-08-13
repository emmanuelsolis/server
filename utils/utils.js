const jwt = require("jsonwebtoken");
//Para limpiar la respuesta de mongoose
exports.clearRes = (data) => {
    const {password, createdAt, updatedAt, __v, ...restData} = data;
    return restData;
}
// crear el  JSON WEB TOKEN
exports.createJWT = (user) => {
    //jwt.sign({valorEncriptar}, palabraSecreta, opcional:{tiempoExpiracion})
    // esto retrna => g637dhcm77348.736sfjfkg.1327284786
    return jwt.sign({
        userId: user._id,
        email: user.email,
        role:user.role,
        //username:user.username
    }, process.env.JWT_SECRET, {expiresIn: '24h'}).split('.');

}

