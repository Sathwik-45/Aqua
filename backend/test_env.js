require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const uri = process.env.MONGO_URI;
if (!uri) {
    console.log("MONGO_URI not found");
} else {
    const masked = uri.replace(/:([^@]+)@/, ":****@");
    console.log("Loaded URI:", masked);
}
