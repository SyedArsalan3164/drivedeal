const Car = require('../models/Car');
const Subscriber = require('../models/Subscriber');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
const getCars = async (req, res) => {
  try {
    const cars = await Car.find({});
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single car by id
// @route   GET /api/cars/:id
// @access  Public
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a car
// @route   POST /api/cars
// @access  Private/Admin
const createCar = async (req, res) => {
  try {
    const car = new Car({
      ...req.body, // spread all fields from request body (brand, model, price, etc.)
    });

    const createdCar = await car.save();

    // Broadcast email to all subscribers
    try {
      const subscribers = await Subscriber.find({});
      if (subscribers.length > 0) {
        const emailPromises = subscribers.map(sub => 
          sendEmail({
            email: sub.email,
            subject: `New Vehicle Alert: ${createdCar.brand} ${createdCar.model}`,
            message: `Checkout our new listing: ${createdCar.brand} ${createdCar.model} for ₹${createdCar.price.toLocaleString()}`,
            htmlMessage: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                  <h2 style="color: white; margin: 0;">New Vehicle Alert!</h2>
                </div>
                <div style="padding: 20px; background-color: #f8fafc;">
                  <h3 style="color: #1e293b; margin-top: 0;">Just Listed: ${createdCar.brand} ${createdCar.model}</h3>
                  <p style="color: #475569; line-height: 1.6;">We've just added a stunning new vehicle to our inventory. Log in to check out the details!</p>
                  
                  <div style="margin: 20px 0; padding: 15px; background-color: white; border-radius: 6px; border: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 5px 0;"><strong>Brand:</strong> ${createdCar.brand}</p>
                    <p style="margin: 0 0 5px 0;"><strong>Model:</strong> ${createdCar.model}</p>
                    <p style="margin: 0 0 5px 0;"><strong>Year:</strong> ${createdCar.year}</p>
                    <p style="margin: 0;"><strong>Asking Price:</strong> ₹${createdCar.price.toLocaleString()}</p>
                  </div>
                  
                  <p style="color: #475569; line-height: 1.6;">Visit DriveDeal to view photos and complete details.</p>
                  <br>
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="http://localhost:5000/api/newsletter/unsubscribe?email=${sub.email}" style="color: #64748b; font-size: 13px; text-decoration: underline;">Unsubscribe from DriveDeal Newsletter</a>
                  </div>
                </div>
              </div>
            `
          }).catch(err => console.error(`Failed to send email to ${sub.email}:`, err))
        );
        
        await Promise.allSettled(emailPromises);
      }
    } catch (broadcastError) {
      console.error('Newsletter broadcast failed:', broadcastError);
    }

    res.status(201).json(createdCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private/Admin
const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (car) {
      // Update fields if they exist in request, else keep original
      car.brand = req.body.brand || car.brand;
      car.model = req.body.model || car.model;
      car.year = req.body.year || car.year;
      car.price = req.body.price || car.price;
      car.mileage = req.body.mileage || car.mileage;
      car.fuelType = req.body.fuelType || car.fuelType;
      car.transmission = req.body.transmission || car.transmission;
      car.location = req.body.location || car.location;
      car.images = req.body.images || car.images;
      car.description = req.body.description || car.description;
      car.status = req.body.status || car.status;

      const updatedCar = await car.save();
      res.json(updatedCar);
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (car) {
      await car.deleteOne();
      res.json({ message: 'Car removed successfully' });
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};
