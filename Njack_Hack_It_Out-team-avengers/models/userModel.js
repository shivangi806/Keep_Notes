const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail]
    },


    photo: {
        type: String
    },
    createPassword: {
        type: String,

        required: true,
        minlength: 6,
    },
    passwordConfirm: {
        type: String,
        validate: {
            validator: function (el) {
                return el === this.createPassword
            },
            message: 'the passwords are not same'
        }
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('createPassword')) return next()
    this.createPassword = await bcrypt.hash(this.createPassword, 12)
    this.passwordConfirm = undefined
    next()
})

userSchema.methods.correctPassword = (async function (candidatePassword, password) {
    return await bcrypt.compare(candidatePassword, password)
})
const User = mongoose.model('User', userSchema)
module.exports = User