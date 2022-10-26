const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

// server connect 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wsk2b.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const parkingCollection = client
        .db("parking_collection")
        .collection("parking");


        app.get("/service", async (req, res) => {
            const query = {};
            const cursor = parkingCollection.find(query)
            const service = await cursor.toArray();
            res.send(service);
          });
    //   post parking 
    app.post("/parking", async (req, res) => {
        const parking = req.body;
        const result = await parkingCollection.insertOne(parking);
        res.send(result);
      });

 app.put('/parking/:id', async(req,res)=>{
  const id = req.params.id
  const updateTime = req.body
  console.log("updateTime", updateTime,id)
  const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {checkout:updateTime.date},
      };
      const result = await parkingCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
 })

    }
    finally {
    }
}run().catch(console.dir);
 //---connect to data base ---
// {code}
// main async function ----------
// {code}
// app listening --------------
app.get("/", (req, res) => {
  res.send("hello Parking apps");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});