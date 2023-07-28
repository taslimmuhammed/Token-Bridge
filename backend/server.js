import express from 'express';
import {ethToBsc, bscToEth} from './Controller/minting.controller.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = 8085;
app.use(express.json());
app.use(cors());
// Route 1: Home page
app.get('/', (req, res) => {
    console.log("Welcome to the bridge");
    res.send('Welcome to the bridge');
});

// Route 2: About page
app.post('/bsttoeth', (req, res) => { 
    bscToEth(req, res)
});

// Route 3: Contact page
app.post('/ethtobsc', (req, res) => {
    ethToBsc(req, res)
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
