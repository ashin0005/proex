const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 1000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const { MongoClient, Collection } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const Client = new MongoClient(uri);

app.set('view engine', 'ejs');
app.use(express.static('public'));


const userRoutes = require('./route/userRoutes');
const { register } = require("module");

app.use('/', userRoutes);



app.post('/', async (req, res) => {
    try {
        await Client.connect();
        const db = Client.db('profile');
        const collection = db.collection('user');

        const { Name, Age, Email, Mobile, Password } = req.body;
        const myDetails = { Name, Age, Email, Mobile, Password };

        console.log(myDetails);

        await collection.insertOne(myDetails);

        res.redirect('/');
    } catch (err) {
        console.log('error:', err);
    } finally {
        await Client.close(); // Change 'client' to 'Client'
    }
})




app.get('/', async (req, res) => {
    try {
        await Client.connect();
        const db = Client.db('profile');
        const collection = db.collection('user');

        const ashi = await collection.find().toArray();
        console.log("User data:", ashi);

        res.render('user/index', { ashi });
    } finally {
        await Client.close();
    }
});



// // Add route for updating user data
// app.post('/update', async (req, res) => {
//     try {
//         await Client.connect();
//         const db = Client.db('profile');
//         const collection = db.collection('user');

//         const { id, Name, Age, Email, Mobile, Password } = req.body;
//         const updatedDetails = { Name, Age, Email, Mobile, Password };

//         await collection.updateOne({ _id: ObjectId(id) }, { $set: updatedDetails });

//         res.redirect('user/update');
//     } catch (err) {
//         console.error('Error updating user data:', err);
//         res.status(500).send('Error updating user data');
//     } finally {
//         await Client.close();
//     }
// });

// // Add route for deleting user data
// app.post('/delete', async (req, res) => {
//     try {
//         await Client.connect();
//         const db = Client.db('profile');
//         const collection = db.collection('user');

//         const { id } = req.body;

//         await collection.deleteOne({ _id: ObjectId(id) });

//         res.redirect('user/form');
//     } catch (err) {
//         console.error('Error deleting user data:', err);
//         res.status(500).send('Error deleting user data');
//     } finally {
//         await Client.close();
//     }
// });


// app.post('/updatedoc', async (req, res) => {
//     try {
//         // Connect to the MongoDB database
//         const Client = await MongoClient.connect('mongodb://localhost:27017');
//         const db = Client.db('profile');
//         const collection = db.collection('user');

//         const {
//             proId,
//             Name,
//             Age,
//             Email,
//             Mobile,
//             Password
//         } = req.body;

//         // Save the filename in the database
//         // const pimg = req.file.filename;

//         console.log(proId);
//         // Update the patient record with the specified patientId
//         // const result = await collection.updateOne({
//         //     _id: new ObjectId(proId)
//         // }, {
//         //     $set: {
//         //         proId,
//         //         Name,
//         //         Age,
//         //         Email,
//         //         Mobile,
//         //         Password
//         //     }
//         // });

//         // Check if the patient record was updated successfully
//         // if (result.modifiedCount === 1) {
//         //     console.log(`patient with ID ${proId} updated successfully.`);
//         //     return res.redirect('/adm-pro');
//         // } else {
//         //     console.log(`patient with ID ${proId} not found.`);
//         // }

//         // Redirect after successful deletion
//     } catch (e) {
//         console.error(`Error: ${e}`);
//         return "An error occurred while updating the patient record.";
//     }
// });



app.post('/deletepro', async (req, res) => {
    try {
        // Get the productId from the form data
        const proId = req.body.proId;

        // Connect to the MongoDB database
        const Client = await MongoClient.connect('mongodb://localhost:27017');

        const db = Client.db('profile');
        const collection = db.collection('user');

        const user = await collection.findOne({
            _id: new ObjectId(proId)
        });

        // Delete the product record with the specified proId
        const result = await collection.deleteOne({
            _id: new ObjectId(proId)
        });

        
        // Redirect after successful deletion
        return res.redirect('/user/index');
    } catch (e) {
        console.error(`Error: ${e}`);
        return res.status(500).send("An error occurred while deleting the product record.");
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




