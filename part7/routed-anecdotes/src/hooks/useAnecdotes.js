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

  return {
    anecdotes,
    setAnecdotes,
  };
};
