import { useAnecdotes } from "../hooks/useAnecdotes.js";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";

const App = () => {
  const { result, addAnecdote, voteAnecdote } = useAnecdotes();

  if (result.isPending) {
    return <div>loading data...</div>;
  }

  if (result.isError) {
    return <div>Anecdote service not available due to server problems </div>;
  }

  const anecdotes = result.data;

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm addAnecdote={addAnecdote} />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteAnecdote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
