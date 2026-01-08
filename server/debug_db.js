const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const PatentSchema = new mongoose.Schema({}, { strict: false });
const Patent = mongoose.model("Patent", PatentSchema, "patents"); // Explicit collection name

async function debug() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB");

        const sample = await Patent.findOne({});
        console.log("Sample Patent Document:");
        console.log(JSON.stringify(sample, null, 2));

        const count = await Patent.countDocuments({});
        console.log("Total Patents in DB:", count);

        const categories = await Patent.distinct("mainCategoryId");
        console.log("Unique mainCategoryId values:", categories);

        const missileCount = await Patent.countDocuments({ mainCategoryId: "Missile Systems" });
        console.log("Patents with mainCategoryId='Missile Systems':", missileCount);

        const regexCount = await Patent.countDocuments({ mainCategoryId: { $regex: /Missile/i } });
        console.log("Patents matching /Missile/i:", regexCount);

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

debug();
