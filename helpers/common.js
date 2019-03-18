var jwt = require('jsonwebtoken');
var config = require("../config");


module.exports.sign = function (object, type) { 

    let data = {};
    data.userType = type;
    if(type == 'user')
        data.user = object;
    else if(type == 'admin')
        data.admin = object;
    else
        data.reviewer = object;

    return jwt.sign(data, config.tokenSecret, {
        expiresIn:  config.tokenExpire
    })
};

module.exports.verifyJWT = (token) => {
    try {
        return jwt.verify(token,
            config.tokenSecret);
    } catch (err) {
        return false;
    }
}


module.exports.validEmail = (email) =>{
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


module.exports.validPassword = (email) =>{
    return true;
}

module.exports.secureUserRes = (user) =>{
    return userRes(user);
}

module.exports.secureCompanyUserRes = (company) =>{
    return companyUserRes(company);
}

module.exports.secureUserAndCompanies = (user) =>{
    user = userRes(user);
    for(let company of user.companies)
        company = companyUserRes(company);
    return user;
}

function userRes(user){
    user.password = null;
    user.updatedAt = null;
    return user;
}

function companyUserRes(company){
    company.owner = userRes(company.owner);
    for(let boardMember of company.boardMembers)
        boardMember = userRes(boardMember);
    return company;
}