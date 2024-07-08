import mongoose from "mongoose";

const apiDataSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    dateOfSale: { type: Date, required: true },
    sold: { type: Boolean, required: true },
    category: { type: String, required: true },
  
})

export const apiData = mongoose.model('apiData', apiDataSchema) 