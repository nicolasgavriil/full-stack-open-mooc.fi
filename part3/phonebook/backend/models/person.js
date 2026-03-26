import "dotenv/config";
import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

try {
  await mongoose.connect(url, { family: 4 });
  console.log("Connected to MongoDB");
} catch (err) {
  console.error("Error connecting to MongoDB", err);
}

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 5, required: true, unique: true },
  number: {
    type: String,
    validate: {
      validator: (v) => /^\d{2,3}-\d{5,}$/.test(v),
      message:
        "Phone number must have 2–3 digits, a dash (-), then at least 6 digits (e.g. 09-1234567, 090-1234567)",
    },
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const Person = mongoose.model("Person", personSchema);
