import "dotenv/config";
import { Client } from "pg";

console.log("DATABASE_URL:", process.env.DATABASE_URL);
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export default client;
