const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

// middleware
app.use(cors());
app.use(express.json());

// mongodb config
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jjvalws.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//verify jwt
function verifyJWT(req, res, next) {
  // get authorization from header
  const authHeader = req.headers.authorization;

  // check if the header exists
  if (!authHeader) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  // split the token
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "forbidden access" });
    }

    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    const sectorsCollection = client.db("nameSector").collection("sectors");
    const personsCollection = client.db("nameSector").collection("persons");

    // get sectors
    app.get("/sectors", async (req, res) => {
      const query = {};

      const sectors = await sectorsCollection.find(query).toArray();

      res.send(sectors);
    });

    // save person data
    app.post("/data-input", async (req, res) => {
      const data = req.body;

      const result = await personsCollection.insertOne(data);

      res.send(result);
    });

    // get all persons
    app.get("/persons", async (req, res) => {
      const query = {};

      const persons = await personsCollection.find(query).toArray();

      res.send(persons);
    });

    // get session token
    app.get("/session-id", (req, res) => {
      const time = req.query.time;

      const token = jwt.sign({ time }, process.env.ACCESS_TOKEN_SECRET);

      res.send({ token: token, time: time });
    });

    //edit person data
    app.put("/edit-person-data/:id", verifyJWT, async (req, res) => {
      const data = req.body;
      const id = req.params.id;

      const query = { _id: ObjectId(id) };

      const updatedDoc = {
        $set: data,
      };

      const options = { upsert: true };

      const result = await personsCollection.updateOne(
        query,
        updatedDoc,
        options
      );

      res.send(result);
    });
  } finally {
    //
  }
}

run().catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send(`<h1>name sector server is running ????</h1>`);
});

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
