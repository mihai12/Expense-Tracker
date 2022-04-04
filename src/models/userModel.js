const mongoose = require("mongoose");
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { use } = require("bcrypt/promises");

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            index: { unique: true},
            minlength: 6
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: { unique: true }
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            trim: true,
        },
        verified: {
            type: Boolean,
            default: true, //verification disabled
        },
        //verify new user
        //unlike resset password token, no harm done if simple verification token is stolen by eavesdropping
        verificationToken: {
            type: String,
            required: true,
            index: true,
            unique: true,
            default: () => crypto.randomBytes(20).toString("hex"),
        }
    }
);

//generate pass with bcrypt, 12 passes
async function generateHash(password) {
    return bcrypt.hash(password, 12);

}

//mongoose pre-save funcion to generate hashed password
userSchema.pre('save', function preSave(next) {
    const user = this;
    if(user.isModified('password')) {
        return generateHash(user.password)
        .then((hash) => {
            user.password = hash;
            return next();
        }).catch((error) => {
            return next(error)
        });
    }
    return next();
});

//compare hashed password with user input
userSchema.methods.comparePassword = async function comparePassword(passToCompare) {
    return bcrypt.compare(passToCompare, this.password);
}

module.exports = mongoose.model('User', userSchema);