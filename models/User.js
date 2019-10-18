const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name:  {
        type:String,
        required: true,
        max: 255,
    },
    email : {
        type:String,
        unique: true,
        required: true,
        min: 5,
        max: 255,
    },
    role : {
        type: String,
        enum:  ['student','academic','administrator'] ,        
        required: true,
    },
    password: {        
        type:String,
        min: 6,
        max: 255,
        required: true,
    },    
    api_token: String,    
    _institution: { type: Schema.Types.ObjectId, ref: 'Institution' }
});

mongoose.model('User', userSchema);
