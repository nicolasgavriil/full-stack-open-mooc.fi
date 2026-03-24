import "dotenv/config";
import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

try {
  mongoose.connect(url, { family: 4 });
  console.log("Connected to MongoDB");
} catch (err) {
  console.error("Error connecting to MongoDB", err);
}

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  number: { type: String, required: true },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const Person = mongoose.model("Person", personSchema);
