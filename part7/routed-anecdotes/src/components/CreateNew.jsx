import { useField } from "../hooks/useField.js";
import { useAnecdotes } from "../hooks/useAnecdotes.js";
import { useNavigate } from "react-router-dom";

const CreateNew = () => {
  const content = useField("content", "text");
  const author = useField("author", "text");
  const info = useField("info", "text");
  const { addAnecdote } = useAnecdotes();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const anecdote = {
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    };
    addAnecdote(anecdote);
    navigate("/");
  };

  const handleReset = () => {
    const fields = [content, author, info];
    fields.forEach((field) => field.reset());
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.props} />
        </div>
        <div>
          author
          <input {...author.props} />
        </div>
        <div>
          url for more info
          <input {...info.props} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  );
};

export default CreateNew;
