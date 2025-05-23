const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors'); 

dotenv.config()

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'password-db';

const app = express()
const port = 3000
console.log(process.env.MONGO_URI)

app.use(bodyParser.json());
app.use(cors() );

client.connect();
console.log('Connected successfully to server');

// Get all the passwords
app.get('/', async (req, res) => { 
  const db = client.db(dbName); 
  const collection = db.collection('passwords');
  const findResult = await collection.find({}).toArray();
  res.json(findResult)
})

// Save password
app.post ('/', async (req, res) => { 
  const password = req.body;
  const db = client.db(dbName); 
  const collection = db.collection('passwords');
  const findResult = await collection.insertOne(password);
  res.send({success: true, result: findResult})
})

// Delete  password
app.delete ('/', async (req, res) => { 
  const password = req.body;
  const db = client.db(dbName); 
  const collection = db.collection('passwords');
  const findResult = await collection.deleteOne(password);
  res.send({success: true, result: findResult})
})

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`)
})
