import { Router } from "express";
import { createProperty, getAllProperties, getLandlordProperties, getPropertyById, updatePropertyAvailability } from "../controllers/property.js";
import { isLoggedIn, requirePermissions } from "../middlewares/auth.js";
const router = Router();
// landlord
router.post("/", isLoggedIn, requirePermissions("landlord"), createProperty);
router.get("/landlord", isLoggedIn, requirePermissions("landlord"), getLandlordProperties);
router.patch("/landlord/:propertyId", isLoggedIn, requirePermissions("landlord"), updatePropertyAvailability);
router.get("/", isLoggedIn, getAllProperties);
router.get("/:propertyId", isLoggedIn, getPropertyById);


export default router;