import { useState, useEffect } from "react";
import anecdoteService from "../services/anecdotes";

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([]);

  useEffect(() => {
    const fetchAnecdotes = async () => {
      const data = await anecdoteService.getAll();

      setAnecdotes(data);
    };

    fetchAnecdotes();
  }, []);

  const addAnecdote = async (anecdote) => {
    const savedAnecdote = await anecdoteService.createNew(anecdote);
    setAnecdotes((prev) => prev.concat(savedAnecdote));
  };

  const deleteAnecdote = async (id) => {
    const deletedId = await anecdoteService.remove(id);
    setAnecdotes((prev) =>
      prev.filter((anecdote) => anecdote.id !== deletedId),
    );
  };

  return {
    anecdotes,
    addAnecdote,
    deleteAnecdote,
  };
};
