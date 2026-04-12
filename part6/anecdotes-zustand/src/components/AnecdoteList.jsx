import { useAnecdotes, useAnecdoteActions } from "../store";

const AnecdoteList = () => {
  const { vote, remove } = useAnecdoteActions();
  const anecdotes = useAnecdotes();
  const anecdotesByVotes = anecdotes.toSorted((a1, a2) => a2.votes - a1.votes);

  return (
    <div>
      {anecdotesByVotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
            {anecdote.votes === 0 && (
              <button onClick={() => remove(anecdote.id)}>delete</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
