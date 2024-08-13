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
  origin: 'https://66bb6ed394302c376344fae7--celebrated-tanuki-cc8e6d.netlify.app', 
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
