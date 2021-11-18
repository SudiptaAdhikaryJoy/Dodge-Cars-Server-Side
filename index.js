const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e9cyj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('dodgeCar');
        const itemsCollection = database.collection('items');

         // GET API
        app.get('/items', async (req,res)=>{
            const cursor = itemsCollection.find({});
            const offers = await cursor.toArray();
            res.send(offers);
        } );

        // GET API

        app.get('/items/:id', async (req,res)=>{
            const id = req.params.id;
            console.log('id', id);
            const query = {_id: ObjectId(id)};
            const offer = await itemsCollection.findOne(query);
            res.json(offer);
        })

        // POST API
        app.post('/items', async (req, res)=>{
            const offer = req.body;
            console.log('hit post',offer);

            const result = await itemsCollection.insertOne(offer);
            res.json(result);
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
     res.send('hello world');
})

app.listen(port, ()=> {
    console.log(`example app listening on port ${port}`);
})