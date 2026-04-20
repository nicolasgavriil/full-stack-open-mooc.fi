import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notification: { message: null, type: null },
  timeoutId: null,
  actions: {
    notify: ({ message, type, seconds = 5 }) => {
      if (useNotificationStore.getState().timeoutId) {
        clearTimeout(useNotificationStore.getState().timeoutId);
      }

      set({ notification: { message, type } });

      const id = setTimeout(() => {
        set({ notification: { message: null, type: null }, timeoutId: null });
      }, seconds * 1000);

      set({ timeoutId: id });
    },
  },
}));

export const useNotification = () => {
  return useNotificationStore((state) => state.notification);
};

export const useNotificationActions = () => {
  return useNotificationStore((state) => state.actions);
};

export default useNotificationStore;
