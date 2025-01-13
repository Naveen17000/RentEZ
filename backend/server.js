const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

// Load environment variables
dotenv.config({ path: './config/.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Validate environment variables
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined');
  process.exit(1);
}

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',  // Local development for React
      'http://localhost:3001',  // Another local React frontend
      'https://rentez-2quq.onrender.com',  // Backend itself (if needed)
    ];

    // Allow all Vercel subdomains
    const isAllowedVercel = origin && origin.endsWith('.vercel.app');

    if (allowedOrigins.includes(origin) || isAllowedVercel || !origin) {
      // Allow requests with no origin (like mobile apps or curl requests)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

app.use((req, res, next) => { 
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// Serve static files
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    // Remove Cross-Origin-Resource-Policy header if it exists
    res.removeHeader('Cross-Origin-Resource-Policy');
    // You can set other headers here as needed
  }
}));
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));


// Define API routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const addressRoutes = require('./routes/addressRoutes');
const favoritesRoutes = require('./routes/favoriteRoutes');
const bankroutes = require('./routes/BankRoutes')
const personalDetailsRoutes = require('./routes/personalDetailsRoutes');
const adminRoutes = require('./routes/admin-route');
const dashboard = require('./routes/dashboardRoutes')
app.use('/api/products', productRoutes); // Keep this for product-related routes
app.use('/api/users', userRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/bank-details',bankroutes);
app.use('/api/personal-details', personalDetailsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api',dashboard);
// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the API!'); // Simple response to indicate server is running
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
