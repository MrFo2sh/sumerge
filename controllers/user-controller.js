var config = require("../config")
var common = require('../helpers/common');
var User = require("../models/user");
var Company = require("../models/company");


exports.test = (req, res) =>{
    return res.sendStatus(200);
}


exports.signup = (req, res) =>{

    let {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        email,
        password
    } = req.body;

    if(!
        (firstName &&
        lastName &&
        dateOfBirth &&
        gender &&
        email &&
        password &&
        common.validEmail(email) &&
        common.validPassword(password))
    ) return res.sendStatus(400);

    User.findOne({email: email})
    .then(user =>{

        //user already exist
        if(user) return res.sendStatus(409); //conflict

        //register user
        user = {};
        user.fullName = firstName + " " + lastName;
        user.firstName = firstName;
        user.lastName = lastName;
        user.dateOfBirth = new Date(dateOfBirth);
        user.gender = gender;
        user.email = email;
        user.password = password;


        User.create(user)
        .then(user =>{
            return res.json({
                token: common.sign(user, "user"),
                user: common.secureUserRes(user)
            }) 
        })
        .catch(err =>{
            console.log("Internal server error while creating user at signup: \n",err,"\n\n");
            return res.sendStatus(500); //internal server error
        })
    })
    .catch(err =>{
        console.log("Internal server error while searching for user at signup: \n",err,"\n\n");
        return res.sendStatus(500); //internal server error
    })

}



exports.signin = (req, res) =>{

    let {
        email,
        password
    } = req.body;

    if(!
        (email &&
        password &&
        common.validEmail(email) &&
        common.validPassword(password))
    ) return res.sendStatus(400);

    User.findOne({email: email})
    .then(user =>{

        //user already exist
        if(!user) return res.sendStatus(404);

        user.comparePassword(password, function (err, isMatch) {
            if (err) return res.sendStatus(500);

            //wrong password
            if (!isMatch) return res.sendStatus(404);

            return res.json({
                token: common.sign(user, "user"),
                user: common.secureUserRes(user)
            }) 
        })

        
    })
    .catch(err =>{
        console.log("Internal server error while searching for user at signup: \n",err,"\n\n");
        return res.sendStatus(500); //internal server error
    })

}


exports.createCompany = (req, res) =>{

    let {
        email,
        name,
        type,
    } = req.body;

    if(!(
        email &&
        name &&
        type
    )) return res.sendStatus(400);

    let company = {};
    company.owner = req.user._id;
    company.email = email;
    company.name = name;
    company.type = type;

    Company.create(company)
    .then(company =>{

        User.findOneAndUpdate({_id: req.user._id}, 
            {$push: {companies: company._id}}
        )
        .then(()=>{
            return res.json({company: company});
        })
        .catch(err =>{
            console.log("Internal server error while adding company to user list: \n",err,"\n\n")
            return res.sendStatus(500);
        })
    })
    .catch(err =>{
        console.log("Internal server error while creating company: \n",err,"\n\n")
        return res.sendStatus(500);
    })

}


exports.getUser = (req, res) =>{
    let id = req.params.id;

    if(!id) return res.sendStatus(400);

    User.findById(id)
    .populate({
        path: "companies",
        model: "company",
        populate:{
            path: "boardMembers",
            model: "user"
        }
    })
    .then(user =>{
        return res.json({user: common.secureUserAndCompanies(user)})
    })
    .catch(err =>{
        console.log("Internal server error while getting user: \n",err,"\n\n")
        return res.sendStatus(500);
    })
}


exports.addBoard = (req, res) =>{
    let {
        companyId,
        boardId
    } = req.body;

    if(!(companyId && boardId)) return res.sendStatus(400);

    Company.findOneAndUpdate({owner: req.user._id, _id: companyId},
        {$push: {boardMembers: boardId}}
    )
    .then(() =>{
        return res.sendStatus(200);
    })
    .catch(err =>{
        console.log("Internal server error while adding board member to company: \n",err,"\n\n")
        return res.sendStatus(500);
    })
}