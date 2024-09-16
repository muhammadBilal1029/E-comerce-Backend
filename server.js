require('dotenv').config();
const express=require('express');
const cors = require('cors');
const authRoutes=require('./Routes/auth');
const AdminRoute =require('./Routes/Admin')
const mongoose=require('mongoose');

const app=express();
app.use(cors());


app.use(express.json());

mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>console.log("MongoDb Connected"))
.catch((err)=>console.log(err));
app.use('/api/auth',authRoutes);
app.use('/api/Admin',AdminRoute);
app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to the API!',
    });
  });
const PORT=process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });