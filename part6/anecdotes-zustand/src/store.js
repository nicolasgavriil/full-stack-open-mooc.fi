import { create } from "zustand";
import anecdoteService from "./services/anecdotes.js";

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => ({
  content: anecdote,
  id: getId(),
  votes: 0,
});

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: "",
  actions: {
    vote: async (id) => {
      const anecdote = useAnecdoteStore
        .getState()
        .anecdotes.find((a) => a.id === id);
      const updatedAnecdote = await anecdoteService.update({
        ...anecdote,
        votes: anecdote.votes + 1,
      });
      set((state) => ({
        anecdotes: state.anecdotes.map((a) =>
          a.id === id ? updatedAnecdote : a,
        ),
      }));
    },
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll();
      set(() => ({ anecdotes }));
    },
    add: async (anecdote) => {
      const savedAnecdote = await anecdoteService.create(asObject(anecdote));
      set((state) => ({
        anecdotes: state.anecdotes.concat(savedAnecdote),
      }));
    },
    setFilter: (filter) =>
      set(() => ({
        filter,
      })),
  },
}));

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes);
  const filter = useAnecdoteStore((state) => state.filter);
  return anecdotes.filter((a) => a.content.includes(filter));
};
export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions);
