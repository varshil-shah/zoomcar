const router = require("express").Router();
const carController = require("../controllers/car.controller");
const authController = require("../controllers/auth.controller");

router.use(authController.protect);

router.post("/create", carController.createCar);
router.get("/get-rides", carController.getRide);

router.use(authController.restrictTo("admin"));

router.get("/update-rent-history", carController.updateRentHistory);

module.exports = router;
