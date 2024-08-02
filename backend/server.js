const express = require('express');
const app = express();
require('dotenv').config();
const connectToMongo = require('./config/db');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

connectToMongo();

const corsOptions = {
  origin: ' https://66acd7d242913a4e06a1da57--effervescent-pasca-6ae474.netlify.app', // Deployment = Replace with your frontend URL ---------------------------
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
// Routes
const userRoute = require('./routes/userRoute');
const recipeRoute = require('./routes/recipeRoute');
const imageRoute = require('./routes/imageRoute')
app.use('/api/user', userRoute);
app.use('/api/recipes', recipeRoute);
app.use('/api/image',imageRoute)

const adminRoute = require('./routes/adminRoute')
app.use('/api/admin',adminRoute)

app.get('/', (req, res) => {
  res.send('Hello 3');
});

app.listen(port, () => console.log(`Node server started at port ${port}`));
