import mongoose from "mongoose"

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },    
})

// "This checks if the model 'Food' has already been registered in Mongoose. 
//  If it exists, it uses that existing model. 
//  If it does not exist, it creates a new model using the provided schema."

const foodModel = mongoose.models.Food || mongoose.model("Food", foodSchema)

export default foodModel