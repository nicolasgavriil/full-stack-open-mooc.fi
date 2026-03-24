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
    res.send(persons);
  } catch (err) {
    next(err);
  }
});

app.get("/api/persons/:id", (req, res, next) => {
  try {
    const personId = req.params.id;
    const person = persons.find((p) => p.id === personId);
    if (!person) {
      return res.status(404).end();
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

    const personAdded = await personToAdd.save();

    res.status(201).json(personAdded);
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
    res.send(body);
  } catch (err) {
    next(err);
  }
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
