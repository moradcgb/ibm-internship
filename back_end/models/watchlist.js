const mongoose = require('mongoose');

const watchlistschema = new mongoose.Schema({
    Symbol: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, 
});

module.exports = mongoose.model("watchlist", watchlistschema);
