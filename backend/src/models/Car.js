const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    mileage: { type: Number, required: true },
    fuelType: { 
      type: String, 
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'], 
      required: true 
    },
    transmission: { 
      type: String, 
      enum: ['Manual', 'Automatic'], 
      required: true 
    },
    location: { type: String, required: true },
    images: { type: [String], required: true },
    description: { type: String },
    ownerHistory: { type: String, default: '1 Previous Owner' },
    status: { 
      type: String, 
      enum: ['Available', 'Sold'], 
      default: 'Available' 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Car', carSchema);
