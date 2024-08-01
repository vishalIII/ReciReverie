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
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Authorization', 'Content-Type'], // Add other headers as needed
  credentials: true, // If you need to include cookies in the requests
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files

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
