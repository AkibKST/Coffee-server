const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s1acxwp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // newCoffee ke data base e pathano
    const coffeeCollection = client.db('coffeeDB').collection('coffee');


    // mongodb theke data cliennt side e dekhabo
    app.get('/coffee', async(req, res)=>{
        const cursor = coffeeCollection.find();
        // coffeeCollection er modde sob gula data client side e dekhabo

        const result = await cursor.toArray();
        res.send(result);
    })

    // update korar jonno
    app.get('/coffee/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await coffeeCollection.findOne(query);
        res.send(result)
    })
    // client side theke newCoffee ta nilam
    app.post('/coffee', async(req, res)=>{
        const newCoffee = req.body;
        console.log(newCoffee);

        // client side theke j data ta asche seta cltn er moddhe dibo
        const result = await coffeeCollection.insertOne(newCoffee);
        res.send(result)
    })

    // mongodb theke delete korar kaj
    app.delete('/coffee/:id', async (req, res)=>{
        // id ta res.params.id theke niye nibo
        const id = req.params.id;
        // khujbo jeta diye delete korbo
        const query = { _id: new ObjectId(id)};
        // mongodb crud er usecase theke ekta delete oparation chalabo
        const result = await coffeeCollection.deleteOne(query);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Coffee making server is running')
})

app.listen(port, () => {
    console.log(`Coffee server is running on port: ${port}`)
})