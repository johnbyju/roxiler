import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();


export const connectDB = async () => {
  const db_uri = process.env.db_uri as string;
  try {
    await mongoose.connect(db_uri);
    console.log('DB Connected Successfully');
  } 
  catch (error) {
    console.error('Error while connecting to MongoDB:', error);
  }
};

