import { create } from "zustand";
import blogService from "../services/blogs.js";
import useNotificationStore from "./notificationStore.js";

const useBlogStore = create((set) => ({
  blogs: [],
  actions: {
    initializeBlogs: async () => {
      const blogs = await blogService.getAll();
      set(() => ({ blogs }));
    },
    createBlog: async (newBlog) => {
      try {
        const createdBlog = await blogService.create(newBlog);
        set((state) => ({ blogs: state.blogs.concat(createdBlog) }));

        useNotificationStore.getState().actions.notify({
          message: `New blog: "${createdBlog.title}" by ${createdBlog.author} added`,
          type: "success",
        });
      } catch (err) {
        useNotificationStore.getState().actions.notify({
          message: err.response?.data?.error || "Something went wrong",
          type: "error",
        });

        throw err;
      }
    },

    likeBlog: async (blog) => {
      try {
        const updatedBlog = await blogService.like(blog.id);
        set((state) => ({
          blogs: state.blogs.map((b) => (b.id === blog.id ? updatedBlog : b)),
        }));

        useNotificationStore.getState().actions.notify({
          message: `Liked "${updatedBlog.title}" by ${updatedBlog.author}`,
          type: "success",
        });
      } catch (err) {
        useNotificationStore.getState().actions.notify({
          message: err.response?.data?.error || "Something went wrong",
          type: "error",
        });
      }
    },
    removeBlog: async (blog) => {
      try {
        await blogService.remove(blog.id);
        (set((state) => ({
          blogs: state.blogs.filter((b) => b.id !== blog.id),
        })),
          useNotificationStore.getState().actions.notify({
            message: `Blog deleted`,
            type: "success",
          }));
      } catch (err) {
        useNotificationStore.getState().actions.notify({
          message: err.response?.data?.error || "Something went wrong",
          type: "error",
        });
      }
    },
  },
}));

export const useBlogs = () => {
  const blogs = useBlogStore((state) => state.blogs);
  return blogs;
};

export const useBlogActions = () => useBlogStore((state) => state.actions);
