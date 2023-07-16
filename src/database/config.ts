import mongoose from "mongoose";

export const dbConnection = async() => {
    
    try {
        
        await mongoose.connect(process.env.DB_CNN as string, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions);

        console.log("[DB] online");

    } catch (error) {

        console.error(error);

    }
    
};