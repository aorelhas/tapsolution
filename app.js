const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

// Import Routes
const userRoutes = require('./routes/user');

const app = express();

// DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connected');
  });

// Routes
app.use('/api', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
