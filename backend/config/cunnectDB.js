const { default: mongoose } = require("mongoose")

const cunnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB cunnected");
    } catch (error) {
        console.log("DB cunnection Error");
        
    }
    
}
module.exports = cunnectDB;