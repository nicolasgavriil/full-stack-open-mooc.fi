import { useEffect } from "react";
import { useAnecdoteActions } from "./store.js";
import AnecdoteList from "./components/AnecdoteList.jsx";
import AnecdoteForm from "./components/AnecdoteForm.jsx";
import Filter from "./components/Filter.jsx";

const App = () => {
  const { initialize } = useAnecdoteActions();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div>
      <Filter />
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
