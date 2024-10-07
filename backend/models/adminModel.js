import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema({
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
    demo: {
        type: Boolean,
        default: false
    }
}, {minimize:false}) // "This is used to prevent the schema from removing empty fields"

const adminModel = mongoose.models.Admin || mongoose.model("Admin", adminSchema)

export default adminModel
