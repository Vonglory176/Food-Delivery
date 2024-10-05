import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    demo: {
        type: Boolean,
        default: false
    }
}, {minimize:false}) // "This is used to prevent the schema from removing empty fields"

const adminModel = mongoose.models.Admin || mongoose.model("Admin", adminSchema)

export default adminModel
