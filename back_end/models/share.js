const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema(
  {
    Symbol: { type: String, required: true },
    contracted_value: { type: Number,  },
    contracted_dnt: { type: Date,  },
    state: {
      type: String,
      enum: ["filled", "declined"],
      required: [true, "uncufficient balance please deposit"],
    },
    Type: {
      type: String,
      enum: ["buy", "sell"],
      required: true
    },
    size: { type: Number, required: true },
    user:[{ type: mongoose.Schema.Types.ObjectId, ref:'user' , required : true}],
  
  },

  { timestamps: true }

);

module.exports = mongoose.model("Share", shareSchema);
