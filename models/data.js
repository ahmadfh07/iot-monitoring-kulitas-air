const mongoose = require("mongoose");

const Data = mongoose.model("Data", {
  date: {
    type: Date,
    default: new Date(),
  },
  time: {
    type: Date,
    default: new Date(),
  },
  tds: {
    type: String,
    required: true,
  },
});

module.exports = Data;
