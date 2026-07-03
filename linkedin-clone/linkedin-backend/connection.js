const mongoose = require('mongoose');

//linkedinClone

mongoose.connect('mongodb://localhost:27017/linkedinClone').then(res => {
    console.log('MongoDB connected successfully')
}).catch(err => { console.log('MongoDB connection failed', err) })
