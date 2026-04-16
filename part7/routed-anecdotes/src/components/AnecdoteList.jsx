import { useAnecdotes } from "../hooks/useAnecdotes.js";

const AnecdoteList = () => {
  const { anecdotes, deleteAnecdote } = useAnecdotes();

  if (!anecdotes) return null;

  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map((anecdote) => (
          <li key={anecdote.id}>
            {anecdote.content}
            <button type="button" onClick={() => deleteAnecdote(anecdote.id)}>
              delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnecdoteList;
