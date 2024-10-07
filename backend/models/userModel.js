import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: 3,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 50
    },
    cartData: {
        type: Object,
        default: {}
    }
}, {minimize:false}) // "This is used to prevent the schema from removing empty fields"

const userModel = mongoose.models.User || mongoose.model("User", userSchema)

export default userModel
