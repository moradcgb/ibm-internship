const mongoose = require("mongoose");

const tradeHistorySchema = new mongoose.Schema(
  {
    Symbol: { type: String, required: true },
    contracted_value: { type: Number, required: true },
    closed_value: { type: Number, required: true },
    contracted_dnt: { type: Date, required: true },
    closed_dnt: { type: Date, required: true },
    Type: { type: String, enum: ["buy", "sell"], required: true },
    size: { type: Number, required: true },
    pnl: { type: Number }, // Profit or Loss
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TradeHistory", tradeHistorySchema);
