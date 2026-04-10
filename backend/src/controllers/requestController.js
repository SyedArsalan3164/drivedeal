const ClientRequest = require('../models/ClientRequest');
const Car = require('../models/Car');

// @desc    Create a new client request (Booking/Inquiry)
// @route   POST /api/requests
// @access  Public
const createRequest = async (req, res) => {
  try {
    const { clientName, phone, carId, visitDate, message } = req.body;

    if (!clientName || !phone || !carId || !visitDate || !message) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const car = await Car.findById(carId);

    const request = new ClientRequest({
      clientName,
      phone,
      carId,
      vehicleBrand: car ? car.brand : 'Unknown',
      vehicleModel: car ? car.model : 'Unknown',
      vehiclePrice: car ? car.price : 0,
      visitDate,
      message,
      status: 'Pending'
    });

    const createdRequest = await request.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all client requests
// @route   GET /api/requests
// @access  Private/Admin
const getRequests = async (req, res) => {
  try {
    // Populate the related car information
    const requests = await ClientRequest.find({}).populate('carId', 'brand model year price images');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update request status
// @route   PUT /api/requests/:id/status
// @access  Private/Admin
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Status must be either 'Pending' or 'Contacted'
    if (status !== 'Pending' && status !== 'Contacted') {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await ClientRequest.findById(req.params.id);

    if (request) {
      request.status = status;
      const updatedRequest = await request.save();
      res.json(updatedRequest);
    } else {
      res.status(404).json({ message: 'Request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRequest,
  getRequests,
  updateRequestStatus
};
