const mongoose = require('mongoose');

const TextSchema = new mongoose.Schema({
    text : {
        type: String,
        required: true
    },
    embedidng :{
        type : [Number],
        required : true
    }
});

module.exports = mongoose.model("Text", TextSchema);