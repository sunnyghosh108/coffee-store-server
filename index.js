const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o4ydcux.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);


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
    // Send a ping to confirm a successful connection
    // const database =client.db("userDB")
    const usersCollection=client.db("usersDB").collection('users');

    app.get('/users',async (req,res)=>{
      const cursor =usersCollection.find()
      const result =await cursor.toArray();
      res.send(result);
    })

    app.get('/users/:id',async(req,res)=>{
      const id =req.params.id;
      const query ={_id:new ObjectId(id)}
      const user =await usersCollection.findOne(query);
      res.send(user);
    })

     app.post('/users',async (req,res)=>{
        const user=req.body;
        console.log('new user',user);
        const result = await usersCollection.insertOne(user);
        res.send(result);
     })

     app.delete('/users/:id',async(req,res)=>{
      const id=req.params.id;
      console.log('please delete from database',id);
      const query={_id:new ObjectId(id)}
      const result = await usersCollection.deleteOne(query);
      res.send(result)
     })

     app.put('/users/:id',async(req,res)=>{
      const id =req.params.id;
      const user=req.body;
      console.log(id,user);
      const filter={_id:new ObjectId(id)}
      const options={upsert:true}
      const updatedUser ={
        $set:{
          name:user.name,
          email:user.email
        }
      }
      const result =await usersCollection.updateOne(filter,updatedUser,options)
      res.send(result);


     })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
    res.send('Coffee making server is running ')
})

app.listen(port,()=>{
    console.log(`Coffee Server is running on port:${port}`)
})