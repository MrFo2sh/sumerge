var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
var userSchema = new Schema({
    email:{
        type:String,
        match: /^\S+@\S+\.\S+$/,
        unique: true,
        trim: true,
        lowercase: true
    },
    fullName :{
        type:String
    },
    firstName :{
        type:String
    },
    lastName :{
        type:String
    },
    dateOfBirth:{
        type: Date
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'empty'],
        default: 'empty'
    },
    password:{
        type:String
    },
    companies: [{
        type: Schema.ObjectId, 
        ref: 'company'
    }]
},
{
  timestamps: true
});

userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var user = mongoose.model('user', userSchema);

module.exports = user;

