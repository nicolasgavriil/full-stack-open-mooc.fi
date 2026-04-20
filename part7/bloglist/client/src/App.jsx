import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import NavBar from "./components/NavBar.jsx";
import Notification from "./components/Notification.jsx";
import LoginForm from "./components/LoginForm.jsx";
import BlogsPage from "./components/BlogsPage.jsx";
import BlogPage from "./components/BlogPage.jsx";
import BlogCreationForm from "./components/BlogCreationForm.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

import { useBlogActions } from "./stores/blogStore.js";

const App = () => {
  const { initializeBlogs } = useBlogActions();

  useEffect(() => {
    initializeBlogs();
  }, [initializeBlogs]);

  return (
    <Container>
      <div>
        <NavBar />
        <Notification />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<BlogsPage />} />
            <Route path="/blogs" element={<BlogsPage />} />

            <Route path="/blogs/:id" element={<BlogPage />} />
            <Route path="/create" element={<BlogCreationForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="*" element={<h1>404 - Page not found</h1>} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Container>
  );
};

export default App;
