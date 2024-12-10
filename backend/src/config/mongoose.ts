import { connect, set } from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

// connection to db
export const connectToDB = async () => {
  try {
    set('strictQuery', false);
    const db = await connect("mongodb+srv://raazdura:duraaz1234@raazdura.lmpiqa6.mongodb.net/task-manager?retryWrites=true&w=majority");
    console.log('MongoDB connected to', db.connection.name);
    // Emit an event when the connection is successful
  } catch (error) {
    console.error(error);
    // Emit an event when there's an error
  }
};