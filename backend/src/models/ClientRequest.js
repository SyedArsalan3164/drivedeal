const mongoose = require('mongoose');

const clientRequestSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    phone: { type: String, required: true },
    carId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true 
    },
    vehicleBrand: { type: String },
    vehicleModel: { type: String },
    vehiclePrice: { type: Number },
    visitDate: { type: String, required: true },
    message: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['Pending', 'Contacted'], 
      default: 'Pending' 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ClientRequest', clientRequestSchema);
