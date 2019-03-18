var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var companySchema = new Schema({
    owner: {
        type: Schema.ObjectId, 
        ref: 'user'
    },
    email:{
        type:String,
        match: /^\S+@\S+\.\S+$/,
        unique: true,
        trim: true,
        lowercase: true
    },
    name: {
        type:String,
        unique: true
    },
    type: {
        type: String,
        enum: ['ssc', 'spc']
    },
    boardMembers: [{
        type: Schema.ObjectId, 
        ref: 'user'
    }]
},
{
  timestamps: true
});


var company = mongoose.model('company', companySchema);

module.exports = company;

