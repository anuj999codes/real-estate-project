const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/propertiesController");

router.post("/", ctrl.createProperty);
router.get("/", ctrl.getAllProperties);
router.get("/:id", ctrl.getPropertyById);
router.put("/:id", ctrl.updateProperty);
router.delete("/:id", ctrl.deleteProperty);

module.exports = router;
