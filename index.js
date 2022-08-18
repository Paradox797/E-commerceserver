const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');

const userRouter = require("./user.routes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lf6hgoi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });








async function run() {
    try {
        await client.connect();
        const servicesCollection = client.db('E_commerceServer').collection('services');
        const bookingCollection = client.db('E_commerceServer').collection('bookings');
        const asCollection = client.db('E_commerceServer').collection('as');
        const allusersCollection = client.db('E_commerceServer').collection('as');




        app.get('/allusers', async (req, res) => {
            const query = {};
            const cursor = asCollection.find(query);
            const allusers = await cursor.toArray();
            res.send(allusers);
        });//showing all users


        app.get('/as', async (req, res) => {
            const email = req.query.email;
            // console.log(customerEmail);
            const query = { email: email };
            const account = await asCollection.find(query).toArray();
            // const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send(account);
        });//for account





        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });//for showing new items in cartpage 


        // app.get('/available', async (req, res) => {
        //     const name = req.query.bookingName || "Outgoing shoes";
        //     const services = await servicesCollection.find().toArray();

        //     const query = { bookingName: bookingName };
        //     const bookings = await bookingCollection.find(query).toArray;

        //     services.forEach(service => {
        //         const serviceBookings = bookings.filter(b => b.bookingName === serviceBookings.name);
        //         const booked = serviceBookings.map(s => s.bookingNumber);
        //         const available= service.bookingNumber
        //     })

        //     res.send(services);
        // })







        // app.put('/update', async (req, res) => {
        //     // const email = req.params.email;
        //     // const user = req.body;
        //     const user = { location: "Chittagong" }
        //     const filter = { userID: "vXZlYg8Uj9eKudmrNq7lIbQCQCC3" };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: user,
        //     };
        //     const result = await asCollection.updateOne(filter, updateDoc, options);
        //     //  const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
        //     res.send({ result });
        // })//new

        app.put('/update', async (req, res) => {
            console.log(req.body);
            const user = req.body;
            const filter = { userID: user.userID };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await asCollection.updateOne(filter, updateDoc, options);
            res.send({ result });
        })//making one user,



        app.get('/booking', async (req, res) => {
            const customerEmail = req.query.customerEmail;
            // console.log(customerEmail);
            const query = { customerEmail: customerEmail };
            const bookings = await bookingCollection.find(query).toArray();
            res.send(bookings);
        });//for finding one cart








        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const query = { bookingName: booking.bookingName, date: booking.date, customerName: booking.customerName };//bookingName: booking.bookingName, date: booking.date, customerName: customerName 
            const exists = await bookingCollection.findOne(query);
            if (exists) {
                return res.send({ success: false, booking: exists })
            }
            const result = await bookingCollection.insertOne(booking);
            res.send({ success: true, result });
        })//for booking items

        app.post('/as', async (req, res) => {
            const as = req.body;
            const query = {};
            // const exists = await asCollection.findOne(query);
            // if (exists) {
            //     return res.send({ success: false, as: exists })
            // }
            const result = await asCollection.insertOne(as);
            res.send({ success: true, result });
        })//for inserting new users





        // app.post('/allusers', async (req, res) => {
        //     const allusers = req.body;
        //     const query = {};
        //     // const exists = await asCollection.findOne(query);
        //     // if (exists) {
        //     //     return res.send({ success: false, as: exists })
        //     // }
        //     const result = await allusersCollection.insertOne(allusers);
        //     res.send({ success: true, result });
        // })




    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})