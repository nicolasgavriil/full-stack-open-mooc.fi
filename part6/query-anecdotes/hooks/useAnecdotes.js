import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAnecdotes,
  createAnecdote,
  updateAnecdote,
} from "../src/requests.js";
import { useNotify } from "./useNotify.js";

export const useAnecdotes = () => {
  const queryClient = useQueryClient();
  const { setNotification } = useNotify();

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 1,
  });

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });

      setNotification(`Created: ${data.content}`);
    },
    onError: (err) => {
      const errorMessage =
        err.error || err.message || "An unknown error occurred";

      setNotification(`Error: ${errorMessage}`);
    },
  });

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
    },
  });

  return {
    result,
    addAnecdote: (anecdote) => newAnecdoteMutation.mutate(anecdote),
    voteAnecdote: (anecdote) => {
      updateAnecdoteMutation.mutate(
        { ...anecdote, votes: anecdote.votes + 1 },
        {
          onSuccess: (updatedData) =>
            setNotification(`Voted: ${updatedData.content}`),
          onError: (err) => setNotification(`Error: ${err.message}`),
        },
      );
    },
  };
};
