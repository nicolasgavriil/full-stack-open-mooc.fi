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
  },
}));

export const useBlogs = () => {
  const blogs = useBlogStore((state) => state.blogs);
  return blogs;
};

export const useBlogActions = () => useBlogStore((state) => state.actions);
