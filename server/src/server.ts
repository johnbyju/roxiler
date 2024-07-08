import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db';
import router from './routes';
import cors from 'cors'

dotenv.config();
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

const allowedOrigins = ['http://localhost:5173/']; 
app.use(cors({
  origin: function(origin, callback) {
    // Check if the origin is allowed
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));


// DB Connection
connectDB();

// Routes
app.use('/roxiler', router);

// Default route
app.get('/', (req, res) => {
    res.send('Hello World');
});

const Port = process.env.PORT || 5000;

app.listen(Port, () => {
    console.log(`Server is running on localhost:${Port}`);
});
