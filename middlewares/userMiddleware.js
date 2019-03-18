var common = require('../helpers/common');


exports.authenticate = (req, res, next) => {
    let token;
    if (req.headers && req.headers.authorization) {
        token = req.headers.authorization;
        let data = common.verifyJWT(token)
        if (
            data && 
            data.userType == "user"
        ) {
            req.user = data.user;
            return next();
        } else {
            return res.status(403).json({
                msg: "Invalid token"
            });
        }
    }else return res.sendStatus(403);
};