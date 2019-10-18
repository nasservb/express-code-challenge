const mongoose = require('mongoose');
const { Schema } = mongoose;

const instituetionSchema = new Schema({
    name:  {
        type:String,
        required: true,
        max: 255,
    },
    url:  {
        type:String,
        required: true,
        max: 255,
    },
    email_domain :  {
        type:String,
        required: true,
        max: 255,
    },
});

mongoose.model('Institution', instituetionSchema);
