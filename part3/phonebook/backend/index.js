import express from "express";
import morgan from "morgan";

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

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "99-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
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

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body || !body.name || !body.number) {
    return res.status(400).json({
      error: "Missing content",
    });
  }
  if (persons.find((p) => p.name === body.name)) {
    return res.status(400).json({
      error: "Name must be unique",
    });
  }

  const newId = String(Math.floor(Math.random() * 1000000000));
  const person = {
    id: newId,
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  res.status(201).json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const personId = req.params.id;
  persons = persons.filter((p) => p.id !== personId);
  return res.status(204).end();
});

app.get("/info", (req, res) => {
  const now = new Date();
  const body = `<p>Phonebook has info for ${persons.length} people</p><p>${now.toString()}</p>`;
  res.send(body);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
