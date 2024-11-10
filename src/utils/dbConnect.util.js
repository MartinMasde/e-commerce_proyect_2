import { connect } from "mongoose";

async function dbConnect() {
    try {
        connect(process.env.MONGO_URI)
        console.log("mongodb connected");        
    } catch (error) {
        console.log(error);        
    }
}

export default dbConnect