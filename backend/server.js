require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/database");

require("./models/User");
require("./models/Note");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Adatbázis kapcsolat sikeres.");

    await sequelize.sync();
    console.log("Adatbázis szinkronizálva.");

    app.listen(PORT, () => {
      console.log(`Szerver fut: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Hiba a szerver indításakor:", error);
  }
}

startServer();