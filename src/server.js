require("dotenv").config();
const app = require("./app");
const { poolPromise } = require("./config/db");

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await poolPromise;
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
