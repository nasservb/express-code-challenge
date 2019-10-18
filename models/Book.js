const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
    isbn: {
        type:String,
        required: true,
        max: 255,
    },
    title:  {
        type:String,
        required: true,
        max: 255,
    },
    author : String,
    _institution: { type: Schema.Types.ObjectId, ref: 'Institution' }
});

mongoose.model('Book', bookSchema);