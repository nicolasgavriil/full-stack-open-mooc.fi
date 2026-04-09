import { create } from "zustand";

const useFeedbackStore = create((set) => ({
  feedback: {
    good: 0,
    neutral: 0,
    bad: 0,
  },
  actions: {
    incrementGood: () =>
      set((state) => ({
        feedback: { ...state.feedback, good: state.feedback.good + 1 },
      })),
    incrementNeutral: () =>
      set((state) => ({
        feedback: { ...state.feedback, neutral: state.feedback.neutral + 1 },
      })),
    incrementBad: () =>
      set((state) => ({
        feedback: { ...state.feedback, bad: state.feedback.bad + 1 },
      })),
  },
}));

export const useFeedback = () => useFeedbackStore((state) => state.feedback);
export const useFeedbackControls = () =>
  useFeedbackStore((state) => state.actions);
