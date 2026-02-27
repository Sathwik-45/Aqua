const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });
const Owner = require('./backend/models/Owners');

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const owners = await Owner.find();
        console.log(`Found ${owners.length} owners:`);
        owners.forEach(o => {
            console.log(`- ${o.shopName}`);
            console.log(`  Location Obj:`, o.location);
            console.log(`  Address: ${o.address}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkData();
