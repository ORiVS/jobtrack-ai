require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  host: "127.0.0.1",
  port: 55432,
  user: "jobtracker_user",
  password: "jobtracker_pass",
  database: "jobtracker_ai",
  ssl: false,
});

async function testConnection() {
  try {
    await client.connect();
    console.log("PostgreSQL connection successful");

    const result = await client.query(
      "SELECT current_database(), current_user, inet_server_addr(), inet_server_port();"
    );

    console.log(result.rows);

    await client.end();
  } catch (error) {
    console.error("PostgreSQL connection failed");
    console.error(error.message);
    console.error(error);
  }
}

testConnection();