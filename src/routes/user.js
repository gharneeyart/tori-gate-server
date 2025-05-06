import { Router } from "express";
import { login, register, verifyEmail, forgotPassword, resetPassword } from "../controllers/auth.js";
import { deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/user.js";
import { isLoggedIn } from "../middlewares/auth.js";
import upload from "../helpers/multer.js";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById); 
router.patch("/users/:id", isLoggedIn, upload.single('image'), updateUser);
router.delete("/users/:userId", deleteUser);

export default router;

