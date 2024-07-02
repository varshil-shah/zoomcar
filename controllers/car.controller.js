const Car = require("../models/car.model");
const RentHistory = require("../models/rent-history.model");
const sequelize = require("../database/database");
const { Op } = require("sequelize");

const catchAsync = require("../utils/catch-async");
const AppError = require("../utils/app-error");

exports.createCar = catchAsync(async (req, res, next) => {
  console.log(req.body);
  console.log(req.user);

  const car = await Car.create({
    userId: req.user.dataValues.userId,
    category: req.body.category,
    model: req.body.model,
    numberPlate: req.body.number_plate,
    currentCity: req.body.current_city,
    rentPerHour: req.body.rent_per_hr,
  });

  if (!car) {
    return next(new AppError("Failed to create car", 500));
  }

  const rentHistories = req.body.rent_history || [];
  const rentalHistoryRecords = rentHistories.map((rentHistory) => ({
    carId: car.carId,
    origin: rentHistory.origin,
    destination: rentHistory.destination,
    rentalTime: rentHistory.rental_time,
    amount: rentHistory.amount,
  }));

  await RentHistory.bulkCreate(rentalHistoryRecords);

  res.status(200).json({
    status: "Car added successfully",
    car_id: car.carId,
    status_code: 200,
  });
});

exports.getRide = catchAsync(async (req, res, next) => {
  const { origin, destination, category, required_hours } = req.query;

  if (!origin || !destination || !category || !required_hours) {
    return next(new AppError("Please provide all the required fields", 400));
  }

  const cars = await Car.findAll({
    attributes: ["carId", "model", "numberPlate", "currentCity", "rentPerHour"],
    where: {
      currentCity: origin,
      category,
    },
    include: [
      {
        model: RentHistory,
        attributes: ["amount", "rentalTime"],
        where: {
          origin,
          destination,
          amount: {
            [Op.lte]: required_hours * sequelize.col("Cars.rentPerHour"),
          },
        },
      },
    ],
  });

  if (cars.length === 0) {
    return next(new AppError("No cars available", 404));
  }

  res.status(200).json({
    status: "Success",
    data: cars,
    status_code: 200,
  });
});

exports.rentCar = catchAsync(async (req, res, next) => {
  const { car_id, origin, destination, required_hours } = req.body;

  if (!car_id || !origin || !destination || !required_hours) {
    return next(new AppError("Please provide all the required fields", 400));
  }

  const car = await Car.findByPk(car_id);

  if (!car) {
    return next(new AppError("Car not found at moment!", 404));
  }

  const totalAmount = required_hours * car.rentPerHour;

  const rentHistory = await RentHistory.create({
    carId: car_id,
    origin,
    destination,
    rentalTime: new Date(),
    amount: totalAmount,
  });

  if (!rentHistory) {
    return next(new AppError("Failed to rent a car", 500));
  }

  res.status(200).json({
    status: "Car rented successfully",
    rent_id: rentHistory.rentHistoryId,
    status_code: 200,
  });
});

exports.updateRentHistory = catchAsync(async (req, res, next) => {
  const { car_id, ride_details } = req.body;

  if (!car_id || !ride_details) {
    return next(new AppError("Please provide all the required fields", 400));
  }

  const car = await Car.findByPk(car_id);

  if (!car) {
    return next(new AppError("Car not found at moment!", 404));
  }

  const rentHistory = await RentHistory.findOne({
    where: {
      carId: car_id,
    },
  });

  if (!rentHistory) {
    return next(new AppError("Rent history not found", 404));
  }

  rentHistory.origin = ride_details.origin;
  rentHistory.destination = ride_details.destination;
  rentHistory.rentalTime = new Date();

  await rentHistory.save();

  res.status(200).json({
    status: "Rent history updated successfully",
    rent_id: rentHistory.rentHistoryId,
    status_code: 200,
  });
});
