require("dotenv").config();
const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();

const url = process.env.MONGO_URI;
const dbName = "ordbanken-db";
let db;

app.use(express.json());

async function connectToDatabase() {
  try {
    const client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    });
    console.log("Connected to MongoDB");

    db = client.db(dbName);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
}

async function getCollectionData(category = null) {
  const collection = db.collection("ordbank");

  try {
    const query = category ? { category } : {};
    const docs = await collection.find(query).toArray();
    return docs;
  } catch (err) {
    console.error("Error retrieving data:", err);
    return [];
  }
}

app.get("/api/fetch_all", async (req, res) => {
  const { category } = req.query;

  try {
    const data = await getCollectionData(category);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve data" });
  }
});

connectToDatabase().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

module.exports = app;
