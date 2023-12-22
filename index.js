const express=require('express')
const app=express()
const port=process.env.PORT || 5000;

require('dotenv').config()
const cors=require('cors')


app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.u2o3a1l.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection

  const taskCollection=client.db('taskManage').collection('allTask')



app.post('/task',async(req,res)=>{
    const taskInfo=req.body
    console.log('Task Uploaded',taskInfo)
    const result=await taskCollection.insertOne(taskInfo)
    res.send(result)
})


app.get('/task/:email',async(req,res)=>{
  const email=req.params.email
  const query={email:email}
    const result=await taskCollection.find(query).toArray()
    res.send(result)
})

app.delete('/task/:id',async(req,res)=>{
    const id=req.params.id
    const query={_id:new ObjectId(id)}
    const result=await taskCollection.deleteOne(query)
    res.send(result)
})


app.put('/task/:id',async(req,res)=>{
    const modifiedTask=req.body
    console.log('modified task',modifiedTask)
    const id=req.params.id
    const filter={_id:new ObjectId(id)}
    const updateTask={
        $set:{
            status:modifiedTask.status
        }
    }
    const result=await taskCollection.updateMany(filter,updateTask)
    res.send(result)
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
  
    res.send('Task   Server is Running')

})

app.listen(port)
