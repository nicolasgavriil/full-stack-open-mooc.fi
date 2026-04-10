import { useAnecdoteActions } from "../store";

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions();

  const handleCreate = (e) => {
    e.preventDefault();
    add(e.target.anecdote.value);
    e.target.reset();
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
