import express from "express";
import morgan from "morgan";

const app = express();

app.use(express.json());

morgan.token("body", (req, res) => {
  return req.body ? JSON.stringify(req.body) : "Empty body";
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms - :body",
  ),
);

let notes = [
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
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.send(notes);
});

app.get("/api/persons/:id", (req, res) => {
  const personId = req.params.id;
  const note = notes.find((note) => note.id === personId);
  if (!note) {
    return res.status(404).end();
  }

  return res.send(note);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  console.log(body);
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Missing content",
    });
  }
  if (notes.find((note) => note.name === body.name)) {
    return res.status(400).json({
      error: "Name must be unique",
    });
  }

  const newId = String(Math.floor(Math.random() * 1000000000));
  const note = {
    id: newId,
    name: body.name,
    number: body.number,
  };
  notes = notes.concat(note);
  res.status(201).json(note);
});

app.delete("/api/persons/:id", (req, res) => {
  const personId = req.params.id;
  notes = notes.filter((note) => note.id !== personId);
  return res.status(204).end();
});

app.get("/info", (req, res) => {
  const now = new Date();
  const body = `<p>Phonebook has info for ${notes.length} people</p><p>${now.toString()}</p>`;
  res.send(body);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
