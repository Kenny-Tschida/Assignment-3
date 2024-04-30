var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

const port = "8081";
const host = "localhost";
const { MongoClient } = require("mongodb");

// MongoDB
const url = "mongodb://127.0.0.1:27017";
const dbName = "reactdata";
const client = new MongoClient(url);
const db = client.db(dbName);

app.get("/listProducts", async (req, res) => {
  await client.connect();
  console.log("Node connected successfully to GET MongoDB");
  const query = {};
  const results = await db
    .collection("fakestore_catalog")
    .find(query)
    .limit(100)
    .toArray();
  console.log(results);
  res.status(200);
  res.send(results);
});
app.get("/:id", async (req, res) => {
  const productid = Number(req.params.id);
  console.log("Product to find :", productid);
  await client.connect();
  console.log("Node connected successfully to GET-id MongoDB");
  const query = { id: productid };
  const results = await db.collection("fakestore_catalog").findOne(query);
  console.log("Results :", results);
  if (!results) res.send("Not Found").status(404);
  else res.send(results).status(200);
});
app.post("/addProduct", async (req, res) => {
  try {
    await client.connect();
    const values = Object.values(req.body);
    const id = values[0]; // id
    const title = values[1]; // title
    const price = values[2]; // price
    const description = values[3]; // description
    const category = values[4]; //category
    const image = values[5]; // image
    const rating = values[6]; // rating
    console.log(id, title, price, description, category, image, rating);
    const newDocument = {
      id: id,
      title: title,
      price: price,
      description: description,
      category: category,
      image: image,
      rating: rating,
    };
    const results = await db
      .collection("fakestore_catalog")
      .insertOne(newDocument);
    res.status(200);
    res.send(results);
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(500)
      .json({ error: error.message || "An internal server error occurred" });
  }
});

app.delete("/deleteProduct", async (req, res) => {
  try {
    await client.connect();
    // const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const id = values[0]; // id
    console.log("Item to delete :", id);
    const query = { id: id };
    const results = await db.collection("fakestore_catalog").deleteOne(query);
    res.status(200);
    res.send(results);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
app.put("/update/:id", async (req, res) => {
  const itemId = Number(req.params.id);
  await client.connect();
  const query1 = { id: itemId };
  const updatePrice = { $set: { price: req.body.price } };
  const results = await db
    .collection("fakestore_catalog")
    .findOneAndUpdate(query1, updatePrice, { returnDocument: "after" });
  res.status(200);
  res.send(results);
});
app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});
