const { Pool } = require("pg");
const configInfo = require("../config.js");

const connectInfo = {
  user: process.env.DB_USER || configInfo.user,
  host: process.env.DB_HOST || configInfo.host,
  database: process.env.DB_DB || configInfo.database,
  password: process.env.DB_PASSWORD || configInfo.password
};

const connectionString = `postgres://${connectInfo.user}:${connectInfo.password}@${connectInfo.host}:5432/${connectInfo.database}`;
let pool;
const connectDB = () => {
  pool = new Pool({
    connectionString: connectionString
  });

  pool.connect(err => {
    if (err) {
      console.log(err);
      pool.end();
      setTimeout(connectDB, 5000);
    }
    console.log("connected to db");
  });
};

connectDB();

module.exports = pool;
