import { useAnecdotes, useAnecdoteActions } from "../store";

const AnecdoteList = () => {
  const { vote } = useAnecdoteActions();
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
