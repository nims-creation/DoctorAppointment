import express from "express"
import cors from 'cors'
import 'dotenv/config'
import http from 'http'
import { Server } from 'socket.io'
import messageModel from './models/messageModel.js'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler.js';

// app config
const app = express()
const port = process.env.PORT || 4000
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

connectDB()
connectCloudinary()

// Socket.io logic
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on("send_message", async (data) => {
        try {
            // Save to DB
            const newMessage = new messageModel({
                appointmentId: data.room, // room is appointmentId
                sender: data.sender, // 'user' or 'doctor'
                text: data.text,
                timestamp: Date.now()
            });
            await newMessage.save();
            
            // Broadcast to others in the room
            socket.to(data.room).emit("receive_message", data);
        } catch (error) {
            console.error("Error saving message", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// middlewares
app.use(helmet());
app.use(express.json())
app.use(cors())
app.use(mongoSanitize());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

// Global Error Handler
app.use(errorHandler);

server.listen(port, () => console.log(`Server started on PORT:${port}`))