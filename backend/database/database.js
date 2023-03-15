const mongoose = require("mongoose");

const connection = async () => {
    try {
        const uri = "mongodb+srv://ozgevuralkoca:1@ecommercedb.fcgiu1m.mongodb.net/?retryWrites=true&w=majority";
        var result = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Mongodb connection successful")
    } catch (error) {
        console.log(`MongoDb connection is not working! Error + ${error}`)
    }
}

module.exports = connection