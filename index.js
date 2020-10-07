var express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;



const uri = "mongodb+srv://OrganicUser:OrganicUser@cluster0.wxwkk.mongodb.net/<OrganicDb>?retryWrites=true&w=majority";

var app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})



const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true});
client.connect(err => {
  const ProductCollection = client.db("OrganicDb").collection("products");

  app.get('/products', (req, res) => {
    ProductCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })

  })

  app.get('/product/:id', (req, res) => {
    ProductCollection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents) => {
      res.send(documents[0])
    })
  })

  // const product = {name: "Modhu" , price: 25 , quantity: 20}
  app.post("/addProduct" , (req, res) => {
     const product = req.body;
     ProductCollection.insertOne(product)
     .then(result => {
      //  console.log('data added succesfully');
      //  res.send('success');
       res.redirect('/')
     })
  });

  app.patch('/update/:id', (req, res) => {
    // console.log(req.body.price)
    console.log(req.params.id)
    ProductCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then(result => {
      res.send(result.modifiedCount > 0)
    })
  })

  app.delete('/delete/:id', (req, res) => {
    ProductCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0);
    })
  })
});


app.listen(3000) 