import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import colors from 'colors'

dotenv.config()

const app = express()

if(process.env.NODE_ENV === 'development')
{
    app.use(morgan('dev'))
}

app.get('/', (req, res) => {
  res.send('API Running...');
});

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server Running in ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold))