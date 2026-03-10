const mongoose = require("mongoose");

const connectDatabase = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);

        /*!process.env.PROD &&*/ console.log("MongoDB Connected");

        return connection; 
    } catch (error) {
        /*!process.env.PROD &&*/ console.log("Error Connecting Database:", error);
        throw error; 
    }
};

module.exports = connectDatabase;