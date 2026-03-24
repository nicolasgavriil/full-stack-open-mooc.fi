import "dotenv/config";
import mongoose from "mongoose";

if (process.argv.length < 3) {
  console.log(`Usage: node mongo.js <yourPassword> [name] [number]`);
  process.exit(1);
}

const password = process.argv[2];

if (password !== process.env.MONGODB_PASSWORD) {
  console.log("Wrong password");
  process.exit(1);
}

const url = process.env.MONGODB_URL;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  const persons = await Person.find({});
  console.log("Phonebook:");
  for (const person of persons) {
    console.log(`${person.name} ${person.number}`);
  }
} else {
  const name = process.argv[3];
  const number = process.argv[4];

  const personToAdd = new Person({
    name,
    number,
  });

  const personAdded = await personToAdd.save();
  console.log(
    `Added ${personAdded.name} number ${personAdded.number} to the phonebook`,
  );
}

mongoose.connection.close();
