import express from 'express';
import { loginUser, registerUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay, paymentStripe, verifyStripe, addReview, downloadPrescription } from '../controllers/userController.js';
import upload from '../middleware/multer.js';
import authUser from '../middleware/authUser.js';
import validateRequest from '../middleware/validateRequest.js';
import { registerSchema, loginSchema, updateProfileSchema, reviewSchema } from '../validations/userValidation.js';

const userRouter = express.Router();

userRouter.post("/register", validateRequest(registerSchema), registerUser)
userRouter.post("/login", validateRequest(loginSchema), loginUser)

userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update-profile", upload.single('image'), authUser, validateRequest(updateProfileSchema), updateProfile)
userRouter.post("/book-appointment", authUser, bookAppointment)
userRouter.get("/appointments", authUser, listAppointment)
userRouter.post("/cancel-appointment", authUser, cancelAppointment)
userRouter.post("/payment-razorpay", authUser, paymentRazorpay)
userRouter.post("/verifyRazorpay", authUser, verifyRazorpay)
userRouter.post("/payment-stripe", authUser, paymentStripe)
userRouter.post("/verifyStripe", authUser, verifyStripe)
userRouter.post("/add-review", authUser, validateRequest(reviewSchema), addReview)
userRouter.post("/download-prescription/:appointmentId", authUser, downloadPrescription)

export default userRouter;