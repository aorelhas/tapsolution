const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect DataBase
connectDB();

// MiddleWare Body-Parser
app.use(express.json({ extennded: false }));

app.get('/', (req, res) => res.send('API Running..'));

// Routes Definition
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
