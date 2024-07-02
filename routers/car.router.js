const router = require("express").Router();
const carController = require("../controllers/car.controller");
const authController = require("../controllers/auth.controller");

router.use(authController.protect);

router.post("/create", carController.createCar);
router.get("/get-rides", carController.getRide);

module.exports = router;
