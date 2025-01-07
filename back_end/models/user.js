// models/product.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    pwd: { type: String, required: true },
    bd:{type: Date, required: true},
    Balance:{type : Number, default: 0 },
    shares:[{ type: mongoose.Schema.Types.ObjectId, ref:'share', required: true}],


});

module.exports = mongoose.model('user', userSchema);
