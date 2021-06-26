const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cfr7q.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const blogsCollection = client.db("retro-blog").collection("blogs");
    const adminCollection = client.db("retro-blog").collection("admin");


    app.post('/postBlog', (req, res) => {
        const newSBlog = req.body;
        blogsCollection.insertOne(newSBlog)
          .then(result => {
            res.send(result.insertedCount > 0)
          })
      })


      app.get('/blogs', (req, res) => {
        blogsCollection.find()
          .toArray((err, items) => {
            res.send(items)
          })
      }) 

      app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        adminCollection.insertOne(newAdmin)
          .then(result => {
            console.log('Admin count', result.insertedCount)
            res.send(result.insertedCount > 0)
          })
      })

      app.delete("/delete/:id", (req, res)=>{
        blogsCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then((result)=>{
          res.send(result)
        });
      });
      
      app.post('/isAdmin', (req, res) => {
        const email = req.body.email
        adminCollection.find({ email: email })
          .toArray((err, admin) => {
            res.send(admin.length > 0);
          })
      })
});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
