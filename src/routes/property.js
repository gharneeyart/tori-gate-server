import { Router } from "express";
import { createProperty, deleteProperty, getAllProperties, getLandlordProperties, getPropertyById, updatePropertyAvailability } from "../controllers/property.js";
import { isLoggedIn, requirePermissions } from "../middlewares/auth.js";
import upload from "../helpers/multer.js";
const router = Router();
// landlord
router.post("/", isLoggedIn, requirePermissions("landlord"),upload.array('images',6), createProperty);
router.get("/landlord", isLoggedIn, requirePermissions("landlord"), getLandlordProperties);
router.patch("/landlord/:propertyId", isLoggedIn, requirePermissions("landlord"), updatePropertyAvailability);
router.get("/", isLoggedIn, getAllProperties);
router.get("/:propertyId", isLoggedIn, getPropertyById);
router.delete("/landlord/:propertyId", isLoggedIn, requirePermissions("landlord"), deleteProperty);


export default router;