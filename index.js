require("dotenv").config();
const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();

const url = process.env.MONGO_URI;
const dbName = "ordbanken-db";

app.use(express.json());

async function getDatabaseData() {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection("ordbank");

    const docs = await collection.find({}).toArray();

    return docs;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    return [];
  } finally {
    await client.close();
  }
}

app.get("/", async (req, res) => {
  try {
    const data = await getDatabaseData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
