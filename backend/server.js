const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import All Routes
const authRoutes = require('./routes/authRoutes');
const bestJuiceRoutes = require('./routes/bestJuiceRoutes');
const menuRoutes = require('./routes/menuRoutes');
const servantRoutes = require('./routes/servantRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/best-juices', bestJuiceRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/servants', servantRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('Juice Bar Management API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});