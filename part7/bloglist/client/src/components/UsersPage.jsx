import UserTable from "./UserTable.jsx";
import { Typography } from "@mui/material";

const UsersPage = () => {
  return (
    <>
      <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
        Users
      </Typography>
      <UserTable />
    </>
  );
};

export default UsersPage;
