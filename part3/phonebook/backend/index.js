import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import { Person } from "./models/person.js";
import { AppError, errorHandler } from "./middleware/errors.js";

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

app.get("/api/persons", async (req, res, next) => {
  try {
    const persons = await Person.find({});
    return res.send(persons);
  } catch (err) {
    next(err);
  }
});

app.get("/api/persons/:id", async (req, res, next) => {
  try {
    const personId = req.params.id;
    const person = await Person.findById(personId);
    if (!person) {
      throw new AppError("Person not found", 404);
    }
    return res.send(person);
  } catch (err) {
    next(err);
  }
});

app.post("/api/persons", async (req, res, next) => {
  try {
    const body = req.body;

    if (!body || !body.name || !body.number) {
      throw new AppError("Missing content", 400);
    }

    const personToAdd = new Person({
      name: body.name,
      number: body.number,
    });

    const addedPerson = await personToAdd.save();

    return res.status(201).json(addedPerson);
  } catch (err) {
    next(err);
  }
});

app.put("/api/persons/:id", async (req, res, next) => {
  const personId = req.params.id;
  const body = req.body;
  if (!body || !body.name || !body.number) {
    throw new AppError("Missing content", 400);
  }
  try {
    const personToUpdate = await Person.findById(personId);
    if (!personToUpdate) {
      throw new AppError("Person not found", 404);
    }
    personToUpdate.name = body.name;
    personToUpdate.number = body.number;
    const updatedPerson = await personToUpdate.save();
    return res.status(200).json(updatedPerson);
  } catch (err) {
    next(err);
  }
});

app.delete("/api/persons/:id", async (req, res, next) => {
  const personId = req.params.id;
  try {
    await Person.findByIdAndDelete(personId);
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
});

app.get("/info", (req, res, next) => {
  try {
    const now = new Date();
    const body = `<p>Phonebook has info for ${persons.length} people</p><p>${now.toString()}</p>`;
    return res.send(body);
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
