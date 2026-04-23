import { useParams } from "react-router-dom";
import { useUsers } from "../stores/userStore.js";

const UserPage = () => {
  const users = useUsers();
  const { id } = useParams();
  const user = users.find((u) => u.id === id);

  if (!user) return null;

  return (
    <>
      <h2>{user.name} </h2>
      <h3>Added blogs:</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title} </li>
        ))}
      </ul>
    </>
  );
};

export default UserPage;
