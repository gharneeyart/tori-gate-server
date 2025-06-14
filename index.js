import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDB } from './src/configs/db.config.js';
import userRoutes from './src/routes/user.js'
import propertyRoutes from './src/routes/property.js';  

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT

app.get('/', (req, res) => {
    return res.send('Welcome to tori gate server');
});

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/property', propertyRoutes);
  
  // Start the server
  app.listen(port, () => {
    connectDB();
    console.log(`Tori Gate Server listening on ${port}`);
  });