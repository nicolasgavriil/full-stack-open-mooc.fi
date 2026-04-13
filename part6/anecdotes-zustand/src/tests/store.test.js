import { describe, test, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("../services/anecdotes", () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

import useAnecdoteStore, {
  useAnecdotes,
  useAnecdoteActions,
} from "../store.js";
import anecdoteService from "../services/anecdotes";

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: "" });
  vi.clearAllMocks();
});

describe("useAnecdoteActions", () => {
  test("initialize loads anecdotes from service", async () => {
    const mockAnecdotes = [
      {
        content: "If it hurts, do it more often",
        id: "1",
        votes: 5,
      },
      {
        content: "Adding manpower to a late software project makes it later!",
        id: "2",
        votes: 0,
      },
    ];
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes);

    const { result } = renderHook(() => useAnecdoteActions());

    await act(async () => {
      await result.current.initialize();
    });

    const { result: anecdotesResult } = renderHook(() => useAnecdotes());
    expect(anecdotesResult.current).toEqual(mockAnecdotes);
  });

  test("returns anecdotes sorted by votes", () => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: "1", content: "lowest", votes: 1 },
        { id: "2", content: "highest", votes: 10 },
        { id: "3", content: "middle", votes: 5 },
      ],
      filter: "",
    });

    const { result } = renderHook(() => useAnecdotes());

    expect(result.current).toEqual([
      { id: "2", content: "highest", votes: 10 },
      { id: "3", content: "middle", votes: 5 },
      { id: "1", content: "lowest", votes: 1 },
    ]);
  });
});
