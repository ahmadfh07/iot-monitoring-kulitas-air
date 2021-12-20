const mongoose = require("mongoose");
const dataSchema = mongoose.Schema(
  {
    tds: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const Data = mongoose.model("Data", dataSchema);

module.exports = Data;
