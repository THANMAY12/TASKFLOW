require("dotenv").config();

const app = require("./src/app");
const connectToDb = require("./src/config/db");

const PORT = process.env.PORT || 5000;
connectToDb();

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});