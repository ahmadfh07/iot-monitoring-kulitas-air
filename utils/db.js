if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

//menambah satu data
// const contact1 = new Contact({
//   nama: "Doddy",
//   nohp: "08156867781",
//   email: "doddy@gmail.com",
// });

// //simpan ke collection
// contact1.save().then((contact) => console.log(contact));
