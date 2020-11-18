import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/**
 * MongoDB connection
 * Need to set the uri in the .env file
 */
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser : true, useCreateIndex : true, useUnifiedTopology : true});

const connection = mongoose.connection;
connection.once ('open', () => {
    console.log("MongoDB database connection established successfully");
})

/**
 *  Routes setup
 */
import userRoutes from './routes/users.route.js'

app.use('/users', userRoutes);

/**
 * app listen to port
 */
app.listen(port , () => {
    console.log(`server is running on port : ${port}`);
})