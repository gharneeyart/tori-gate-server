import mongoose from 'mongoose';

const { Schema } = mongoose;

const PropertySchema = new Schema(
    {
        title:{
            type: String,
            required: true,
            trim: true
        },
        description:{
            type: String,
            required: true
        },
        price:{
            type: Number,
            required: true,
            min: 0
        },
        location:{
            type: String,
            required: true
        },
        bedroom:{
            type: Number,
            required: true,
            min: 0
        },
        livingRoom:{
            type: Number,
            required: true,
            min: 0
        },
        kitchen:{
            type: Number,
            required: true,
            min: 0
        },
        toilet:{
            type: Number,
            required: true,
            min: 0
        },
        paymentPeriod:{
            type: String,
            enum: ['monthly', 'yearly', 'weekly'],
            required: true
        },
        images: {
            type: [String]
        },
        availability:{
            type: String,
            enum: ["rented", "available"],
            default: "available"
        },
        landlord: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
    },
    {timestamps: true}
);
export default mongoose.model('Property', PropertySchema);