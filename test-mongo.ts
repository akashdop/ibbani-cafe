import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.log("MONGODB_URI not found");
  process.exit(1);
}

async function testConnection() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ Connection Failed:");
    console.error(err);
  } finally {
    await client.close();
  }
}

testConnection();