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
<<<<<<< HEAD
  origin: 'http://localhost:5173', // Deployment = Replace with your frontend URL ---------------------------
=======
  origin: 'https://66ad28bd0175d3aa355366d2--effervescent-pasca-6ae474.netlify.app', // Deployment = Replace with your frontend URL ---------------------------
>>>>>>> a24abbcb90230a72f214100f056ee77ecd461a68
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 


// Cloudinary-------------------
const uploadRoute = require('./routes/uploadRoute'); // Adjust the path as needed
app.use('/api', uploadRoute);



// Routes
const userRoute = require('./routes/userRoute');
const recipeRoute = require('./routes/recipeRoute');
app.use('/api/user', userRoute);
app.use('/api/recipes', recipeRoute);


const adminRoute = require('./routes/adminRoute')
app.use('/api/admin',adminRoute)

app.get('/', (req, res) => {
  res.send('Hello 3');
});

app.listen(port, () => console.log(`Node server started at port ${port}`));