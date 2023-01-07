const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

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

      console.log(result);
      res.send(result);
    });

    // used to insert sector data to database
    /* app.get("/sectors", (req, res) => {
      const sectorArr = [
        "Manufacturing",
        "Construction materials",
        "Electronics and Optics",
        "Food and Beverage",
        "Bakery & confectionery products",
        "Beverages",
        "Fish & fish products",
        "Meat & meat products",
        "Milk & dairy products",
        "Other",
        "Sweets & snack food",
        "Furniture",
        "Bathroom/sauna",
        "Bedroom",
        "Children's room",
        "Kitchen",
        "Living room",
        "Office",
        "Other (Furniture)",
        "Outdoor",
        "Project furniture",
        "Machinery",
        "Machinery components",
        "Machinery equipment/tools",
        "Manufacture of machinery",
        "Maritime",
        "Aluminium and steel workboats",
        "Boat/Yacht building",
        "Ship repair and conversion",
        "Metal structures",
        "Other",
        "Repair and maintenance service",
        "Metalworking",
        "Construction of metal structures",
        "Houses and buildings",
        "Metal products",
        "Metal works",
        "CNC-machining",
        "Forgings, Fasteners",
        "Gas, Plasma, Laser cutting",
        "MIG, TIG, Aluminum welding",
        "Plastic and Rubber",
        "Packaging",
        "Plastic goods",
        "Plastic processing technology",
        "Blowing",
        "Moulding",
        "Plastics welding and processing",
        "Plastic profiles",
        "Printing",
        "Advertising",
        "Book/Periodicals printing",
        "Labelling and packaging printing",
        "Textile and Clothing",
        "Clothing",
        "Textile",
        "Wood",
        "Other (Wood)",
        "Wooden building materials",
        "Wooden houses",
        "Other",
        "Creative industries",
        "Energy technology",
        "Environment",
        "Service",
        "Business services",
        "Engineering",
        "Information Technology and Telecommunications",
        "Data processing, Web portals, E-marketing",
        "Programming, Consultancy",
        "Software, Hardware",
        "Telecommunications",
        "Tourism",
        "Translation services",
        "Transport and Logistics",
        "Air",
        "Rail",
        "Road",
        "Water",
      ];

      sectorArr.forEach(async sector => {
        const sectorObj = {
          name: sector,
        };

        const result = await sectorsCollection.insertOne(sectorObj);

        console.log(result);
      });

      console.log(sectorArr.length);

      res.send("working");
    }); */
  } finally {
    //
  }
}

run().catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send(`<h1>name sector server is running 🚀</h1>`);
});

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
