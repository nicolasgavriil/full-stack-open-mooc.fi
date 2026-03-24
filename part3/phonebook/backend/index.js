import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import { Person } from "./models/person.js";

const app = express();

app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (req, res) => {
  return req.body ? JSON.stringify(req.body) : "Empty body";
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms - :body",
  ),
);

app.get("/api/persons", async (req, res) => {
  const persons = await Person.find({});
  res.send(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const personId = req.params.id;
  const person = persons.find((p) => p.id === personId);
  if (!person) {
    return res.status(404).end();
  }

  return res.send(person);
});

app.post("/api/persons", async (req, res) => {
  const body = req.body;

  if (!body || !body.name || !body.number) {
    return res.status(400).json({
      error: "Missing content",
    });
  }

  const personToAdd = new Person({
    name: body.name,
    number: body.number,
  });

  const personAdded = await personToAdd.save();

  res.status(201).json(personAdded);
});

app.delete("/api/persons/:id", async (req, res) => {
  const personId = req.params.id;
  try {
    await Person.findByIdAndDelete(personId);
    return res.status(204).end();
  } catch (err) {
    console.log(err);
  }
});

app.get("/info", (req, res) => {
  const now = new Date();
  const body = `<p>Phonebook has info for ${persons.length} people</p><p>${now.toString()}</p>`;
  res.send(body);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
